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

        audio_win:{
            default:null,
            url:cc.AudioClip,
        },

        audio_lose:{
            default:null,
            url:cc.AudioClip,
        },

        audio_card:{
            default:null,
            url:cc.AudioClip,
        },

        audio_chip:{
            default:null,
            url:cc.AudioClip,
        },

        audio_bgm:{
            default:null,
            url:cc.AudioClip,
        },
    },
    
    //播放按钮的声音
    play_audio_btn:function(){
        if(this.audio_btn){
            cc.audioEngine.play(this.audio_btn);
        }
    },

    play_audio_win:function(){
        if(this.audio_win){
            cc.audioEngine.play(this.audio_win);
        }
    },

    play_audio_lose:function(){
        if(this.audio_lose){
            cc.audioEngine.play(this.audio_lose);
        }
    },

    play_audio_card:function(){
        if(this.audio_card){
            cc.audioEngine.play(this.audio_card);
        }
    },

    play_audio_chip:function(){
        if(this.audio_chip){
            cc.audioEngine.play(this.audio_chip);
        }
    },

    play_audio_bgm:function(){
        if(this.audio_bgm){
            this.bg_music_id = cc.audioEngine.play(this.audio_bgm,true,0.8);
        }
    },

    pause_audio_bgm:function(){
        cc.audioEngine.pause(this.bg_music_id);
    },

    resume_audio_bgm:function(){
        cc.audioEngine.resume(this.bg_music_id);
    },




    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
