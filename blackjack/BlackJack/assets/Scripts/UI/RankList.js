
var players = require("PlayerData").players;

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

        scrollV:{
            default:null,
            type:cc.ScrollView
        },

        rankCount:0,

        rank_pre:{
            default:null,
            type:cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {

        this.content = this.scrollV.content;

        this.setupOriginData();
    },

    setupOriginData:function(){

        for (let i = 0; i<this.rankCount; i++){

            var playerInfo = players[i];
            var item = cc.instantiate(this.rank_pre);

            item.getComponent("RankItem").updateValue(i,playerInfo);

            // console.log(item);

            this.content.addChild(item);
        }

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
