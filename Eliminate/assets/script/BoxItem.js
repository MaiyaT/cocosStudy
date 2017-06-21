


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
                    case BoxType.Blank: return cc.Color.WHITE;
                    default:return cc.Color.CYAN;
                }
            }
        },

        //行
        rank : 0,
        //列
        row : 0,


        /*移动y的位置 符合条件的要更新 x的坐标
        * 里面是 {x:0,y:3,isleft:true} 字典类型
        * */
        ani_point : [],


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
