cc.Class({
    extends: cc.Component,

    properties: {
        
        point:cc.Label,
        suit:cc.Sprite,
        mainPic:cc.Sprite,
        cardBG:cc.Sprite,

        redTextColor:cc.Color.RED,
        blackTextColor:cc.Color.BLACK,

        textBackBG:cc.SpriteFrame,
        textFrontBG:cc.SpriteFrame,

        textFaces:{
            default:[],
            type:cc.SpriteFrame,
        },

        textSuitSmall:{
            default:[],
            type:cc.SpriteFrame,
        },

        textSuitBig:{
            default:[],
            type:cc.SpriteFrame,
        },


    },

    init:function(card){

        var isFaceCard = card.point > 10;

        if(isFaceCard){
            this.mainPic.spriteFrame = this.textFaces[card.point - 10 - 1];
        }else{
            this.mainPic.spriteFrame = this.textSuitBig[card.point - 1];
        }

        this.point.string = card.pointName;

        if(card.isRedSuit){
            this.point.node.color = this.redTextColor;
        }else{
            this.point.node.color = this.blackTextColor;
        }

        this.suit.spriteFrame = this.textSuitSmall[card.suit - 1];
    },

    reveal: function (isFaceUp) {
        this.point.node.active = isFaceUp;
        this.suit.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.textFrontBG : this.textBackBG;
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
