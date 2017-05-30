




var State = cc.Enum({
    None : -1,
    Run  : -1,
    Jump : -1,
    Drop : -1,
    DropEnd : -1,
    Dead : -1
});

var DustType = cc.Enum({
    DustUp : -1,
    DustDown : -1
});

var Dust = require("Dust");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        dust_pre : {
            default:null,
            type:cc.Prefab
        },

        // groundY:{
        //     default:0,
        //     tooltip:"地面高度"
        // },

        gravity:{
            default:0,
            tooltip:"重力-跳起来之后,速度递减"
        },

        jumpSpeed:{
            default:0,
            tooltip:"起跳速度"
        },


        _state:{
            default:State.None,
            type:State,
            visible:false
        },

        state:{

            get:function(){
                return this._state;
            },
            set:function(value){
                if(this._state !== value)
                {
                    this._state = value;
                    if(this._state !== State.None){
                        //执行状态变化时候 sheep的动画切换
                        //动画的名字 要 State枚举的名字一样
                        let animationName = State[this._state];
                        this.aim.stop();
                        this.aim.play(animationName);

                        if(this._state === State.Jump){
                            this.showDustAnimation(DustType.DustUp);
                            cc.audioEngine.play(this.jumpAudio,false);
                        }else if(this._state === State.DropEnd){
                            this.showDustAnimation(DustType.DustDown);
                        }
                    }
                }
            },
            type:State
        },
        
        jumpAudio:{
            default:null,
            url:cc.AudioClip,
            tooltip:"跳跃的声音"
        },

        deadAudio:{
            default:null,
            url:cc.AudioClip
        },

        getAudio:{
            default:null,
            url:cc.AudioClip
        },
    },


    init(){
        console.log("执行了 init");
        //这个系统没有这个方法 要在外面调用
    },

    ctor(){
        console.log("执行了 ctor"); //构造函数  会自动调用super的ctor

        this.currentSpeed = 0;
    },

    // use this for initialization
    onLoad: function () {

        this.aim = this.node.getComponent(cc.Animation);

        //地面的高度 
        let ground = cc.find("Canvas/ground");
        this.groundY = ground.y + ground.height*0.5 + this.node.height*0.5;

        console.log("==================ground======="+this.groundY);

        this.state = State.Run;
        this.pool_dust = new cc.NodePool(Dust)
        this.registerInput();

        //开启碰撞
        let collistion = cc.director.getCollisionManager();
        collistion.enabled = true;


        console.log("===========grounpList======"+cc.game.groupList);
    },

    onCollisionEnter:function(other,self){

        // console.log("========发生了碰撞========",other);
        if(this.state != State.Dead){

            //检查碰撞了哪一个分组了
            let group_name = cc.game.groupList[other.node.groupIndex];

            // console.log("=========碰撞到 "+ group_name +" 了=============");

            var GameManager = require("GameManager");
            let game_m = cc.find("Game").getComponent(GameManager);

            if(group_name == "Pipe"){
                //碰到了 水管 over
                this.state = State.Dead;
                game_m.stop_game();

                cc.audioEngine.play(this.deadAudio);
            }
            else if(group_name == "NextPipe"){
                //过了一根水管
                game_m.score_add();

                cc.audioEngine.play(this.getAudio);
            }
        }
    },

    // -- 注册操作事件
    registerInput:function(){

        let self = this;
        let listener = {

            event : cc.EventListener.KEYBOARD,

            onKeyPressed:function(keycode,event){

                // console.log("点击了按钮"+keycode);
                self.jump_action();
            },
        };

        cc.eventManager.addListener(listener,this.node);

    },


    //跳起动作
    jump_action:function(){

        var GameManager = require("GameManager");
        let game_m = cc.find("Game").getComponent(GameManager);
        if (game_m.game_state === GameManager.GameState.Run)
        {
            this.state = State.Jump;

            this.currentSpeed = this.jumpSpeed;
        }

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        switch(this.state){
            
            case State.Jump:
                if(this.currentSpeed < 0){
                    //速度减到0 开始下落
                    this.state = State.Drop;
                }
            break;
            case State.Drop:
                if(this.node.y < this.groundY){
                    this.node.y = this.groundY;
                    this.state = State.DropEnd;
                }
            break;

            case State.None:
            case State.Dead:
            return;

        }

        if(this.state === State.Jump  || this.node.y > this.groundY) {
            this.currentSpeed -= dt*this.gravity; 
            this.node.y += this.currentSpeed*dt;
        }
    },

    //掉到地面上的时候回调 这个回调在动画编辑器里面添加事件
    onDropFinished:function(){
        this.state = State.Run;
    },

    reRun:function(){
        this.state = State.Run;
    },

    //跳起来 和 掉到地上时候弹起灰尘
    showDustAnimation:function(aim_type){

        let _dust = null;
        if (this.pool_dust.size() > 0){
            _dust = this.pool_dust.get();
        }else{
            _dust = cc.instantiate(this.dust_pre);
        }

        //跟绵羊加载同一个父物体下 同一级别
        _dust.parent = this.node.parent;
        let pos_node = this.node.position;
        pos_node.y -= this.node.height*0.4;
        _dust.position =  pos_node; 

        let dust_c = _dust.getComponent(Dust);

        let callback = function(dust){
            
            console.log("动画结束回调==="+dust);
            this.pool_dust.put(dust.node);

        }.bind(this);

        let aim_name = DustType[aim_type];
        dust_c.playAnimation(aim_name, callback);

        console.log("弹起了灰尘===="+(aim_type === DustType.DustUp)?"跳起":"落地");

    },
});
