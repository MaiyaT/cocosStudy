cc.Class({
    extends: cc.Component,

    properties: {
        
        speed:0,
        
        begin_x:{
            default:0,
            tooltip:"开始掉落的位置x"
        },
        begin_y:{
            default:0,
            tooltip:"开始掉落的位置y"
        },
        
        end_y:{
            default:0,
            tooltip:""
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
