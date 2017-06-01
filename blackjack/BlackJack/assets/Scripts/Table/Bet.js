cc.Class({
    extends: cc.Component,

    properties: {
        
        chip_prefab:{
            default:null,
            type:cc.Prefab,
        },

        chip_btns:[cc.Node],
        chip_values:['Integer'],
        chipTossAnchor:cc.Node,

    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
