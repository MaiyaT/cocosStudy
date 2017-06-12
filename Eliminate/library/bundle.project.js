require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BoxDrop":[function(require,module,exports){
"use strict";
cc._RFpush(module, '89bc7CJRGxJBZsOHDnUjDFu', 'BoxDrop');
// script/BoxDrop.js


var BoxItem = require("BoxItem");

var BoxState = require("States").BoxState;
var BoxShowType = require("States").BoxShowType;

cc.Class({
    "extends": cc.Component,

    properties: {

        speed: 0,

        acc_speed: {
            "default": 9.8,
            tooltop: "加速度"
        },

        boxItem: {
            "default": null,
            type: BoxItem
        },

        //visible:false,
        _showType: {
            "default": BoxShowType.K_Normal,
            type: BoxShowType
        },

        showType: {

            get: function get() {
                return this._showType;
            },

            set: function set(value) {

                switch (value) {
                    case BoxShowType.K_Normal:
                        this.select_item.active = false;

                        break;

                    case BoxShowType.K_Select:
                        this.select_item.active = true;

                        break;

                    case BoxShowType.K_SkillAround:

                        break;

                    case BoxShowType.K_SkillColor:

                        break;

                    case BoxShowType.K_SkillRank:

                        break;

                    case BoxShowType.K_SkillRaw:

                        break;

                }
            }
        },

        _state_b: {
            "default": BoxState.ENormal,
            type: BoxState
        },

        // visible:false
        state_b: {

            get: function get() {
                return this._state_b;
            },

            set: function set(value) {

                if (this._state_b !== value) {

                    this._state_b = value;

                    this.currentSpeed = this.speed;

                    var animation = this.getComponent(cc.Animation);

                    switch (value) {
                        case BoxState.ENormal:

                            break;

                        case BoxState.EFalling:

                            break;

                        case BoxState.EFalled:
                            animation.play("ani_box");

                            break;

                        case BoxState.EDestroy:
                            console.log("摧毁吹asd");
                            // this.node.color = cc.color(255,255,255,255);
                            // animation.play("box_destroy");

                            break;

                    }
                }
            },

            type: BoxState

        }

    },

    // tooltop:"方块的状态"
    statics: {
        BoxState: BoxState
    },

    init: function init() {

        this.select_item = this.node.getChildByName("sel");
        this.currentSpeed = 0;

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
    },

    unuse: function unuse() {
        console.log("xiaohui");

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
        this.node.y = -100000;
    },

    reuse: function reuse() {
        console.log("chongyong");

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
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

    destroyFinish: function destroyFinish() {

        //动画结束之后的回调
        this.node.opacity = 255;

        console.log("摧毁动画完成");
    },

    resetOriginPos: function resetOriginPos() {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;

        this.node.color = this.boxItem.color_show;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        //如果是正在掉落的 刷新endy 的坐标
        // if(this.state_b === BoxState.EFalling ||
        //     this.state_b === BoxState.EDestroy){
        if (this.state_b === BoxState.EFalling) {

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

                if (this.state_b === BoxState.EFalling) {
                    this.state_b = BoxState.EFalled;
                }
            }
        }

        // if (this.node.x > this.boxItem.begin_x) {
        //     this.node.x -= this.speed * dt;
        // }
        //
        // if (this.node.x < this.boxItem.begin_x) {
        //     this.node.x = this.boxItem.begin_x;
        // }
    }
});

cc._RFpop();
},{"BoxItem":"BoxItem","States":"States"}],"BoxItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1e9eeXAPpRI2pOXFKZL+0Bg', 'BoxItem');
// script/BoxItem.js



var Color_Box = cc.Enum({

    YELLOW: -1,
    Green: -1,
    Blue: -1,
    Black: -1,
    White: -1
});

// White : -1,

