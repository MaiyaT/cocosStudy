

var player = require("PlayerData").player;
var Decks = require("Decks");
var Types = require("Types");
var ActorPlayingState = Types.ActorPlayingState;
var Fsm = require("game-fsm");




cc.Class({
    extends: cc.Component,

    properties: {
        
        player_anchor:[cc.Node],
        player_prefab:cc.Prefab,

    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
