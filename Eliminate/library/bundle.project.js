require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BoxDrop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '89bc7CJRGxJBZsOHDnUjDFu', 'BoxDrop');
// script\BoxDrop.js

"use strict";

var BoxItem = require("BoxItem");

var BoxState = require("States").BoxState;
var BoxType = require("States").BoxType;
var BoxShowType = require("States").BoxShowType;
var Game_State = require("States").Game_State;

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
            type: BoxItem,
            visible: false
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
                            // console.log("摧毁吹asd");

                            // animation.play("ani_destroy");

                            var panel = cc.find("Game/Panel").getComponent("BoxPanel");
                            if (panel.gamestate === Game_State.Start) {
                                panel.boxDrop_destroy(this);
                            } else {
                                animation.play("ani_destroy");
                            }

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
        // console.log("xiaohui");

        this.state_b = BoxState.ENormal;
        this.showType = BoxShowType.K_Normal;
        this.node.y = -100000;
    },

    reuse: function reuse() {
        // console.log("chongyong");

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
        /*
        只有再play状态下才能点击
        */
        var panel = cc.find("Game/Panel").getComponent("BoxPanel");
        if (panel.gamestate === Game_State.Play && this.boxItem.color_type < BoxType.TypeCount) {

            console.log("点击了   " + "rank=" + this.boxItem.rank + "row=" + this.boxItem.row);

            var eliminate = cc.find("Game/Eliminate").getComponent("Eliminate");
            eliminate.click_item(this);
        }
    },

    box_destroy: function box_destroy() {

        //动画结束之后的回调
        this.node.opacity = 255;

        console.log("摧毁动画完成");

        var panel = cc.find("Game/Panel").getComponent("BoxPanel");

        panel.boxDrop_destroy(this);
    },

    resetOriginPos: function resetOriginPos() {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;

        this.node.color = this.boxItem.color_show;
    },

    boxSpeciallyShow: function boxSpeciallyShow(type) {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.end_y;

        this.boxItem.color_type = type;
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

            if (this.node.y <= this.boxItem.end_y) {

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

var BoxType = require("States").BoxType;

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
        color_type: BoxType.White,

        color_show: {
            get: function get() {
                switch (this.color_type) {
                    case BoxType.White:
                        return cc.Color.WHITE;
                    case BoxType.YELLOW:
                        return cc.Color.YELLOW;
                    case BoxType.Green:
                        return cc.Color.GREEN;
                    case BoxType.Blue:
                        return cc.Color.BLUE;
                    case BoxType.Black:
                        return cc.Color.BLACK;
                    case BoxType.Barrier:
                        return cc.Color.RED;
                    default:
                        return cc.Color.CYAN;
                }
            }
        },

        //行
        rank: 0,
        //列
        row: 0,

        /*固定的行*/
        row_fix: 0,
        /*固定的列*/
        rank_fix: 0,

        id: {
            get: function get() {
                return this.rank.toString() + this.row.toString();
            }
        }
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RF.pop();
},{"States":"States"}],"BoxPanel":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ec9173gyKpBEJYU26Ye1eOe', 'BoxPanel');
// script\BoxPanel.js

"use strict";

