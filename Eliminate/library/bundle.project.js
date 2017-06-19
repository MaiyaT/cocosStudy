require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BoxDrop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '89bc7CJRGxJBZsOHDnUjDFu', 'BoxDrop');
// script\BoxDrop.js

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
                            animation.play("box_destroy");

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
// script\BoxItem.js

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
// script\BoxPanel.js

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

        console.log("清空成==========功======");

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

            // if(showDelayAnimation) {
            //     this.schedule(function () {
            //         //状态设置成是摧毁
            //         wipe_list.forEach(function (elem) {
            //
            //             let box = elem.getComponent("BoxDrop");
            //             box.state_b = BoxState.EDestroy;
            //
            //         }.bind(this));
            //     }, 0.3, 1);
            // }


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

                console.log("======定时开始判断是否都已掉落到底部了 begin =====");

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

                console.log("=========检测是否开消除 end =========");

                this.gamestate = Game_State.Play;
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
// script\Eliminate.js

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
// script\JSBCall.js

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
// script\State\States.js

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvSlNCQ2FsbC5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvU3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBRkk7O0FBT1I7QUFDSTtBQUNBO0FBRk07O0FBS1Y7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJO0FBQ0k7QUFDSTs7QUFFQTs7QUFFSjtBQUNJOztBQUVBOztBQUVKOztBQUdJOztBQUVKOztBQUdJOztBQUVKOztBQUlJOztBQUVKOztBQUVJOztBQTdCUjtBQWlDSDtBQXpDSTs7QUE4Q1Q7QUFDSTtBQUNBO0FBRks7O0FBTVQ7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUk7O0FBRUo7O0FBR0k7O0FBRUo7QUFDSTs7QUFFQTs7QUFFSjtBQUNJO0FBQ0E7QUFDQTs7QUFFQTs7QUFwQlI7QUF3Qkg7QUFDSjs7QUFFRDs7QUEzQ0k7O0FBekVBOztBQTJIWjtBQUNJO0FBREk7O0FBSVI7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7OztBQUdEO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBRUg7O0FBRUQ7QUFDSTs7QUFFQTtBQUNBO0FBQ0g7O0FBSUQ7QUFDQTs7QUFFSTs7O0FBR0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDs7QUFFSTs7QUFFQTtBQUNBO0FBQ0g7O0FBSUQ7O0FBRUk7QUFDQTs7QUFFQTtBQUNIOztBQU1EOztBQUVJO0FBQ0E7O0FBR0E7QUFFSDs7QUFHRDtBQUNBOztBQUVJO0FBQ0E7QUFDQTtBQUNBOztBQUVJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEOztBQUVJOzs7O0FBSUE7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7QUFFSjs7QUFNRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBNVBJOzs7Ozs7Ozs7O0FDSFQ7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5vQjs7QUFleEI7QUFDSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSTtBQUNJO0FBQXFCO0FBQ3JCO0FBQXNCO0FBQ3RCO0FBQXFCO0FBQ3JCO0FBQW9CO0FBQ3BCO0FBQXFCO0FBQ3JCO0FBQVE7QUFOWjtBQVFIO0FBVk07O0FBYVg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNJO0FBQ0g7QUFIRjtBQTdCSzs7QUFvQ1o7QUFDQTs7QUF4Q0s7O0FBbURUO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZLOztBQUtUO0FBQ0k7QUFDQTtBQUZJOztBQUtSO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7O0FBRUk7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUVKO0FBQ0o7QUFDRDtBQWpCTTs7QUEzQkY7O0FBaURaO0FBQ0E7O0FBRUk7O0FBRUk7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFJQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQUdEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7QUFHSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFFSDs7QUFLRDs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7O0FBRUE7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7O0FBRUQ7OztBQUdBOztBQUdJOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7Ozs7QUFJQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7QUFHSTtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0o7O0FBR0Q7QUFDQTtBQUF3RDs7O0FBRXBEO0FBQ0E7O0FBRUE7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFJSDtBQUNHO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUdEOztBQUVJOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUFDSjtBQUNKO0FBQ0o7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7O0FBRUk7QUFDSTtBQUNIO0FBR0o7QUFFSjtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBS0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFJQTtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBRUg7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQVFEOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSDs7QUFPRDtBQUNBOztBQUVJO0FBQ0k7O0FBRUE7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKOztBQUdEOztBQUVBO0FBQ0E7QUFDSDs7QUFFRDtBQUNIO0FBRUo7QUE1bUJJOzs7Ozs7Ozs7O0FDUFQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFDQTtBQUhROztBQU1aO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJOztBQUVJO0FBQ0E7QUFFSDtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUk7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7O0FBRUE7O0FBRUE7QUFDSDtBQUVKO0FBQ0c7QUFDQTs7QUFFQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBNUNROztBQVRKOztBQTBEWjtBQUNBOztBQU9BO0FBQ0E7O0FBRUk7O0FBRUM7O0FBRUE7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQztBQUNKOztBQXRGSTs7Ozs7Ozs7OztBQ05UO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFGSzs7QUFaRDs7QUFvQlo7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFHRDtBQUNBOztBQUVJOztBQUVIOztBQXBESTs7Ozs7Ozs7OztBQ0NUO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBSUo7QUFDQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUtKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFNSjs7QUFFSTtBQUNBO0FBQ0E7O0FBSmEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBCb3hTaG93VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U2hvd1R5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNwZWVkOjAsXHJcblxyXG4gICAgICAgIGFjY19zcGVlZDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6OS44LFxyXG4gICAgICAgICAgICB0b29sdG9wOlwi5Yqg6YCf5bqmXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBib3hJdGVtOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOkJveEl0ZW0sXHJcbiAgICAgICAgICAgIC8vdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgX3Nob3dUeXBlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpCb3hTaG93VHlwZS5LX05vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hTaG93VHlwZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNob3dUeXBlOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hvd1R5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ob3JtYWw6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NlbGVjdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbEFyb3VuZDpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsQ29sb3I6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbFJhbms6XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxSYXc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAgICAgX3N0YXRlX2I6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFN0YXRlLkVOb3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U3RhdGUsXHJcbiAgICAgICAgICAgIC8vIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdGF0ZV9iOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVfYjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zdGF0ZV9iICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlX2IgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVOb3JtYWw6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVGYWxsaW5nOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxlZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2JveFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRURlc3Ryb3k6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuaRp+avgeWQuWFzZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubm9kZS5jb2xvciA9IGNjLmNvbG9yKDI1NSwyNTUsMjU1LDI1NSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGxheShcImJveF9kZXN0cm95XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdHlwZTpCb3hTdGF0ZSxcclxuXHJcbiAgICAgICAgICAgIC8vIHRvb2x0b3A6XCLmlrnlnZfnmoTnirbmgIFcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzdGF0aWNzOntcclxuICAgICAgICBCb3hTdGF0ZTpCb3hTdGF0ZVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0KCl7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJzZWxcIik7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVudXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ4aWFvaHVpXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IC0xMDAwMDA7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICByZXVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2hvbmd5b25nXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLmNsaWNrX2FkZCgpO1xyXG5cclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEJveEl0ZW06ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZighdGhpcy5ib3hJdGVtKXtcclxuICAgICAgICAgICAgdGhpcy5ib3hJdGVtID0gbmV3IEJveEl0ZW0oKTsgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja19hY3Rpb246ZnVuY3Rpb24oKXtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhcIueCueWHu+S6hiAgIFwiK1wicmFuaz1cIit0aGlzLmJveEl0ZW0ucmFuaytcInJvdz1cIit0aGlzLmJveEl0ZW0ucm93KTtcclxuXHJcbiAgICAgICAgbGV0IGVsaW1pbmF0ZSA9IGNjLmZpbmQoXCJHYW1lL0VsaW1pbmF0ZVwiKS5nZXRDb21wb25lbnQoXCJFbGltaW5hdGVcIik7XHJcbiAgICAgICAgZWxpbWluYXRlLmNsaWNrX2l0ZW0odGhpcyk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgZGVzdHJveUZpbmlzaDpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v5Yqo55S757uT5p2f5LmL5ZCO55qE5Zue6LCDXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pGn5q+B5Yqo55S75a6M5oiQXCIpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcmVzZXRPcmlnaW5Qb3M6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLmNvbG9yID0gdGhpcy5ib3hJdGVtLmNvbG9yX3Nob3c7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgICAgIC8v5aaC5p6c5piv5q2j5Zyo5o6J6JC955qEIOWIt+aWsGVuZHkg55qE5Z2Q5qCHXHJcbiAgICAgICAgLy8gaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyB8fFxyXG4gICAgICAgIC8vICAgICB0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVEZXN0cm95KXtcclxuICAgICAgICBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tID0gdGhpcy5ub2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0ICogMC41O1xyXG5cclxuICAgICAgICAgICAgaWYgKGJveF9ib3R0b20gPiB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuICAgICAgICAgICAgICAgIC8v5Yqg6YCf5bqm5o6J6JC9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNwZWVkX24gPSB0aGlzLmN1cnJlbnRTcGVlZCArIHRoaXMuYWNjX3NwZWVkKmR0O1xyXG4gICAgICAgICAgICAgICAgbGV0IHMgPSAoc3BlZWRfbiArIHRoaXMuY3VycmVudFNwZWVkICkqMC41ICogZHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSBzcGVlZF9uO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUueSA8IHRoaXMuYm94SXRlbS5lbmRfeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog5o6J6JC95Yiw5oyH5a6a5L2N572u55qE5pe25YCZ5by55Yqo5LiA5LiLXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA+IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54IC09IHRoaXMuc3BlZWQgKiBkdDtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBpZiAodGhpcy5ub2RlLnggPCB0aGlzLmJveEl0ZW0uYmVnaW5feCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuIiwiXHJcblxyXG5cclxudmFyIENvbG9yX0JveCA9IGNjLkVudW0oe1xyXG5cclxuICAgIFlFTExPVyA6IC0xLFxyXG4gICAgR3JlZW4gOiAtMSxcclxuICAgIEJsdWUgOiAtMSxcclxuICAgIEJsYWNrIDogLTEsXHJcbiAgICBXaGl0ZSA6IC0xLFxyXG4gICAgLy8gV2hpdGUgOiAtMSxcclxuXHJcblxyXG4gICAgLy8gQ291bnQ6LTEsXHJcbn0pO1xyXG5cclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnhcclxuICAgICAgICBiZWdpbl94OjAsXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva55XHJcbiAgICAgICAgYmVnaW5feSA6IDAsXHJcbiAgICAgICAgLy/opoHmirXovr7nmoTkvY3nva5ZXHJcbiAgICAgICAgZW5kX3kgOiAtMTAwMCxcclxuICAgICAgICAvL+aYvuekuueahOminOiJslxyXG4gICAgICAgIGNvbG9yX3R5cGUgOiBDb2xvcl9Cb3guV2hpdGUsXHJcblxyXG4gICAgICAgIGNvbG9yX3Nob3c6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCh0aGlzLmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LldoaXRlOnJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5ZRUxMT1c6cmV0dXJuIGNjLkNvbG9yLllFTExPVztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5HcmVlbjpyZXR1cm4gY2MuQ29sb3IuR1JFRU47XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guQmx1ZTpyZXR1cm4gY2MuQ29sb3IuQkxVRTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5CbGFjazpyZXR1cm4gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpyZXR1cm4gY2MuQ29sb3IuUkVEO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/ooYxcclxuICAgICAgICByYW5rIDogMCxcclxuICAgICAgICAvL+WIl1xyXG4gICAgICAgIHJvdyA6IDAsXHJcblxyXG4gICAgICAgIGlkOntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yYW5rLnRvU3RyaW5nKCkgKyB0aGlzLnJvdy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcblxyXG5cclxuLy8gbW9kdWxlLmV4cG9ydHMgPSB7XHJcbi8vICAgICBDb2xvcl9Cb3ggOiBDb2xvcl9Cb3hcclxuLy8gfTsiLCJcclxuXHJcbnZhciBCb3hEcm9wID0gcmVxdWlyZShcIkJveERyb3BcIik7XHJcbnZhciBCb3hJdGVtID0gcmVxdWlyZShcIkJveEl0ZW1cIik7XHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBHYW1lX1N0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5HYW1lX1N0YXRlO1xyXG5cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgICAgIGJveF9wcmVmYWI6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yYW5rOntcclxuICAgICAgICAgICAgZGVmYXVsdDoxMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuWIl+aVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jvdzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLooYzmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN1cGVyX25vZGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfZ2FtZVN0YXRlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpHYW1lX1N0YXRlLlN0YXJ0LFxyXG4gICAgICAgICAgICB0eXBlOkdhbWVfU3RhdGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2FtZXN0YXRlOntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nYW1lU3RhdGU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgIT09IHZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lU3RhdGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lvIDlp4vmjonokL1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVCZWdpbk9yaWdpblkoKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSAgaWYodmFsdWUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0eXBlOkdhbWVfU3RhdGVcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlbW92ZUJ5VmFsdWUgPSBmdW5jdGlvbihhcnIsdmFsKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpPGFyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0gPT09IHZhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQXJyYXkucHJvdG90eXBlLmZpbHRlclJlcGVhdCA9IGZ1bmN0aW9uKCl7ICBcclxuICAgICAgICAvLyAgICAgLy/nm7TmjqXlrprkuYnnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgLy8gICAgIGlmKGFyci5sZW5ndGggPiAwKXtcclxuICAgICAgICAvLyAgICAgICAgIGFyci5wdXNoKHRoaXNbMF0pO1xyXG4gICAgICAgIC8vICAgICB9XHJcblxyXG4gICAgICAgIC8vICAgICBmb3IodmFyIGkgPSAxOyBpIDwgdGhpcy5sZW5ndGg7IGkrKyl7ICAgIC8v5LuO5pWw57uE56ys5LqM6aG55byA5aeL5b6q546v6YGN5Y6G5q2k5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5a+55YWD57Sg6L+b6KGM5Yik5pat77yaICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5aaC5p6c5pWw57uE5b2T5YmN5YWD57Sg5Zyo5q2k5pWw57uE5Lit56ys5LiA5qyh5Ye6546w55qE5L2N572u5LiN5pivaSAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+mCo+S5iOaIkeS7rOWPr+S7peWIpOaWreesrGnpobnlhYPntKDmmK/ph43lpI3nmoTvvIzlkKbliJnnm7TmjqXlrZjlhaXnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICAgICAgaWYodGhpcy5pbmRleE9mKHRoaXNbaV0pID09IGkpeyAgXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgYXJyLnB1c2godGhpc1tpXSk7ICBcclxuICAgICAgICAvLyAgICAgICAgIH0gIFxyXG4gICAgICAgIC8vICAgICB9ICBcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGFycjsgIFxyXG4gICAgICAgIC8vIH0gIFxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0ID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gMTAwO1xyXG4gICAgICAgIHRoaXMuaXRlbUhlaWdodCA9IDEwMDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtU3BhY2UgPSA1O1xyXG5cclxuICAgICAgICAvL3RoaXMubWFyZ2luX3RvcCA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICAvL3RoaXMubWFyZ2luX2JvdHRvbSA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41IC0gdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW5fdG9wID0gLSh0aGlzLnN1cGVyX25vZGUuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqdGhpcy5udW1fcm93ICsgdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcm93IC0gMSkgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2JvdHRvbSA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41IC0gdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW5fbGVmdCA9ICAtdGhpcy5pdGVtV2lkdGgqdGhpcy5udW1fcmFuayowLjUgKyB0aGlzLml0ZW1TcGFjZSoodGhpcy5udW1fcmFuayowLjUtMSk7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5fcmlnaHQgPSB0aGlzLml0ZW1XaWR0aCAqIHRoaXMubnVtX3JhbmsgKiAwLjUgLSB0aGlzLml0ZW1TcGFjZSAqICh0aGlzLm51bV9yYW5rICogMC41IC0gMSk7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJhc2RzICBcIiArIHRoaXMubWFyZ2luX3RvcCtcIiAgXCIrdGhpcy5tYXJnaW5fYm90dG9tKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hQb29sID0gbmV3IGNjLk5vZGVQb29sKFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXBsYXlHYW1lKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v6YeN5paw5byA5aeL5ri45oiPXHJcbiAgICByZXBsYXlHYW1lOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5TdGFydDtcclxuXHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5zdXBlcl9ub2RlLmNoaWxkcmVuO1xyXG5cclxuICAgICAgICB3aGlsZShjaGlsZHJlbi5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm94RHJvcF9kZXN0cm95KGNoaWxkcmVuW2ldLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+a4heepunJhbmtsaXN0XHJcbiAgICAgICAgdmFyIGl0ZW07XHJcbiAgICAgICAgd2hpbGUgKGl0ZW0gPSB0aGlzLnJhbmtMaXN0LnNoaWZ0KCkpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIua4heepuuaIkD09PT09PT09PT3lip89PT09PT1cIik7XHJcblxyXG4gICAgICAgIC8v5Yib5bu65omA5pyJ6Z2i5p2/55qE5pWw5o2uXHJcbiAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGluZGV4PHRoaXMubnVtX3Jhbms7IGluZGV4Kyspe1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJhbmtDb250ZW50KGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/liJvlu7rmr4/kuIDliJfnmoTmlbDmja5cclxuICAgIGNyZWF0ZVJhbmtDb250ZW50OmZ1bmN0aW9uKGluZGV4KXtcclxuXHJcbiAgICAgICAgbGV0IHJhbmtfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuICAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubnVtX3JvdzsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgIGJveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIGJveC5oZWlnaHQgPSB0aGlzLml0ZW1IZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgcmFua19saXN0LnB1c2goYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QucHVzaChyYW5rX2xpc3QpO1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5omA5pyJ5YiXIGVuZCB555qE5pWw5o2uXHJcbiAgICB1cGRhdGVBbGxSYW5rRW5kWTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAvL+eci+ivpeWIl+eahOaVsOmHj+aYr+WQpiDlsI/kuo4gdGhpcy5udW1fcm93ICDlsJHkuo7nmoTor53liJnooaXlhYVcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxpc3Rfc3ViID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlKGxpc3Rfc3ViLmxlbmd0aCA8IHRoaXMubnVtX3Jvdyl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICBuZXdfYm94LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feCA9IG9yaWdpbl94O1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gMDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9IChjYy5yYW5kb20wVG8xKCkqNSkgfCAwO1xyXG4gICAgICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdfYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0X3N1Yi5wdXNoKG5ld19ib3gpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIC8v5pu05paw5q+P5Liq5YWD57Sg55qEZW5kIHkg5L2N572uXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPGxpc3Rfc3ViLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBsaXN0X3N1YltpXTtcclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGl0ZW1fYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBlbHNlIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgIC8vICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZShjYWxsYmFjaywgdGhpcywgaW50ZXJ2YWwsICF0aGlzLl9pc1J1bm5pbmcpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLmNhbGxCYWNrRmlsbGluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT3lrprml7blmajliLfkuoY9PT09PVwiKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8c2VsZi5udW1fcmFuazsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgbGV0IGxpc3QgPSBzZWxmLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3mo4DmtYvmmK/lkKblvIDmtojpmaQ9PT09PT09PT1cIik7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgICAgIHNlbGYudW5zY2hlZHVsZShzZWxmLmNhbGxCYWNrRmlsbGluZyk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgICAgIHNlbGYuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAvL+WIpOaWreS7luaYr+WQpuaJgOacieaWueWdl+W3suaOieiQveWIsOaMh+WumuS9jee9rlxyXG4gICAgICAgIC8vICAgICAvL+i/mei+ueWmguaenGJpbmQgdGhpc+eahOivnSDlrprml7blmajlgZzkuI3kuIvmnaVcclxuICAgICAgICAvLyAgICAgdGhpcy5zY2hlZHVsZSh0aGlzLmNhbGxCYWNrRmlsbGluZywwLjIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw5q+P5LiA5YiX5LuW5Lus5Lit55qE5q+P5Liq5YWD57Sg55qE5Yid5aeL55qEb3JpZ2luIHnnmoTlgLxcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQmVnaW5PcmlnaW5ZOmZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOafkOS4gOWIl+S4rSDku47mnIDlkI7lvIDlp4vpgY3ljobov5Tlm55cclxuICAgICAgICAgKiDnrpflh7rlvIDlp4vmjonkuobnmoTkvY3nva5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpiDlt7Lovr7liLDku5bnmoRlbmR5IOWmguaenOi/mOacqui+vuWIsOWwseaYryDmraPopoHmjonokL1cclxuICAgICAgICAgICAgbGV0IG9mZl90b3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VfdG9wID0gNTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvcihsZXQgaiA9IHRoaXMubnVtX3Jvdy0xOyBqPj0wOyBqLS0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9ib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYm94X2Mubm9kZS55ICE9PSBib3hfYy5ib3hJdGVtLmVuZF95KXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogMS7lrp7kvovmuLjmiI/nmoTml7blgJkg5Yid5aeL5byA5aeL55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAgICAgICogMi7mtojpmaTnmoQg5pa55Z2X5LiN5Zyo55WM6Z2i5Lit55qE6K6+572u5LuW55qE5byA5aeL5L2N572uIOW3suWcqOeVjOmdouS4reeahOS4jeWOu+iuvue9ruS7llxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcCArIG9mZl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wID0gb2ZmX3RvcCArIGJveF9jLm5vZGUuaGVpZ2h0ICsgc3BhY2VfdG9wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2VfdG9wID0gc3BhY2VfdG9wICsgMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+aYr+imgeaOieiQveeahFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlBsYXkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIFxyXG4gICAgLy/kuqTmjaLkuKTkuKrmlrnlnZfnmoTkvY3nva5cclxuICAgIGV4Y2hhbmdlQm94SXRlbTpmdW5jdGlvbihib3gxLGJveDIsdG9DaGVja1ZpYWJsZSA9IHRydWUpe1xyXG5cclxuICAgICAgICBsZXQgYm94SXRlbTEgPSBib3gxLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICBsZXQgYm94SXRlbTIgPSBib3gyLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgaWYoYm94SXRlbTEucmFuayA9PT0gYm94SXRlbTIucmFuayl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA5YiX55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2VuZHkgPSBib3hJdGVtMi5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTIuZW5kX3kgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTEuZW5kX3kgPSB0ZW1wX2VuZHk7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcm93ID0gYm94SXRlbTIucm93O1xyXG5cclxuICAgICAgICAgICAgYm94SXRlbTIucm93ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yb3cgPSB0ZW1wX3JvdzsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0W2JveEl0ZW0xLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTEucm93XSA9IGxpc3RbYm94SXRlbTIucm93XTtcclxuICAgICAgICAgICAgbGlzdFtib3hJdGVtMi5yb3ddID0gdGVtcF9ub2RlO1xyXG5cclxuXHJcblxyXG4gICAgICAgIH1lbHNlIGlmKGJveEl0ZW0xLnJvdyA9PT0gYm94SXRlbTIucm93KXtcclxuICAgICAgICAgICAgLy/lkIzkuIDooYznmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QxID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QyID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMi5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2JlZ2lueCA9IGJveEl0ZW0yLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmJlZ2luX3ggPSBib3hJdGVtMS5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5iZWdpbl94ID0gdGVtcF9iZWdpbng7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcmFuayA9IGJveEl0ZW0yLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJhbmsgPSBib3hJdGVtMS5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yYW5rID0gdGVtcF9yYW5rO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd19pbmRleCA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgbGV0IHRlbXBfbm9kZSA9IGxpc3QxW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QxW3Jvd19pbmRleF0gPSBsaXN0Mltyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0Mltyb3dfaW5kZXhdID0gdGVtcF9ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodG9DaGVja1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXNWaWFibGUgPSB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFpc1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/kuI3lj6/mtojpmaTnmoTor50g5L2N572u5YaN5LqS5o2i5Zue5p2lXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4jeWPr+a2iOmZpFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4Y2hhbmdlQm94SXRlbShib3gyLGJveDEsZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+ajgOa1i+mdouadv+aJgOacieaWueWdlyDmmK/lkKblj6/mtojpmaRcclxuICAgIGNoZWNrUGFuZWxFbGltaW5hdGFibGU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IHdpcGVfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAvL+WIpOaWreWIlyDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZW1wTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcHJlX2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcm93LTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkod2lwZV9saXN0LHRlbXBMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc1JlcGVhdEl0ZW1JbldpcGUoaXRlbSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8d2lwZV9saXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHdpcGVfbGlzdFtpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uaWQgPT09IGl0ZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+WIpOaWreihjCDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3Jhbms7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5yYW5rTGlzdFtqXVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGogPT09ICh0aGlzLm51bV9yYW5rLTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzUmVwZWF0SXRlbUluV2lwZShlbGVtKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5wdXNoKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYod2lwZV9saXN0Lmxlbmd0aCA+IDApe1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dEZWxheUFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIC8v5LiN5pi+56S65raI6Zmk5Yqo55S7XHJcbiAgICAgICAgICAgICAgICBzaG93RGVsYXlBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLy8jd2FyblxyXG4gICAgICAgICAgICAvL+i/meS4gOWdlyDpgLvovpEg5pyJ6Zeu6aKYXHJcblxyXG4gICAgICAgICAgICAvLyBpZihzaG93RGVsYXlBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIC8v54q25oCB6K6+572u5oiQ5piv5pGn5q+BXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgYm94LnN0YXRlX2IgPSBCb3hTdGF0ZS5FRGVzdHJveTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAvLyAgICAgfSwgMC4zLCAxKTtcclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAvL+S4jeaYr+WIneWni+WMlueahCDlgZznlZnkuIDkvJrlhL/lho3mtojpmaRcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/mtojpmaTmjolcclxuICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/mnInplIDmr4HlnKjmjonokL1cclxuICAgICAgICAgICAgICAgIGlmKHNob3dEZWxheUFuaW1hdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/mraPlnKjmjonokL3loavlhYVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuRmlsbGluZztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFsbFJhbmtFbmRZKCk7XHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksc2hvd0RlbGF5QW5pbWF0aW9uPzAuNjowLGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlBsYXk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgYm94RHJvcF9nZXQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IGJveCA9IG51bGw7XHJcbiAgICAgICAgaWYodGhpcy5ib3hQb29sLnNpemUoKSA+IDApe1xyXG4gICAgICAgICAgICBib3ggPSB0aGlzLmJveFBvb2wuZ2V0KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGJveCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm94X3ByZWZhYik7XHJcbiAgICAgICAgICAgIGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICB9LFxyXG5cclxuICAgIGJveERyb3BfZGVzdHJveTpmdW5jdGlvbihib3gpe1xyXG5cclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wucHV0KGJveC5ub2RlKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZShjYWxsYmFjaywgdGhpcywgaW50ZXJ2YWwsICF0aGlzLl9pc1J1bm5pbmcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5maWxsSW50ZXJ2YWwgPT09IDEwKXtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT3lrprml7blvIDlp4vliKTmlq3mmK/lkKbpg73lt7LmjonokL3liLDlupXpg6jkuoYgYmVnaW4gPT09PT1cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8c2VsZi5udW1fcmFuazsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpc3QgPSBzZWxmLnJhbmtMaXN0W2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGYubnVtX3JvdzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94X2NfaSA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihib3hfY19pLnN0YXRlX2IgIT09IEJveFN0YXRlLkVGYWxsZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PeajgOa1i+aYr+WQpuW8gOa2iOmZpCBlbmQgPT09PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG4vLyB2YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBfc2VsZWN0X2JveDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6YCJ5Lit5p+Q5Liq5pa55Z2XXHJcbiAgICAgICAgc2VsZWN0X2JveDoge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RfYm94O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdF9ib3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9uZXcgPSB2YWx1ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fb2xkID0gdGhpcy5fc2VsZWN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJveEl0ZW1fbmV3LmlkICE9PSBib3hJdGVtX29sZC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIueci+aYr+WQpuimgeS6pOS6kuS9jee9riDov5jmmK/or7TliIfmjaLliLDov5nkuKrpgInkuK3nmoTkvY3nva7lpITnkIZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQxID0gXCIgKyBib3hJdGVtX25ldy5pZCArIFwiICBpZDI9IFwiICsgYm94SXRlbV9vbGQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aXp+eahOWPlua2iOmAieaLqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94LnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0odmFsdWUsIHRoaXMuX3NlbGVjdF9ib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLkuI3mmK/nm7jov5HnmoQg5Y+W5raI5LiK5LiA5Liq6YCJ5oupIOmAieS4reaWsOeCueWHu+eahFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumAieS4reS6huWQjOS4gOS4qiDlj5bmtojpgInmi6lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgbGV0IGJveEl0ZW0gPSBjbGlja19ub2RlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgLy8gIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLmJveERyb3BfZGVzdHJveShjbGlja19ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gIC8v5LiK6Z2i55qE5o6J5LiL5p2lXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLnVwZGF0ZVJhbmtFbmRZKGJveEl0ZW0ucmFuayk7XHJcblxyXG5cclxuICAgICAgICAgdGhpcy5zZWxlY3RfYm94ID0gY2xpY2tfbm9kZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuXHJcbiAgICAgICAgbGFiX3Nob3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9jQ2FsbEpzOmZ1bmN0aW9uIChzdHIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJfc2hvdy5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMubGFiX3Nob3cuc3RyaW5nID0gc3RyO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxhYl9zaG93Lm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH0sNSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBqc0NhbGxPYzpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v57G75ZCNIOaWueazlSAg5Y+C5pWwMSDlj4LmlbAyIOWPguaVsDNcclxuICAgICAgICB2YXIgcmVzdWx0ID0ganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIkpTQk1hbmFnZXJcIixcInloSlNCQ2FsbDpcIixcImpz6L+Z6L655Lyg5YWl55qE5Y+C5pWwXCIpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImpzX2NhbGxfb2MgPT09PT09PT09ICVAXCIscmVzdWx0KTtcclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLm9jQ2FsbEpzKFwi5rWL6K+VIOaYvuekuumakOiXj1wiKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJcclxuLy/mlrnlnZfmjonokL3nmoTnirbmgIFcclxuY29uc3QgQm94U3RhdGUgPSBjYy5FbnVtKHtcclxuXHJcbiAgICAvLyBFTm9uZSA6IC0xLCAgICAgIC8v5LuA5LmI6YO95LiN5pivXHJcblxyXG4gICAgRU5vcm1hbCA6IC0xLCAgICAvL+ato+W4uFxyXG4gICAgRUZhbGxpbmcgOiAtMSwgICAvL+aOieiQvVxyXG4gICAgRUZhbGxlZCA6IC0xLCAgICAvL+aOieiQvee7k+adn1xyXG4gICAgRURlc3Ryb3kgOiAtMSwgICAvL+mUgOavgVxyXG5cclxufSk7XHJcblxyXG4vL+aWueWdl+aYvuekuueahOeKtuaAgVxyXG5jb25zdCBCb3hTaG93VHlwZSA9IGNjLkVudW0oe1xyXG5cclxuICAgIEtfTm9ybWFsIDogLTEsICAgICAgICAgIC8v5q2j5bi4XHJcbiAgICBLX1NlbGVjdCA6IC0xLCAgICAgICAgICAvL+mAieS4rVxyXG5cclxuICAgIEtfU2tpbGxBcm91bmQgOiAtMSwgICAgICAgLy/plIDmr4Eg5ZGo6L6555qE5Lmd5LiqXHJcbiAgICBLX1NraWxsUmFuayA6IC0xLCAgICAgICAgIC8v6ZSA5q+BIOivpeWIl1xyXG4gICAgS19Ta2lsbFJhdyA6IC0xLCAgICAgICAgICAvL+mUgOavgSDor6XooYxcclxuICAgIEtfU2tpbGxDb2xvciA6IC0xLCAgICAgICAgLy/plIDmr4Eg6K+l6ImyXHJcbn0pO1xyXG5cclxuXHJcblxyXG4vL+a4uOaIj+i/m+ihjOeahOeKtuaAgVxyXG52YXIgR2FtZV9TdGF0ZSA9IGNjLkVudW0oe1xyXG4gICAgU3RhcnQgOiAtMSwgICAgIC8v5byA5aeL5a6e5L6LXHJcbiAgICBGaWxsaW5nOiAtMSwgICAgLy/mlrnlnZfooaXpvZDkuK1cclxuICAgIFBsYXkgOiAtMSwgICAgICAvL+i/m+ihjOS4rVxyXG4gICAgT3ZlciA6IC0xLCAgICAgIC8v57uT5p2fXHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgQm94U3RhdGUsXHJcbiAgICBCb3hTaG93VHlwZSxcclxuICAgIEdhbWVfU3RhdGVcclxuXHJcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==