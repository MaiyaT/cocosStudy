
var Bomb_box = require("Bomb_box");

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

        bomb:{
            default:null,
            type:cc.Prefab,
        },

        parentNode:{
            default:null,
            type:cc.Node,
        }
    },

    // use this for initialization
    onLoad: function () {

        this.pool = new cc.NodePool(Bomb_box);
    },

    getBombParticleFromPool:function () {

        let bomb = null;
        if(this.pool.size() > 0){
            bomb = this.pool.get();
        }else {
            bomb = cc.instantiate(this.bomb);
        }
        return bomb;
    },

    showBombParticleAtPoint:function (point) {

        let bomb = this.getBombParticleFromPool();

        this.parentNode.addChild(bomb);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
