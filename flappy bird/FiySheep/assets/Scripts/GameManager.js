
var Sheep = require("Sheep");

var GameState = cc.Enum({

    Menu : -1,
    Run:-1,
    Over:-1,

});


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

        score_lab:{
            default:null,
            type:cc.Label
        },

        _score:{
            get:function(){
                let str = this.score_lab.string;
                let result = str.replace("Score:","");
                return parseInt(result);
            },
            set:function(value){
                this.score_lab.string = "Score:"+value;
            },
        },

        game_state:{
            default:GameState.Menu,
            type:GameState,
            visible:false
        },
    },

    statics:{
        GameState
    },

    score_add:function(){
        this._score = this._score + 1;
    },

    score_reset:function(){
        this._score = 0;
    },

    // use this for initialization
    onLoad: function () {

        this.game_state = GameState.Menu;

        YH.yh_width = cc.director.getWinSizeInPixels().width;
        YH.yh_height = cc.director.getWinSizeInPixels().height;

        console.log("=================屏幕的宽高"+YH.yh_width+"==="+YH.yh_height);

        this.gameOver = cc.find("GameOver");
        this.start_game();
    },

    start_game:function(){

        this.game_state = GameState.Run;

        let sheep = cc.find("Canvas/sheep").getComponent("Sheep");
        sheep.reRun();

        this.gameOver.active = false;
        this.score_reset();

        this.gameOver.getComponent("GameOverMenu").score.string = "Score:0";

        var pipe_m = this.node.getComponent("PipeManager");
        pipe_m.start_schedule();
    },

    stop_game:function(){

        this.game_state = GameState.Over;

        // let sheep = cc.find("Canvas/sheep").getComponent("Sheep");
        // sheep.state = Sheep.State.Dead;

        this.gameOver.active = true;
        this.gameOver.getComponent("GameOverMenu").score.string = "Score:"+this._score;

        this.score_reset();

        var pipe_m = this.node.getComponent("PipeManager");
        pipe_m.stop_schedule();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});


// module.exports = {
//     "game_state":this.game_state
// };