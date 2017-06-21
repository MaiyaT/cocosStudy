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
        this.speed_x = 10;
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

        this.node.opacity = 255;
    },

    boxSpeciallyShow: function boxSpeciallyShow(type) {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.end_y;

        this.boxItem.color_type = type;
        this.node.color = this.boxItem.color_show;

        if (type === BoxType.Blank) {
            this.node.opacity = 10;
        }
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

            if (this.boxItem.ani_point.length > 0) {
                // console.log("需要做偏移操作 判断");
                // let point_a = this.boxItem.ani_point

                //判断这个位置的y 需要在的x的位置
                // let points = this.boxItem.ani_point.filter(function(elem){
                //     return this.node.y < elem.y;
                // }.bind(this));

                var last_point = this.boxItem.ani_point[0];

                if (last_point !== undefined && this.node.x !== last_point.x && this.node.y < last_point.y) {

                    if (last_point.isleft) {
                        //左边的递减
                        this.node.x = this.node.x - this.speed_x;
                        if (this.node.x < last_point.x) {
                            this.node.x = last_point.x;
                            this.boxItem.ani_point.shift(); //删除第一个元素
                            console.log("=======移除");
                        }
                    } else {
                        //右边的递增
                        this.node.x = this.node.x + this.speed_x;
                        if (this.node.x > last_point.x) {
                            this.node.x = last_point.x;
                            this.boxItem.ani_point.shift(); //删除第一个元素
                            console.log("=======移除");
                        }
                    }
                }

                // console.log("====" + last_point);
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
                    case BoxType.Blank:
                        return cc.Color.WHITE;
                    default:
                        return cc.Color.CYAN;
                }
            }
        },

        //行
        rank: 0,
        //列
        row: 0,

        /*移动y的位置 符合条件的要更新 x的坐标
        * 里面是 {x:0,y:3,isleft:true} 字典类型
        * */
        ani_point: [],

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

                    var tempBefore = this._gameState;

                    this._gameState = value;

                    if (value === Game_State.Play) {
                        //开始掉落
                        this.updateBeginOriginY();
                    } else if (value === Game_State.Filling) {
                        this.fillInterval = 0;
                    }

                    if (tempBefore === Game_State.Start) {
                        //是刚实例游戏完之后
                        //创建障碍物
                        this.createBarrierCanvas();
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

        /*障碍物的方块列表*/
        this.listBarrier = [];

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

        this.updateBeginOriginY();

        this.checkPanelEliminatable();
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
            if (box !== undefined) {
                var box_c = box.getComponent("BoxDrop");
                this.listBarrier.push(box);
                box_c.boxSpeciallyShow(BoxType.Barrier);
            }
        }.bind(this));

        /*设置这个barrier下的方块*/
        barrierList.forEach(function (ele) {

            var list = this.rankList[ele.rank];
            for (var num_b = 0; num_b < ele.row; num_b++) {

                //这个位置设置成空白占位信息
                var box = list[num_b];
                if (box !== undefined) {
                    var box_c = box.getComponent("BoxDrop");
                    if (box_c.boxItem.color_type < BoxType.TypeCount) {
                        box_c.boxSpeciallyShow(BoxType.Blank);
                    }
                }
            }
        }.bind(this));

        this.beginBlankFill();
    },

    /*开始空位填充*/
    beginBlankFill: function beginBlankFill() {

        /*看是否需要创建 方块 去填充占位方块*/

        if (this.listBarrier.length === 0) {
            //没有障碍物
            return;
        }

        //给这个障碍物下面补充方块
        for (var i = 0; i < this.listBarrier.length; i++) {

            var box = this.listBarrier[i];

            this.blankCheckReplaceAvailable(box);
        }
    },

    /*检测是否可以替换
    * box_c 这个要操作的方块类型  是 障碍物、方块
    * */
    blankCheckReplaceAvailable: function blankCheckReplaceAvailable(box) {

        var box_c = box.getComponent("BoxDrop");

        if (box_c.boxItem.color_type === BoxType.Barrier) {
            //是障碍物

            //这个障碍物的边界两边 物体是 边界 、障碍物、方块
            var box_left = this.rankList[box_c.boxItem.rank - 1][box_c.boxItem.row];
            var box_Right = this.rankList[box_c.boxItem.rank + 1][box_c.boxItem.row];
            var box_bottom = this.rankList[box_c.boxItem.rank][box_c.boxItem.row - 1];

            if (box_bottom.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //这个底部是空的 可以填充方块

                if (box_left.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount) {
                    //左边位置掉落填充
                    console.log("左边位置掉落填充");
                    this.blankReplaceBox(box_bottom, box_left);
                    return true;
                } else if (box_Right.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount) {
                    //右边位置掉落填充
                    console.log("右边位置掉落填充");
                }
            }
        } else if (box_c.boxItem.color_type < BoxType.TypeCount) {
            //是方块

            //这个方块的 左下方 右下方 正下方 判断是否是空位
            var box_bottom_left = this.rankList[box_c.boxItem.rank - 1][box_c.boxItem.row - 1];
            var box_bottom_Right = this.rankList[box_c.boxItem.rank + 1][box_c.boxItem.row - 1];
            var box_bottom_zheng = this.rankList[box_c.boxItem.rank][box_c.boxItem.row - 1];
            if (box_bottom_zheng !== undefined && box_bottom_zheng.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //正下方是空的 往正下方 替换
                console.log("正下方是空的 往正下方 替换");
                this.blankReplaceBox(box_bottom_zheng, box);
                return true;
            } else if (box_bottom_left !== undefined && box_bottom_left.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //左下方是空的 往左下方 替换
                console.log("左下方");
            } else if (box_bottom_Right !== undefined && box_bottom_Right.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //右下方是空的 往右下方 替换
                console.log("右下方");
            }
        }

        return false;
    },

    /*替换方块 并执行替换切换的动画效果*/
    blankReplaceBox: function blankReplaceBox(boxBlank, boxReplace) {

        var box_re = boxReplace.getComponent("BoxDrop");
        var box_bl = boxBlank.getComponent("BoxDrop");

        var repeatList = box_re.boxItem.ani_point.filter(function (elem) {
            return elem.x === box_bl.boxItem.begin_x;
        });

        if (repeatList.length === 0) {
            var isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
            box_re.boxItem.ani_point.push({ "x": box_bl.boxItem.begin_x, "y": box_bl.boxItem.end_y, "isleft": isleft });
        }
        box_re.boxItem.end_y = box_bl.boxItem.end_y;

        var temp_rank = box_re.boxItem.rank;

        box_re.boxItem.row = box_bl.boxItem.row;
        box_re.boxItem.rank = box_bl.boxItem.rank;

        //占位的方块 位置替换成要移入的方块  移除这个占位方块
        this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxReplace;

        //这个方块继续往下替换
        if (!this.blankCheckReplaceAvailable(box_re)) {
            console.log("移动完成 替换=======");

            this.boxPool.put(box_bl.node);
        }

        //后面遍历的时候把他移除掉
        //this.rankList[temp_rank].removeByValue(this.rankList[temp_rank],boxReplace);


        // boxDrop_destroy:function(box){
        //
        //     let list = this.rankList[box.boxItem.rank];
        //
        //     list.removeByValue(list,box.node);
        //
        //     this.boxPool.put(box.node);
        // },
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

        if (this.gamestate === Game_State.Filling || this.gamestate === Game_State.Start) {

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

                console.log("=========都到 掉落到底部了 检测是否可消除 end =========");

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

    Barrier: -1, //障碍物
    Blank: -1, //空白占位

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
    Filling: -1, //方块补齐中 掉落中
    // BlankFilling : -1, //空位补充 自动掉落
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvSlNCQ2FsbC5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvU3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUZNOztBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSEk7O0FBT1I7QUFDSTtBQUNBO0FBRk07O0FBS1Y7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJO0FBQ0k7QUFDSTs7QUFFQTs7QUFFSjtBQUNJOztBQUVBOztBQUVKOztBQUdJOztBQUVKOztBQUdJOztBQUVKOztBQUlJOztBQUVKOztBQUVJOztBQTdCUjtBQWlDSDtBQXpDSTs7QUE4Q1Q7QUFDSTtBQUNBO0FBRks7O0FBTVQ7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUk7O0FBRUo7O0FBR0k7O0FBRUo7QUFDSTs7QUFFQTtBQUNKO0FBQ0k7O0FBRUE7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIOztBQUVEOztBQTNCUjtBQStCSDtBQUNKOztBQUVEOztBQWxESTs7QUF6RUE7O0FBa0laO0FBQ0k7QUFESTs7QUFJUjs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDSDs7O0FBR0Q7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDtBQUNJOztBQUVBO0FBQ0E7QUFDSDs7QUFJRDtBQUNBOztBQUVJO0FBQ0E7QUFFSDs7QUFFRDtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0k7OztBQUdBO0FBQ0E7O0FBR0k7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7O0FBSUQ7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQU1EOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDs7QUFHRDs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7O0FBR0Q7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTs7QUFFSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDs7QUFFSTs7O0FBR0E7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7O0FBR0Q7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUlJO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNIO0FBQ0o7O0FBSUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQTlUSTs7Ozs7Ozs7OztBQ0xUOztBQUdBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0k7QUFDSTtBQUFtQjtBQUNuQjtBQUFvQjtBQUNwQjtBQUFtQjtBQUNuQjtBQUFrQjtBQUNsQjtBQUFtQjtBQUNuQjtBQUFxQjtBQUNyQjtBQUFvQjtBQUNwQjtBQUFRO0FBUlo7QUFVSDtBQVpNOztBQWVYO0FBQ0E7QUFDQTtBQUNBOztBQUdBOzs7QUFHQTs7QUFHQTtBQUNJO0FBQ0k7QUFDSDtBQUhGO0FBdENLOztBQTZDWjtBQUNBOztBQWpESzs7Ozs7Ozs7OztBQ0pUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGSzs7QUFLVDtBQUNJO0FBQ0E7QUFGSTs7QUFLUjtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0k7QUFDSDtBQUNEOztBQUVJOztBQUVJOztBQUVBOztBQUVBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSDs7QUFHRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBRUo7QUFDSjtBQUNEO0FBNUJNOztBQTNCRjs7QUE0RFo7QUFDQTs7QUFFSTs7QUFFSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7O0FBSUE7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUE7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFSjs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBR0Q7QUFDSDs7QUFHRDtBQUNBOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDSDtBQUNKOztBQUdEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNHOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSDs7QUFJRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUE7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7O0FBRUE7O0FBRUE7QUFDQTs7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTs7QUFFQTtBQUNIOztBQUlEO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDs7QUFJRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBR0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBRUg7O0FBR0Q7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7OztBQUdBOztBQUdJOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7Ozs7QUFJQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7QUFHSTtBQUNIO0FBQ0o7QUFDRztBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFBd0Q7OztBQUVwRDtBQUNBOztBQUVBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBSUg7QUFDRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFHRDs7QUFFSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTs7QUFFQTtBQUNBO0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7O0FBRUk7QUFDSTtBQUNIO0FBR0o7QUFFSjtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVJO0FBQ0E7QUFFSDs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBRUg7QUFHSjs7QUFFRDtBQUNIOztBQUVEOztBQUVBO0FBQ0g7O0FBUUQ7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFSTs7QUFFQTs7QUFFQTtBQUNIOztBQU9EO0FBQ0E7O0FBRUk7O0FBR0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKOztBQUdEOztBQUVBO0FBQ0E7QUFDSDs7QUFFRDtBQUNIO0FBRUo7QUFqeEJJOzs7Ozs7Ozs7O0FDUFQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFDQTtBQUhROztBQU1aO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJOztBQUVJO0FBQ0E7QUFFSDtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUk7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7O0FBRUE7O0FBRUE7QUFDSDtBQUVKO0FBQ0c7QUFDQTs7QUFFQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBNUNROztBQVRKOztBQTBEWjtBQUNBOztBQU9BO0FBQ0E7O0FBRUk7O0FBRUM7O0FBRUE7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQztBQUNKOztBQXRGSTs7Ozs7Ozs7OztBQ05UO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFGSzs7QUFaRDs7QUFvQlo7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFHRDtBQUNBOztBQUVJOztBQUVIOztBQXBESTs7Ozs7Ozs7OztBQ0VUO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFab0I7O0FBa0J4QjtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUlKO0FBQ0E7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFLSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFNSjs7QUFFSTtBQUNBO0FBQ0E7QUFDQTs7QUFMYSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG5cclxudmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcbnZhciBCb3hTaG93VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U2hvd1R5cGU7XHJcbnZhciBHYW1lX1N0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5HYW1lX1N0YXRlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBzcGVlZDowLFxyXG5cclxuICAgICAgICBhY2Nfc3BlZWQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjkuOCxcclxuICAgICAgICAgICAgdG9vbHRvcDpcIuWKoOmAn+W6plwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYm94SXRlbTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hJdGVtLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICBfc2hvd1R5cGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFNob3dUeXBlLktfTm9ybWFsLFxyXG4gICAgICAgICAgICB0eXBlOkJveFNob3dUeXBlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2hvd1R5cGU6e1xyXG5cclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaG93VHlwZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX05vcm1hbDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsQXJvdW5kOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxDb2xvcjpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsUmFuazpcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbFJhdzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG5cclxuICAgICAgICBfc3RhdGVfYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6Qm94U3RhdGUuRU5vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hTdGF0ZSxcclxuICAgICAgICAgICAgLy8gdmlzaWJsZTpmYWxzZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN0YXRlX2I6e1xyXG5cclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZV9iO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3N0YXRlX2IgIT09IHZhbHVlKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGVfYiA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IHRoaXMuc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRU5vcm1hbDpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxpbmc6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRmFsbGVkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoXCJhbmlfYm94XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVEZXN0cm95OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmkafmr4HlkLlhc2RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5pbWF0aW9uLnBsYXkoXCJhbmlfZGVzdHJveVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhbmVsLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbmVsLmJveERyb3BfZGVzdHJveSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2Rlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG5cclxuICAgICAgICAgICAgLy8gdG9vbHRvcDpcIuaWueWdl+eahOeKtuaAgVwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXRpY3M6e1xyXG4gICAgICAgIEJveFN0YXRlOkJveFN0YXRlXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQoKXtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RfaXRlbSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcInNlbFwiKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgdW51c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInhpYW9odWlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gLTEwMDAwMDtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJldXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjaG9uZ3lvbmdcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuY2xpY2tfYWRkKCk7XHJcbiAgICAgICAgdGhpcy5zcGVlZF94ID0gMTA7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRCb3hJdGVtOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuYm94SXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbSA9IG5ldyBCb3hJdGVtKCk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tfYWN0aW9uOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLypcclxuICAgICAgICDlj6rmnInlho1wbGF554q25oCB5LiL5omN6IO954K55Ye7XHJcbiAgICAgICAgKi9cclxuICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuICAgICAgICBpZihwYW5lbC5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSAmJlxyXG4gICAgICAgICAgICB0aGlzLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KSB7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueCueWHu+S6hiAgIFwiK1wicmFuaz1cIit0aGlzLmJveEl0ZW0ucmFuaytcInJvdz1cIit0aGlzLmJveEl0ZW0ucm93KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlbGltaW5hdGUgPSBjYy5maW5kKFwiR2FtZS9FbGltaW5hdGVcIikuZ2V0Q29tcG9uZW50KFwiRWxpbWluYXRlXCIpO1xyXG4gICAgICAgICAgICBlbGltaW5hdGUuY2xpY2tfaXRlbSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgYm94X2Rlc3Ryb3k6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvL+WKqOeUu+e7k+adn+S5i+WQjueahOWbnuiwg1xyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIuaRp+avgeWKqOeUu+WujOaIkFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcblxyXG4gICAgICAgIHBhbmVsLmJveERyb3BfZGVzdHJveSh0aGlzKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIHJlc2V0T3JpZ2luUG9zOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLmNvbG9yID0gdGhpcy5ib3hJdGVtLmNvbG9yX3Nob3c7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgYm94U3BlY2lhbGx5U2hvdzpmdW5jdGlvbiAodHlwZSkge1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmVuZF95O1xyXG5cclxuICAgICAgICB0aGlzLmJveEl0ZW0uY29sb3JfdHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5ub2RlLmNvbG9yID0gdGhpcy5ib3hJdGVtLmNvbG9yX3Nob3c7XHJcblxyXG4gICAgICAgIGlmKHR5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDEwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICAvL+WmguaenOaYr+ato+WcqOaOieiQveeahCDliLfmlrBlbmR5IOeahOWdkOagh1xyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcgfHxcclxuICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRGVzdHJveSl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzcGVlZF9uID0gdGhpcy5jdXJyZW50U3BlZWQgKyB0aGlzLmFjY19zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIGxldCBzID0gKHNwZWVkX24gKyB0aGlzLmN1cnJlbnRTcGVlZCApKjAuNSAqIGR0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gc3BlZWRfbjtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSAtPSBzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnkgPD0gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDmjonokL3liLDmjIflrprkvY3nva7nmoTml7blgJnlvLnliqjkuIDkuItcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuYm94SXRlbS5hbmlfcG9pbnQubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumcgOimgeWBmuWBj+enu+aTjeS9nCDliKTmlq1cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBsZXQgcG9pbnRfYSA9IHRoaXMuYm94SXRlbS5hbmlfcG9pbnRcclxuXHJcbiAgICAgICAgICAgICAgICAvL+WIpOaWrei/meS4quS9jee9rueahHkg6ZyA6KaB5Zyo55qEeOeahOS9jee9rlxyXG4gICAgICAgICAgICAgICAgLy8gbGV0IHBvaW50cyA9IHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybiB0aGlzLm5vZGUueSA8IGVsZW0ueTtcclxuICAgICAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxhc3RfcG9pbnQgPSB0aGlzLmJveEl0ZW0uYW5pX3BvaW50WzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGxhc3RfcG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ICE9PSBsYXN0X3BvaW50LnggJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA8IGxhc3RfcG9pbnQueSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGxhc3RfcG9pbnQuaXNsZWZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lt6bovrnnmoTpgJLlh49cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLm5vZGUueCAtIHRoaXMuc3BlZWRfeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ub2RlLnggPCBsYXN0X3BvaW50Lngpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSBsYXN0X3BvaW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJveEl0ZW0uYW5pX3BvaW50LnNoaWZ0KCk7Ly/liKDpmaTnrKzkuIDkuKrlhYPntKBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09Peenu+mZpFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj7PovrnnmoTpgJLlop5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLm5vZGUueCArIHRoaXMuc3BlZWRfeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ub2RlLnggPiBsYXN0X3BvaW50Lngpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSBsYXN0X3BvaW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJveEl0ZW0uYW5pX3BvaW50LnNoaWZ0KCk7Ly/liKDpmaTnrKzkuIDkuKrlhYPntKBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09Peenu+mZpFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj09PT1cIiArIGxhc3RfcG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA+IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54IC09IHRoaXMuc3BlZWQgKiBkdDtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBpZiAodGhpcy5ub2RlLnggPCB0aGlzLmJveEl0ZW0uYmVnaW5feCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuIiwiXHJcblxyXG5cclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcblxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva54XHJcbiAgICAgICAgYmVnaW5feDowLFxyXG4gICAgICAgIC8v5byA5aeL5o6J6JC955qE5L2N572ueVxyXG4gICAgICAgIGJlZ2luX3kgOiAwLFxyXG4gICAgICAgIC8v6KaB5oq16L6+55qE5L2N572uWVxyXG4gICAgICAgIGVuZF95IDogLTEwMDAsXHJcbiAgICAgICAgLy/mmL7npLrnmoTpopzoibJcclxuICAgICAgICBjb2xvcl90eXBlIDogQm94VHlwZS5XaGl0ZSxcclxuXHJcbiAgICAgICAgY29sb3Jfc2hvdzp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMuY29sb3JfdHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLldoaXRlOnJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuWUVMTE9XOnJldHVybiBjYy5Db2xvci5ZRUxMT1c7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkdyZWVuOnJldHVybiBjYy5Db2xvci5HUkVFTjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmx1ZTpyZXR1cm4gY2MuQ29sb3IuQkxVRTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmxhY2s6cmV0dXJuIGNjLkNvbG9yLkJMQUNLO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CYXJyaWVyOnJldHVybiBjYy5Db2xvci5SRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJsYW5rOiByZXR1cm4gY2MuQ29sb3IuV0hJVEU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpyZXR1cm4gY2MuQ29sb3IuQ1lBTjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6KGMXHJcbiAgICAgICAgcmFuayA6IDAsXHJcbiAgICAgICAgLy/liJdcclxuICAgICAgICByb3cgOiAwLFxyXG5cclxuXHJcbiAgICAgICAgLyrnp7vliqh555qE5L2N572uIOespuWQiOadoeS7tueahOimgeabtOaWsCB455qE5Z2Q5qCHXHJcbiAgICAgICAgKiDph4zpnaLmmK8ge3g6MCx5OjMsaXNsZWZ0OnRydWV9IOWtl+WFuOexu+Wei1xyXG4gICAgICAgICogKi9cclxuICAgICAgICBhbmlfcG9pbnQgOiBbXSxcclxuXHJcblxyXG4gICAgICAgIGlkOntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yYW5rLnRvU3RyaW5nKCkgKyB0aGlzLnJvdy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxyXG5cclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxudmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEdhbWVfU3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkdhbWVfU3RhdGU7XHJcbnZhciBCb3hUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgYm94X3ByZWZhYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jhbms6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi5YiX5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcm93OntcclxuICAgICAgICAgICAgZGVmYXVsdDoxMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuihjOaVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3VwZXJfbm9kZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9nYW1lU3RhdGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkdhbWVfU3RhdGUuU3RhcnQsXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnYW1lc3RhdGU6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVTdGF0ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSAhPT0gdmFsdWUpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEJlZm9yZSA9IHRoaXMuX2dhbWVTdGF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLlBsYXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlICBpZih2YWx1ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBCZWZvcmUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aYr+WImuWunuS+i+a4uOaIj+WujOS5i+WQjlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WIm+W7uumanOeijeeJqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJhcnJpZXJDYW52YXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0eXBlOkdhbWVfU3RhdGVcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlbW92ZUJ5VmFsdWUgPSBmdW5jdGlvbihhcnIsdmFsKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpPGFyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0gPT09IHZhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIC8vIEFycmF5LnByb3RvdHlwZS5maWx0ZXJSZXBlYXQgPSBmdW5jdGlvbigpeyAgXHJcbiAgICAgICAgLy8gICAgIC8v55u05o6l5a6a5LmJ57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIC8vICAgICBpZihhcnIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgLy8gICAgICAgICBhcnIucHVzaCh0aGlzWzBdKTtcclxuICAgICAgICAvLyAgICAgfVxyXG5cclxuICAgICAgICAvLyAgICAgZm9yKHZhciBpID0gMTsgaSA8IHRoaXMubGVuZ3RoOyBpKyspeyAgICAvL+S7juaVsOe7hOesrOS6jOmhueW8gOWni+W+queOr+mBjeWOhuatpOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WvueWFg+e0oOi/m+ihjOWIpOaWre+8miAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WmguaenOaVsOe7hOW9k+WJjeWFg+e0oOWcqOatpOaVsOe7hOS4reesrOS4gOasoeWHuueOsOeahOS9jee9ruS4jeaYr2kgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/pgqPkuYjmiJHku6zlj6/ku6XliKTmlq3nrKxp6aG55YWD57Sg5piv6YeN5aSN55qE77yM5ZCm5YiZ55u05o6l5a2Y5YWl57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIGlmKHRoaXMuaW5kZXhPZih0aGlzW2ldKSA9PSBpKXsgIFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGFyci5wdXNoKHRoaXNbaV0pOyAgXHJcbiAgICAgICAgLy8gICAgICAgICB9ICBcclxuICAgICAgICAvLyAgICAgfSAgXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBhcnI7ICBcclxuICAgICAgICAvLyB9ICBcclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1XaWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSAxMDA7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVNwYWNlID0gNTtcclxuXHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl90b3AgPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSArIHRoaXMuaXRlbUhlaWdodCp0aGlzLm51bV9yb3cgKyB0aGlzLml0ZW1TcGFjZSAqICh0aGlzLm51bV9yb3cgLSAxKSArIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl9ib3R0b20gPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSAtIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX3RvcCA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9ib3R0b20gPSAtKHRoaXMuc3VwZXJfbm9kZS5oZWlnaHQpKjAuNSArICB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG5cclxuICAgICAgICB0aGlzLm1hcmdpbl9sZWZ0ID0gIC10aGlzLml0ZW1XaWR0aCp0aGlzLm51bV9yYW5rKjAuNSArIHRoaXMuaXRlbVNwYWNlKih0aGlzLm51bV9yYW5rKjAuNS0xKTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9yaWdodCA9IHRoaXMuaXRlbVdpZHRoICogdGhpcy5udW1fcmFuayAqIDAuNSAtIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JhbmsgKiAwLjUgLSAxKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFzZHMgIFwiICsgdGhpcy5tYXJnaW5fdG9wK1wiICBcIit0aGlzLm1hcmdpbl9ib3R0b20pO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wgPSBuZXcgY2MuTm9kZVBvb2woXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAvKumanOeijeeJqeeahOaWueWdl+WIl+ihqCovXHJcbiAgICAgICAgdGhpcy5saXN0QmFycmllciA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnJlcGxheUdhbWUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/ph43mlrDlvIDlp4vmuLjmiI9cclxuICAgIHJlcGxheUdhbWU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlN0YXJ0O1xyXG5cclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnN1cGVyX25vZGUuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIHdoaWxlKGNoaWxkcmVuLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3hEcm9wX2Rlc3Ryb3koY2hpbGRyZW5baV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5riF56m6cmFua2xpc3RcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICB3aGlsZSAoaXRlbSA9IHRoaXMucmFua0xpc3Quc2hpZnQoKSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5riF56m65oiQPT09PT09PT09PeWKnz09PT09PVwiKTtcclxuXHJcbiAgICAgICAgLy/liJvlu7rmiYDmnInpnaLmnb/nmoTmlbDmja5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXg8dGhpcy5udW1fcmFuazsgaW5kZXgrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUmFua0NvbnRlbnQoaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVCZWdpbk9yaWdpblkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8q5Yib5bu66Zqc56KN54mpIOW4g+WxgFxyXG4gICAgKiAxLuWcqOmanOeijeeJqeS4i+mdoueahOeJqeS9k+aKiuS7lua4heepulxyXG4gICAgKiAyLui/meS4quWIl+eahOaVsOmHj+ayoeacieWPmOi/mOaYr+i/meS6m+aVsOmHj1xyXG4gICAgKiAqL1xyXG4gICAgY3JlYXRlQmFycmllckNhbnZhczpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAzOyBpPHRoaXMubnVtX3JhbmstMzsgaSsrKXtcclxuICAgICAgICAvLyAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGxldCBib3ggPSBsaXN0WzddO1xyXG4gICAgICAgIC8vICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAvLyAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJhcnJpZXIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgbGV0IGJhcnJpZXJMaXN0ID0gW3tcInJvd1wiOjcsXCJyYW5rXCI6NX0se1wicm93XCI6NyxcInJhbmtcIjo2fSx7XCJyb3dcIjo3LFwicmFua1wiOjd9LHtcInJvd1wiOjcsXCJyYW5rXCI6OH0se1wicm93XCI6NixcInJhbmtcIjo1fV07XHJcblxyXG4gICAgICAgIC8v6K6+572u5pivIGJhcnJpZXLnmoTmlrnlnZfnsbvlnotcclxuICAgICAgICBiYXJyaWVyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbZWxlLnJhbmtdO1xyXG4gICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtlbGUucm93XTtcclxuICAgICAgICAgICAgaWYoYm94ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RCYXJyaWVyLnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveFNwZWNpYWxseVNob3coQm94VHlwZS5CYXJyaWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvKuiuvue9rui/meS4qmJhcnJpZXLkuIvnmoTmlrnlnZcqL1xyXG4gICAgICAgIGJhcnJpZXJMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtlbGUucmFua107XHJcbiAgICAgICAgICAgIGZvcihsZXQgbnVtX2IgPSAwOyBudW1fYjxlbGUucm93O251bV9iKyspe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z5Liq5L2N572u6K6+572u5oiQ56m655m95Y2g5L2N5L+h5oGvXHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtudW1fYl07XHJcbiAgICAgICAgICAgICAgICBpZihib3ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJsYW5rKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5iZWdpbkJsYW5rRmlsbCgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyrlvIDlp4vnqbrkvY3loavlhYUqL1xyXG4gICAgYmVnaW5CbGFua0ZpbGw6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKueci+aYr+WQpumcgOimgeWIm+W7uiDmlrnlnZcg5Y675aGr5YWF5Y2g5L2N5pa55Z2XKi9cclxuXHJcbiAgICAgICAgaWYodGhpcy5saXN0QmFycmllci5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICAvL+ayoeaciemanOeijeeJqVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+e7mei/meS4qumanOeijeeJqeS4i+mdouihpeWFheaWueWdl1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0QmFycmllci5sZW5ndGg7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5saXN0QmFycmllcltpXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYmxhbmtDaGVja1JlcGxhY2VBdmFpbGFibGUoYm94KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKuajgOa1i+aYr+WQpuWPr+S7peabv+aNolxyXG4gICAgKiBib3hfYyDov5nkuKropoHmk43kvZznmoTmlrnlnZfnsbvlnosgIOaYryDpmpznoo3nianjgIHmlrnlnZdcclxuICAgICogKi9cclxuICAgIGJsYW5rQ2hlY2tSZXBsYWNlQXZhaWxhYmxlIDogZnVuY3Rpb24gKGJveCl7XHJcblxyXG4gICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAgICAgICAgIC8v5piv6Zqc56KN54mpXHJcblxyXG4gICAgICAgICAgICAvL+i/meS4qumanOeijeeJqeeahOi+ueeVjOS4pOi+uSDniankvZPmmK8g6L6555WMIOOAgemanOeijeeJqeOAgeaWueWdl1xyXG4gICAgICAgICAgICBsZXQgYm94X2xlZnQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuay0xXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAgICAgICAgIGxldCBib3hfUmlnaHQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuaysxXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmtdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG5cclxuICAgICAgICAgICAgaWYoYm94X2JvdHRvbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICAvL+i/meS4quW6lemDqOaYr+epuueahCDlj6/ku6XloavlhYXmlrnlnZdcclxuXHJcbiAgICAgICAgICAgICAgICBpZihib3hfbGVmdC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAvL+W3pui+ueS9jee9ruaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5bem6L655L2N572u5o6J6JC95aGr5YWFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b20sYm94X2xlZnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGJveF9SaWdodC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAvL+WPs+i+ueS9jee9ruaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5Y+z6L655L2N572u5o6J6JC95aGr5YWFXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2UgaWYoYm94X2MuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAvL+aYr+aWueWdl1xyXG5cclxuICAgICAgICAgICAgLy/ov5nkuKrmlrnlnZfnmoQg5bem5LiL5pa5IOWPs+S4i+aWuSDmraPkuIvmlrkg5Yik5pat5piv5ZCm5piv56m65L2NXHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tX2xlZnQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuay0xXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgICAgICAgICAgbGV0IGJveF9ib3R0b21fUmlnaHQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuaysxXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgICAgICAgICAgbGV0IGJveF9ib3R0b21femhlbmcgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFua11bYm94X2MuYm94SXRlbS5yb3ctMV07XHJcbiAgICAgICAgICAgIGlmKGJveF9ib3R0b21femhlbmcgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgYm94X2JvdHRvbV96aGVuZy5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuaykge1xyXG4gICAgICAgICAgICAgICAgLy/mraPkuIvmlrnmmK/nqbrnmoQg5b6A5q2j5LiL5pa5IOabv+aNolxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLmraPkuIvmlrnmmK/nqbrnmoQg5b6A5q2j5LiL5pa5IOabv+aNolwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b21femhlbmcsYm94KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihib3hfYm90dG9tX2xlZnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgYm94X2JvdHRvbV9sZWZ0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgIC8v5bem5LiL5pa55piv56m655qEIOW+gOW3puS4i+aWuSDmm7/mjaJcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5bem5LiL5pa5XCIpO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihib3hfYm90dG9tX1JpZ2h0ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIGJveF9ib3R0b21fUmlnaHQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICAgICAgLy/lj7PkuIvmlrnmmK/nqbrnmoQg5b6A5Y+z5LiL5pa5IOabv+aNolxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLlj7PkuIvmlrlcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAvKuabv+aNouaWueWdlyDlubbmiafooYzmm7/mjaLliIfmjaLnmoTliqjnlLvmlYjmnpwqL1xyXG4gICAgYmxhbmtSZXBsYWNlQm94IDpmdW5jdGlvbiAoYm94QmxhbmssYm94UmVwbGFjZSl7XHJcblxyXG4gICAgICAgIGxldCBib3hfcmUgPSBib3hSZXBsYWNlLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgbGV0IGJveF9ibCA9IGJveEJsYW5rLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIGxldCByZXBlYXRMaXN0ID0gYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50LmZpbHRlcihmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW0ueCA9PT0gYm94X2JsLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZihyZXBlYXRMaXN0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBsZXQgaXNsZWZ0ID0gYm94X2JsLmJveEl0ZW0uYmVnaW5feCA8IGJveF9yZS5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9yZS5ib3hJdGVtLmFuaV9wb2ludC5wdXNoKHtcInhcIjogYm94X2JsLmJveEl0ZW0uYmVnaW5feCwgXCJ5XCI6IGJveF9ibC5ib3hJdGVtLmVuZF95LFwiaXNsZWZ0XCI6aXNsZWZ0fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLmVuZF95ID0gYm94X2JsLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgIGxldCB0ZW1wX3JhbmsgPSBib3hfcmUuYm94SXRlbS5yYW5rO1xyXG5cclxuICAgICAgICBib3hfcmUuYm94SXRlbS5yb3cgPSBib3hfYmwuYm94SXRlbS5yb3c7XHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0ucmFuayA9IGJveF9ibC5ib3hJdGVtLnJhbms7XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy/ljaDkvY3nmoTmlrnlnZcg5L2N572u5pu/5o2i5oiQ6KaB56e75YWl55qE5pa55Z2XICDnp7vpmaTov5nkuKrljaDkvY3mlrnlnZdcclxuICAgICAgICB0aGlzLnJhbmtMaXN0W2JveF9ibC5ib3hJdGVtLnJhbmtdW2JveF9ibC5ib3hJdGVtLnJvd10gPSBib3hSZXBsYWNlO1xyXG5cclxuICAgICAgICAvL+i/meS4quaWueWdl+e7p+e7reW+gOS4i+abv+aNolxyXG4gICAgICAgIGlmKCF0aGlzLmJsYW5rQ2hlY2tSZXBsYWNlQXZhaWxhYmxlKGJveF9yZSkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuenu+WKqOWujOaIkCDmm7/mjaI9PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ib3hQb29sLnB1dChib3hfYmwubm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIC8v5ZCO6Z2i6YGN5Y6G55qE5pe25YCZ5oqK5LuW56e76Zmk5o6JXHJcbiAgICAgICAgLy90aGlzLnJhbmtMaXN0W3RlbXBfcmFua10ucmVtb3ZlQnlWYWx1ZSh0aGlzLnJhbmtMaXN0W3RlbXBfcmFua10sYm94UmVwbGFjZSk7XHJcblxyXG5cclxuICAgICAgICAvLyBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgICAgIC8vIH0sXHJcblxyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIC8v5Yib5bu65q+P5LiA5YiX55qE5pWw5o2uXHJcbiAgICBjcmVhdGVSYW5rQ29udGVudDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCByYW5rX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaW5kZXg7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLm51bV9yb3c7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICBib3guYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGJveC53aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG4gICAgICAgICAgICBib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuaW5pdEJveEl0ZW0oKTtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feCA9IG9yaWdpbl94O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSooaSsxKTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb3VudCA9IEJveFR5cGUuVHlwZUNvdW50O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKmNvdW50KSB8IDA7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5yZXNldE9yaWdpblBvcygpO1xyXG5cclxuICAgICAgICAgICAgYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgIHJhbmtfbGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0LnB1c2gocmFua19saXN0KTtcclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+abtOaWsOaJgOacieWIlyBlbmQgeeeahOaVsOaNrlxyXG4gICAgdXBkYXRlQWxsUmFua0VuZFk6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgLy/nnIvor6XliJfnmoTmlbDph4/mmK/lkKYg5bCP5LqOIHRoaXMubnVtX3JvdyAg5bCR5LqO55qE6K+d5YiZ6KGl5YWFXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0X3N1YiA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB3aGlsZShsaXN0X3N1Yi5sZW5ndGggPCB0aGlzLm51bV9yb3cpe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBuZXdfYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICAgICAgbmV3X2JveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IG5ld19ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucmFuayA9IGk7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IDA7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuICAgICAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmV3X2JveC5wYXJlbnQgPSB0aGlzLnN1cGVyX25vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdF9zdWIucHVzaChuZXdfYm94KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgZW5kX2JveF95ID0gdGhpcy5tYXJnaW5fYm90dG9tO1xyXG5cclxuICAgICAgICAgICAgLy/mm7TmlrDmr4/kuKrlhYPntKDnmoRlbmQgeSDkvY3nva5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8bGlzdF9zdWIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGxpc3Rfc3ViW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gaXRlbV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSppO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrDmr4/kuIDliJfku5bku6zkuK3nmoTmr4/kuKrlhYPntKDnmoTliJ3lp4vnmoRvcmlnaW4geeeahOWAvFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVCZWdpbk9yaWdpblk6ZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5p+Q5LiA5YiX5LitIOS7juacgOWQjuW8gOWni+mBjeWOhui/lOWbnlxyXG4gICAgICAgICAqIOeul+WHuuW8gOWni+aOieS6hueahOS9jee9rlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Yik5pat5piv5ZCmIOW3sui+vuWIsOS7lueahGVuZHkg5aaC5p6c6L+Y5pyq6L6+5Yiw5bCx5pivIOato+imgeaOieiQvVxyXG4gICAgICAgICAgICBsZXQgb2ZmX3RvcCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBzcGFjZV90b3AgPSA1O1xyXG5cclxuICAgICAgICAgICAgLy8gZm9yKGxldCBqID0gdGhpcy5udW1fcm93LTE7IGo+PTA7IGotLSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvL2JveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiAxLuWunuS+i+a4uOaIj+eahOaXtuWAmSDliJ3lp4vlvIDlp4vnmoTkvY3nva5cclxuICAgICAgICAgICAgICAgICAgICAgKiAyLua2iOmZpOeahCDmlrnlnZfkuI3lnKjnlYzpnaLkuK3nmoTorr7nva7ku5bnmoTlvIDlp4vkvY3nva4g5bey5Zyo55WM6Z2i5Lit55qE5LiN5Y676K6+572u5LuWXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB8fCAoYm94X2Mubm9kZS55ID49IGJveF9jLmJveEl0ZW0uYmVnaW5feSkpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgb2ZmX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSBvZmZfdG9wICsgYm94X2Mubm9kZS5oZWlnaHQgKyBzcGFjZV90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZV90b3AgPSBzcGFjZV90b3AgKyAxMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5piv6KaB5o6J6JC955qEXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIC8v5Lqk5o2i5Lik5Liq5pa55Z2X55qE5L2N572uXHJcbiAgICBleGNoYW5nZUJveEl0ZW06ZnVuY3Rpb24oYm94MSxib3gyLHRvQ2hlY2tWaWFibGUgPSB0cnVlKXtcclxuXHJcbiAgICAgICAgbGV0IGJveEl0ZW0xID0gYm94MS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgbGV0IGJveEl0ZW0yID0gYm94Mi5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgIGlmKGJveEl0ZW0xLnJhbmsgPT09IGJveEl0ZW0yLnJhbmspe1xyXG4gICAgICAgICAgICAvL+WQjOS4gOWIl+eahFxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9lbmR5ID0gYm94SXRlbTIuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmVuZF95ID0gYm94SXRlbTEuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLmVuZF95ID0gdGVtcF9lbmR5O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JvdyA9IGJveEl0ZW0yLnJvdztcclxuXHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJvdyA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgYm94SXRlbTEucm93ID0gdGVtcF9yb3c7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdFtib3hJdGVtMS5yb3ddO1xyXG4gICAgICAgICAgICBsaXN0W2JveEl0ZW0xLnJvd10gPSBsaXN0W2JveEl0ZW0yLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTIucm93XSA9IHRlbXBfbm9kZTtcclxuXHJcblxyXG5cclxuICAgICAgICB9ZWxzZSBpZihib3hJdGVtMS5yb3cgPT09IGJveEl0ZW0yLnJvdyl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA6KGM55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0MSA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcbiAgICAgICAgICAgIGxldCBsaXN0MiA9IHRoaXMucmFua0xpc3RbYm94SXRlbTIucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9iZWdpbnggPSBib3hJdGVtMi5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMi5iZWdpbl94ID0gYm94SXRlbTEuYmVnaW5feDtcclxuICAgICAgICAgICAgYm94SXRlbTEuYmVnaW5feCA9IHRlbXBfYmVnaW54O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JhbmsgPSBib3hJdGVtMi5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMi5yYW5rID0gYm94SXRlbTEucmFuaztcclxuICAgICAgICAgICAgYm94SXRlbTEucmFuayA9IHRlbXBfcmFuaztcclxuXHJcbiAgICAgICAgICAgIGxldCByb3dfaW5kZXggPSBib3hJdGVtMS5yb3c7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0MVtyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0MVtyb3dfaW5kZXhdID0gbGlzdDJbcm93X2luZGV4XTtcclxuICAgICAgICAgICAgbGlzdDJbcm93X2luZGV4XSA9IHRlbXBfbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRvQ2hlY2tWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzVmlhYmxlID0gdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICBpZighaXNWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5LiN5Y+v5raI6Zmk55qE6K+dIOS9jee9ruWGjeS6kuaNouWbnuadpVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLkuI3lj6/mtojpmaRcIik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leGNoYW5nZUJveEl0ZW0oYm94Mixib3gxLGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/mo4DmtYvpnaLmnb/miYDmnInmlrnlnZcg5piv5ZCm5Y+v5raI6ZmkXHJcbiAgICBjaGVja1BhbmVsRWxpbWluYXRhYmxlOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCB3aXBlX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgLy/liKTmlq3liJcg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG4gICAgICAgICAgICAgICAgaWYoIXByZV9ib3gpe1xyXG4gICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fcHJlID0gcHJlX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvQWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgLyrpopzoibLnm7jlkIwg5bm25LiU5piv5pmu6YCa57G75Z6L55qE6aKc6Imy55qE5pe25YCZKi9cclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1fcHJlLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3Jvdy0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHdpcGVfbGlzdCx0ZW1wTGlzdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZXBlYXRJdGVtSW5XaXBlKGl0ZW0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHdpcGVfbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZih3aXBlX2xpc3RbaV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkID09PSBpdGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/liKTmlq3ooYwg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yYW5rOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMucmFua0xpc3Rbal1baV07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1fcHJlLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3JhbmstMSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvQWRkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcExpc3QubGVuZ3RoID49IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov73liqDliLB3aXBl6YeM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNSZXBlYXRJdGVtSW5XaXBlKGVsZW0pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lwZV9saXN0LnB1c2goZWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZih3aXBlX2xpc3QubGVuZ3RoID4gMCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd0RlbGF5QW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgLy/kuI3mmL7npLrmtojpmaTliqjnlLtcclxuICAgICAgICAgICAgICAgIHNob3dEZWxheUFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy/kuI3mmK/liJ3lp4vljJbnmoQg5YGc55WZ5LiA5Lya5YS/5YaN5raI6ZmkIOiuqeeUqOaIt+eci+WIsOimgea2iOmZpOS6huS7gOS5iOS4nOilv1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+a2iOmZpOaOiVxyXG4gICAgICAgICAgICAgICAgLy8gd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIGxldCBib3ggPSBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gYm94LnN0YXRlX2IgPSBCb3hTdGF0ZS5FRGVzdHJveTtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmJveERyb3BfZGVzdHJveShlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3ggPSBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LnN0YXRlX2IgPSBCb3hTdGF0ZS5FRGVzdHJveTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog6L+Z6L655LiA5Liq5bu26L+fXHJcbiAgICAgICAgICAgICAgICAg5aaC5p6c5ri45oiP5pivIOWIneWni+WMlueahOivneS4jeW7tui/n1xyXG4gICAgICAgICAgICAgICAgIOS4jeaYr+WIneWni+WMliBzdGFydOeahCDopoHnrYnplIDmr4HliqjnlLvlrozmiJDkuYvlkI7lho3lvIDlp4vmjonokL1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5pyJ6ZSA5q+B5Zyo5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgIT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+ato+WcqOaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuRmlsbGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsUmFua0VuZFkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksKHRoaXMuZ2FtZXN0YXRlICE9PSBHYW1lX1N0YXRlLlN0YXJ0KT8wLjM6MCxmYWxzZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLHNob3dEZWxheUFuaW1hdGlvbj8wLjM6MCxmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIGJveERyb3BfZ2V0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCBib3ggPSBudWxsO1xyXG4gICAgICAgIGlmKHRoaXMuYm94UG9vbC5zaXplKCkgPiAwKXtcclxuICAgICAgICAgICAgYm94ID0gdGhpcy5ib3hQb29sLmdldCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBib3ggPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJveF9wcmVmYWIpO1xyXG4gICAgICAgICAgICBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5pbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfSxcclxuXHJcbiAgICBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuXHJcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveC5ib3hJdGVtLnJhbmtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxpc3QucmVtb3ZlQnlWYWx1ZShsaXN0LGJveC5ub2RlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hQb29sLnB1dChib3gubm9kZSk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmlsbEludGVydmFsID09PSAxMCl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT095a6a5pe25byA5aeL5Yik5pat5piv5ZCm6YO95bey5o6J6JC95Yiw5bqV6YOo5LqGIGJlZ2luID09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3pg73liLAg5o6J6JC95Yiw5bqV6YOo5LqGIOajgOa1i+aYr+WQpuWPr+a2iOmZpCBlbmQgPT09PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG4vLyB2YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBfc2VsZWN0X2JveDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6YCJ5Lit5p+Q5Liq5pa55Z2XXHJcbiAgICAgICAgc2VsZWN0X2JveDoge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RfYm94O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdF9ib3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9uZXcgPSB2YWx1ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fb2xkID0gdGhpcy5fc2VsZWN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJveEl0ZW1fbmV3LmlkICE9PSBib3hJdGVtX29sZC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIueci+aYr+WQpuimgeS6pOS6kuS9jee9riDov5jmmK/or7TliIfmjaLliLDov5nkuKrpgInkuK3nmoTkvY3nva7lpITnkIZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQxID0gXCIgKyBib3hJdGVtX25ldy5pZCArIFwiICBpZDI9IFwiICsgYm94SXRlbV9vbGQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aXp+eahOWPlua2iOmAieaLqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94LnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0odmFsdWUsIHRoaXMuX3NlbGVjdF9ib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLkuI3mmK/nm7jov5HnmoQg5Y+W5raI5LiK5LiA5Liq6YCJ5oupIOmAieS4reaWsOeCueWHu+eahFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumAieS4reS6huWQjOS4gOS4qiDlj5bmtojpgInmi6lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgbGV0IGJveEl0ZW0gPSBjbGlja19ub2RlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgLy8gIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLmJveERyb3BfZGVzdHJveShjbGlja19ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gIC8v5LiK6Z2i55qE5o6J5LiL5p2lXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLnVwZGF0ZVJhbmtFbmRZKGJveEl0ZW0ucmFuayk7XHJcblxyXG5cclxuICAgICAgICAgdGhpcy5zZWxlY3RfYm94ID0gY2xpY2tfbm9kZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuXHJcbiAgICAgICAgbGFiX3Nob3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9jQ2FsbEpzOmZ1bmN0aW9uIChzdHIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJfc2hvdy5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMubGFiX3Nob3cuc3RyaW5nID0gc3RyO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxhYl9zaG93Lm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH0sNSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBqc0NhbGxPYzpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v57G75ZCNIOaWueazlSAg5Y+C5pWwMSDlj4LmlbAyIOWPguaVsDNcclxuICAgICAgICB2YXIgcmVzdWx0ID0ganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIkpTQk1hbmFnZXJcIixcInloSlNCQ2FsbDpcIixcImpz6L+Z6L655Lyg5YWl55qE5Y+C5pWwXCIpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImpzX2NhbGxfb2MgPT09PT09PT09ICVAXCIscmVzdWx0KTtcclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLm9jQ2FsbEpzKFwi5rWL6K+VIOaYvuekuumakOiXj1wiKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJcclxuXHJcbi8q5pa55Z2X55qE57G75Z6LKi9cclxuY29uc3QgQm94VHlwZSA9IGNjLkVudW0oe1xyXG4gICAgWUVMTE9XIDogLTEsXHJcbiAgICBHcmVlbiA6IC0xLFxyXG4gICAgQmx1ZSA6IC0xLFxyXG4gICAgQmxhY2sgOiAtMSxcclxuICAgIFdoaXRlIDogLTEsXHJcblxyXG4gICAgVHlwZUNvdW50IDogLTEsXHJcblxyXG4gICAgQmFycmllciA6IC0xLCAgICAgICAvL+manOeijeeJqVxyXG4gICAgQmxhbmsgOiAtMSwgICAgICAgICAgLy/nqbrnmb3ljaDkvY1cclxuXHJcbiAgICBDb3VudCA6IC0xXHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuLy/mlrnlnZfmjonokL3nmoTnirbmgIFcclxuY29uc3QgQm94U3RhdGUgPSBjYy5FbnVtKHtcclxuXHJcbiAgICAvLyBFTm9uZSA6IC0xLCAgICAgIC8v5LuA5LmI6YO95LiN5pivXHJcblxyXG4gICAgRU5vcm1hbCA6IC0xLCAgICAvL+ato+W4uFxyXG4gICAgRUZhbGxpbmcgOiAtMSwgICAvL+aOieiQvVxyXG4gICAgRUZhbGxlZCA6IC0xLCAgICAvL+aOieiQvee7k+adn1xyXG4gICAgRURlc3Ryb3kgOiAtMSwgICAvL+mUgOavgVxyXG5cclxufSk7XHJcblxyXG4vL+aWueWdl+aYvuekuueahOeKtuaAgVxyXG5jb25zdCBCb3hTaG93VHlwZSA9IGNjLkVudW0oe1xyXG5cclxuICAgIEtfTm9ybWFsIDogLTEsICAgICAgICAgIC8v5q2j5bi4XHJcbiAgICBLX1NlbGVjdCA6IC0xLCAgICAgICAgICAvL+mAieS4rVxyXG5cclxuICAgIEtfU2tpbGxBcm91bmQgOiAtMSwgICAgICAgLy/plIDmr4Eg5ZGo6L6555qE5Lmd5LiqXHJcbiAgICBLX1NraWxsUmFuayA6IC0xLCAgICAgICAgIC8v6ZSA5q+BIOivpeWIl1xyXG4gICAgS19Ta2lsbFJhdyA6IC0xLCAgICAgICAgICAvL+mUgOavgSDor6XooYxcclxuICAgIEtfU2tpbGxDb2xvciA6IC0xLCAgICAgICAgLy/plIDmr4Eg6K+l6ImyXHJcbn0pO1xyXG5cclxuXHJcblxyXG4vL+a4uOaIj+i/m+ihjOeahOeKtuaAgVxyXG52YXIgR2FtZV9TdGF0ZSA9IGNjLkVudW0oe1xyXG4gICAgU3RhcnQgOiAtMSwgICAgIC8v5byA5aeL5a6e5L6LXHJcbiAgICBGaWxsaW5nOiAtMSwgICAgLy/mlrnlnZfooaXpvZDkuK0g5o6J6JC95LitXHJcbiAgICAvLyBCbGFua0ZpbGxpbmcgOiAtMSwgLy/nqbrkvY3ooaXlhYUg6Ieq5Yqo5o6J6JC9XHJcbiAgICBQbGF5IDogLTEsICAgICAgLy/ov5vooYzkuK1cclxuICAgIE92ZXIgOiAtMSwgICAgICAvL+e7k+adn1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgIEJveFN0YXRlLFxyXG4gICAgQm94U2hvd1R5cGUsXHJcbiAgICBHYW1lX1N0YXRlLFxyXG4gICAgQm94VHlwZVxyXG5cclxufTsiXSwic291cmNlUm9vdCI6IiJ9