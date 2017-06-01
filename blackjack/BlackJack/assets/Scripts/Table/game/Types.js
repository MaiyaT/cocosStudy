
var Suit = cc.Enum({
    Spade:1,//黑桃
    Heart:2,//红桃
    Club:3,//梅花
    Diamond:4,//方片
});

var A2_10JQK = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(",");


function Card (point, suit){

    Object.defineProperties(this,{

        point:{
            value:point,
            writable:false,
        },

        suit:{
            value:suit,
            writable:false,
        },

        id:{
            value:(suit-1)*13 + (point-1),
            writable:false,
        },

        pointName:{
            get:function(){
                return A2_10JQK[this.point];
            }
        },

        suitName:{
            get:function(){
                return Suit[this.suit];
            }
        },

        isBlackSuit:{
            get:function(){
                return this.suit === Suit.Spade || this.suit === Suit.Club;
            }
        },

        isRedSuit:{
            get:function(){
                return this.suit === Suit.Heart || this.suit === Suit.Diamond;
            }
        },

    });

}


Car.prototype.toString = function (){
    return this.suitName + " " + this.pointName;
};

// 存放 52 张扑克的实例
var cards = new Array(52);

// 初始化所有扑克牌
(function createCards(){

    for (var s = 1; s<=4; s++){
        for( var p = 1; p<= 13; p ++){
            var card = new Card(p,s);
            cards[card.id] = card;
        }
    }
})();

// 手中牌的状态
var ActorPlayingState = cc.Enum({
    Normal: -1,
    Stand:-1,
    Report:-1,
    Bust:-1,
});


//输赢
var Outcome = cc.Enum({
    Win:-1,
    Lost:-1,
    Tie:-1,
});


// 牌型，值越大越厉害
var Hand = cc.Enum({
    Normal: -1,     // 无
    BlackJack: -1,  // 黑杰克
    FiveCard: -1,   // 五小龙
});


module.exports = {

    Suit:Suit,
    Card:Card,
    ActorPlayingState:ActorPlayingState,
    Hand:Hand,
    Outcome:Outcome,

};
