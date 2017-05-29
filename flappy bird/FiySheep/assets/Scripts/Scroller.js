cc.Class({
    extends: cc.Component,

    properties: {
    
        left_margin:0,

    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        var pos_x = this.node.x;

        pos_x -= YH.yh_speed*dt;

        if (pos_x <= this.left_margin){
            pos_x = 0;
        }
        this.node.x = pos_x;
    },
});
