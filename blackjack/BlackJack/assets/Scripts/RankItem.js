cc.Class({
    extends: cc.Component,

    properties: {
        
        user_icon:{
            default:null,
            type:cc.Sprite,
        },

        user_title:{
            default:null,
            type:cc.Label,
        },

        user_gold:{
            default:null,
            type:cc.Label,
        },

        user_rank_lab:{
            default:null,
            type:cc.Label,
        },

        user_rang_bg:{
            default:null,
            type:cc.Sprite,
        },

        texture_ranks:[cc.SpriteFrame],

        texture_icons:[cc.SpriteFrame],

    },

    // use this for initialization
    onLoad: function () {



    },

    updateValue:function(index, name){
        
        if(index < 3){
            this.user_rang_bg.spriteFrame = this.texture_ranks[index];
            this.user_rank_lab.node.active = false;
        }else{
            this.user_rank_lab.node.active = true;
            this.user_rank_lab.string = (index + 1);
        }

        this.user_icon.spriteFrame = this.texture_icons[name["photoIdx"]];
        this.user_title.string = name.name;
        this.user_gold.string = name.gold;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
