"use strict";

var BoxItem = require("BoxItem");

cc.Class({
    extends: cc.Component,

    properties: {

        speed: 0,

        boxItem: {
            default: null,
            type: BoxItem
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        // this.click_add();
        this.boxItem = new BoxItem();
    },

    click_action: function click_action() {

        console.log("dianjile   " + "rank=" + this.boxItem.rank + "row=" + this.boxItem.row);

        var eliminate = cc.find("Game/Eliminate").getComponent("Eliminate");
        eliminate.click_item(this);
    },

    unuse: function unuse() {
        console.log("xiaohui");
    },

    reuse: function reuse() {
        console.log("chongyong");
    },

    resetOriginPos: function resetOriginPos() {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;

        this.node.color = this.boxItem.color_show;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        var box_bottom = this.node.y + this.node.height * 0.5;

        if (box_bottom > this.boxItem.end_y) {
            this.node.y -= this.speed * dt;
        }

        if (this.node.y < this.boxItem.end_y) {
            this.node.y = this.boxItem.end_y;
        }
    }
});

// module.exports = {
//     boxItem : this.boxItem
// };