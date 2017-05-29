


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

        //先执行一次
        this.pipe_create();
        //开始计时器
        this.schedule(this.pipe_create,this.creat_interval);

    },

    pipe_create:function(){
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
