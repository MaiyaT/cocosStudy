cc.Class({
    extends: cc.Component,

    properties: {
        
        chip_toss_ani:cc.Animation,
    },

    play_toss:function(){
        this.chip_toss_ani.play("ship_toss");
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
