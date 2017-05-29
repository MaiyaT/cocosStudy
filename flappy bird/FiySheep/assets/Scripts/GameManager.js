



cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

        YH.yh_width = cc.director.getWinSizeInPixels().width;
        YH.yh_height = cc.director.getWinSizeInPixels().height;

        console.log("=================屏幕的宽高"+YH.yh_width+"==="+YH.yh_height);

        this.start_game();
    },

    start_game:function(){

        var pipe_m = this.node.getComponent("PipeManager");

        pipe_m.start_schedule();
    },

    stop_game:function(){

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
