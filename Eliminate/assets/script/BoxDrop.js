
var BoxItem = require("BoxItem");

var BoxState = require("States").BoxState;
var BoxType = require("States").BoxType;
var BoxShowType = require("States").BoxShowType;
var Game_State = require("States").Game_State;

cc.Class({
    extends: cc.Component,

    properties: {
        
        speed:0,

        speedMax:800,

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

    init:function(){

        this.select_item = this.node.getChildByName("sel");
        this.titleShow = this.node.getChildByName("Label");

        this.currentSpeed = 0;

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
    },


    unuse:function(){
        console.log("xiaohui");

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
        this.node.y = -100000;

        this.boxItem.ani_point = [];
    },

    reuse:function(){
        console.log("chongyong");

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
    },



    // use this for initialization
    onLoad: function () {

        // this.click_add();
        // this.speed_x = 20;
        
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

        this.node.opacity = 255;
    },


    boxSpeciallyShow:function (type) {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.end_y;

        this.boxItem.color_type = type;
        this.node.color = this.boxItem.color_show;

        if(type === BoxType.Blank){
            this.node.opacity = 10;
        }
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

                speed_n = Math.min(speed_n,this.speedMax);
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


        if(this.boxItem.ani_point.length > 0){

            // console.log("需要做偏移操作 判断");
            // let point_a = this.boxItem.blank_move_point

            //判断这个位置的y 需要在的x的位置
            // let points = this.boxItem.blank_move_point.filter(function(elem){
            //     return this.node.y < elem.y;
            // }.bind(this));

            let last_point = this.boxItem.ani_point[0];

            if(last_point !== undefined &&
                // this.node.x !== last_point.x &&
                this.node.y < last_point.y){

                if(last_point.isleft){
                    //左边的递减
                    this.node.x = this.node.x - this.speed*0.3;
                    if(this.node.x <= last_point.x){
                        this.node.x = last_point.x;
                        this.boxItem.ani_point.shift();//删除第一个元素
                        console.log("=======移除");
                    }
                }else {
                    //右边的递增
                    this.node.x = this.node.x + this.speed*0.3;
                    if(this.node.x >= last_point.x){
                        this.node.x = last_point.x;
                        this.boxItem.ani_point.shift();//删除第一个元素
                        console.log("=======移除");
                    }
                }
            }

            // console.log("====" + last_point);
        }


        if(YHDebug){
            this.titleShow.active = true;
            this.titleShow.getComponent(cc.Label).string = this.boxItem.rank + "_" + this.boxItem.row;
            if(this.boxItem.color_type === BoxType.White ||
                this.boxItem.color_type === BoxType.YELLOW){
                this.titleShow.getComponent(cc.Label).node.color = cc.Color.BLACK;
            }else {
                this.titleShow.getComponent(cc.Label).node.color = cc.Color.WHITE;
            }

        }else {
            this.titleShow.active = false;
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

