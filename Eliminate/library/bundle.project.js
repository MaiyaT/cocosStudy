require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BoxDrop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '89bc7CJRGxJBZsOHDnUjDFu', 'BoxDrop');
// script/BoxDrop.js

"use strict";

var BoxItem = require("BoxItem");

var BoxState = require("States").BoxState;
var BoxShowType = require("States").BoxShowType;

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

        _showType: {
            default: BoxShowType.K_Normal,
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
            default: BoxState.ENormal,
            type: BoxState
        },

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

cc._RF.pop();
},{"BoxItem":"BoxItem","States":"States"}],"BoxItem":[function(require,module,exports){
"use strict";
cc._RF.push(module, '1e9eeXAPpRI2pOXFKZL+0Bg', 'BoxItem');
// script/BoxItem.js

"use strict";

var Color_Box = cc.Enum({

    YELLOW: -1,
    Green: -1,
    Blue: -1,
    Black: -1,
    White: -1
});

cc.Class({
    extends: cc.Component,

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

cc._RF.pop();
},{}],"BoxPanel":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ec9173gyKpBEJYU26Ye1eOe', 'BoxPanel');
// script/BoxPanel.js

"use strict";

var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
var BoxState = require("States").BoxState;
var Game_State = require("States").Game_State;

cc.Class({
    extends: cc.Component,

    properties: {

        box_prefab: {
            default: null,
            type: cc.Prefab
        },

        num_rank: {
            default: 10,
            tooltip: "列数"
        },

        num_row: {
            default: 10,
            tooltip: "行数"
        },

        super_node: {
            default: null,
            type: cc.Node
        },

        _gameState: {
            default: Game_State.Start,
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
                var _box_c = item_box.getComponent("BoxDrop");

                _box_c.boxItem.row = _i;
                _box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight + this.itemSpace) * (_i + 1);
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
        var toCheckViable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


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
            var _temp_node = list1[row_index];
            list1[row_index] = list2[row_index];
            list2[row_index] = _temp_node;
        }

        if (toCheckViable) {

            var isViable = this.checkPanelEliminatable();

            if (!isViable) {

                //不可消除的话 位置再互换回来
                console.log("不可消除");
                setTimeout(function () {
                    this.exchangeBoxItem(box2, box1, false);
                }.bind(this), 300);
            }
        }
    },

    //检测面板所有方块 是否可消除
    checkPanelEliminatable: function checkPanelEliminatable() {

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
            for (var _i2 = 0; _i2 < wipe_list.length; _i2++) {
                if (wipe_list[_i2].getComponent("BoxDrop").boxItem.id === item.getComponent("BoxDrop").boxItem.id) {
                    return true;
                }
            }
            return false;
        }

        //判断行 是否有三个以及三个以上的一样的色块连在一起
        for (var _i3 = 0; _i3 < this.num_row; _i3++) {

            var _tempList = [];
            var _pre_box = null;
            for (var _j = 0; _j < this.num_rank; _j++) {
                var _box = this.rankList[_j][_i3];
                if (!_pre_box) {
                    _pre_box = _box;
                    _tempList.push(_box);
                } else {
                    var _item_pre = _pre_box.getComponent("BoxDrop").boxItem;
                    var _item_box = _box.getComponent("BoxDrop").boxItem;

                    var _toAdd = false;
                    if (_item_pre.color_type === _item_box.color_type) {
                        _tempList.push(_box);
                        if (_j === this.num_rank - 1) {
                            _toAdd = true;
                        }
                    } else {
                        _toAdd = true;
                    }

                    if (_toAdd) {
                        if (_tempList.length >= 3) {
                            //追加到wipe里面
                            _tempList.forEach(function (elem) {

                                if (!isRepeatItemInWipe(elem)) {
                                    wipe_list.push(elem);
                                }
                            });
                        }
                        //清空数组
                        _tempList = [];

                        _pre_box = _box;
                        _tempList.push(_box);
                    }
                }
            }
        }

        if (wipe_list.length > 0) {

            var showDelayAnimation = true;
            if (this.gamestate === Game_State.Start) {
                //不显示消除动画
                showDelayAnimation = false;
            }

            //#warn
            //这一块 逻辑 有问题

            if (showDelayAnimation) {
                this.schedule(function () {
                    //状态设置成是摧毁
                    wipe_list.forEach(function (elem) {

                        var box = elem.getComponent("BoxDrop");
                        box.state_b = BoxState.EDestroy;
                    }.bind(this));
                }, 0.3, 1);
            }

            //不是初始化的 停留一会儿再消除
            this.schedule(function () {

                //消除掉
                wipe_list.forEach(function (elem) {

                    this.boxDrop_destroy(elem.getComponent("BoxDrop"));
                }.bind(this));

                //有销毁在掉落
                if (showDelayAnimation) {
                    //正在掉落填充
                    this.gamestate = Game_State.Filling;
                }

                this.updateAllRankEndY();
            }.bind(this), showDelayAnimation ? 0.6 : 0, false);

            return true;
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

            var self = this;

            if (this.fillInterval === 10) {

                this.fillInterval = 0;

                console.log("======定时开始判断是否都已掉落到底部了=====");

                for (var i = 0; i < self.num_rank; i++) {
                    var list = self.rankList[i];

                    for (var j = 0; j < self.num_row; j++) {
                        var box = list[j];
                        var box_c_i = box.getComponent("BoxDrop");
                        if (box_c_i.state_b !== BoxState.EFalled) {
                            return;
                        }
                    }
                }

                console.log("=========检测是否开消除=========");

                this.gamestate === Game_State.Play;
                self.checkPanelEliminatable();
            }

            this.fillInterval += 1;
        }
    }
});

