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


        audio_btn:{
            default:null,
            url:cc.AudioClip,
        },
    },
    
    //播放按钮的声音
    play_btn_audio:function(){
        if(this.audio_btn){
            cc.audioEngine.play(this.audio_btn);
        }
    },



    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
