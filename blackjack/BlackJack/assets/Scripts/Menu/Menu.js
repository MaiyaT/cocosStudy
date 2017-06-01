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

        let menu = cc.find("Menu");
        this.audio_m = null;
        if(menu){
            this.audio_m = menu.getComponent("MenuAudio");
        }
        if(this.audio_m){
            this.audio_m.play_audio_bgm();
        }

        cc.director.preloadScene("game",function(){

            console.log("预加载完成");

        });

    },

    play_game:function(){

        cc.director.loadScene("game");

        if(this.audio_m){
            this.audio_m.pause_audio_bgm();
        }
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
