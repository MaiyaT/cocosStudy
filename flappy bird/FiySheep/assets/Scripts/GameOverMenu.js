

var GameManager = require("GameManager");

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

        score:{
            default:null,
            type:cc.Label
        },

        replay_btn:{
            default:null,
            type:cc.Button
        },
    },

    // use this for initialization
    onLoad: function () {

        this.replay_btn.node.on("click",function(){

            this.game_replay();

        }.bind(this));

    },

    game_replay:function(){

        console.log("=========点击了重新刚开始的按钮========");

        let game_m = cc.find("Game").getComponent("GameManager");

        game_m.start_game();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
