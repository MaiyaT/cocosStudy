


var Color_Box = cc.Enum({

    Red : -1,
    Green : -1,
    Blue : -1,
    Black : -1,
    White : -1,


    // Count:-1,
});



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
        color_type : Color_Box.White,

        color_show:{
            get:function(){
                switch(this.color_type){
                    case Color_Box.White:return cc.Color.WHITE;
                    case Color_Box.Red:return cc.Color.RED;
                    case Color_Box.Green:return cc.Color.GREEN;
                    case Color_Box.Blue:return cc.Color.BLUE;
                    case Color_Box.Black:return cc.Color.BLACK;
                    default:return cc.Color.YELLOW;
                }
            }
        },

        //行
        rank : 0,
        //列
        row : 0,

    },



    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});


// module.exports = {
//     Color_Box : Color_Box
// };