"use strict";

var BoxItem = require("BoxItem");

var BoxState = require("States").BoxState;

cc.Class({
    extends: cc.Component,

    properties: {

        speed: 0,

        acc_speed: {
            default: 9.8,
            tooltop: "加速度"
        },

        boxItem: {
            default: null,
            type: BoxItem
        },

        _state_b: {
            default: BoxState.ENone,
            type: BoxState
        },

        state_b: {

            get: function get() {
                return this._state_b;
            },

            set: function set(value) {

                if (this._state_b !== value) {

                    this._state_b = value;

                    switch (value) {
                        case BoxState.ENormal:
                            this.select_item.active = false;

                            break;

                        case BoxState.EFalling:
                            this.select_item.active = false;

                            break;

                        case BoxState.ESelect:
                            this.select_item.active = true;
                            break;

                        case BoxState.EDestroy:
                            this.select_item.active = true;

                            break;

                        case BoxState.ESkillAround:
                            break;

                        case BoxState.ESkillColor:
                            break;

                        case BoxState.ESkillRank:
                            break;

                        case BoxState.ESkillRaw:
                            break;
                    }
                }
            },

            type: BoxState

        }

    },

    statics: {
        BoxState: BoxState
    },

    init: function init() {

        this.select_item = this.node.getChildByName("sel");

        this.state_b = BoxState.ENormal;
        this.currentSpeed = this.speed;
    },


    // use this for initialization
    onLoad: function onLoad() {

        // this.click_add();


    },

    initBoxItem: function initBoxItem() {
        if (!this.boxItem) {
            this.boxItem = new BoxItem();
        }
    },

    click_action: function click_action() {

        console.log("点击了   " + "rank=" + this.boxItem.rank + "row=" + this.boxItem.row);

        var eliminate = cc.find("Game/Eliminate").getComponent("Eliminate");
        eliminate.click_item(this);
    },

    unuse: function unuse() {
        console.log("xiaohui");
    },

    reuse: function reuse() {
        console.log("chongyong");

        this.state_b = BoxState.ENormal;
    },

    resetOriginPos: function resetOriginPos() {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;

        this.node.color = this.boxItem.color_show;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        if (this.node.y === this.boxItem.end_y && this.node.x === this.boxItem.begin_x) {
            return;
        }

        var box_bottom = this.node.y + this.node.height * 0.5;

        if (box_bottom > this.boxItem.end_y) {
            //加速度掉落

            var speed_n = this.currentSpeed + this.acc_speed * dt;
            var s = (speed_n + this.currentSpeed) * 0.5 * dt;

            this.currentSpeed = speed_n;

            this.node.y -= s;
        }

        if (this.node.y < this.boxItem.end_y) {

            /**
             * 掉落到指定位置的时候弹动一下
             */

            this.node.y = this.boxItem.end_y;

            var animation = this.getComponent(cc.Animation);
            animation.play("ani_box");
        }

        if (this.node.x > this.boxItem.begin_x) {
            this.node.x -= this.speed * dt;
        }

        if (this.node.x < this.boxItem.begin_x) {
            this.node.x = this.boxItem.begin_x;
        }
    }
});

module.exports = {
    BoxState: BoxState
};