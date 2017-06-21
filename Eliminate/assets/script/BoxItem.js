


var BoxType = require("States").BoxType;


cc.Class({
    extends: cc.Component,

    properties: {

        //开始掉落的位置x
        begin_x:0,
        //开始掉落的位置y
        begin_y : 0,
        //要抵达的位置Y
        end_y : -1000,
        //显示的颜色
        color_type : BoxType.White,

        color_show:{
            get:function(){
                switch(this.color_type){
                    case BoxType.White:return cc.Color.WHITE;
                    case BoxType.YELLOW:return cc.Color.YELLOW;
                    case BoxType.Green:return cc.Color.GREEN;
                    case BoxType.Blue:return cc.Color.BLUE;
                    case BoxType.Black:return cc.Color.BLACK;
                    case BoxType.Barrier:return cc.Color.RED;
                    default:return cc.Color.CYAN;
                }
            }
        },

        //行
        rank : 0,
        //列
        row : 0,

        /*固定的行*/
        row_fix : 0,
        /*固定的列*/
        rank_fix : 0,


        id:{
            get:function(){
                return this.rank.toString() + this.row.toString();
            }
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