cc._RF.pop();
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem","States":"States"}],"Eliminate":[function(require,module,exports){
"use strict";
cc._RF.push(module, '7b910h9DBlEMYmM2T2qQ1xv', 'Eliminate');
// script/Eliminate.js

"use strict";

var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
// var BoxState = require("States").BoxState;
var BoxShowType = require("States").BoxShowType;

cc.Class({
    extends: cc.Component,

    properties: {

        _select_box: {
            default: null,
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

cc._RF.pop();
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem","States":"States"}],"JSBCall":[function(require,module,exports){
"use strict";
cc._RF.push(module, '88435lB2SRBPYyLC7Ahqc66', 'JSBCall');
// script/JSBCall.js

"use strict";

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

        lab_show: {
            default: null,
            type: cc.Label
        }

    },

    ocCallJs: function ocCallJs(str) {

        this.lab_show.node.active = true;

        this.lab_show.string = str;

        this.scheduleOnce(function () {

            this.lab_show.node.active = false;
        }, 5);
    },

    jsCallOc: function jsCallOc() {

        //类名 方法  参数1 参数2 参数3
        var result = jsb.reflection.callStaticMethod("JSBManager", "yhJSBCall:", "js这边传入的参数");

        console.log("js_call_oc ========= %@", result);
    },

    // use this for initialization
    onLoad: function onLoad() {

        // this.ocCallJs("测试 显示隐藏");

    }

});

cc._RF.pop();
},{}],"States":[function(require,module,exports){
"use strict";
cc._RF.push(module, '825dffoY2JNS6LKKSchXyiY', 'States');
// script/State/States.js

"use strict";

//方块掉落的状态
var BoxState = cc.Enum({

    // ENone : -1,      //什么都不是

    ENormal: -1, //正常
    EFalling: -1, //掉落
    EFalled: -1, //掉落结束
    EDestroy: -1 });

//方块显示的状态
var BoxShowType = cc.Enum({

    K_Normal: -1, //正常
    K_Select: -1, //选中

    K_SkillAround: -1, //销毁 周边的九个
    K_SkillRank: -1, //销毁 该列
    K_SkillRaw: -1, //销毁 该行
    K_SkillColor: -1 });

//游戏进行的状态
var Game_State = cc.Enum({
    Start: -1, //开始实例
    Filling: -1, //方块补齐中
    Play: -1, //进行中
    Over: -1 });

module.exports = {

    BoxState: BoxState,
    BoxShowType: BoxShowType,
    Game_State: Game_State

};

cc._RF.pop();
},{}]},{},["BoxDrop","BoxItem","BoxPanel","Eliminate","JSBCall","States"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvSlNCQ2FsbC5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvU3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBRkk7O0FBT1I7QUFDSTtBQUNBO0FBRk07O0FBS1Y7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJO0FBQ0k7QUFDSTs7QUFFQTs7QUFFSjtBQUNJOztBQUVBOztBQUVKOztBQUdJOztBQUVKOztBQUdJOztBQUVKOztBQUlJOztBQUVKOztBQUVJOztBQTdCUjtBQWlDSDtBQXpDSTs7QUE4Q1Q7QUFDSTtBQUNBO0FBRks7O0FBTVQ7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUk7O0FBRUo7O0FBR0k7O0FBRUo7QUFDSTs7QUFFQTs7QUFFSjtBQUNJO0FBQ0E7QUFDQTs7O0FBR0E7O0FBckJSO0FBeUJIO0FBQ0o7O0FBRUQ7O0FBNUNJOztBQXpFQTs7QUE0SFo7QUFDSTtBQURJOztBQUlSOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNIOzs7QUFHRDtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUVIOztBQUVEO0FBQ0k7O0FBRUE7QUFDQTtBQUNIOztBQUlEO0FBQ0E7O0FBRUk7OztBQUdIOztBQUVEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7O0FBRUk7O0FBRUE7QUFDQTtBQUNIOztBQUlEOztBQUVJO0FBQ0E7O0FBRUE7QUFDSDs7QUFNRDs7QUFFSTtBQUNBOztBQUdBO0FBRUg7O0FBR0Q7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTs7QUFFSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDs7QUFFSTs7OztBQUlBOztBQUVBO0FBQ0k7QUFDSDtBQUNKO0FBRUo7O0FBTUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQTdQSTs7Ozs7Ozs7OztBQ0hUOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOb0I7O0FBZXhCO0FBQ0k7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0k7QUFDSTtBQUFxQjtBQUNyQjtBQUFzQjtBQUN0QjtBQUFxQjtBQUNyQjtBQUFvQjtBQUNwQjtBQUFxQjtBQUNyQjtBQUFRO0FBTlo7QUFRSDtBQVZNOztBQWFYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBSEY7QUE3Qks7O0FBb0NaO0FBQ0E7O0FBeENLOztBQW1EVDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGSzs7QUFLVDtBQUNJO0FBQ0E7QUFGSTs7QUFLUjtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0k7QUFDSDtBQUNEOztBQUVJO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0g7QUFFSjtBQUNKO0FBQ0Q7QUFqQk07O0FBM0JGOztBQWlEWjtBQUNBOztBQUVJOztBQUVJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7O0FBS0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUE7QUFDSDs7QUFHRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBR0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBRUg7O0FBS0Q7O0FBRUE7QUFDQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKOztBQUVEOztBQUVBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIOztBQUVEOzs7QUFHQTs7QUFHSTs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTs7QUFFQTtBQUNBOztBQUVBOztBQUVJOzs7O0FBSUE7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBO0FBR0k7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFBd0Q7OztBQUVwRDtBQUNBOztBQUVBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBSUg7QUFDRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFHRDs7QUFFSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUdKO0FBRUo7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUtEO0FBQ0E7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7O0FBRUk7QUFDQTtBQUVIO0FBQ0o7QUFDSjs7QUFJRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBRUg7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQVFEOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSDs7QUFPRDtBQUNBOztBQUVJO0FBQ0k7O0FBRUE7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKOztBQUdEOztBQUVBO0FBQ0E7QUFDSDs7QUFFRDtBQUNIO0FBRUo7QUE3bUJJOzs7Ozs7Ozs7O0FDUFQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFDQTtBQUhROztBQU1aO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJOztBQUVJO0FBQ0E7QUFFSDtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUk7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7O0FBRUE7O0FBRUE7QUFDSDtBQUVKO0FBQ0c7QUFDQTs7QUFFQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBNUNROztBQVRKOztBQTBEWjtBQUNBOztBQU9BO0FBQ0E7O0FBRUk7O0FBRUM7O0FBRUE7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQztBQUNKOztBQXRGSTs7Ozs7Ozs7OztBQ05UO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFGSzs7QUFaRDs7QUFvQlo7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFHRDtBQUNBOztBQUVJOztBQUVIOztBQXBESTs7Ozs7Ozs7OztBQ0NUO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBSUo7QUFDQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUtKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFNSjs7QUFFSTtBQUNBO0FBQ0E7O0FBSmEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBCb3hTaG93VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U2hvd1R5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNwZWVkOjAsXHJcblxyXG4gICAgICAgIGFjY19zcGVlZDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6OS44LFxyXG4gICAgICAgICAgICB0b29sdG9wOlwi5Yqg6YCf5bqmXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBib3hJdGVtOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOkJveEl0ZW0sXHJcbiAgICAgICAgICAgIC8vdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgX3Nob3dUeXBlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpCb3hTaG93VHlwZS5LX05vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hTaG93VHlwZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNob3dUeXBlOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hvd1R5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ob3JtYWw6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NlbGVjdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbEFyb3VuZDpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsQ29sb3I6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbFJhbms6XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxSYXc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAgICAgX3N0YXRlX2I6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFN0YXRlLkVOb3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U3RhdGUsXHJcbiAgICAgICAgICAgIC8vIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdGF0ZV9iOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVfYjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zdGF0ZV9iICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlX2IgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVOb3JtYWw6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVGYWxsaW5nOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxlZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2JveFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRURlc3Ryb3k6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuaRp+avgeWQuWFzZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubm9kZS5jb2xvciA9IGNjLmNvbG9yKDI1NSwyNTUsMjU1LDI1NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmltYXRpb24ucGxheShcImJveF9kZXN0cm95XCIpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U3RhdGUsXHJcblxyXG4gICAgICAgICAgICAvLyB0b29sdG9wOlwi5pa55Z2X55qE54q25oCBXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc3RhdGljczp7XHJcbiAgICAgICAgQm94U3RhdGU6Qm94U3RhdGVcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdCgpe1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdF9pdGVtID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwic2VsXCIpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICB1bnVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwieGlhb2h1aVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSAtMTAwMDAwO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcmV1c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNob25neW9uZ1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5jbGlja19hZGQoKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRCb3hJdGVtOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuYm94SXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbSA9IG5ldyBCb3hJdGVtKCk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tfYWN0aW9uOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLngrnlh7vkuoYgICBcIitcInJhbms9XCIrdGhpcy5ib3hJdGVtLnJhbmsrXCJyb3c9XCIrdGhpcy5ib3hJdGVtLnJvdyk7XHJcblxyXG4gICAgICAgIGxldCBlbGltaW5hdGUgPSBjYy5maW5kKFwiR2FtZS9FbGltaW5hdGVcIikuZ2V0Q29tcG9uZW50KFwiRWxpbWluYXRlXCIpO1xyXG4gICAgICAgIGVsaW1pbmF0ZS5jbGlja19pdGVtKHRoaXMpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIGRlc3Ryb3lGaW5pc2g6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvL+WKqOeUu+e7k+adn+S5i+WQjueahOWbnuiwg1xyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIuaRp+avgeWKqOeUu+WujOaIkFwiKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIHJlc2V0T3JpZ2luUG9zOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5jb2xvciA9IHRoaXMuYm94SXRlbS5jb2xvcl9zaG93O1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICAvL+WmguaenOaYr+ato+WcqOaOieiQveeahCDliLfmlrBlbmR5IOeahOWdkOagh1xyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcgfHxcclxuICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRGVzdHJveSl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzcGVlZF9uID0gdGhpcy5jdXJyZW50U3BlZWQgKyB0aGlzLmFjY19zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIGxldCBzID0gKHNwZWVkX24gKyB0aGlzLmN1cnJlbnRTcGVlZCApKjAuNSAqIGR0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gc3BlZWRfbjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSAtPSBzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnkgPCB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOaOieiQveWIsOaMh+WumuS9jee9rueahOaXtuWAmeW8ueWKqOS4gOS4i1xyXG4gICAgICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAvLyBpZiAodGhpcy5ub2RlLnggPiB0aGlzLmJveEl0ZW0uYmVnaW5feCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5vZGUueCAtPSB0aGlzLnNwZWVkICogZHQ7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gaWYgKHRoaXMubm9kZS54IDwgdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICAvLyB9XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbiIsIlxyXG5cclxuXHJcbnZhciBDb2xvcl9Cb3ggPSBjYy5FbnVtKHtcclxuXHJcbiAgICBZRUxMT1cgOiAtMSxcclxuICAgIEdyZWVuIDogLTEsXHJcbiAgICBCbHVlIDogLTEsXHJcbiAgICBCbGFjayA6IC0xLFxyXG4gICAgV2hpdGUgOiAtMSxcclxuICAgIC8vIFdoaXRlIDogLTEsXHJcblxyXG5cclxuICAgIC8vIENvdW50Oi0xLFxyXG59KTtcclxuXHJcblxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva54XHJcbiAgICAgICAgYmVnaW5feDowLFxyXG4gICAgICAgIC8v5byA5aeL5o6J6JC955qE5L2N572ueVxyXG4gICAgICAgIGJlZ2luX3kgOiAwLFxyXG4gICAgICAgIC8v6KaB5oq16L6+55qE5L2N572uWVxyXG4gICAgICAgIGVuZF95IDogLTEwMDAsXHJcbiAgICAgICAgLy/mmL7npLrnmoTpopzoibJcclxuICAgICAgICBjb2xvcl90eXBlIDogQ29sb3JfQm94LldoaXRlLFxyXG5cclxuICAgICAgICBjb2xvcl9zaG93OntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5XaGl0ZTpyZXR1cm4gY2MuQ29sb3IuV0hJVEU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guWUVMTE9XOnJldHVybiBjYy5Db2xvci5ZRUxMT1c7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guR3JlZW46cmV0dXJuIGNjLkNvbG9yLkdSRUVOO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LkJsdWU6cmV0dXJuIGNjLkNvbG9yLkJMVUU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guQmxhY2s6cmV0dXJuIGNjLkNvbG9yLkJMQUNLO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6cmV0dXJuIGNjLkNvbG9yLlJFRDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6KGMXHJcbiAgICAgICAgcmFuayA6IDAsXHJcbiAgICAgICAgLy/liJdcclxuICAgICAgICByb3cgOiAwLFxyXG5cclxuICAgICAgICBpZDp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFuay50b1N0cmluZygpICsgdGhpcy5yb3cudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG5cclxuXHJcbi8vIG1vZHVsZS5leHBvcnRzID0ge1xyXG4vLyAgICAgQ29sb3JfQm94IDogQ29sb3JfQm94XHJcbi8vIH07IiwiXHJcblxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG52YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICBib3hfcHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcmFuazp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLliJfmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yb3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi6KGM5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdXBlcl9ub2RlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2dhbWVTdGF0ZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6R2FtZV9TdGF0ZS5TdGFydCxcclxuICAgICAgICAgICAgdHlwZTpHYW1lX1N0YXRlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdhbWVzdGF0ZTp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZVN0YXRlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlICE9PSB2YWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUgPT09IEdhbWVfU3RhdGUuUGxheSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA5aeL5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQmVnaW5PcmlnaW5ZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHlwZTpHYW1lX1N0YXRlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5yZW1vdmVCeVZhbHVlID0gZnVuY3Rpb24oYXJyLHZhbCl7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaTxhcnIubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYoYXJyW2ldID09PSB2YWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEFycmF5LnByb3RvdHlwZS5maWx0ZXJSZXBlYXQgPSBmdW5jdGlvbigpeyAgXHJcbiAgICAgICAgLy8gICAgIC8v55u05o6l5a6a5LmJ57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIC8vICAgICBpZihhcnIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgLy8gICAgICAgICBhcnIucHVzaCh0aGlzWzBdKTtcclxuICAgICAgICAvLyAgICAgfVxyXG5cclxuICAgICAgICAvLyAgICAgZm9yKHZhciBpID0gMTsgaSA8IHRoaXMubGVuZ3RoOyBpKyspeyAgICAvL+S7juaVsOe7hOesrOS6jOmhueW8gOWni+W+queOr+mBjeWOhuatpOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WvueWFg+e0oOi/m+ihjOWIpOaWre+8miAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WmguaenOaVsOe7hOW9k+WJjeWFg+e0oOWcqOatpOaVsOe7hOS4reesrOS4gOasoeWHuueOsOeahOS9jee9ruS4jeaYr2kgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/pgqPkuYjmiJHku6zlj6/ku6XliKTmlq3nrKxp6aG55YWD57Sg5piv6YeN5aSN55qE77yM5ZCm5YiZ55u05o6l5a2Y5YWl57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIGlmKHRoaXMuaW5kZXhPZih0aGlzW2ldKSA9PSBpKXsgIFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGFyci5wdXNoKHRoaXNbaV0pOyAgXHJcbiAgICAgICAgLy8gICAgICAgICB9ICBcclxuICAgICAgICAvLyAgICAgfSAgXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBhcnI7ICBcclxuICAgICAgICAvLyB9ICBcclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1XaWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSAxMDA7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVNwYWNlID0gNTtcclxuXHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl90b3AgPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSArIHRoaXMuaXRlbUhlaWdodCp0aGlzLm51bV9yb3cgKyB0aGlzLml0ZW1TcGFjZSAqICh0aGlzLm51bV9yb3cgLSAxKSArIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl9ib3R0b20gPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSAtIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX3RvcCA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9ib3R0b20gPSAtKHRoaXMuc3VwZXJfbm9kZS5oZWlnaHQpKjAuNSAtIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX2xlZnQgPSAgLXRoaXMuaXRlbVdpZHRoKnRoaXMubnVtX3JhbmsqMC41ICsgdGhpcy5pdGVtU3BhY2UqKHRoaXMubnVtX3JhbmsqMC41LTEpO1xyXG4gICAgICAgIHRoaXMubWFyZ2luX3JpZ2h0ID0gdGhpcy5pdGVtV2lkdGggKiB0aGlzLm51bV9yYW5rICogMC41IC0gdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcmFuayAqIDAuNSAtIDEpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXNkcyAgXCIgKyB0aGlzLm1hcmdpbl90b3ArXCIgIFwiK3RoaXMubWFyZ2luX2JvdHRvbSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIHRoaXMucmVwbGF5R2FtZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+mHjeaWsOW8gOWni+a4uOaIj1xyXG4gICAgcmVwbGF5R2FtZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuU3RhcnQ7XHJcblxyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuc3VwZXJfbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgd2hpbGUoY2hpbGRyZW4ubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShjaGlsZHJlbltpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/muIXnqbpyYW5rbGlzdFxyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHdoaWxlIChpdGVtID0gdGhpcy5yYW5rTGlzdC5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmuIXnqbrmiJDlip9cIik7XHJcblxyXG4gICAgICAgIC8v5Yib5bu65omA5pyJ6Z2i5p2/55qE5pWw5o2uXHJcbiAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGluZGV4PHRoaXMubnVtX3Jhbms7IGluZGV4Kyspe1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJhbmtDb250ZW50KGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/liJvlu7rmr4/kuIDliJfnmoTmlbDmja5cclxuICAgIGNyZWF0ZVJhbmtDb250ZW50OmZ1bmN0aW9uKGluZGV4KXtcclxuXHJcbiAgICAgICAgbGV0IHJhbmtfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuICAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubnVtX3JvdzsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgIGJveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIGJveC5oZWlnaHQgPSB0aGlzLml0ZW1IZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgcmFua19saXN0LnB1c2goYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QucHVzaChyYW5rX2xpc3QpO1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5omA5pyJ5YiXIGVuZCB555qE5pWw5o2uXHJcbiAgICB1cGRhdGVBbGxSYW5rRW5kWTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAvL+eci+ivpeWIl+eahOaVsOmHj+aYr+WQpiDlsI/kuo4gdGhpcy5udW1fcm93ICDlsJHkuo7nmoTor53liJnooaXlhYVcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxpc3Rfc3ViID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlKGxpc3Rfc3ViLmxlbmd0aCA8IHRoaXMubnVtX3Jvdyl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICBuZXdfYm94LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feCA9IG9yaWdpbl94O1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gMDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9IChjYy5yYW5kb20wVG8xKCkqNSkgfCAwO1xyXG4gICAgICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdfYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0X3N1Yi5wdXNoKG5ld19ib3gpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIC8v5pu05paw5q+P5Liq5YWD57Sg55qEZW5kIHkg5L2N572uXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPGxpc3Rfc3ViLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBsaXN0X3N1YltpXTtcclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGl0ZW1fYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbHNlIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgIC8vICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZShjYWxsYmFjaywgdGhpcywgaW50ZXJ2YWwsICF0aGlzLl9pc1J1bm5pbmcpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLmNhbGxCYWNrRmlsbGluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT3lrprml7blmajliLfkuoY9PT09PVwiKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8c2VsZi5udW1fcmFuazsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgbGV0IGxpc3QgPSBzZWxmLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3mo4DmtYvmmK/lkKblvIDmtojpmaQ9PT09PT09PT1cIik7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgICAgIHNlbGYudW5zY2hlZHVsZShzZWxmLmNhbGxCYWNrRmlsbGluZyk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgICAgIHNlbGYuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAvL+WIpOaWreS7luaYr+WQpuaJgOacieaWueWdl+W3suaOieiQveWIsOaMh+WumuS9jee9rlxyXG4gICAgICAgIC8vICAgICAvL+i/mei+ueWmguaenGJpbmQgdGhpc+eahOivnSDlrprml7blmajlgZzkuI3kuIvmnaVcclxuICAgICAgICAvLyAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLmNhbGxCYWNrRmlsbGluZywwLjIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw5q+P5LiA5YiX5LuW5Lus5Lit55qE5q+P5Liq5YWD57Sg55qE5Yid5aeL55qEb3JpZ2luIHnnmoTlgLxcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQmVnaW5PcmlnaW5ZOmZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOafkOS4gOWIl+S4rSDku47mnIDlkI7lvIDlp4vpgY3ljobov5Tlm55cclxuICAgICAgICAgKiDnrpflh7rlvIDlp4vmjonkuobnmoTkvY3nva5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpiDlt7Lovr7liLDku5bnmoRlbmR5IOWmguaenOi/mOacqui+vuWIsOWwseaYryDmraPopoHmjonokL1cclxuICAgICAgICAgICAgbGV0IG9mZl90b3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VfdG9wID0gNTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvcihsZXQgaiA9IHRoaXMubnVtX3Jvdy0xOyBqPj0wOyBqLS0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9ib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYm94X2Mubm9kZS55ICE9PSBib3hfYy5ib3hJdGVtLmVuZF95KXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogMS7lrp7kvovmuLjmiI/nmoTml7blgJkg5Yid5aeL5byA5aeL55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAgICAgICogMi7mtojpmaTnmoQg5pa55Z2X5LiN5Zyo55WM6Z2i5Lit55qE6K6+572u5LuW55qE5byA5aeL5L2N572uIOW3suWcqOeVjOmdouS4reeahOS4jeWOu+iuvue9ruS7llxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcCArIG9mZl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wID0gb2ZmX3RvcCArIGJveF9jLm5vZGUuaGVpZ2h0ICsgc3BhY2VfdG9wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2VfdG9wID0gc3BhY2VfdG9wICsgMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+aYr+imgeaOieiQveeahFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlBsYXkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFxyXG4gICAgLy/kuqTmjaLkuKTkuKrmlrnlnZfnmoTkvY3nva5cclxuICAgIGV4Y2hhbmdlQm94SXRlbTpmdW5jdGlvbihib3gxLGJveDIsdG9DaGVja1ZpYWJsZSA9IHRydWUpe1xyXG5cclxuICAgICAgICBsZXQgYm94SXRlbTEgPSBib3gxLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICBsZXQgYm94SXRlbTIgPSBib3gyLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgaWYoYm94SXRlbTEucmFuayA9PT0gYm94SXRlbTIucmFuayl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA5YiX55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2VuZHkgPSBib3hJdGVtMi5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTIuZW5kX3kgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTEuZW5kX3kgPSB0ZW1wX2VuZHk7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcm93ID0gYm94SXRlbTIucm93O1xyXG5cclxuICAgICAgICAgICAgYm94SXRlbTIucm93ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yb3cgPSB0ZW1wX3JvdzsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0W2JveEl0ZW0xLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTEucm93XSA9IGxpc3RbYm94SXRlbTIucm93XTtcclxuICAgICAgICAgICAgbGlzdFtib3hJdGVtMi5yb3ddID0gdGVtcF9ub2RlO1xyXG5cclxuXHJcblxyXG4gICAgICAgIH1lbHNlIGlmKGJveEl0ZW0xLnJvdyA9PT0gYm94SXRlbTIucm93KXtcclxuICAgICAgICAgICAgLy/lkIzkuIDooYznmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QxID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QyID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMi5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2JlZ2lueCA9IGJveEl0ZW0yLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmJlZ2luX3ggPSBib3hJdGVtMS5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5iZWdpbl94ID0gdGVtcF9iZWdpbng7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcmFuayA9IGJveEl0ZW0yLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJhbmsgPSBib3hJdGVtMS5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yYW5rID0gdGVtcF9yYW5rO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd19pbmRleCA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgbGV0IHRlbXBfbm9kZSA9IGxpc3QxW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QxW3Jvd19pbmRleF0gPSBsaXN0Mltyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0Mltyb3dfaW5kZXhdID0gdGVtcF9ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodG9DaGVja1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXNWaWFibGUgPSB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFpc1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/kuI3lj6/mtojpmaTnmoTor50g5L2N572u5YaN5LqS5o2i5Zue5p2lXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4jeWPr+a2iOmZpFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4Y2hhbmdlQm94SXRlbShib3gyLGJveDEsZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+ajgOa1i+mdouadv+aJgOacieaWueWdlyDmmK/lkKblj6/mtojpmaRcclxuICAgIGNoZWNrUGFuZWxFbGltaW5hdGFibGU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IHdpcGVfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAvL+WIpOaWreWIlyDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZW1wTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcHJlX2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcm93LTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkod2lwZV9saXN0LHRlbXBMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc1JlcGVhdEl0ZW1JbldpcGUoaXRlbSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8d2lwZV9saXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHdpcGVfbGlzdFtpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uaWQgPT09IGl0ZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+WIpOaWreihjCDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3Jhbms7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5yYW5rTGlzdFtqXVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGogPT09ICh0aGlzLm51bV9yYW5rLTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzUmVwZWF0SXRlbUluV2lwZShlbGVtKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5wdXNoKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYod2lwZV9saXN0Lmxlbmd0aCA+IDApe1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dEZWxheUFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIC8v5LiN5pi+56S65raI6Zmk5Yqo55S7XHJcbiAgICAgICAgICAgICAgICBzaG93RGVsYXlBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLy8jd2FyblxyXG4gICAgICAgICAgICAvL+i/meS4gOWdlyDpgLvovpEg5pyJ6Zeu6aKYXHJcblxyXG4gICAgICAgICAgICBpZihzaG93RGVsYXlBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v54q25oCB6K6+572u5oiQ5piv5pGn5q+BXHJcbiAgICAgICAgICAgICAgICAgICAgd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3ggPSBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5zdGF0ZV9iID0gQm94U3RhdGUuRURlc3Ryb3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB9LCAwLjMsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8v5LiN5piv5Yid5aeL5YyW55qEIOWBnOeVmeS4gOS8muWEv+WGjea2iOmZpFxyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+a2iOmZpOaOiVxyXG4gICAgICAgICAgICAgICAgd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm94RHJvcF9kZXN0cm95KGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+aciemUgOavgeWcqOaOieiQvVxyXG4gICAgICAgICAgICAgICAgaWYoc2hvd0RlbGF5QW5pbWF0aW9uKXtcclxuICAgICAgICAgICAgICAgICAgICAvL+ato+WcqOaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5GaWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsUmFua0VuZFkoKTtcclxuXHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxzaG93RGVsYXlBbmltYXRpb24/MC42OjAsZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuUGxheTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICBib3hEcm9wX2dldDpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBsZXQgYm94ID0gbnVsbDtcclxuICAgICAgICBpZih0aGlzLmJveFBvb2wuc2l6ZSgpID4gMCl7XHJcbiAgICAgICAgICAgIGJveCA9IHRoaXMuYm94UG9vbC5nZXQoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgYm94ID0gY2MuaW5zdGFudGlhdGUodGhpcy5ib3hfcHJlZmFiKTtcclxuICAgICAgICAgICAgYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJveDtcclxuICAgIH0sXHJcblxyXG4gICAgYm94RHJvcF9kZXN0cm95OmZ1bmN0aW9uKGJveCl7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3guYm94SXRlbS5yYW5rXTtcclxuICAgICAgICBcclxuICAgICAgICBsaXN0LnJlbW92ZUJ5VmFsdWUobGlzdCxib3gubm9kZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyl7XHJcbiAgICAgICAgICAgIC8vIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnNjaGVkdWxlKGNhbGxiYWNrLCB0aGlzLCBpbnRlcnZhbCwgIXRoaXMuX2lzUnVubmluZyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmZpbGxJbnRlcnZhbCA9PT0gMTApe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PeWumuaXtuW8gOWni+WIpOaWreaYr+WQpumDveW3suaOieiQveWIsOW6lemDqOS6hj09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3mo4DmtYvmmK/lkKblvIDmtojpmaQ9PT09PT09PT1cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCArPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG59KTtcclxuXHJcblxyXG4iLCJcclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuLy8gdmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEJveFNob3dUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTaG93VHlwZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX3NlbGVjdF9ib3g6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+mAieS4reafkOS4quaWueWdl1xyXG4gICAgICAgIHNlbGVjdF9ib3g6IHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0X2JveDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RfYm94KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19TZWxlY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fbmV3ID0gdmFsdWUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hJdGVtX29sZCA9IHRoaXMuX3NlbGVjdF9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChib3hJdGVtX25ldy5pZCAhPT0gYm94SXRlbV9vbGQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLnnIvmmK/lkKbopoHkuqTkupLkvY3nva4g6L+Y5piv6K+05YiH5o2i5Yiw6L+Z5Liq6YCJ5Lit55qE5L2N572u5aSE55CGXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkMSA9IFwiICsgYm94SXRlbV9uZXcuaWQgKyBcIiAgaWQyPSBcIiArIGJveEl0ZW1fb2xkLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/ml6fnmoTlj5bmtojpgInmi6lcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveC5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChib3hJdGVtX25ldy5yYW5rID09PSBib3hJdGVtX29sZC5yYW5rICYmIE1hdGguYWJzKGJveEl0ZW1fbmV3LnJvdyAtIGJveEl0ZW1fb2xkLnJvdykgPT09IDEpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYm94SXRlbV9uZXcucm93ID09PSBib3hJdGVtX29sZC5yb3cgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucmFuayAtIGJveEl0ZW1fb2xkLnJhbmspID09PSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmmK/nm7jov5HnmoQg5Lqk5o2i5L2N572uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94UGFuZWwuZXhjaGFuZ2VCb3hJdGVtKHZhbHVlLCB0aGlzLl9zZWxlY3RfYm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5LiN5piv55u46L+R55qEIOWPlua2iOS4iuS4gOS4qumAieaLqSDpgInkuK3mlrDngrnlh7vnmoRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLpgInkuK3kuoblkIzkuIDkuKog5Y+W5raI6YCJ5oupXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/ngrnlh7vkuoYg5p+Q5Liq6YCJ6aG5XHJcbiAgICBjbGlja19pdGVtOmZ1bmN0aW9uKGNsaWNrX25vZGUpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coaXRlbSk7XHJcblxyXG4gICAgICAgICBsZXQgYm94UGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hJdGVtID0gY2xpY2tfbm9kZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgIC8vICAvL+a2iOmZpOaOiVxyXG4gICAgICAgIC8vICBib3hQYW5lbC5ib3hEcm9wX2Rlc3Ryb3koY2xpY2tfbm9kZSk7XHJcblxyXG4gICAgICAgIC8vICAvL+S4iumdoueahOaOieS4i+adpVxyXG4gICAgICAgIC8vICBib3hQYW5lbC51cGRhdGVSYW5rRW5kWShib3hJdGVtLnJhbmspO1xyXG5cclxuXHJcbiAgICAgICAgIHRoaXMuc2VsZWN0X2JveCA9IGNsaWNrX25vZGU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGxhYl9zaG93OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgIH0sXG5cblxuICAgIG9jQ2FsbEpzOmZ1bmN0aW9uIChzdHIpIHtcblxuICAgICAgICB0aGlzLmxhYl9zaG93Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmxhYl9zaG93LnN0cmluZyA9IHN0cjtcblxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHRoaXMubGFiX3Nob3cubm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB9LDUpO1xuXG4gICAgfSxcblxuICAgIGpzQ2FsbE9jOmZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvL+exu+WQjSDmlrnms5UgIOWPguaVsDEg5Y+C5pWwMiDlj4LmlbAzXG4gICAgICAgIHZhciByZXN1bHQgPSBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwiSlNCTWFuYWdlclwiLFwieWhKU0JDYWxsOlwiLFwianPov5novrnkvKDlhaXnmoTlj4LmlbBcIik7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJqc19jYWxsX29jID09PT09PT09PSAlQFwiLHJlc3VsdCk7XG5cbiAgICB9LFxuXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyB0aGlzLm9jQ2FsbEpzKFwi5rWL6K+VIOaYvuekuumakOiXj1wiKTtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJcbi8v5pa55Z2X5o6J6JC955qE54q25oCBXG5jb25zdCBCb3hTdGF0ZSA9IGNjLkVudW0oe1xuXG4gICAgLy8gRU5vbmUgOiAtMSwgICAgICAvL+S7gOS5iOmDveS4jeaYr1xuXG4gICAgRU5vcm1hbCA6IC0xLCAgICAvL+ato+W4uFxuICAgIEVGYWxsaW5nIDogLTEsICAgLy/mjonokL1cbiAgICBFRmFsbGVkIDogLTEsICAgIC8v5o6J6JC957uT5p2fXG4gICAgRURlc3Ryb3kgOiAtMSwgICAvL+mUgOavgVxuXG59KTtcblxuLy/mlrnlnZfmmL7npLrnmoTnirbmgIFcbmNvbnN0IEJveFNob3dUeXBlID0gY2MuRW51bSh7XG5cbiAgICBLX05vcm1hbCA6IC0xLCAgICAgICAgICAvL+ato+W4uFxuICAgIEtfU2VsZWN0IDogLTEsICAgICAgICAgIC8v6YCJ5LitXG5cbiAgICBLX1NraWxsQXJvdW5kIDogLTEsICAgICAgIC8v6ZSA5q+BIOWRqOi+ueeahOS5neS4qlxuICAgIEtfU2tpbGxSYW5rIDogLTEsICAgICAgICAgLy/plIDmr4Eg6K+l5YiXXG4gICAgS19Ta2lsbFJhdyA6IC0xLCAgICAgICAgICAvL+mUgOavgSDor6XooYxcbiAgICBLX1NraWxsQ29sb3IgOiAtMSwgICAgICAgIC8v6ZSA5q+BIOivpeiJslxufSk7XG5cblxuXG4vL+a4uOaIj+i/m+ihjOeahOeKtuaAgVxudmFyIEdhbWVfU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBTdGFydCA6IC0xLCAgICAgLy/lvIDlp4vlrp7kvotcbiAgICBGaWxsaW5nOiAtMSwgICAgLy/mlrnlnZfooaXpvZDkuK1cbiAgICBQbGF5IDogLTEsICAgICAgLy/ov5vooYzkuK1cbiAgICBPdmVyIDogLTEsICAgICAgLy/nu5PmnZ9cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIEJveFN0YXRlLFxuICAgIEJveFNob3dUeXBlLFxuICAgIEdhbWVfU3RhdGVcblxufTsiXSwic291cmNlUm9vdCI6IiJ9