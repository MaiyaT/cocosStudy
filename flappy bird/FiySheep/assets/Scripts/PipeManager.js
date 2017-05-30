
var PipeGroup = require("PipeGroup");
var GameManager = require("GameManager");


cc.Class({
    extends: cc.Component,

    properties: {
        
        pipe_pre:{
            default:null,
            type:cc.Prefab
        },

        creat_interval:{
            default:0.6,
            tooltip:"创建水管的时间间隔"
        },

    },

    stop_schedule:function(){

        //停止计时器
        this.unschedule(this.pipe_create);
    },

    start_schedule:function(){

        //清理掉场景中的 水管
        let Pipes = cc.find("Canvas/Pipes");
        // Pipes.children.forEach(function(item){
        //     console.log("======遍历子视图======"+item);
            
            // if(item.name === "PipeGroup"){
               
            //     console.log("============= 是 PipeGroup 类型 ===========");

            //     item.getComponent("PipeGroup").release_pipe();
            // }
        // });

        let pipe_list = [];
        for (let i = 0;i<Pipes.children.length; i++){

            let item = Pipes.children[i];
            if(item.name === "PipeGroup"){
               
               pipe_list.push(item);

                console.log("============= 是 PipeGroup 类型 ===========");                
            }
        }

        while(pipe_list.length > 0){
           
            let item = pipe_list[0];
            item.getComponent("PipeGroup").release_pipe();

            console.log("=============== 移除 ================");

            pipe_list.shift();
        }



        //先执行一次
        this.pipe_create();
        //开始计时器
        this.schedule(this.pipe_create,this.creat_interval);

    },

    pipe_create:function(){

        let game_m = cc.find("Game").getComponent(GameManager);
        if (game_m.game_state !== GameManager.GameState.Run){
            return;
        }


        console.log("============= pipe_create");

        console.log("================ size =======" + this.pool_m.size());

        let group = null;
        if(this.pool_m.size()>0){
            group = this.pool_m.get();
        }else{
            group = cc.instantiate(this.pipe_pre);
        }
        let c_group = group.getComponent("PipeGroup");
        c_group.configSetup();

        let origin_x = YH.yh_width*0.5 + group.width;
        group.x = origin_x;

        group.active = true;

        let Pipes = cc.find("Canvas/Pipes");
        // Pipes.addChild(group.node);

        group.parent = Pipes;
        // Pipes.addChild(group);
    },

    pipe_release:function(group){
        console.log("============= pipe_release");

        this.pool_m.put(group.node);
    },
    
    // use this for initialization
    onLoad: function () {
        this.pool_m = new cc.NodePool("PipeGroup");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