var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
var BoxState = require("States").BoxState;
var Game_State = require("States").Game_State;
var BoxType = require("States").BoxType;

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

                    if (this._gameState === Game_State.Start) {
                        //是刚实例游戏完之后
                        //创建障碍物
                        this.createBarrierCanvas();
                    }

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
        this.margin_bottom = -this.super_node.height * 0.5 + this.itemHeight * 0.5;

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

    /*创建障碍物 布局
    * 1.在障碍物下面的物体把他清空
    * 2.这个列的数量没有变还是这些数量
    * */
    createBarrierCanvas: function createBarrierCanvas() {

        // for (let i = 3; i<this.num_rank-3; i++){
        //     let list = this.rankList[i];
        //
        //     let box = list[7];
        //     let box_c = box.getComponent("BoxDrop");
        //     box_c.boxSpeciallyShow(BoxType.Barrier);
        // }

        var barrierList = [{ "row": 7, "rank": 5 }, { "row": 7, "rank": 6 }, { "row": 7, "rank": 7 }, { "row": 7, "rank": 8 }, { "row": 6, "rank": 5 }];

        //设置是 barrier的方块类型
        barrierList.forEach(function (ele) {

            var list = this.rankList[ele.rank];
            var box = list[ele.row];
            var box_c = box.getComponent("BoxDrop");
            box_c.boxSpeciallyShow(BoxType.Barrier);
        }.bind(this));

        /*清空这个barrier下的方块*/
        barrierList.forEach(function (ele) {

            var list = this.rankList[ele.rank];
            for (var num_b = 0; num_b < ele.row; num_b++) {

                //移除这个空位的方块信息
                list[num_b] = undefined;
            }
        }.bind(this));

        // for(let i = 0; i < this.num_rank; i++){
        //
        //     for(let )
        //
        // }
    },

    // /*获取某列下 是Barrier阻塞类型的方块*/
    // getMaxRowBarrierAtRank:function (rank) {
    //
    //     let row_max = -1;
    //
    //     let list = this.rankList[rank];
    //
    //     for(let j = 0; j<this.num_row; j++){
    //
    //         let box = list[j];
    //         let box_c = box.getComponent("BoxDrop");
    //         if(box_c.boxItem.color_type === BoxType.Barrier){
    //             row_max = Math.max(row_max,j);
    //         }
    //     }
    //
    //     return row_max;
    // },

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

            var count = BoxType.TypeCount;
            box_c.boxItem.color_type = cc.random0To1() * count | 0;

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

            // let barrier_row = this.getMaxRowBarrierAtRank(i);
            // console.log("======="+barrier_row);

            // let list = this.rankList[index];

            var end_box_y = this.margin_bottom;

            //更新每个元素的end y 位置
            for (var _i = 0; _i < list_sub.length; _i++) {

                var item_box = list_sub[_i];
                var _box_c = item_box.getComponent("BoxDrop");
                _box_c.boxItem.row = _i;
                _box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight + this.itemSpace) * _i;
            }
        }

        this.updateBeginOriginY();

        if (this.gamestate === Game_State.Start) {
            this.checkPanelEliminatable();
        }
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
                } else {
                    box_c.state_b = BoxState.EFalled;
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
                    /*颜色相同 并且是普通类型的颜色的时候*/
                    if (item_pre.color_type === item_box.color_type && item_pre.color_type < BoxType.TypeCount) {
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
                    if (_item_pre.color_type === _item_box.color_type && _item_pre.color_type < BoxType.TypeCount) {
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

            //不是初始化的 停留一会儿再消除 让用户看到要消除了什么东西
            this.schedule(function () {

                //消除掉
                // wipe_list.forEach(function(elem){
                //
                //     // let box = elem.getComponent("BoxDrop");
                //     // box.state_b = BoxState.EDestroy;
                //     this.boxDrop_destroy(elem.getComponent("BoxDrop"));
                //
                // }.bind(this));

                wipe_list.forEach(function (elem) {

                    var box = elem.getComponent("BoxDrop");
                    box.state_b = BoxState.EDestroy;
                }.bind(this));

                /**
                 * 这边一个延迟
                 如果游戏是 初始化的话不延迟
                 不是初始化 start的 要等销毁动画完成之后再开始掉落
                 */
                this.schedule(function () {

                    //有销毁在掉落
                    if (this.gamestate !== Game_State.Start) {
                        //正在掉落填充
                        this.gamestate = Game_State.Filling;
                    }

                    this.updateAllRankEndY();
                }.bind(this), this.gamestate !== Game_State.Start ? 0.3 : 0, false);
            }.bind(this), showDelayAnimation ? 0.3 : 0, false);

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

/*方块的类型*/
var BoxType = cc.Enum({
    YELLOW: -1,
    Green: -1,
    Blue: -1,
    Black: -1,
    White: -1,

    TypeCount: -1,

    Barrier: -1,

    Count: -1
});

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
    Game_State: Game_State,
    BoxType: BoxType

};

cc._RF.pop();
},{}]},{},["BoxDrop","BoxItem","BoxPanel","Eliminate","JSBCall","States"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvSlNCQ2FsbC5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvU3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUZNOztBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSEk7O0FBT1I7QUFDSTtBQUNBO0FBRk07O0FBS1Y7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJO0FBQ0k7QUFDSTs7QUFFQTs7QUFFSjtBQUNJOztBQUVBOztBQUVKOztBQUdJOztBQUVKOztBQUdJOztBQUVKOztBQUlJOztBQUVKOztBQUVJOztBQTdCUjtBQWlDSDtBQXpDSTs7QUE4Q1Q7QUFDSTtBQUNBO0FBRks7O0FBTVQ7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUk7O0FBRUo7O0FBR0k7O0FBRUo7QUFDSTs7QUFFQTtBQUNKO0FBQ0k7O0FBRUE7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIOztBQUVEOztBQTNCUjtBQStCSDtBQUNKOztBQUVEOztBQWxESTs7QUF6RUE7O0FBa0laO0FBQ0k7QUFESTs7QUFJUjs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDSDs7O0FBR0Q7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDtBQUNJOztBQUVBO0FBQ0E7QUFDSDs7QUFJRDtBQUNBOztBQUVJOzs7QUFHSDs7QUFFRDtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0k7OztBQUdBO0FBQ0E7O0FBR0k7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7O0FBSUQ7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQU1EOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFHRDs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDSDs7QUFHRDtBQUNBOztBQUVJO0FBQ0E7QUFDQTtBQUNBOztBQUVJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEOztBQUVJOzs7QUFHQTs7QUFFQTtBQUNJO0FBQ0g7QUFDSjtBQUVKOztBQUlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFwUkk7Ozs7Ozs7Ozs7QUNMVDs7QUFHQTtBQUNJOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNJO0FBQ0k7QUFBbUI7QUFDbkI7QUFBb0I7QUFDcEI7QUFBbUI7QUFDbkI7QUFBa0I7QUFDbEI7QUFBbUI7QUFDbkI7QUFBcUI7QUFDckI7QUFBUTtBQVBaO0FBU0g7QUFYTTs7QUFjWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNJO0FBQ0k7QUFDSDtBQUhGO0FBcENLOztBQTJDWjtBQUNBOztBQS9DSzs7Ozs7Ozs7OztBQ0pUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGSzs7QUFLVDtBQUNJO0FBQ0E7QUFGSTs7QUFLUjtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0k7QUFDSDtBQUNEOztBQUVJOztBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIO0FBRUo7QUFDSjtBQUNEO0FBekJNOztBQTNCRjs7QUF5RFo7QUFDQTs7QUFFSTs7QUFFSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBOztBQUlBOztBQUVBO0FBQ0E7QUFDSTtBQUNIOztBQUVEOztBQUVBO0FBSUg7O0FBRUQ7Ozs7QUFJQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBRUg7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVJO0FBQ0E7QUFDSDtBQUNKOztBQUlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUdIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUVIOztBQUdEO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7OztBQUdBOztBQUdJOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7Ozs7QUFJQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7QUFHSTtBQUNIO0FBQ0o7QUFDRztBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFBd0Q7OztBQUVwRDtBQUNBOztBQUVBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBSUg7QUFDRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFHRDs7QUFFSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTs7QUFFQTtBQUNBO0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7O0FBRUk7QUFDSTtBQUNIO0FBR0o7QUFFSjtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVJO0FBQ0E7QUFFSDs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBRUg7QUFHSjs7QUFFRDtBQUNIOztBQUVEOztBQUVBO0FBQ0g7O0FBUUQ7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFSTs7QUFFQTs7QUFFQTtBQUNIOztBQU9EO0FBQ0E7O0FBRUk7QUFDSTs7QUFFQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7O0FBRUE7QUFDQTtBQUNIOztBQUVEO0FBQ0g7QUFFSjtBQS9wQkk7Ozs7Ozs7Ozs7QUNQVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBSFE7O0FBTVo7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7O0FBRUk7QUFDQTtBQUVIO0FBQ0c7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFSTs7QUFFQTtBQUNBOztBQUVBO0FBQ0g7QUFFRzs7QUFFQTs7QUFFQTtBQUNIO0FBRUo7QUFDRztBQUNBOztBQUVBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUE1Q1E7O0FBVEo7O0FBMERaO0FBQ0E7O0FBT0E7QUFDQTs7QUFFSTs7QUFFQzs7QUFFQTs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7OztBQUdDO0FBQ0o7O0FBdEZJOzs7Ozs7Ozs7O0FDTlQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUZLOztBQVpEOztBQW9CWjs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUVIO0FBRUo7O0FBRUQ7O0FBRUk7QUFDQTs7QUFFQTtBQUVIOztBQUdEO0FBQ0E7O0FBRUk7O0FBRUg7O0FBcERJOzs7Ozs7Ozs7O0FDRVQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBR0E7QUFab0I7O0FBa0J4QjtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUlKO0FBQ0E7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFLSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBTUo7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7O0FBTGEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBCb3hUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hUeXBlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3BlZWQ6MCxcclxuXHJcbiAgICAgICAgYWNjX3NwZWVkOntcclxuICAgICAgICAgICAgZGVmYXVsdDo5LjgsXHJcbiAgICAgICAgICAgIHRvb2x0b3A6XCLliqDpgJ/luqZcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJveEl0ZW06e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94SXRlbSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgX3Nob3dUeXBlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpCb3hTaG93VHlwZS5LX05vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hTaG93VHlwZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNob3dUeXBlOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hvd1R5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ob3JtYWw6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NlbGVjdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbEFyb3VuZDpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsQ29sb3I6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbFJhbms6XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxSYXc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAgICAgX3N0YXRlX2I6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFN0YXRlLkVOb3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U3RhdGUsXHJcbiAgICAgICAgICAgIC8vIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdGF0ZV9iOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVfYjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zdGF0ZV9iICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlX2IgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVOb3JtYWw6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVGYWxsaW5nOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxlZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2JveFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRGVzdHJveTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5pGn5q+B5ZC5YXNkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2Rlc3Ryb3lcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihwYW5lbC5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lbC5ib3hEcm9wX2Rlc3Ryb3kodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGxheShcImFuaV9kZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdHlwZTpCb3hTdGF0ZSxcclxuXHJcbiAgICAgICAgICAgIC8vIHRvb2x0b3A6XCLmlrnlnZfnmoTnirbmgIFcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzdGF0aWNzOntcclxuICAgICAgICBCb3hTdGF0ZTpCb3hTdGF0ZVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0KCl7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJzZWxcIik7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVudXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ4aWFvaHVpXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IC0xMDAwMDA7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICByZXVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hvbmd5b25nXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLmNsaWNrX2FkZCgpO1xyXG5cclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEJveEl0ZW06ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZighdGhpcy5ib3hJdGVtKXtcclxuICAgICAgICAgICAgdGhpcy5ib3hJdGVtID0gbmV3IEJveEl0ZW0oKTsgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja19hY3Rpb246ZnVuY3Rpb24oKXtcclxuICAgICAgICAvKlxyXG4gICAgICAgIOWPquacieWGjXBsYXnnirbmgIHkuIvmiY3og73ngrnlh7tcclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgIGlmKHBhbmVsLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5ICYmXHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi54K55Ye75LqGICAgXCIrXCJyYW5rPVwiK3RoaXMuYm94SXRlbS5yYW5rK1wicm93PVwiK3RoaXMuYm94SXRlbS5yb3cpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVsaW1pbmF0ZSA9IGNjLmZpbmQoXCJHYW1lL0VsaW1pbmF0ZVwiKS5nZXRDb21wb25lbnQoXCJFbGltaW5hdGVcIik7XHJcbiAgICAgICAgICAgIGVsaW1pbmF0ZS5jbGlja19pdGVtKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBib3hfZGVzdHJveTpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v5Yqo55S757uT5p2f5LmL5ZCO55qE5Zue6LCDXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pGn5q+B5Yqo55S75a6M5oiQXCIpO1xyXG5cclxuICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgcGFuZWwuYm94RHJvcF9kZXN0cm95KHRoaXMpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcmVzZXRPcmlnaW5Qb3M6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBib3hTcGVjaWFsbHlTaG93OmZ1bmN0aW9uICh0eXBlKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICAvL+WmguaenOaYr+ato+WcqOaOieiQveeahCDliLfmlrBlbmR5IOeahOWdkOagh1xyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcgfHxcclxuICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRGVzdHJveSl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzcGVlZF9uID0gdGhpcy5jdXJyZW50U3BlZWQgKyB0aGlzLmFjY19zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIGxldCBzID0gKHNwZWVkX24gKyB0aGlzLmN1cnJlbnRTcGVlZCApKjAuNSAqIGR0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gc3BlZWRfbjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSAtPSBzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnkgPD0gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDmjonokL3liLDmjIflrprkvY3nva7nmoTml7blgJnlvLnliqjkuIDkuItcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMubm9kZS54ID4gdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5ub2RlLnggLT0gdGhpcy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA8IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxufSk7XHJcblxyXG4iLCJcclxuXHJcblxyXG52YXIgQm94VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94VHlwZTtcclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnhcclxuICAgICAgICBiZWdpbl94OjAsXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva55XHJcbiAgICAgICAgYmVnaW5feSA6IDAsXHJcbiAgICAgICAgLy/opoHmirXovr7nmoTkvY3nva5ZXHJcbiAgICAgICAgZW5kX3kgOiAtMTAwMCxcclxuICAgICAgICAvL+aYvuekuueahOminOiJslxyXG4gICAgICAgIGNvbG9yX3R5cGUgOiBCb3hUeXBlLldoaXRlLFxyXG5cclxuICAgICAgICBjb2xvcl9zaG93OntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuV2hpdGU6cmV0dXJuIGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5ZRUxMT1c6cmV0dXJuIGNjLkNvbG9yLllFTExPVztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuR3JlZW46cmV0dXJuIGNjLkNvbG9yLkdSRUVOO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbHVlOnJldHVybiBjYy5Db2xvci5CTFVFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbGFjazpyZXR1cm4gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJhcnJpZXI6cmV0dXJuIGNjLkNvbG9yLlJFRDtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OnJldHVybiBjYy5Db2xvci5DWUFOO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/ooYxcclxuICAgICAgICByYW5rIDogMCxcclxuICAgICAgICAvL+WIl1xyXG4gICAgICAgIHJvdyA6IDAsXHJcblxyXG4gICAgICAgIC8q5Zu65a6a55qE6KGMKi9cclxuICAgICAgICByb3dfZml4IDogMCxcclxuICAgICAgICAvKuWbuuWumueahOWIlyovXHJcbiAgICAgICAgcmFua19maXggOiAwLFxyXG5cclxuXHJcbiAgICAgICAgaWQ6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJhbmsudG9TdHJpbmcoKSArIHRoaXMucm93LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiXHJcblxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG52YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICBib3hfcHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcmFuazp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLliJfmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yb3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi6KGM5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdXBlcl9ub2RlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2dhbWVTdGF0ZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6R2FtZV9TdGF0ZS5TdGFydCxcclxuICAgICAgICAgICAgdHlwZTpHYW1lX1N0YXRlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdhbWVzdGF0ZTp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZVN0YXRlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5piv5Yia5a6e5L6L5ri45oiP5a6M5LmL5ZCOXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yib5bu66Zqc56KN54mpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmFycmllckNhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLlBsYXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlICBpZih2YWx1ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVtb3ZlQnlWYWx1ZSA9IGZ1bmN0aW9uKGFycix2YWwpe1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGk8YXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKGFycltpXSA9PT0gdmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy8gQXJyYXkucHJvdG90eXBlLmZpbHRlclJlcGVhdCA9IGZ1bmN0aW9uKCl7ICBcclxuICAgICAgICAvLyAgICAgLy/nm7TmjqXlrprkuYnnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgLy8gICAgIGlmKGFyci5sZW5ndGggPiAwKXtcclxuICAgICAgICAvLyAgICAgICAgIGFyci5wdXNoKHRoaXNbMF0pO1xyXG4gICAgICAgIC8vICAgICB9XHJcblxyXG4gICAgICAgIC8vICAgICBmb3IodmFyIGkgPSAxOyBpIDwgdGhpcy5sZW5ndGg7IGkrKyl7ICAgIC8v5LuO5pWw57uE56ys5LqM6aG55byA5aeL5b6q546v6YGN5Y6G5q2k5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5a+55YWD57Sg6L+b6KGM5Yik5pat77yaICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5aaC5p6c5pWw57uE5b2T5YmN5YWD57Sg5Zyo5q2k5pWw57uE5Lit56ys5LiA5qyh5Ye6546w55qE5L2N572u5LiN5pivaSAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+mCo+S5iOaIkeS7rOWPr+S7peWIpOaWreesrGnpobnlhYPntKDmmK/ph43lpI3nmoTvvIzlkKbliJnnm7TmjqXlrZjlhaXnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICAgICAgaWYodGhpcy5pbmRleE9mKHRoaXNbaV0pID09IGkpeyAgXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgYXJyLnB1c2godGhpc1tpXSk7ICBcclxuICAgICAgICAvLyAgICAgICAgIH0gIFxyXG4gICAgICAgIC8vICAgICB9ICBcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGFycjsgIFxyXG4gICAgICAgIC8vIH0gIFxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0ID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gMTAwO1xyXG4gICAgICAgIHRoaXMuaXRlbUhlaWdodCA9IDEwMDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtU3BhY2UgPSA1O1xyXG5cclxuICAgICAgICAvL3RoaXMubWFyZ2luX3RvcCA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICAvL3RoaXMubWFyZ2luX2JvdHRvbSA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41IC0gdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW5fdG9wID0gLSh0aGlzLnN1cGVyX25vZGUuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqdGhpcy5udW1fcm93ICsgdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcm93IC0gMSkgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2JvdHRvbSA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX2xlZnQgPSAgLXRoaXMuaXRlbVdpZHRoKnRoaXMubnVtX3JhbmsqMC41ICsgdGhpcy5pdGVtU3BhY2UqKHRoaXMubnVtX3JhbmsqMC41LTEpO1xyXG4gICAgICAgIHRoaXMubWFyZ2luX3JpZ2h0ID0gdGhpcy5pdGVtV2lkdGggKiB0aGlzLm51bV9yYW5rICogMC41IC0gdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcmFuayAqIDAuNSAtIDEpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXNkcyAgXCIgKyB0aGlzLm1hcmdpbl90b3ArXCIgIFwiK3RoaXMubWFyZ2luX2JvdHRvbSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIHRoaXMucmVwbGF5R2FtZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+mHjeaWsOW8gOWni+a4uOaIj1xyXG4gICAgcmVwbGF5R2FtZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuU3RhcnQ7XHJcblxyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuc3VwZXJfbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgd2hpbGUoY2hpbGRyZW4ubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShjaGlsZHJlbltpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/muIXnqbpyYW5rbGlzdFxyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHdoaWxlIChpdGVtID0gdGhpcy5yYW5rTGlzdC5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmuIXnqbrmiJA9PT09PT09PT095YqfPT09PT09XCIpO1xyXG5cclxuICAgICAgICAvL+WIm+W7uuaJgOaciemdouadv+eahOaVsOaNrlxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleDx0aGlzLm51bV9yYW5rOyBpbmRleCsrKXtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSYW5rQ29udGVudChpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVCZWdpbk9yaWdpblkoKTtcclxuXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyrliJvlu7rpmpznoo3niakg5biD5bGAXHJcbiAgICAqIDEu5Zyo6Zqc56KN54mp5LiL6Z2i55qE54mp5L2T5oqK5LuW5riF56m6XHJcbiAgICAqIDIu6L+Z5Liq5YiX55qE5pWw6YeP5rKh5pyJ5Y+Y6L+Y5piv6L+Z5Lqb5pWw6YePXHJcbiAgICAqICovXHJcbiAgICBjcmVhdGVCYXJyaWVyQ2FudmFzOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDM7IGk8dGhpcy5udW1fcmFuay0zOyBpKyspe1xyXG4gICAgICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGV0IGJveCA9IGxpc3RbN107XHJcbiAgICAgICAgLy8gICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIC8vICAgICBib3hfYy5ib3hTcGVjaWFsbHlTaG93KEJveFR5cGUuQmFycmllcik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBsZXQgYmFycmllckxpc3QgPSBbe1wicm93XCI6NyxcInJhbmtcIjo1fSx7XCJyb3dcIjo3LFwicmFua1wiOjZ9LHtcInJvd1wiOjcsXCJyYW5rXCI6N30se1wicm93XCI6NyxcInJhbmtcIjo4fSx7XCJyb3dcIjo2LFwicmFua1wiOjV9XTtcclxuXHJcbiAgICAgICAgLy/orr7nva7mmK8gYmFycmllcueahOaWueWdl+exu+Wei1xyXG4gICAgICAgIGJhcnJpZXJMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtlbGUucmFua107XHJcbiAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2VsZS5yb3ddO1xyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJhcnJpZXIpO1xyXG5cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvKua4heepuui/meS4qmJhcnJpZXLkuIvnmoTmlrnlnZcqL1xyXG4gICAgICAgIGJhcnJpZXJMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtlbGUucmFua107XHJcbiAgICAgICAgICAgIGZvcihsZXQgbnVtX2IgPSAwOyBudW1fYjxlbGUucm93O251bV9iKyspe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v56e76Zmk6L+Z5Liq56m65L2N55qE5pa55Z2X5L+h5oGvXHJcbiAgICAgICAgICAgICAgICBsaXN0W251bV9iXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy8gZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgZm9yKGxldCApXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIC8q6I635Y+W5p+Q5YiX5LiLIOaYr0JhcnJpZXLpmLvloZ7nsbvlnovnmoTmlrnlnZcqL1xyXG4gICAgLy8gZ2V0TWF4Um93QmFycmllckF0UmFuazpmdW5jdGlvbiAocmFuaykge1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgcm93X21heCA9IC0xO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbcmFua107XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAvLyAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgLy8gICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAvLyAgICAgICAgICAgICByb3dfbWF4ID0gTWF0aC5tYXgocm93X21heCxqKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgcmV0dXJuIHJvd19tYXg7XHJcbiAgICAvLyB9LFxyXG5cclxuICAgIC8v5Yib5bu65q+P5LiA5YiX55qE5pWw5o2uXHJcbiAgICBjcmVhdGVSYW5rQ29udGVudDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCByYW5rX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaW5kZXg7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLm51bV9yb3c7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICBib3guYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGJveC53aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG4gICAgICAgICAgICBib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuaW5pdEJveEl0ZW0oKTtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feCA9IG9yaWdpbl94O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSooaSsxKTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb3VudCA9IEJveFR5cGUuVHlwZUNvdW50O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKmNvdW50KSB8IDA7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5yZXNldE9yaWdpblBvcygpO1xyXG5cclxuICAgICAgICAgICAgYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgIHJhbmtfbGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0LnB1c2gocmFua19saXN0KTtcclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+abtOaWsOaJgOacieWIlyBlbmQgeeeahOaVsOaNrlxyXG4gICAgdXBkYXRlQWxsUmFua0VuZFk6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgLy/nnIvor6XliJfnmoTmlbDph4/mmK/lkKYg5bCP5LqOIHRoaXMubnVtX3JvdyAg5bCR5LqO55qE6K+d5YiZ6KGl5YWFXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0X3N1YiA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aGlsZShsaXN0X3N1Yi5sZW5ndGggPCB0aGlzLm51bV9yb3cpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBuZXdfYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICAgICAgbmV3X2JveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IG5ld19ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucmFuayA9IGk7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IDA7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuICAgICAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmV3X2JveC5wYXJlbnQgPSB0aGlzLnN1cGVyX25vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdF9zdWIucHVzaChuZXdfYm94KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvLyBsZXQgYmFycmllcl9yb3cgPSB0aGlzLmdldE1heFJvd0JhcnJpZXJBdFJhbmsoaSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPT09PT09PVwiK2JhcnJpZXJfcm93KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpbmRleF07XHJcblxyXG4gICAgICAgICAgICBsZXQgZW5kX2JveF95ID0gdGhpcy5tYXJnaW5fYm90dG9tO1xyXG5cclxuICAgICAgICAgICAgLy/mm7TmlrDmr4/kuKrlhYPntKDnmoRlbmQgeSDkvY3nva5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8bGlzdF9zdWIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGxpc3Rfc3ViW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gaXRlbV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSppO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrDmr4/kuIDliJfku5bku6zkuK3nmoTmr4/kuKrlhYPntKDnmoTliJ3lp4vnmoRvcmlnaW4geeeahOWAvFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVCZWdpbk9yaWdpblk6ZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5p+Q5LiA5YiX5LitIOS7juacgOWQjuW8gOWni+mBjeWOhui/lOWbnlxyXG4gICAgICAgICAqIOeul+WHuuW8gOWni+aOieS6hueahOS9jee9rlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Yik5pat5piv5ZCmIOW3sui+vuWIsOS7lueahGVuZHkg5aaC5p6c6L+Y5pyq6L6+5Yiw5bCx5pivIOato+imgeaOieiQvVxyXG4gICAgICAgICAgICBsZXQgb2ZmX3RvcCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBzcGFjZV90b3AgPSA1O1xyXG5cclxuICAgICAgICAgICAgLy8gZm9yKGxldCBqID0gdGhpcy5udW1fcm93LTE7IGo+PTA7IGotLSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvL2JveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiAxLuWunuS+i+a4uOaIj+eahOaXtuWAmSDliJ3lp4vlvIDlp4vnmoTkvY3nva5cclxuICAgICAgICAgICAgICAgICAgICAgKiAyLua2iOmZpOeahCDmlrnlnZfkuI3lnKjnlYzpnaLkuK3nmoTorr7nva7ku5bnmoTlvIDlp4vkvY3nva4g5bey5Zyo55WM6Z2i5Lit55qE5LiN5Y676K6+572u5LuWXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB8fCAoYm94X2Mubm9kZS55ID49IGJveF9jLmJveEl0ZW0uYmVnaW5feSkpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgb2ZmX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSBvZmZfdG9wICsgYm94X2Mubm9kZS5oZWlnaHQgKyBzcGFjZV90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZV90b3AgPSBzcGFjZV90b3AgKyAxMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5piv6KaB5o6J6JC955qEXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIC8v5Lqk5o2i5Lik5Liq5pa55Z2X55qE5L2N572uXHJcbiAgICBleGNoYW5nZUJveEl0ZW06ZnVuY3Rpb24oYm94MSxib3gyLHRvQ2hlY2tWaWFibGUgPSB0cnVlKXtcclxuXHJcbiAgICAgICAgbGV0IGJveEl0ZW0xID0gYm94MS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgbGV0IGJveEl0ZW0yID0gYm94Mi5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgIGlmKGJveEl0ZW0xLnJhbmsgPT09IGJveEl0ZW0yLnJhbmspe1xyXG4gICAgICAgICAgICAvL+WQjOS4gOWIl+eahFxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9lbmR5ID0gYm94SXRlbTIuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmVuZF95ID0gYm94SXRlbTEuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLmVuZF95ID0gdGVtcF9lbmR5O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JvdyA9IGJveEl0ZW0yLnJvdztcclxuXHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJvdyA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgYm94SXRlbTEucm93ID0gdGVtcF9yb3c7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdFtib3hJdGVtMS5yb3ddO1xyXG4gICAgICAgICAgICBsaXN0W2JveEl0ZW0xLnJvd10gPSBsaXN0W2JveEl0ZW0yLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTIucm93XSA9IHRlbXBfbm9kZTtcclxuXHJcblxyXG5cclxuICAgICAgICB9ZWxzZSBpZihib3hJdGVtMS5yb3cgPT09IGJveEl0ZW0yLnJvdyl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA6KGM55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0MSA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcbiAgICAgICAgICAgIGxldCBsaXN0MiA9IHRoaXMucmFua0xpc3RbYm94SXRlbTIucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9iZWdpbnggPSBib3hJdGVtMi5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMi5iZWdpbl94ID0gYm94SXRlbTEuYmVnaW5feDtcclxuICAgICAgICAgICAgYm94SXRlbTEuYmVnaW5feCA9IHRlbXBfYmVnaW54O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JhbmsgPSBib3hJdGVtMi5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMi5yYW5rID0gYm94SXRlbTEucmFuaztcclxuICAgICAgICAgICAgYm94SXRlbTEucmFuayA9IHRlbXBfcmFuaztcclxuXHJcbiAgICAgICAgICAgIGxldCByb3dfaW5kZXggPSBib3hJdGVtMS5yb3c7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0MVtyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0MVtyb3dfaW5kZXhdID0gbGlzdDJbcm93X2luZGV4XTtcclxuICAgICAgICAgICAgbGlzdDJbcm93X2luZGV4XSA9IHRlbXBfbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRvQ2hlY2tWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzVmlhYmxlID0gdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICBpZighaXNWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5LiN5Y+v5raI6Zmk55qE6K+dIOS9jee9ruWGjeS6kuaNouWbnuadpVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLkuI3lj6/mtojpmaRcIik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leGNoYW5nZUJveEl0ZW0oYm94Mixib3gxLGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/mo4DmtYvpnaLmnb/miYDmnInmlrnlnZcg5piv5ZCm5Y+v5raI6ZmkXHJcbiAgICBjaGVja1BhbmVsRWxpbWluYXRhYmxlOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCB3aXBlX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgLy/liKTmlq3liJcg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG4gICAgICAgICAgICAgICAgaWYoIXByZV9ib3gpe1xyXG4gICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fcHJlID0gcHJlX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvQWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgLyrpopzoibLnm7jlkIwg5bm25LiU5piv5pmu6YCa57G75Z6L55qE6aKc6Imy55qE5pe25YCZKi9cclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1fcHJlLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3Jvdy0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHdpcGVfbGlzdCx0ZW1wTGlzdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZXBlYXRJdGVtSW5XaXBlKGl0ZW0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHdpcGVfbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZih3aXBlX2xpc3RbaV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkID09PSBpdGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/liKTmlq3ooYwg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yYW5rOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMucmFua0xpc3Rbal1baV07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1fcHJlLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3JhbmstMSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvQWRkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcExpc3QubGVuZ3RoID49IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov73liqDliLB3aXBl6YeM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNSZXBlYXRJdGVtSW5XaXBlKGVsZW0pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lwZV9saXN0LnB1c2goZWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZih3aXBlX2xpc3QubGVuZ3RoID4gMCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd0RlbGF5QW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgLy/kuI3mmL7npLrmtojpmaTliqjnlLtcclxuICAgICAgICAgICAgICAgIHNob3dEZWxheUFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy/kuI3mmK/liJ3lp4vljJbnmoQg5YGc55WZ5LiA5Lya5YS/5YaN5raI6ZmkIOiuqeeUqOaIt+eci+WIsOimgea2iOmZpOS6huS7gOS5iOS4nOilv1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+a2iOmZpOaOiVxyXG4gICAgICAgICAgICAgICAgLy8gd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIGxldCBib3ggPSBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gYm94LnN0YXRlX2IgPSBCb3hTdGF0ZS5FRGVzdHJveTtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmJveERyb3BfZGVzdHJveShlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3ggPSBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LnN0YXRlX2IgPSBCb3hTdGF0ZS5FRGVzdHJveTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog6L+Z6L655LiA5Liq5bu26L+fXHJcbiAgICAgICAgICAgICAgICAg5aaC5p6c5ri45oiP5pivIOWIneWni+WMlueahOivneS4jeW7tui/n1xyXG4gICAgICAgICAgICAgICAgIOS4jeaYr+WIneWni+WMliBzdGFydOeahCDopoHnrYnplIDmr4HliqjnlLvlrozmiJDkuYvlkI7lho3lvIDlp4vmjonokL1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5pyJ6ZSA5q+B5Zyo5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgIT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+ato+WcqOaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuRmlsbGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsUmFua0VuZFkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksKHRoaXMuZ2FtZXN0YXRlICE9PSBHYW1lX1N0YXRlLlN0YXJ0KT8wLjM6MCxmYWxzZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLHNob3dEZWxheUFuaW1hdGlvbj8wLjM6MCxmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIGJveERyb3BfZ2V0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCBib3ggPSBudWxsO1xyXG4gICAgICAgIGlmKHRoaXMuYm94UG9vbC5zaXplKCkgPiAwKXtcclxuICAgICAgICAgICAgYm94ID0gdGhpcy5ib3hQb29sLmdldCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBib3ggPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJveF9wcmVmYWIpO1xyXG4gICAgICAgICAgICBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5pbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfSxcclxuXHJcbiAgICBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuXHJcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveC5ib3hJdGVtLnJhbmtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxpc3QucmVtb3ZlQnlWYWx1ZShsaXN0LGJveC5ub2RlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hQb29sLnB1dChib3gubm9kZSk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nKXtcclxuICAgICAgICAgICAgLy8gY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUoY2FsbGJhY2ssIHRoaXMsIGludGVydmFsLCAhdGhpcy5faXNSdW5uaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmlsbEludGVydmFsID09PSAxMCl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT095a6a5pe25byA5aeL5Yik5pat5piv5ZCm6YO95bey5o6J6JC95Yiw5bqV6YOo5LqGIGJlZ2luID09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3mo4DmtYvmmK/lkKblvIDmtojpmaQgZW5kID09PT09PT09PVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuUGxheTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCArPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG59KTtcclxuXHJcblxyXG4iLCJcclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuLy8gdmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEJveFNob3dUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTaG93VHlwZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX3NlbGVjdF9ib3g6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+mAieS4reafkOS4quaWueWdl1xyXG4gICAgICAgIHNlbGVjdF9ib3g6IHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0X2JveDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RfYm94KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19TZWxlY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fbmV3ID0gdmFsdWUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hJdGVtX29sZCA9IHRoaXMuX3NlbGVjdF9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChib3hJdGVtX25ldy5pZCAhPT0gYm94SXRlbV9vbGQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLnnIvmmK/lkKbopoHkuqTkupLkvY3nva4g6L+Y5piv6K+05YiH5o2i5Yiw6L+Z5Liq6YCJ5Lit55qE5L2N572u5aSE55CGXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkMSA9IFwiICsgYm94SXRlbV9uZXcuaWQgKyBcIiAgaWQyPSBcIiArIGJveEl0ZW1fb2xkLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/ml6fnmoTlj5bmtojpgInmi6lcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveC5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChib3hJdGVtX25ldy5yYW5rID09PSBib3hJdGVtX29sZC5yYW5rICYmIE1hdGguYWJzKGJveEl0ZW1fbmV3LnJvdyAtIGJveEl0ZW1fb2xkLnJvdykgPT09IDEpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYm94SXRlbV9uZXcucm93ID09PSBib3hJdGVtX29sZC5yb3cgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucmFuayAtIGJveEl0ZW1fb2xkLnJhbmspID09PSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmmK/nm7jov5HnmoQg5Lqk5o2i5L2N572uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94UGFuZWwuZXhjaGFuZ2VCb3hJdGVtKHZhbHVlLCB0aGlzLl9zZWxlY3RfYm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5LiN5piv55u46L+R55qEIOWPlua2iOS4iuS4gOS4qumAieaLqSDpgInkuK3mlrDngrnlh7vnmoRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLpgInkuK3kuoblkIzkuIDkuKog5Y+W5raI6YCJ5oupXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/ngrnlh7vkuoYg5p+Q5Liq6YCJ6aG5XHJcbiAgICBjbGlja19pdGVtOmZ1bmN0aW9uKGNsaWNrX25vZGUpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coaXRlbSk7XHJcblxyXG4gICAgICAgICBsZXQgYm94UGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hJdGVtID0gY2xpY2tfbm9kZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgIC8vICAvL+a2iOmZpOaOiVxyXG4gICAgICAgIC8vICBib3hQYW5lbC5ib3hEcm9wX2Rlc3Ryb3koY2xpY2tfbm9kZSk7XHJcblxyXG4gICAgICAgIC8vICAvL+S4iumdoueahOaOieS4i+adpVxyXG4gICAgICAgIC8vICBib3hQYW5lbC51cGRhdGVSYW5rRW5kWShib3hJdGVtLnJhbmspO1xyXG5cclxuXHJcbiAgICAgICAgIHRoaXMuc2VsZWN0X2JveCA9IGNsaWNrX25vZGU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcblxyXG4gICAgICAgIGxhYl9zaG93OntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBvY0NhbGxKczpmdW5jdGlvbiAoc3RyKSB7XHJcblxyXG4gICAgICAgIHRoaXMubGFiX3Nob3cubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmxhYl9zaG93LnN0cmluZyA9IHN0cjtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sYWJfc2hvdy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB9LDUpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAganNDYWxsT2M6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvL+exu+WQjSDmlrnms5UgIOWPguaVsDEg5Y+C5pWwMiDlj4LmlbAzXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJKU0JNYW5hZ2VyXCIsXCJ5aEpTQkNhbGw6XCIsXCJqc+i/mei+ueS8oOWFpeeahOWPguaVsFwiKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJqc19jYWxsX29jID09PT09PT09PSAlQFwiLHJlc3VsdCk7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5vY0NhbGxKcyhcIua1i+ivlSDmmL7npLrpmpDol49cIik7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiXHJcblxyXG4vKuaWueWdl+eahOexu+WeiyovXHJcbmNvbnN0IEJveFR5cGUgPSBjYy5FbnVtKHtcclxuICAgIFlFTExPVyA6IC0xLFxyXG4gICAgR3JlZW4gOiAtMSxcclxuICAgIEJsdWUgOiAtMSxcclxuICAgIEJsYWNrIDogLTEsXHJcbiAgICBXaGl0ZSA6IC0xLFxyXG5cclxuICAgIFR5cGVDb3VudCA6IC0xLFxyXG5cclxuICAgIEJhcnJpZXIgOiAtMSxcclxuXHJcblxyXG4gICAgQ291bnQgOiAtMVxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbi8v5pa55Z2X5o6J6JC955qE54q25oCBXHJcbmNvbnN0IEJveFN0YXRlID0gY2MuRW51bSh7XHJcblxyXG4gICAgLy8gRU5vbmUgOiAtMSwgICAgICAvL+S7gOS5iOmDveS4jeaYr1xyXG5cclxuICAgIEVOb3JtYWwgOiAtMSwgICAgLy/mraPluLhcclxuICAgIEVGYWxsaW5nIDogLTEsICAgLy/mjonokL1cclxuICAgIEVGYWxsZWQgOiAtMSwgICAgLy/mjonokL3nu5PmnZ9cclxuICAgIEVEZXN0cm95IDogLTEsICAgLy/plIDmr4FcclxuXHJcbn0pO1xyXG5cclxuLy/mlrnlnZfmmL7npLrnmoTnirbmgIFcclxuY29uc3QgQm94U2hvd1R5cGUgPSBjYy5FbnVtKHtcclxuXHJcbiAgICBLX05vcm1hbCA6IC0xLCAgICAgICAgICAvL+ato+W4uFxyXG4gICAgS19TZWxlY3QgOiAtMSwgICAgICAgICAgLy/pgInkuK1cclxuXHJcbiAgICBLX1NraWxsQXJvdW5kIDogLTEsICAgICAgIC8v6ZSA5q+BIOWRqOi+ueeahOS5neS4qlxyXG4gICAgS19Ta2lsbFJhbmsgOiAtMSwgICAgICAgICAvL+mUgOavgSDor6XliJdcclxuICAgIEtfU2tpbGxSYXcgOiAtMSwgICAgICAgICAgLy/plIDmr4Eg6K+l6KGMXHJcbiAgICBLX1NraWxsQ29sb3IgOiAtMSwgICAgICAgIC8v6ZSA5q+BIOivpeiJslxyXG59KTtcclxuXHJcblxyXG5cclxuLy/muLjmiI/ov5vooYznmoTnirbmgIFcclxudmFyIEdhbWVfU3RhdGUgPSBjYy5FbnVtKHtcclxuICAgIFN0YXJ0IDogLTEsICAgICAvL+W8gOWni+WunuS+i1xyXG4gICAgRmlsbGluZzogLTEsICAgIC8v5pa55Z2X6KGl6b2Q5LitXHJcbiAgICBQbGF5IDogLTEsICAgICAgLy/ov5vooYzkuK1cclxuICAgIE92ZXIgOiAtMSwgICAgICAvL+e7k+adn1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgIEJveFN0YXRlLFxyXG4gICAgQm94U2hvd1R5cGUsXHJcbiAgICBHYW1lX1N0YXRlLFxyXG4gICAgQm94VHlwZVxyXG5cclxufTsiXSwic291cmNlUm9vdCI6IiJ9