// Count:-1,
cc.Class({
    "extends": cc.Component,

    properties: {

        //开始掉落的位置x
        begin_x: 0,
        //开始掉落的位置y
        begin_y: 0,
        //要抵达的位置Y
        end_y: -1000,
        //显示的颜色
        color_type: Color_Box.White,

        color_show: {
            get: function get() {
                switch (this.color_type) {
                    case Color_Box.White:
                        return cc.Color.WHITE;
                    case Color_Box.YELLOW:
                        return cc.Color.YELLOW;
                    case Color_Box.Green:
                        return cc.Color.GREEN;
                    case Color_Box.Blue:
                        return cc.Color.BLUE;
                    case Color_Box.Black:
                        return cc.Color.BLACK;
                    default:
                        return cc.Color.RED;
                }
            }
        },

        //行
        rank: 0,
        //列
        row: 0,

        id: {
            get: function get() {
                return this.rank.toString() + this.row.toString();
            }
        }
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

// module.exports = {
//     Color_Box : Color_Box
// };
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"BoxPanel":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ec9173gyKpBEJYU26Ye1eOe', 'BoxPanel');
// script/BoxPanel.js



var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
var BoxState = require("States").BoxState;
var Game_State = require("States").Game_State;

cc.Class({
    "extends": cc.Component,

    properties: {

        box_prefab: {
            "default": null,
            type: cc.Prefab
        },

        num_rank: {
            "default": 10,
            tooltip: "列数"
        },

        num_row: {
            "default": 10,
            tooltip: "行数"
        },

        super_node: {
            "default": null,
            type: cc.Node
        },

        _gameState: {
            "default": Game_State.Start,
            type: Game_State
        },

        gamestate: {
            get: function get() {
                return this._gameState;
            },
            set: function set(value) {

                if (this._gameState !== value) {
                    this._gameState = value;
                    if (value === Game_State.Play) {
                        //开始掉落
                        this.updateBeginOriginY();
                    } else if (value === Game_State.Filling) {
                        this.fillInterval = 0;
                    }
                }
            },
            type: Game_State
        }

    },

    // use this for initialization
    onLoad: function onLoad() {

        Array.prototype.removeByValue = function (arr, val) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        };

        // Array.prototype.filterRepeat = function(){ 
        //     //直接定义结果数组 
        //     var arr = [];
        //     if(arr.length > 0){
        //         arr.push(this[0]);
        //     }

        //     for(var i = 1; i < this.length; i++){    //从数组第二项开始循环遍历此数组 
        //         //对元素进行判断： 
        //         //如果数组当前元素在此数组中第一次出现的位置不是i 
        //         //那么我们可以判断第i项元素是重复的，否则直接存入结果数组 
        //         if(this.indexOf(this[i]) == i){ 
        //             arr.push(this[i]); 
        //         } 
        //     } 
        //     return arr; 
        // } 

        this.rankList = [];

        this.itemWidth = 100;
        this.itemHeight = 100;

        this.itemSpace = 5;

        //this.margin_top = -(cc.director.getWinSize().height)*0.5 + this.itemHeight*this.num_row + this.itemSpace * (this.num_row - 1) + this.itemHeight*0.5;
        //this.margin_bottom = -(cc.director.getWinSize().height)*0.5 - this.itemHeight*0.5;

        this.margin_top = -this.super_node.height * 0.5 + this.itemHeight * this.num_row + this.itemSpace * (this.num_row - 1) + this.itemHeight * 0.5;
        this.margin_bottom = -this.super_node.height * 0.5 - this.itemHeight * 0.5;

        this.margin_left = -this.itemWidth * this.num_rank * 0.5 + this.itemSpace * (this.num_rank * 0.5 - 1);
        this.margin_right = this.itemWidth * this.num_rank * 0.5 - this.itemSpace * (this.num_rank * 0.5 - 1);

        //console.log("asds  " + this.margin_top+"  "+this.margin_bottom);

        this.boxPool = new cc.NodePool("BoxDrop");

        this.replayGame();
    },

    //重新开始游戏
    replayGame: function replayGame() {

        this.gamestate = Game_State.Start;

        var children = this.super_node.children;

        while (children.length > 0) {

            for (var i = 0; i < children.length; ++i) {
                this.boxDrop_destroy(children[i].getComponent("BoxDrop"));
            }
        }

        //清空ranklist
        var item;
        while (item = this.rankList.shift()) {}

        console.log("清空成功");

        //创建所有面板的数据
        for (var index = 0; index < this.num_rank; index++) {
            this.createRankContent(index);
        }

        this.checkPanelEliminatable();

        this.updateBeginOriginY();
    },

    //创建每一列的数据
    createRankContent: function createRankContent(index) {

        var rank_list = [];

        var origin_x = this.margin_left + (this.itemWidth + this.itemSpace) * index;

        for (var i = 0; i < this.num_row; i++) {

            var box = this.boxDrop_get();
            box.active = true;

            box.width = this.itemWidth;
            box.height = this.itemHeight;

            var box_c = box.getComponent("BoxDrop");
            box_c.state_b = BoxState.ENormal;

            box_c.initBoxItem();

            box_c.boxItem.begin_x = origin_x;
            box_c.boxItem.begin_y = this.margin_top;
            box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight + this.itemSpace) * (i + 1);
            box_c.boxItem.rank = index;
            box_c.boxItem.row = i;
            box_c.boxItem.color_type = cc.random0To1() * 5 | 0;

            box_c.resetOriginPos();

            box.parent = this.super_node;

            rank_list.push(box);
        }

        this.rankList.push(rank_list);
    },

    //更新所有列 end y的数据
    updateAllRankEndY: function updateAllRankEndY() {

        //看该列的数量是否 小于 this.num_row  少于的话则补充
        for (var i = 0; i < this.num_rank; i++) {

            var origin_x = this.margin_left + (this.itemWidth + this.itemSpace) * i;

            var list_sub = this.rankList[i];

            while (list_sub.length < this.num_row) {

                var new_box = this.boxDrop_get();
                new_box.active = true;

                var box_c = new_box.getComponent("BoxDrop");

                box_c.boxItem.begin_x = origin_x;
                box_c.boxItem.begin_y = this.margin_top;
                box_c.boxItem.rank = i;
                box_c.boxItem.row = 0;
                box_c.boxItem.color_type = cc.random0To1() * 5 | 0;
                box_c.resetOriginPos();

                new_box.parent = this.super_node;

                list_sub.push(new_box);
            }

            // let list = this.rankList[index];

            //更新每个元素的end y 位置
            for (var _i = 0; _i < list_sub.length; _i++) {

                var item_box = list_sub[_i];
                var box_c = item_box.getComponent("BoxDrop");

                box_c.boxItem.row = _i;
                box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight + this.itemSpace) * (_i + 1);
            }
        }

        this.updateBeginOriginY();

        if (this.gamestate === Game_State.Start) {
            this.checkPanelEliminatable();
        }
        // else if(this.gamestate === Game_State.Filling){
        //     // cc.director.getScheduler().schedule(callback, this, interval, !this._isRunning);
        //
        //     let self = this;
        //
        //     this.callBackFilling = function () {
        //
        //         console.log("======定时器刷了=====");
        //
        //         for (let i = 0; i<self.num_rank; i++) {
        //             let list = self.rankList[i];
        //
        //             for (let j = 0; j < self.num_row; j++) {
        //                 let box = list[j];
        //                 let box_c_i = box.getComponent("BoxDrop");
        //                 if(box_c_i.state_b !== BoxState.EFalled){
        //                     return;
        //                 }
        //             }
        //         }
        //
        //         console.log("=========检测是否开消除=========");
        //
        //         self.unschedule(self.callBackFilling);
        //
        //         self.checkPanelEliminatable();
        //     }
        //
        //
        //     //判断他是否所有方块已掉落到指定位置
        //     //这边如果bind this的话 定时器停不下来
        //     this.schedule(this.callBackFilling,0.2);
        // }
    },

    /**
     * 更新每一列他们中的每个元素的初始的origin y的值
     */
    updateBeginOriginY: function updateBeginOriginY() {

        /**
         * 某一列中 从最后开始遍历返回
         * 算出开始掉了的位置
         */
        for (var i = 0; i < this.num_rank; i++) {
            var list = this.rankList[i];

            //判断是否 已达到他的endy 如果还未达到就是 正要掉落
            var off_top = 0;
            var space_top = 5;

            // for(let j = this.num_row-1; j>=0; j--){
            for (var j = 0; j < this.num_row; j++) {
                var box = list[j];

                var box_c = box.getComponent("BoxDrop");
                //box_c.boxItem.begin_y = this.margin_top;

                if (box_c.node.y !== box_c.boxItem.end_y) {

                    /**
                     * 1.实例游戏的时候 初始开始的位置
                     * 2.消除的 方块不在界面中的设置他的开始位置 已在界面中的不去设置他
                     */
                    if (this.gamestate === Game_State.Start || box_c.node.y >= box_c.boxItem.begin_y) {

                        box_c.boxItem.begin_y = this.margin_top + off_top;

                        box_c.node.y = box_c.boxItem.begin_y;

                        off_top = off_top + box_c.node.height + space_top;

                        space_top = space_top + 10;
                    }

                    //是要掉落的
                    if (this.gamestate === Game_State.Play || this.gamestate === Game_State.Filling || this.gamestate === Game_State.Start) {
                        box_c.state_b = BoxState.EFalling;
                    }
                }
            }
        }
    },

    //交换两个方块的位置
    exchangeBoxItem: function exchangeBoxItem(box1, box2) {
        var toCheckViable = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        var boxItem1 = box1.getComponent("BoxDrop").boxItem;
        var boxItem2 = box2.getComponent("BoxDrop").boxItem;

        if (boxItem1.rank === boxItem2.rank) {
            //同一列的
            var list = this.rankList[boxItem1.rank];

            //交换位置
            var temp_endy = boxItem2.end_y;
            boxItem2.end_y = boxItem1.end_y;
            boxItem1.end_y = temp_endy;

            box1.node.runAction(cc.moveTo(0.2, cc.p(boxItem1.begin_x, boxItem1.end_y)));
            box2.node.runAction(cc.moveTo(0.2, cc.p(boxItem2.begin_x, boxItem2.end_y)));
            // box1.node.y = boxItem1.end_y;
            // box2.node.y = boxItem2.end_y;

            //交换信息
            var temp_row = boxItem2.row;

            boxItem2.row = boxItem1.row;
            boxItem1.row = temp_row;

            var temp_node = list[boxItem1.row];
            list[boxItem1.row] = list[boxItem2.row];
            list[boxItem2.row] = temp_node;
        } else if (boxItem1.row === boxItem2.row) {
            //同一行的
            var list1 = this.rankList[boxItem1.rank];
            var list2 = this.rankList[boxItem2.rank];

            //交换位置
            var temp_beginx = boxItem2.begin_x;
            boxItem2.begin_x = boxItem1.begin_x;
            boxItem1.begin_x = temp_beginx;

            box1.node.runAction(cc.moveTo(0.2, cc.p(boxItem1.begin_x, boxItem1.end_y)));
            box2.node.runAction(cc.moveTo(0.2, cc.p(boxItem2.begin_x, boxItem2.end_y)));
            // box1.node.y = boxItem1.end_y;
            // box2.node.y = boxItem2.end_y;

            //交换信息
            var temp_rank = boxItem2.rank;
            boxItem2.rank = boxItem1.rank;
            boxItem1.rank = temp_rank;

            var row_index = boxItem1.row;
            var temp_node = list1[row_index];
            list1[row_index] = list2[row_index];
            list2[row_index] = temp_node;
        }

        if (toCheckViable) {

            var isViable = this.checkPanelEliminatable();

            if (!isViable) {

                //不可消除的话 位置再互换回来
                console.log("不可消除");
                setTimeout((function () {
                    this.exchangeBoxItem(box2, box1, false);
                }).bind(this), 300);
            }
        }
    },

    //检测面板所有方块 是否可消除
    checkPanelEliminatable: function checkPanelEliminatable() {
        var _this = this;

        var wipe_list = [];

        //判断列 是否有三个以及三个以上的一样的色块连在一起
        for (var i = 0; i < this.num_rank; i++) {
            var list = this.rankList[i];
            var tempList = [];
            var pre_box = null;
            for (var j = 0; j < this.num_row; j++) {
                var box = list[j];
                if (!pre_box) {
                    pre_box = box;
                    tempList.push(box);
                } else {
                    var item_pre = pre_box.getComponent("BoxDrop").boxItem;
                    var item_box = box.getComponent("BoxDrop").boxItem;

                    var toAdd = false;
                    if (item_pre.color_type === item_box.color_type) {
                        tempList.push(box);
                        if (j === this.num_row - 1) {
                            toAdd = true;
                        }
                    } else {
                        toAdd = true;
                    }

                    if (toAdd) {
                        if (tempList.length >= 3) {
                            //追加到wipe里面
                            Array.prototype.push.apply(wipe_list, tempList);
                        }
                        //清空数组
                        tempList = [];

                        pre_box = box;
                        tempList.push(box);
                    }
                }
            }
        }

        function isRepeatItemInWipe(item) {
            for (var i = 0; i < wipe_list.length; i++) {
                if (wipe_list[i].getComponent("BoxDrop").boxItem.id === item.getComponent("BoxDrop").boxItem.id) {
                    return true;
                }
            }
            return false;
        }

        //判断行 是否有三个以及三个以上的一样的色块连在一起
        for (var i = 0; i < this.num_row; i++) {

            var tempList = [];
            var pre_box = null;
            for (var j = 0; j < this.num_rank; j++) {
                var box = this.rankList[j][i];
                if (!pre_box) {
                    pre_box = box;
                    tempList.push(box);
                } else {
                    var item_pre = pre_box.getComponent("BoxDrop").boxItem;
                    var item_box = box.getComponent("BoxDrop").boxItem;

                    var toAdd = false;
                    if (item_pre.color_type === item_box.color_type) {
                        tempList.push(box);
                        if (j === this.num_rank - 1) {
                            toAdd = true;
                        }
                    } else {
                        toAdd = true;
                    }

                    if (toAdd) {
                        if (tempList.length >= 3) {
                            //追加到wipe里面
                            tempList.forEach(function (elem) {

                                if (!isRepeatItemInWipe(elem)) {
                                    wipe_list.push(elem);
                                }
                            });
                        }
                        //清空数组
                        tempList = [];

                        pre_box = box;
                        tempList.push(box);
                    }
                }
            }
        }

        if (wipe_list.length > 0) {
            var _ret = (function () {

                var showDelayAnimation = true;
                if (_this.gamestate === Game_State.Start) {
                    //不显示消除动画
                    showDelayAnimation = false;
                }

                //#warn
                //这一块 逻辑 有问题

                if (showDelayAnimation) {
                    _this.schedule(function () {
                        //状态设置成是摧毁
                        wipe_list.forEach((function (elem) {

                            var box = elem.getComponent("BoxDrop");
                            box.state_b = BoxState.EDestroy;
                        }).bind(this));
                    }, 0.3, 1);
                }

                //不是初始化的 停留一会儿再消除
                _this.schedule((function () {

                    //消除掉
                    wipe_list.forEach((function (elem) {

                        this.boxDrop_destroy(elem.getComponent("BoxDrop"));
                    }).bind(this));

                    //有销毁在掉落
                    if (showDelayAnimation) {
                        //正在掉落填充
                        this.gamestate = Game_State.Filling;
                    }

                    this.updateAllRankEndY();
                }).bind(_this), showDelayAnimation ? 0.6 : 0, false);

                return {
                    v: true
                };
            })();

            if (typeof _ret === "object") return _ret.v;
        }

        this.gamestate = Game_State.Play;

        return false;
    },

    boxDrop_get: function boxDrop_get() {

        var box = null;
        if (this.boxPool.size() > 0) {
            box = this.boxPool.get();
        } else {
            box = cc.instantiate(this.box_prefab);
            box.getComponent("BoxDrop").init();
        }

        return box;
    },

    boxDrop_destroy: function boxDrop_destroy(box) {

        var list = this.rankList[box.boxItem.rank];

        list.removeByValue(list, box.node);

        this.boxPool.put(box.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        if (this.gamestate === Game_State.Filling) {
            // cc.director.getScheduler().schedule(callback, this, interval, !this._isRunning);

            var _self = this;

            if (this.fillInterval === 10) {

                this.fillInterval = 0;

                console.log("======定时开始判断是否都已掉落到底部了=====");

                for (var i = 0; i < _self.num_rank; i++) {
                    var list = _self.rankList[i];

                    for (var j = 0; j < _self.num_row; j++) {
                        var box = list[j];
                        var box_c_i = box.getComponent("BoxDrop");
                        if (box_c_i.state_b !== BoxState.EFalled) {
                            return;
                        }
                    }
                }

                console.log("=========检测是否开消除=========");

                this.gamestate === Game_State.Play;
                _self.checkPanelEliminatable();
            }

            this.fillInterval += 1;
        }
    }
});

cc._RFpop();
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem","States":"States"}],"Eliminate":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7b910h9DBlEMYmM2T2qQ1xv', 'Eliminate');
// script/Eliminate.js


var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
// var BoxState = require("States").BoxState;
var BoxShowType = require("States").BoxShowType;

cc.Class({
    "extends": cc.Component,

    properties: {

        _select_box: {
            "default": null,
            type: cc.Node,
            visible: false
        },

        //选中某个方块
        select_box: {
            get: function get() {
                return this._select_box;
            },
            set: function set(value) {
                if (!this.select_box) {

                    value.showType = BoxShowType.K_Select;
                    this._select_box = value;
                } else {
                    var boxItem_new = value.getComponent("BoxDrop").boxItem;
                    var boxItem_old = this._select_box.getComponent("BoxDrop").boxItem;
                    if (boxItem_new.id !== boxItem_old.id) {
                        // console.log("看是否要交互位置 还是说切换到这个选中的位置处理");
                        console.log("id1 = " + boxItem_new.id + "  id2= " + boxItem_old.id);
                        //旧的取消选择
                        this._select_box.showType = BoxShowType.K_Normal;

                        if (boxItem_new.rank === boxItem_old.rank && Math.abs(boxItem_new.row - boxItem_old.row) === 1 || boxItem_new.row === boxItem_old.row && Math.abs(boxItem_new.rank - boxItem_old.rank) === 1) {
                            // console.log("是相近的 交换位置");

                            var boxPanel = cc.find("Game/Panel").getComponent("BoxPanel");
                            boxPanel.exchangeBoxItem(value, this._select_box);

                            this._select_box = null;
                        } else {
                            // console.log("不是相近的 取消上一个选择 选中新点击的");

                            value.showType = BoxShowType.K_Select;

                            this._select_box = value;
                        }
                    } else {
                        // console.log("选中了同一个 取消选择");
                        value.showType = BoxShowType.K_Normal;

                        this._select_box = null;
                    }
                }
            },
            visible: false
        }

    },

    // use this for initialization
    onLoad: function onLoad() {},

    //点击了 某个选项
    click_item: function click_item(click_node) {

        //console.log(item);

        var boxPanel = cc.find("Game/Panel").getComponent("BoxPanel");

        var boxItem = click_node.getComponent("BoxDrop").boxItem;

        //  //消除掉
        //  boxPanel.boxDrop_destroy(click_node);

        //  //上面的掉下来
        //  boxPanel.updateRankEndY(boxItem.rank);

        this.select_box = click_node;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem","States":"States"}],"States":[function(require,module,exports){
"use strict";
cc._RFpush(module, '825dffoY2JNS6LKKSchXyiY', 'States');
// script/State/States.js


//方块掉落的状态
var BoxState = cc.Enum({

    // ENone : -1,      //什么都不是

    ENormal: -1, //正常
    EFalling: -1, //掉落
    EFalled: -1, //掉落结束
    EDestroy: -1 });

//方块显示的状态
//销毁

var BoxShowType = cc.Enum({

    K_Normal: -1, //正常
    K_Select: -1, //选中

    K_SkillAround: -1, //销毁 周边的九个
    K_SkillRank: -1, //销毁 该列
    K_SkillRaw: -1, //销毁 该行
    K_SkillColor: -1 });

//游戏进行的状态
//销毁 该色
var Game_State = cc.Enum({
    Start: -1, //开始实例
    Filling: -1, //方块补齐中
    Play: -1, //进行中
    Over: -1 });

//结束
module.exports = {

    BoxState: BoxState,
    BoxShowType: BoxShowType,
    Game_State: Game_State

};

cc._RFpop();
},{}]},{},["BoxDrop","BoxItem","BoxPanel","Eliminate","States"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hEcm9wLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hJdGVtLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hQYW5lbC5qcyIsImFzc2V0cy9zY3JpcHQvRWxpbWluYXRlLmpzIiwiYXNzZXRzL3NjcmlwdC9TdGF0ZS9TdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNRO0FBQ1I7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBRVE7QUFDSTtBQUNBO0FBQVo7QUFDQTtBQUVRO0FBQVI7QUFFWTtBQUNJO0FBQWhCO0FBQ0E7QUFFWTtBQUFaO0FBRWdCO0FBQ0k7QUFDSTtBQUF4QjtBQUV3QjtBQUF4QjtBQUE4QjtBQUdOO0FBQXhCO0FBRXdCO0FBQXhCO0FBQThCO0FBRTlCO0FBR3dCO0FBRHhCO0FBQzhCO0FBQzlCO0FBSXdCO0FBRnhCO0FBRThCO0FBQTlCO0FBTXdCO0FBSnhCO0FBSThCO0FBRjlCO0FBTXdCO0FBSnhCO0FBSThCO0FBRjlCO0FBQ0E7QUFDQTtBQVNRO0FBQ0k7QUFDQTtBQVBaO0FBQ0E7QUFDQTtBQVNRO0FBUFI7QUFTWTtBQUNJO0FBUGhCO0FBQ0E7QUFTWTtBQVBaO0FBU2dCO0FBUGhCO0FBU29CO0FBUHBCO0FBU29CO0FBUHBCO0FBU29CO0FBUHBCO0FBU29CO0FBQ0k7QUFQeEI7QUFTNEI7QUFQNUI7QUFPa0M7QUFMbEM7QUFVNEI7QUFSNUI7QUFRa0M7QUFHTjtBQVI1QjtBQVU0QjtBQVI1QjtBQVFrQztBQUdOO0FBUjVCO0FBQ0E7QUFDQTtBQVc0QjtBQVQ1QjtBQVNrQztBQVBsQztBQUNBO0FBQ0E7QUFZWTtBQVZaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVlJO0FBQ0k7QUFWUjtBQUNBO0FBWUk7QUFWSjtBQVlRO0FBQ0E7QUFWUjtBQVlRO0FBQ0E7QUFWUjtBQUNBO0FBYUk7QUFDSTtBQVhSO0FBYVE7QUFDQTtBQUNBO0FBWFI7QUFDQTtBQWNJO0FBQ0k7QUFaUjtBQWNRO0FBQ0E7QUFaUjtBQUNBO0FBQ0E7QUFnQkk7QUFkSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaUJJO0FBQ0k7QUFDSTtBQWZaO0FBQ0E7QUFDQTtBQWlCSTtBQWZKO0FBaUJRO0FBZlI7QUFpQlE7QUFDQTtBQWZSO0FBQ0E7QUFtQkk7QUFqQko7QUFDQTtBQW1CUTtBQWpCUjtBQW1CUTtBQWpCUjtBQUNBO0FBdUJJO0FBckJKO0FBdUJRO0FBQ0E7QUFyQlI7QUF3QlE7QUF0QlI7QUFDQTtBQUNBO0FBMEJJO0FBeEJKO0FBQ0E7QUFDQTtBQUNBO0FBMEJRO0FBeEJSO0FBMEJZO0FBeEJaO0FBMEJZO0FBeEJaO0FBQ0E7QUEwQmdCO0FBQ0E7QUF4QmhCO0FBMEJnQjtBQXhCaEI7QUEwQmdCO0FBeEJoQjtBQUNBO0FBMEJZO0FBeEJaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEwQmdCO0FBeEJoQjtBQTBCZ0I7QUFDSTtBQXhCcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFFQTtBQUFBO0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNJO0FBSEo7QUFLSTtBQUhKO0FBQ0E7QUFLUTtBQUhSO0FBS1E7QUFIUjtBQUtRO0FBSFI7QUFLUTtBQUhSO0FBS1E7QUFDSTtBQUNJO0FBQ0k7QUFBcUI7QUFBc0I7QUFDckI7QUFBdUI7QUFDeEI7QUFBc0I7QUFDdkI7QUFBcUI7QUFDcEI7QUFBc0I7QUFDbkM7QUFBb0I7QUFJaEQ7QUFDQTtBQUNBO0FBQ0E7QUFEUTtBQUdSO0FBRFE7QUFHUjtBQURRO0FBQ0k7QUFDSTtBQUdoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREk7QUFHSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNJO0FBQUo7QUFFSTtBQUFKO0FBRVE7QUFDSTtBQUNBO0FBQVo7QUFDQTtBQUVRO0FBQ0k7QUFDQTtBQUFaO0FBQ0E7QUFFUTtBQUNJO0FBQ0E7QUFBWjtBQUNBO0FBRVE7QUFDSTtBQUNBO0FBQVo7QUFDQTtBQUVRO0FBQ0k7QUFDQTtBQUFaO0FBQ0E7QUFFUTtBQUNJO0FBQ0k7QUFBaEI7QUFFWTtBQUFaO0FBRWdCO0FBQ0k7QUFDQTtBQUFwQjtBQUV3QjtBQUF4QjtBQUV3QjtBQUF4QjtBQUNBO0FBQ0E7QUFHWTtBQURaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHSTtBQURKO0FBR1E7QUFEUjtBQUdZO0FBQ0k7QUFDSTtBQUNBO0FBRHBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR1E7QUFEUjtBQUdRO0FBQ0E7QUFEUjtBQUdRO0FBRFI7QUFDQTtBQUNBO0FBQ0E7QUFHUTtBQUNBO0FBRFI7QUFHUTtBQUNBO0FBRFI7QUFDQTtBQUNBO0FBR1E7QUFEUjtBQUdRO0FBRFI7QUFDQTtBQUNBO0FBR0k7QUFESjtBQUdRO0FBRFI7QUFHUTtBQURSO0FBR1E7QUFEUjtBQUdZO0FBQ0k7QUFEaEI7QUFDQTtBQUNBO0FBQ0E7QUFHUTtBQUNBO0FBRFI7QUFNUTtBQUpSO0FBQ0E7QUFNUTtBQUNJO0FBSlo7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Q0E7QUFBcEI7QUFFd0I7QUFBeEI7QUFFd0I7QUFBeEI7QUFFd0I7QUFBeEI7QUFDQTtBQUc0QjtBQUNBO0FBRDVCO0FBRzRCO0FBRDVCO0FBQ0E7QUFDQTtBQUk0QjtBQUY1QjtBQUk0QjtBQUY1QjtBQUNBO0FBQ0E7QUFLd0I7QUFIeEI7QUFLd0I7QUFIeEI7QUFDQTtBQUNBO0FBS1k7QUFIWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0k7QUFISjtBQUNBO0FBVUk7QUFSSjtBQUNBO0FBQ0E7QUFVUztBQVJUO0FBVVM7QUFSVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVdTO0FBVFQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBREo7QUFDQTtBQU1BO0FBSkE7QUFNSTtBQUNBO0FBQ0E7QUFKSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbnZhciBCb3hJdGVtID0gcmVxdWlyZShcIkJveEl0ZW1cIik7XHJcblxyXG52YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBzcGVlZDowLFxyXG5cclxuICAgICAgICBhY2Nfc3BlZWQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjkuOCxcclxuICAgICAgICAgICAgdG9vbHRvcDpcIuWKoOmAn+W6plwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYm94SXRlbTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hJdGVtLFxyXG4gICAgICAgICAgICAvL3Zpc2libGU6ZmFsc2UsXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIF9zaG93VHlwZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6Qm94U2hvd1R5cGUuS19Ob3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U2hvd1R5cGVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzaG93VHlwZTp7XHJcblxyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Nob3dUeXBlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfTm9ybWFsOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19TZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxBcm91bmQ6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbENvbG9yOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxSYW5rOlxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsUmF3OlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgICAgIF9zdGF0ZV9iOntcclxuICAgICAgICAgICAgZGVmYXVsdDpCb3hTdGF0ZS5FTm9ybWFsLFxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG4gICAgICAgICAgICAvLyB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhdGVfYjp7XHJcblxyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlX2I7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc3RhdGVfYiAhPT0gdmFsdWUpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZV9iID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gdGhpcy5zcGVlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FTm9ybWFsOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRmFsbGluZzpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVGYWxsZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGxheShcImFuaV9ib3hcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVEZXN0cm95OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLmkafmr4HlkLlhc2RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLm5vZGUuY29sb3IgPSBjYy5jb2xvcigyNTUsMjU1LDI1NSwyNTUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5pbWF0aW9uLnBsYXkoXCJib3hfZGVzdHJveVwiKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG5cclxuICAgICAgICAgICAgLy8gdG9vbHRvcDpcIuaWueWdl+eahOeKtuaAgVwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXRpY3M6e1xyXG4gICAgICAgIEJveFN0YXRlOkJveFN0YXRlXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQoKXtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RfaXRlbSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcInNlbFwiKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgdW51c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInhpYW9odWlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gLTEwMDAwMDtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJldXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjaG9uZ3lvbmdcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuY2xpY2tfYWRkKCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Qm94SXRlbTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCF0aGlzLmJveEl0ZW0pe1xyXG4gICAgICAgICAgICB0aGlzLmJveEl0ZW0gPSBuZXcgQm94SXRlbSgpOyAgICBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsaWNrX2FjdGlvbjpmdW5jdGlvbigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi54K55Ye75LqGICAgXCIrXCJyYW5rPVwiK3RoaXMuYm94SXRlbS5yYW5rK1wicm93PVwiK3RoaXMuYm94SXRlbS5yb3cpO1xyXG5cclxuICAgICAgICBsZXQgZWxpbWluYXRlID0gY2MuZmluZChcIkdhbWUvRWxpbWluYXRlXCIpLmdldENvbXBvbmVudChcIkVsaW1pbmF0ZVwiKTtcclxuICAgICAgICBlbGltaW5hdGUuY2xpY2tfaXRlbSh0aGlzKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBkZXN0cm95RmluaXNoOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy/liqjnlLvnu5PmnZ/kuYvlkI7nmoTlm57osINcclxuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmkafmr4HliqjnlLvlrozmiJBcIik7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICByZXNldE9yaWdpblBvczpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3k7XHJcblxyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAgICAgLy/lpoLmnpzmmK/mraPlnKjmjonokL3nmoQg5Yi35pawZW5keSDnmoTlnZDmoIdcclxuICAgICAgICAvLyBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nIHx8XHJcbiAgICAgICAgLy8gICAgIHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRURlc3Ryb3kpe1xyXG4gICAgICAgIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9ib3R0b20gPSB0aGlzLm5vZGUueSArIHRoaXMubm9kZS5oZWlnaHQgKiAwLjU7XHJcblxyXG4gICAgICAgICAgICBpZiAoYm94X2JvdHRvbSA+IHRoaXMuYm94SXRlbS5lbmRfeSkge1xyXG4gICAgICAgICAgICAgICAgLy/liqDpgJ/luqbmjonokL1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc3BlZWRfbiA9IHRoaXMuY3VycmVudFNwZWVkICsgdGhpcy5hY2Nfc3BlZWQqZHQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IChzcGVlZF9uICsgdGhpcy5jdXJyZW50U3BlZWQgKSowLjUgKiBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IHNwZWVkX247XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgLT0gcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS55IDwgdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDmjonokL3liLDmjIflrprkvY3nva7nmoTml7blgJnlvLnliqjkuIDkuItcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMubm9kZS54ID4gdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5ub2RlLnggLT0gdGhpcy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA8IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxufSk7XHJcblxyXG4iLCJcclxuXHJcblxyXG52YXIgQ29sb3JfQm94ID0gY2MuRW51bSh7XHJcblxyXG4gICAgWUVMTE9XIDogLTEsXHJcbiAgICBHcmVlbiA6IC0xLFxyXG4gICAgQmx1ZSA6IC0xLFxyXG4gICAgQmxhY2sgOiAtMSxcclxuICAgIFdoaXRlIDogLTEsXHJcbiAgICAvLyBXaGl0ZSA6IC0xLFxyXG5cclxuXHJcbiAgICAvLyBDb3VudDotMSxcclxufSk7XHJcblxyXG5cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgICAgIC8v5byA5aeL5o6J6JC955qE5L2N572ueFxyXG4gICAgICAgIGJlZ2luX3g6MCxcclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnlcclxuICAgICAgICBiZWdpbl95IDogMCxcclxuICAgICAgICAvL+imgeaKtei+vueahOS9jee9rllcclxuICAgICAgICBlbmRfeSA6IC0xMDAwLFxyXG4gICAgICAgIC8v5pi+56S655qE6aKc6ImyXHJcbiAgICAgICAgY29sb3JfdHlwZSA6IENvbG9yX0JveC5XaGl0ZSxcclxuXHJcbiAgICAgICAgY29sb3Jfc2hvdzp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMuY29sb3JfdHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guV2hpdGU6cmV0dXJuIGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LllFTExPVzpyZXR1cm4gY2MuQ29sb3IuWUVMTE9XO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LkdyZWVuOnJldHVybiBjYy5Db2xvci5HUkVFTjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5CbHVlOnJldHVybiBjYy5Db2xvci5CTFVFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LkJsYWNrOnJldHVybiBjYy5Db2xvci5CTEFDSztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OnJldHVybiBjYy5Db2xvci5SRUQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+ihjFxyXG4gICAgICAgIHJhbmsgOiAwLFxyXG4gICAgICAgIC8v5YiXXHJcbiAgICAgICAgcm93IDogMCxcclxuXHJcbiAgICAgICAgaWQ6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJhbmsudG9TdHJpbmcoKSArIHRoaXMucm93LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuXHJcblxyXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcclxuLy8gICAgIENvbG9yX0JveCA6IENvbG9yX0JveFxyXG4vLyB9OyIsIlxyXG5cclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxudmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEdhbWVfU3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkdhbWVfU3RhdGU7XHJcblxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgYm94X3ByZWZhYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jhbms6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi5YiX5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcm93OntcclxuICAgICAgICAgICAgZGVmYXVsdDoxMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuihjOaVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3VwZXJfbm9kZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9nYW1lU3RhdGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkdhbWVfU3RhdGUuU3RhcnQsXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnYW1lc3RhdGU6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVTdGF0ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSAhPT0gdmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVTdGF0ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLlBsYXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlICBpZih2YWx1ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVtb3ZlQnlWYWx1ZSA9IGZ1bmN0aW9uKGFycix2YWwpe1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGk8YXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKGFycltpXSA9PT0gdmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBcnJheS5wcm90b3R5cGUuZmlsdGVyUmVwZWF0ID0gZnVuY3Rpb24oKXsgIFxyXG4gICAgICAgIC8vICAgICAvL+ebtOaOpeWumuS5iee7k+aenOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICAvLyAgICAgaWYoYXJyLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIC8vICAgICAgICAgYXJyLnB1c2godGhpc1swXSk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuXHJcbiAgICAgICAgLy8gICAgIGZvcih2YXIgaSA9IDE7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKXsgICAgLy/ku47mlbDnu4TnrKzkuozpobnlvIDlp4vlvqrnjq/pgY3ljobmraTmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/lr7nlhYPntKDov5vooYzliKTmlq3vvJogIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/lpoLmnpzmlbDnu4TlvZPliY3lhYPntKDlnKjmraTmlbDnu4TkuK3nrKzkuIDmrKHlh7rnjrDnmoTkvY3nva7kuI3mmK9pICBcclxuICAgICAgICAvLyAgICAgICAgIC8v6YKj5LmI5oiR5Lus5Y+v5Lul5Yik5pat56ysaemhueWFg+e0oOaYr+mHjeWkjeeahO+8jOWQpuWImeebtOaOpeWtmOWFpee7k+aenOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgICAgICBpZih0aGlzLmluZGV4T2YodGhpc1tpXSkgPT0gaSl7ICBcclxuICAgICAgICAvLyAgICAgICAgICAgICBhcnIucHVzaCh0aGlzW2ldKTsgIFxyXG4gICAgICAgIC8vICAgICAgICAgfSAgXHJcbiAgICAgICAgLy8gICAgIH0gIFxyXG4gICAgICAgIC8vICAgICByZXR1cm4gYXJyOyAgXHJcbiAgICAgICAgLy8gfSAgXHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtV2lkdGggPSAxMDA7XHJcbiAgICAgICAgdGhpcy5pdGVtSGVpZ2h0ID0gMTAwO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1TcGFjZSA9IDU7XHJcblxyXG4gICAgICAgIC8vdGhpcy5tYXJnaW5fdG9wID0gLShjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqdGhpcy5udW1fcm93ICsgdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcm93IC0gMSkgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIC8vdGhpcy5tYXJnaW5fYm90dG9tID0gLShjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkuaGVpZ2h0KSowLjUgLSB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG5cclxuICAgICAgICB0aGlzLm1hcmdpbl90b3AgPSAtKHRoaXMuc3VwZXJfbm9kZS5oZWlnaHQpKjAuNSArIHRoaXMuaXRlbUhlaWdodCp0aGlzLm51bV9yb3cgKyB0aGlzLml0ZW1TcGFjZSAqICh0aGlzLm51bV9yb3cgLSAxKSArIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5fYm90dG9tID0gLSh0aGlzLnN1cGVyX25vZGUuaGVpZ2h0KSowLjUgLSB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG5cclxuICAgICAgICB0aGlzLm1hcmdpbl9sZWZ0ID0gIC10aGlzLml0ZW1XaWR0aCp0aGlzLm51bV9yYW5rKjAuNSArIHRoaXMuaXRlbVNwYWNlKih0aGlzLm51bV9yYW5rKjAuNS0xKTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9yaWdodCA9IHRoaXMuaXRlbVdpZHRoICogdGhpcy5udW1fcmFuayAqIDAuNSAtIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JhbmsgKiAwLjUgLSAxKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFzZHMgIFwiICsgdGhpcy5tYXJnaW5fdG9wK1wiICBcIit0aGlzLm1hcmdpbl9ib3R0b20pO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wgPSBuZXcgY2MuTm9kZVBvb2woXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlcGxheUdhbWUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/ph43mlrDlvIDlp4vmuLjmiI9cclxuICAgIHJlcGxheUdhbWU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlN0YXJ0O1xyXG5cclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnN1cGVyX25vZGUuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIHdoaWxlKGNoaWxkcmVuLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3hEcm9wX2Rlc3Ryb3koY2hpbGRyZW5baV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5riF56m6cmFua2xpc3RcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICB3aGlsZSAoaXRlbSA9IHRoaXMucmFua0xpc3Quc2hpZnQoKSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5riF56m65oiQ5YqfXCIpO1xyXG5cclxuICAgICAgICAvL+WIm+W7uuaJgOaciemdouadv+eahOaVsOaNrlxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleDx0aGlzLm51bV9yYW5rOyBpbmRleCsrKXtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSYW5rQ29udGVudChpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVCZWdpbk9yaWdpblkoKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8v5Yib5bu65q+P5LiA5YiX55qE5pWw5o2uXHJcbiAgICBjcmVhdGVSYW5rQ29udGVudDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCByYW5rX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaW5kZXg7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLm51bV9yb3c7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICBib3guYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGJveC53aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG4gICAgICAgICAgICBib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuaW5pdEJveEl0ZW0oKTtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feCA9IG9yaWdpbl94O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSooaSsxKTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5jb2xvcl90eXBlID0gKGNjLnJhbmRvbTBUbzEoKSo1KSB8IDA7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5yZXNldE9yaWdpblBvcygpO1xyXG5cclxuICAgICAgICAgICAgYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgIHJhbmtfbGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0LnB1c2gocmFua19saXN0KTtcclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+abtOaWsOaJgOacieWIlyBlbmQgeeeahOaVsOaNrlxyXG4gICAgdXBkYXRlQWxsUmFua0VuZFk6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgLy/nnIvor6XliJfnmoTmlbDph4/mmK/lkKYg5bCP5LqOIHRoaXMubnVtX3JvdyAg5bCR5LqO55qE6K+d5YiZ6KGl5YWFXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0X3N1YiA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aGlsZShsaXN0X3N1Yi5sZW5ndGggPCB0aGlzLm51bV9yb3cpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBuZXdfYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICAgICAgbmV3X2JveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IG5ld19ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucmFuayA9IGk7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IDA7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuICAgICAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmV3X2JveC5wYXJlbnQgPSB0aGlzLnN1cGVyX25vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdF9zdWIucHVzaChuZXdfYm94KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpbmRleF07XHJcblxyXG4gICAgICAgICAgICAvL+abtOaWsOavj+S4quWFg+e0oOeahGVuZCB5IOS9jee9rlxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaTxsaXN0X3N1Yi5sZW5ndGg7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gbGlzdF9zdWJbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBpdGVtX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSooaSsxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVCZWdpbk9yaWdpblkoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nKXtcclxuICAgICAgICAvLyAgICAgLy8gY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUoY2FsbGJhY2ssIHRoaXMsIGludGVydmFsLCAhdGhpcy5faXNSdW5uaW5nKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgdGhpcy5jYWxsQmFja0ZpbGxpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT095a6a5pe25Zmo5Yi35LqGPT09PT1cIik7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZi5udW1fcm93OyBqKyspIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGxldCBib3hfY19pID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmKGJveF9jX2kuc3RhdGVfYiAhPT0gQm94U3RhdGUuRUZhbGxlZCl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT095qOA5rWL5piv5ZCm5byA5raI6ZmkPT09PT09PT09XCIpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgICAgICBzZWxmLnVuc2NoZWR1bGUoc2VsZi5jYWxsQmFja0ZpbGxpbmcpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgICAgICBzZWxmLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgLy/liKTmlq3ku5bmmK/lkKbmiYDmnInmlrnlnZflt7LmjonokL3liLDmjIflrprkvY3nva5cclxuICAgICAgICAvLyAgICAgLy/ov5novrnlpoLmnpxiaW5kIHRoaXPnmoTor50g5a6a5pe25Zmo5YGc5LiN5LiL5p2lXHJcbiAgICAgICAgLy8gICAgIHRoaXMuc2NoZWR1bGUodGhpcy5jYWxsQmFja0ZpbGxpbmcsMC4yKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOavj+S4gOWIl+S7luS7rOS4reeahOavj+S4quWFg+e0oOeahOWIneWni+eahG9yaWdpbiB555qE5YC8XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUJlZ2luT3JpZ2luWTpmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmn5DkuIDliJfkuK0g5LuO5pyA5ZCO5byA5aeL6YGN5Y6G6L+U5ZueXHJcbiAgICAgICAgICog566X5Ye65byA5aeL5o6J5LqG55qE5L2N572uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG5cclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKYg5bey6L6+5Yiw5LuW55qEZW5keSDlpoLmnpzov5jmnKrovr7liLDlsLHmmK8g5q2j6KaB5o6J6JC9XHJcbiAgICAgICAgICAgIGxldCBvZmZfdG9wID0gMDtcclxuICAgICAgICAgICAgbGV0IHNwYWNlX3RvcCA9IDU7XHJcblxyXG4gICAgICAgICAgICAvLyBmb3IobGV0IGogPSB0aGlzLm51bV9yb3ctMTsgaj49MDsgai0tKXtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yb3c7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIC8vYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGJveF9jLm5vZGUueSAhPT0gYm94X2MuYm94SXRlbS5lbmRfeSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIDEu5a6e5L6L5ri45oiP55qE5pe25YCZIOWIneWni+W8gOWni+eahOS9jee9rlxyXG4gICAgICAgICAgICAgICAgICAgICAqIDIu5raI6Zmk55qEIOaWueWdl+S4jeWcqOeVjOmdouS4reeahOiuvue9ruS7lueahOW8gOWni+S9jee9riDlt7LlnKjnlYzpnaLkuK3nmoTkuI3ljrvorr7nva7ku5ZcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZigodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpIHx8IChib3hfYy5ub2RlLnkgPj0gYm94X2MuYm94SXRlbS5iZWdpbl95KSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3AgKyBvZmZfdG9wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Mubm9kZS55ID0gYm94X2MuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmX3RvcCA9IG9mZl90b3AgKyBib3hfYy5ub2RlLmhlaWdodCArIHNwYWNlX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlX3RvcCA9IHNwYWNlX3RvcCArIDEwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/mmK/opoHmjonokL3nmoRcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIC8v5Lqk5o2i5Lik5Liq5pa55Z2X55qE5L2N572uXHJcbiAgICBleGNoYW5nZUJveEl0ZW06ZnVuY3Rpb24oYm94MSxib3gyLHRvQ2hlY2tWaWFibGUgPSB0cnVlKXtcclxuXHJcbiAgICAgICAgbGV0IGJveEl0ZW0xID0gYm94MS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgbGV0IGJveEl0ZW0yID0gYm94Mi5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgIGlmKGJveEl0ZW0xLnJhbmsgPT09IGJveEl0ZW0yLnJhbmspe1xyXG4gICAgICAgICAgICAvL+WQjOS4gOWIl+eahFxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9lbmR5ID0gYm94SXRlbTIuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmVuZF95ID0gYm94SXRlbTEuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLmVuZF95ID0gdGVtcF9lbmR5O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JvdyA9IGJveEl0ZW0yLnJvdztcclxuXHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJvdyA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgYm94SXRlbTEucm93ID0gdGVtcF9yb3c7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdFtib3hJdGVtMS5yb3ddO1xyXG4gICAgICAgICAgICBsaXN0W2JveEl0ZW0xLnJvd10gPSBsaXN0W2JveEl0ZW0yLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTIucm93XSA9IHRlbXBfbm9kZTtcclxuXHJcblxyXG5cclxuICAgICAgICB9ZWxzZSBpZihib3hJdGVtMS5yb3cgPT09IGJveEl0ZW0yLnJvdyl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA6KGM55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0MSA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcbiAgICAgICAgICAgIGxldCBsaXN0MiA9IHRoaXMucmFua0xpc3RbYm94SXRlbTIucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9iZWdpbnggPSBib3hJdGVtMi5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMi5iZWdpbl94ID0gYm94SXRlbTEuYmVnaW5feDtcclxuICAgICAgICAgICAgYm94SXRlbTEuYmVnaW5feCA9IHRlbXBfYmVnaW54O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JhbmsgPSBib3hJdGVtMi5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMi5yYW5rID0gYm94SXRlbTEucmFuaztcclxuICAgICAgICAgICAgYm94SXRlbTEucmFuayA9IHRlbXBfcmFuaztcclxuXHJcbiAgICAgICAgICAgIGxldCByb3dfaW5kZXggPSBib3hJdGVtMS5yb3c7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0MVtyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0MVtyb3dfaW5kZXhdID0gbGlzdDJbcm93X2luZGV4XTtcclxuICAgICAgICAgICAgbGlzdDJbcm93X2luZGV4XSA9IHRlbXBfbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRvQ2hlY2tWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzVmlhYmxlID0gdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICBpZighaXNWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5LiN5Y+v5raI6Zmk55qE6K+dIOS9jee9ruWGjeS6kuaNouWbnuadpVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLkuI3lj6/mtojpmaRcIik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leGNoYW5nZUJveEl0ZW0oYm94Mixib3gxLGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/mo4DmtYvpnaLmnb/miYDmnInmlrnlnZcg5piv5ZCm5Y+v5raI6ZmkXHJcbiAgICBjaGVja1BhbmVsRWxpbWluYXRhYmxlOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCB3aXBlX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgLy/liKTmlq3liJcg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG4gICAgICAgICAgICAgICAgaWYoIXByZV9ib3gpe1xyXG4gICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fcHJlID0gcHJlX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvQWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbV9wcmUuY29sb3JfdHlwZSA9PT0gaXRlbV9ib3guY29sb3JfdHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3Jvdy0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHdpcGVfbGlzdCx0ZW1wTGlzdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZXBlYXRJdGVtSW5XaXBlKGl0ZW0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHdpcGVfbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZih3aXBlX2xpc3RbaV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkID09PSBpdGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/liKTmlq3ooYwg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yYW5rOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMucmFua0xpc3Rbal1baV07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcmFuay0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc1JlcGVhdEl0ZW1JbldpcGUoZWxlbSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXBlX2xpc3QucHVzaChlbGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+a4heepuuaVsOe7hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmKHdpcGVfbGlzdC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93RGVsYXlBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAvL+S4jeaYvuekuua2iOmZpOWKqOeUu1xyXG4gICAgICAgICAgICAgICAgc2hvd0RlbGF5QW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vI3dhcm5cclxuICAgICAgICAgICAgLy/ov5nkuIDlnZcg6YC76L6RIOaciemXrumimFxyXG5cclxuICAgICAgICAgICAgaWYoc2hvd0RlbGF5QW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+eKtuaAgeiuvue9ruaIkOaYr+aRp+avgVxyXG4gICAgICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gZWxlbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guc3RhdGVfYiA9IEJveFN0YXRlLkVEZXN0cm95O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgfSwgMC4zLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAvL+S4jeaYr+WIneWni+WMlueahCDlgZznlZnkuIDkvJrlhL/lho3mtojpmaRcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/mtojpmaTmjolcclxuICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/mnInplIDmr4HlnKjmjonokL1cclxuICAgICAgICAgICAgICAgIGlmKHNob3dEZWxheUFuaW1hdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/mraPlnKjmjonokL3loavlhYVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuRmlsbGluZztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFsbFJhbmtFbmRZKCk7XHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksc2hvd0RlbGF5QW5pbWF0aW9uPzAuNjowLGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlBsYXk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgYm94RHJvcF9nZXQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IGJveCA9IG51bGw7XHJcbiAgICAgICAgaWYodGhpcy5ib3hQb29sLnNpemUoKSA+IDApe1xyXG4gICAgICAgICAgICBib3ggPSB0aGlzLmJveFBvb2wuZ2V0KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGJveCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm94X3ByZWZhYik7XHJcbiAgICAgICAgICAgIGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICB9LFxyXG5cclxuICAgIGJveERyb3BfZGVzdHJveTpmdW5jdGlvbihib3gpe1xyXG5cclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wucHV0KGJveC5ub2RlKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZShjYWxsYmFjaywgdGhpcywgaW50ZXJ2YWwsICF0aGlzLl9pc1J1bm5pbmcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5maWxsSW50ZXJ2YWwgPT09IDEwKXtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT3lrprml7blvIDlp4vliKTmlq3mmK/lkKbpg73lt7LmjonokL3liLDlupXpg6jkuoY9PT09PVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaTxzZWxmLm51bV9yYW5rOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHNlbGYucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZi5udW1fcm93OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3hfY19pID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGJveF9jX2kuc3RhdGVfYiAhPT0gQm94U3RhdGUuRUZhbGxlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT095qOA5rWL5piv5ZCm5byA5raI6ZmkPT09PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlBsYXk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgKz0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxufSk7XHJcblxyXG5cclxuIiwiXHJcbnZhciBCb3hEcm9wID0gcmVxdWlyZShcIkJveERyb3BcIik7XHJcbnZhciBCb3hJdGVtID0gcmVxdWlyZShcIkJveEl0ZW1cIik7XHJcbi8vIHZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBCb3hTaG93VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U2hvd1R5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIF9zZWxlY3RfYm94OntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2UsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/pgInkuK3mn5DkuKrmlrnlnZdcclxuICAgICAgICBzZWxlY3RfYm94OiB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdF9ib3g7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0X2JveCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfU2VsZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hJdGVtX25ldyA9IHZhbHVlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9vbGQgPSB0aGlzLl9zZWxlY3RfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYm94SXRlbV9uZXcuaWQgIT09IGJveEl0ZW1fb2xkLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi55yL5piv5ZCm6KaB5Lqk5LqS5L2N572uIOi/mOaYr+ivtOWIh+aNouWIsOi/meS4qumAieS4reeahOS9jee9ruWkhOeQhlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZDEgPSBcIiArIGJveEl0ZW1fbmV3LmlkICsgXCIgIGlkMj0gXCIgKyBib3hJdGVtX29sZC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5pen55qE5Y+W5raI6YCJ5oupXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3guc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYm94SXRlbV9uZXcucmFuayA9PT0gYm94SXRlbV9vbGQucmFuayAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yb3cgLSBib3hJdGVtX29sZC5yb3cpID09PSAxKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGJveEl0ZW1fbmV3LnJvdyA9PT0gYm94SXRlbV9vbGQucm93ICYmIE1hdGguYWJzKGJveEl0ZW1fbmV3LnJhbmsgLSBib3hJdGVtX29sZC5yYW5rKSA9PT0gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5piv55u46L+R55qEIOS6pOaNouS9jee9rlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94UGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFBhbmVsLmV4Y2hhbmdlQm94SXRlbSh2YWx1ZSwgdGhpcy5fc2VsZWN0X2JveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuS4jeaYr+ebuOi/keeahCDlj5bmtojkuIrkuIDkuKrpgInmi6kg6YCJ5Lit5paw54K55Ye755qEXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19TZWxlY3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi6YCJ5Lit5LqG5ZCM5LiA5LiqIOWPlua2iOmAieaLqVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8v54K55Ye75LqGIOafkOS4qumAiemhuVxyXG4gICAgY2xpY2tfaXRlbTpmdW5jdGlvbihjbGlja19ub2RlKXtcclxuICAgICAgICBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGl0ZW0pO1xyXG5cclxuICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcblxyXG4gICAgICAgICBsZXQgYm94SXRlbSA9IGNsaWNrX25vZGUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAvLyAgLy/mtojpmaTmjolcclxuICAgICAgICAvLyAgYm94UGFuZWwuYm94RHJvcF9kZXN0cm95KGNsaWNrX25vZGUpO1xyXG5cclxuICAgICAgICAvLyAgLy/kuIrpnaLnmoTmjonkuIvmnaVcclxuICAgICAgICAvLyAgYm94UGFuZWwudXBkYXRlUmFua0VuZFkoYm94SXRlbS5yYW5rKTtcclxuXHJcblxyXG4gICAgICAgICB0aGlzLnNlbGVjdF9ib3ggPSBjbGlja19ub2RlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiXG4vL+aWueWdl+aOieiQveeahOeKtuaAgVxuY29uc3QgQm94U3RhdGUgPSBjYy5FbnVtKHtcblxuICAgIC8vIEVOb25lIDogLTEsICAgICAgLy/ku4DkuYjpg73kuI3mmK9cblxuICAgIEVOb3JtYWwgOiAtMSwgICAgLy/mraPluLhcbiAgICBFRmFsbGluZyA6IC0xLCAgIC8v5o6J6JC9XG4gICAgRUZhbGxlZCA6IC0xLCAgICAvL+aOieiQvee7k+adn1xuICAgIEVEZXN0cm95IDogLTEsICAgLy/plIDmr4FcblxufSk7XG5cbi8v5pa55Z2X5pi+56S655qE54q25oCBXG5jb25zdCBCb3hTaG93VHlwZSA9IGNjLkVudW0oe1xuXG4gICAgS19Ob3JtYWwgOiAtMSwgICAgICAgICAgLy/mraPluLhcbiAgICBLX1NlbGVjdCA6IC0xLCAgICAgICAgICAvL+mAieS4rVxuXG4gICAgS19Ta2lsbEFyb3VuZCA6IC0xLCAgICAgICAvL+mUgOavgSDlkajovrnnmoTkuZ3kuKpcbiAgICBLX1NraWxsUmFuayA6IC0xLCAgICAgICAgIC8v6ZSA5q+BIOivpeWIl1xuICAgIEtfU2tpbGxSYXcgOiAtMSwgICAgICAgICAgLy/plIDmr4Eg6K+l6KGMXG4gICAgS19Ta2lsbENvbG9yIDogLTEsICAgICAgICAvL+mUgOavgSDor6XoibJcbn0pO1xuXG5cblxuLy/muLjmiI/ov5vooYznmoTnirbmgIFcbnZhciBHYW1lX1N0YXRlID0gY2MuRW51bSh7XG4gICAgU3RhcnQgOiAtMSwgICAgIC8v5byA5aeL5a6e5L6LXG4gICAgRmlsbGluZzogLTEsICAgIC8v5pa55Z2X6KGl6b2Q5LitXG4gICAgUGxheSA6IC0xLCAgICAgIC8v6L+b6KGM5LitXG4gICAgT3ZlciA6IC0xLCAgICAgIC8v57uT5p2fXG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBCb3hTdGF0ZSxcbiAgICBCb3hTaG93VHlwZSxcbiAgICBHYW1lX1N0YXRlXG5cbn07Il19