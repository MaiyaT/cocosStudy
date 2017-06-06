
var BoxItem = require("BoxItem");

cc.Class({
    extends: cc.Component,

    properties: {
        
        speed:0,

        select_item:{
            default:null,
            type:cc.Node
        },

        boxItem:{
            default:null,
            type:BoxItem,
            //visible:false,
        }
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
        
        console.log("点击了   "+"rank="+this.boxItem.rank+"row="+this.boxItem.row);

        let eliminate = cc.find("Game/Eliminate").getComponent("Eliminate");
        eliminate.click_item(this);
    },


    boxIsSelectState:function(isSelect){

        this.select_item.active = isSelect;

    },






    unuse:function(){
        console.log("xiaohui");
    },

    reuse:function(){
        console.log("chongyong");

        this.select_item.active = false;
    },


    resetOriginPos:function(){

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;


        this.node.color = this.boxItem.color_show;
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        let box_bottom = this.node.y + this.node.height * 0.5;

        if (box_bottom > this.boxItem.end_y) {
            this.node.y -= this.speed * dt;
        }

        if (this.node.y < this.boxItem.end_y) {
            this.node.y = this.boxItem.end_y;
        }


        if (this.node.x > this.boxItem.begin_x) {
            this.node.x -= this.speed * dt;
        }

        if (this.node.x < this.boxItem.begin_x) {
            this.node.x = this.boxItem.begin_x;
        }
    },
});

