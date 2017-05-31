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
        bg_music:{
            default:null,
            url:cc.AudioClip
        },
    },
    

    // use this for initialization
    onLoad: function () {

        // this.bg_music_id = cc.audioEngine.play(this.bg_music,false,0.8);

        cc.director.preloadScene("game",function(){

            console.log("预加载完成");

        });

    },

    stop_bg_audio:function(){
        cc.audioEngine.stop(this.bg_music_id);
    },

    play_game:function(){
        cc.director.loadScene("game");

        this.stop_bg_audio();
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
