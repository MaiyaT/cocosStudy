
var Types = require("Types");

function Decks(numberOfDecks){
    this._numberOfDecks = numberOfDecks;
    this._cardIds = new Array(numberOfDecks * 52);

    this.reset();
}

Decks.prototype.reset = function(){

    this._cardIds.length = this._numberOfDecks * 52;
    var index = 0;
    var fromId = Types.Card.fromId;

    for (var i = 0; i < this._numberOfDecks; ++i) {
        for (var cardId = 0; cardId < 52; ++cardId) {
            this._cardIds[index] = fromId(cardId);
            ++index;
        }
    }
}


Decks.prototype.draw = function(){

    var cardIds = this._cardIds;
    var len = cardIds.length;
    if(len === 0){
        return null;
    }

    var random = Math.random();
    var index = (random*len) | 0;
    var result = cardIds[index];

    // 保持数组紧凑
    var last = cardIds[len - 1];
    cardIds[index] = last;
    cardIds.length = len - 1;
    return result;
};

module.exports = Decks;

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //    default: null,      // The default value will be used only when the component attaching
//         //                           to a node for the first time
//         //    url: cc.Texture2D,  // optional, default is typeof default
//         //    serializable: true, // optional, default is true
//         //    visible: true,      // optional, default is true
//         //    displayName: 'Foo', // optional
//         //    readonly: false,    // optional, default is false
//         // },
//         // ...
//     },

//     // use this for initialization
//     onLoad: function () {

//     },

//     // called every frame, uncomment this function to activate update callback
//     // update: function (dt) {

//     // },
// });
