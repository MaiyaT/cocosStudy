
var BoxItem = require("BoxItem");

var BoxState = require("States").BoxState;
var BoxType = require("States").BoxType;
var BoxShowType = require("States").BoxShowType;
var Game_State = require("States").Game_State;

cc.Class({
    extends: cc.Component,

    properties: {
        
        speed:0,

        acc_speed:{
            default:9.8,
            tooltop:"加速度"
        },

        boxItem:{
            default:null,
            type:BoxItem,
            visible:false,
        },


        _showType:{
            default:BoxShowType.K_Normal,
            type:BoxShowType
        },

        showType:{

            get:function () {
                return this._showType;
            },

            set:function (value) {

                switch (value) {
                    case BoxShowType.K_Normal:
                        this.select_item.active = false;

                        break;

                    case BoxShowType.K_Select:
                        this.select_item.active = true;

                        break;

                    case BoxShowType.K_SkillAround:


                        break;

                    case BoxShowType.K_SkillColor:


                        break;

                    case BoxShowType.K_SkillRank:



                        break;

                    case BoxShowType.K_SkillRaw:

                        break;

                }

            },
        },



        _state_b:{
            default:BoxState.ENormal,
            type:BoxState,
            // visible:false
        },

        state_b:{

            get:function () {
                return this._state_b;
            },

            set:function (value) {

                if(this._state_b !== value){

                    this._state_b = value;

                    this.currentSpeed = this.speed;

                    let animation = this.getComponent(cc.Animation);

                    switch (value) {
                        case BoxState.ENormal:

                            break;

                        case BoxState.EFalling:


                            break;

                        case BoxState.EFalled:
                            animation.play("ani_box");

                            break;
                        case BoxState.EDestroy:
                            // console.log("摧毁吹asd");

                            // animation.play("ani_destroy");

                            let panel = cc.find("Game/Panel").getComponent("BoxPanel");
                            if(panel.gamestate === Game_State.Start) {
                                panel.boxDrop_destroy(this);
                            }
                            else {
                                animation.play("ani_destroy");
                            }

                            break;

                    }

                }
            },

            type:BoxState,

            // tooltop:"方块的状态"
        },

    },

    statics:{
        BoxState:BoxState
    },

    init(){

        this.select_item = this.node.getChildByName("sel");
        this.currentSpeed = 0;

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
    },


    unuse:function(){
        // console.log("xiaohui");

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
        this.node.y = -100000;

    },

    reuse:function(){
        // console.log("chongyong");

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
    },



    // use this for initialization
    onLoad: function () {

        // this.click_add();

        
    },

    initBoxItem:function(){
        if(!this.boxItem){
            this.boxItem = new BoxItem();    
        }
    },

    click_action:function(){
        /*
        只有再play状态下才能点击
        */
        let panel = cc.find("Game/Panel").getComponent("BoxPanel");
        if(panel.gamestate === Game_State.Play &&
            this.boxItem.color_type < BoxType.TypeCount) {

            console.log("点击了   "+"rank="+this.boxItem.rank+"row="+this.boxItem.row);

            let eliminate = cc.find("Game/Eliminate").getComponent("Eliminate");
            eliminate.click_item(this);
        }
    },



    box_destroy:function () {

        //动画结束之后的回调
        this.node.opacity = 255;

        console.log("摧毁动画完成");

        let panel = cc.find("Game/Panel").getComponent("BoxPanel");

        panel.boxDrop_destroy(this);
    },





    resetOriginPos:function(){

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;

        this.node.color = this.boxItem.color_show;

    },


    boxSpeciallyShow:function (type) {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.end_y;

        this.boxItem.color_type = type;
        this.node.color = this.boxItem.color_show;
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        //如果是正在掉落的 刷新endy 的坐标
        // if(this.state_b === BoxState.EFalling ||
        //     this.state_b === BoxState.EDestroy){
        if(this.state_b === BoxState.EFalling){

            let box_bottom = this.node.y + this.node.height * 0.5;

            if (box_bottom > this.boxItem.end_y) {
                //加速度掉落

                let speed_n = this.currentSpeed + this.acc_speed*dt;
                let s = (speed_n + this.currentSpeed )*0.5 * dt;

                this.currentSpeed = speed_n;

                this.node.y -= s;
            }

            if (this.node.y <= this.boxItem.end_y) {

                /**
                 * 掉落到指定位置的时候弹动一下
                 */
                this.node.y = this.boxItem.end_y;

                if(this.state_b === BoxState.EFalling){
                    this.state_b = BoxState.EFalled;
                }
            }

        }



        // if (this.node.x > this.boxItem.begin_x) {
        //     this.node.x -= this.speed * dt;
        // }
        //
        // if (this.node.x < this.boxItem.begin_x) {
        //     this.node.x = this.boxItem.begin_x;
        // }
    },
});

