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

        speedMax: 800,

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
        this.titleShow = this.node.getChildByName("Label");

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
        // this.speed_x = 20;

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

                speed_n = Math.min(speed_n, this.speedMax);
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

        if (this.boxItem.ani_point.length > 0) {

            // console.log("需要做偏移操作 判断");
            // let point_a = this.boxItem.ani_point

            //判断这个位置的y 需要在的x的位置
            // let points = this.boxItem.ani_point.filter(function(elem){
            //     return this.node.y < elem.y;
            // }.bind(this));

            var last_point = this.boxItem.ani_point[0];

            if (last_point !== undefined && this.node.x !== last_point.x && this.node.y < last_point.y) {

                // this.node.x = last_point.x;
                // this.boxItem.ani_point.shift();//删除第一个元素

                if (this.boxItem.rank === 6 && this.boxItem.row === 1) {
                    console.log("这个位置异常" + this.boxItem.ani_point);

                    if (last_point.isleft) {
                        //左边的递减
                        this.node.x = this.node.x - this.speed * 0.5;
                        if (this.node.x <= last_point.x) {
                            this.node.x = last_point.x;
                            this.boxItem.ani_point.shift(); //删除第一个元素
                            console.log("=======移除");
                        }
                    } else {
                        //右边的递增
                        this.node.x = this.node.x + this.speed * 0.5;
                        if (this.node.x >= last_point.x) {
                            this.node.x = last_point.x;
                            this.boxItem.ani_point.shift(); //删除第一个元素
                            console.log("=======移除");
                        }
                    }
                } else {

                    if (last_point.isleft) {
                        //左边的递减
                        this.node.x = this.node.x - this.speed * 0.5;
                        if (this.node.x <= last_point.x) {
                            this.node.x = last_point.x;
                            this.boxItem.ani_point.shift(); //删除第一个元素
                            console.log("=======移除");
                        }
                    } else {
                        //右边的递增
                        this.node.x = this.node.x + this.speed * 0.5;
                        if (this.node.x >= last_point.x) {
                            this.node.x = last_point.x;
                            this.boxItem.ani_point.shift(); //删除第一个元素
                            console.log("=======移除");
                        }
                    }
                }
            }

            // console.log("====" + last_point);
        }

        if (YHDebug) {
            this.titleShow.active = true;
            this.titleShow.getComponent(cc.Label).string = this.boxItem.rank + "_" + this.boxItem.row;
            if (this.boxItem.color_type === BoxType.White || this.boxItem.color_type === BoxType.YELLOW) {
                this.titleShow.getComponent(cc.Label).node.color = cc.Color.BLACK;
            } else {
                this.titleShow.getComponent(cc.Label).node.color = cc.Color.WHITE;
            }
        } else {
            this.titleShow.active = false;
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
                        this.updateAllBeginOriginY();
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

        this.updateAllBeginOriginY();

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

        var barrierList = [{ "row": 7, "rank": 2 }, { "row": 6, "rank": 2 }, { "row": 7, "rank": 3 }, { "row": 7, "rank": 4 }, { "row": 7, "rank": 5 }, { "row": 7, "rank": 6 }, { "row": 7, "rank": 7 }, { "row": 6, "rank": 7 }, { "row": 2, "rank": 2 }, { "row": 3, "rank": 2 }, { "row": 2, "rank": 3 }, { "row": 2, "rank": 6 }, { "row": 2, "rank": 7 }, { "row": 3, "rank": 7 }];

        //将blank按row大小排序 从小到大 底部到顶部 排序底部到顶部
        barrierList.sort(function (a, b) {
            return a.row - b.row;
        });

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

            this.blankCheckReplaceBlankAvailable(box);
        }
    },

    /*检测是否可以替换
    * box_c 这个要操作的方块类型  是 障碍物
    * */
    blankCheckReplaceBlankAvailable: function blankCheckReplaceBlankAvailable(box) {

        var box_c = box.getComponent("BoxDrop");

        if (box_c.boxItem.color_type === BoxType.Barrier) {
            //是障碍物

            //这个障碍物的边界两边 物体是 边界 、障碍物、方块
            var box_left = this.rankList[box_c.boxItem.rank - 1][box_c.boxItem.row];
            var box_Right = this.rankList[box_c.boxItem.rank + 1][box_c.boxItem.row];
            var box_bottom = this.rankList[box_c.boxItem.rank][box_c.boxItem.row - 1];

            //如果这个障碍物 上 左 右 都有其他的障碍物 这个障碍物不做处理 由他上方掉落的方块处理
            // let haveRight = (function () {
            //     for(let i = box_c.boxItem.rank+1; i < this.num_rank; i++){
            //         let b = this.rankList[i][box_c.boxItem.row];
            //         if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
            //             return true;
            //         }
            //     }
            //     return false;
            // }.bind(this))();
            // let haveLeft = (function () {
            //     for(let i = box_c.boxItem.rank-1; i >= 0; i--){
            //         let b = this.rankList[i][box_c.boxItem.row];
            //         if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
            //             return true;
            //         }
            //     }
            //     return false;
            // }.bind(this))();
            // let haveTop = (function () {
            //     for(let i = box_c.boxItem.row+1; i < this.num_row; i++){
            //         let b = this.rankList[box_c.boxItem.rank][i];
            //         if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
            //             return true;
            //         }
            //     }
            //     return false;
            // }.bind(this))();
            //
            // if(haveLeft && haveRight &&haveTop){
            //     console.log("这个三面都有障碍物 "+box_c.boxItem.rank +"  "+ box_c.boxItem.row);
            //     // return;
            // }else {
            //     return;
            // }


            if (box_bottom !== undefined && box_bottom.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //这个底部是空的 可以填充方块

                //填充先 左再右
                if (box_Right !== undefined && box_Right.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount) {
                    //右边位置掉落填充
                    console.log("右边位置 往左边填充掉落填充");

                    //另外边界的那个障碍物
                    var edgeOtherBox = this.blankGetBorderBarrierBox(box);

                    //移除 左边这个要删除的 更新新的方块的开始位置信息
                    this.blankRemoveItemAtRank(box_Right);

                    //设置要替换的位置
                    this.blankReplaceBox(box_bottom, box_Right, edgeOtherBox);

                    this.blankCheckReplaceBlankAvailable(box);
                } else if (box_left !== undefined && box_left.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount) {
                    //左边位置掉落填充
                    console.log("左边位置掉落填充 往右边填充掉落填充");

                    //另外边界的那个障碍物
                    var _edgeOtherBox = this.blankGetBorderBarrierBox(box);

                    //移除 左边这个要删除的 更新新的方块的开始位置信息
                    this.blankRemoveItemAtRank(box_left);

                    //设置要替换的位置
                    this.blankReplaceBox(box_bottom, box_left, _edgeOtherBox);

                    this.blankCheckReplaceBlankAvailable(box);
                }
            }
        }
    },

    //或者这个障碍物相邻在一起 另外一边的障碍物
    blankGetBorderBarrierBox: function blankGetBorderBarrierBox(box) {

        var edge_b = void 0; // = undefined;

        var box_c = box.getComponent("BoxDrop");
        var row = box_c.boxItem.row;
        var rank = box_c.boxItem.rank;

        //判断这个方块的右边有没有
        for (var i = rank + 1; i < this.num_rank; i++) {

            var b = this.rankList[i][row];
            if (b.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount) {
                break;
            } else if (b.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank) {
                edge_b = b;
            }
        }
        //左边
        for (var j = rank - 1; j >= 0; j--) {

            var _b = this.rankList[j][row];
            if (_b.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount) {
                break;
            } else if (_b.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank) {
                edge_b = _b;
            }
        }

        if (edge_b !== undefined) {

            var edge_rank = edge_b.getComponent(BoxDrop).boxItem.rank;
            var edge_row = edge_b.getComponent(BoxDrop).boxItem.row;

            //底下
            for (var k = edge_row - 1; k >= 0; k--) {

                var bb = this.rankList[edge_rank][k];
                if (bb.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount) {
                    break;
                } else if (bb.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank) {
                    edge_b = bb;
                }
            }
        }

        return edge_b;
    },

    /*检测是否可以替换
     * box_c 这个要操作的方块类型  是 方块
     * */
    blankCheckReplaceNormalAvailable: function blankCheckReplaceNormalAvailable(box, edgeOtherBox) {

        var box_c = box.getComponent("BoxDrop");
        if (box_c.boxItem.color_type < BoxType.TypeCount) {
            //是方块

            //这个方块的 左下方 右下方 正下方 判断是否是空位
            var box_bottom_left = this.rankList[box_c.boxItem.rank - 1][box_c.boxItem.row - 1];
            var box_bottom_Right = this.rankList[box_c.boxItem.rank + 1][box_c.boxItem.row - 1];
            var box_bottom_zheng = this.rankList[box_c.boxItem.rank][box_c.boxItem.row - 1];
            if (box_bottom_zheng !== undefined && box_bottom_zheng.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //正下方是空的 往正下方 替换
                console.log("正下方是空的 往正下方 替换");
                this.blankReplaceBox(box_bottom_zheng, box, edgeOtherBox);
                return false;
            } else if (box_bottom_left !== undefined && box_bottom_left.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //左下方是空的 往左下方 替换
                console.log("左下方");
                this.blankReplaceBox(box_bottom_left, box, edgeOtherBox);
                return false;
            } else if (box_bottom_Right !== undefined && box_bottom_Right.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //右下方是空的 往右下方 替换
                console.log("右下方");
                this.blankReplaceBox(box_bottom_Right, box, edgeOtherBox);
                return false;
            }
        }

        return true;
    },

    /*替换方块 并执行替换切换的动画效果*/
    blankReplaceBox: function blankReplaceBox(boxBlank, boxReplace, edgeOtherBox) {

        var box_re = boxReplace.getComponent("BoxDrop");
        var box_bl = boxBlank.getComponent("BoxDrop");

        //设置x的位置变化的时候 点
        // let repeatList = box_re.boxItem.ani_point.filter(function(elem){
        //     return elem.x === box_bl.boxItem.begin_x;
        // });

        //要取最后一个位置 来判断这个动画是够添加过
        var lastPoint = box_re.boxItem.ani_point[box_re.boxItem.ani_point.length - 1];

        //存储动画的节点
        var isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
        if (lastPoint === undefined || lastPoint.x !== box_bl.boxItem.begin_x) {
            box_re.boxItem.ani_point.push({ "x": box_bl.boxItem.begin_x, "y": box_bl.boxItem.end_y + box_bl.node.height, "isleft": isleft });
        }

        box_re.boxItem.begin_x = box_bl.boxItem.begin_x;
        box_re.boxItem.end_y = box_bl.boxItem.end_y;

        // let temp_rank = box_re.boxItem.rank;

        box_re.boxItem.row = box_bl.boxItem.row;
        box_re.boxItem.rank = box_bl.boxItem.rank;

        //这个方块继续往下替换
        if (this.blankCheckReplaceNormalAvailable(boxReplace, edgeOtherBox)) {
            console.log("移动完成 替换=======");

            //占位的方块 位置替换成要移入的方块  移除这个占位方块
            this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxReplace;

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

    blankRemoveItemAtRank: function blankRemoveItemAtRank(boxRemove) {

        var box_re = boxRemove.getComponent("BoxDrop");
        var list = this.rankList[box_re.boxItem.rank];
        list.removeByValue(list, boxRemove);

        var new_box = this.updateRankEndYIndex(box_re.boxItem.rank);

        if (new_box !== null) {

            var box_c = new_box.getComponent("BoxDrop");
            if (box_c.node.y !== box_c.boxItem.end_y) {

                if (this.gamestate === Game_State.Start || box_c.node.y >= box_c.boxItem.begin_y) {

                    //他本身是最后一个 跟倒数第二个对比
                    var last_box = list[list.length - 2];
                    if (last_box !== undefined) {
                        box_c.boxItem.begin_y = last_box.getComponent("BoxDrop").boxItem.begin_y + box_c.node.height + 10 * list.length;
                    } else {
                        box_c.boxItem.begin_y = this.margin_top + space_top;
                        box_c.node.y = box_c.boxItem.begin_y;
                    }
                    box_c.node.y = box_c.boxItem.begin_y;
                }

                //是要掉落的
                if (this.gamestate === Game_State.Play || this.gamestate === Game_State.Filling || this.gamestate === Game_State.Start) {
                    box_c.state_b = BoxState.EFalling;
                }
            } else {
                box_c.state_b = BoxState.EFalled;
            }
        }
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

            this.updateRankEndYIndex(i);
        }

        this.updateAllBeginOriginY();

        if (this.gamestate === Game_State.Start) {
            this.checkPanelEliminatable();
        }
    },

    /*更新某列的数据*/
    updateRankEndYIndex: function updateRankEndYIndex(index) {

        var createBox = null;

        var origin_x = this.margin_left + (this.itemWidth + this.itemSpace) * index;

        var list_sub = this.rankList[index];

        while (list_sub.length < this.num_row) {

            var new_box = this.boxDrop_get();
            new_box.active = true;
            new_box.width = this.itemWidth;
            new_box.height = this.itemHeight;

            var box_c = new_box.getComponent("BoxDrop");
            box_c.state_b = BoxState.ENormal;

            box_c.initBoxItem();

            box_c.boxItem.begin_x = origin_x;
            box_c.boxItem.begin_y = this.margin_top;
            box_c.boxItem.rank = index;
            box_c.boxItem.row = 0;
            box_c.boxItem.color_type = cc.random0To1() * 5 | 0;
            box_c.resetOriginPos();

            new_box.parent = this.super_node;

            list_sub.push(new_box);

            createBox = new_box;
        }

        var end_box_y = this.margin_bottom;

        //更新每个元素的end y 位置
        for (var i = 0; i < list_sub.length; i++) {

            var item_box = list_sub[i];
            var _box_c = item_box.getComponent("BoxDrop");
            _box_c.boxItem.row = i;
            _box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight + this.itemSpace) * i;
        }

        return createBox;
    },

    /**
     * 更新每一列他们中的每个元素的初始的origin y的值
     */
    updateAllBeginOriginY: function updateAllBeginOriginY() {

        /**
         * 某一列中 从最后开始遍历返回
         * 算出开始掉了的位置
         */
        for (var i = 0; i < this.num_rank; i++) {
            var list = this.rankList[i];

            //判断是否 已达到他的endy 如果还未达到就是 正要掉落
            var off_top = 0;
            var _space_top = 5;

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

                        off_top = off_top + box_c.node.height + _space_top;

                        _space_top = _space_top + 10;
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
            for (var _i = 0; _i < wipe_list.length; _i++) {
                if (wipe_list[_i].getComponent("BoxDrop").boxItem.id === item.getComponent("BoxDrop").boxItem.id) {
                    return true;
                }
            }
            return false;
        }

        //判断行 是否有三个以及三个以上的一样的色块连在一起
        for (var _i2 = 0; _i2 < this.num_row; _i2++) {

            var _tempList = [];
            var _pre_box = null;
            for (var _j = 0; _j < this.num_rank; _j++) {
                var _box = this.rankList[_j][_i2];
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

    /*是否开启调试*/
    gameShowDebugMessage: function gameShowDebugMessage() {

        YHDebug = !YHDebug;
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
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem","States":"States"}],"Global":[function(require,module,exports){
"use strict";
cc._RF.push(module, '22f7dE3zhxMiZn1mbV88ZRS', 'Global');
// script\State\Global.js

"use strict";

//是否开启调试
window.YHDebug = true;

cc._RF.pop();
},{}],"JSBCall":[function(require,module,exports){
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
},{}]},{},["BoxDrop","BoxItem","BoxPanel","Eliminate","JSBCall","Global","States"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvR2xvYmFsLmpzIiwiYXNzZXRzL3NjcmlwdC9KU0JDYWxsLmpzIiwiYXNzZXRzL3NjcmlwdC9TdGF0ZS9TdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBQ0E7QUFISTs7QUFPUjtBQUNJO0FBQ0E7QUFGTTs7QUFLVjs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7QUFDSTtBQUNJOztBQUVBOztBQUVKO0FBQ0k7O0FBRUE7O0FBRUo7O0FBR0k7O0FBRUo7O0FBR0k7O0FBRUo7O0FBSUk7O0FBRUo7O0FBRUk7O0FBN0JSO0FBaUNIO0FBekNJOztBQThDVDtBQUNJO0FBQ0E7QUFGSzs7QUFNVDs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTs7QUFFSTs7QUFFSjs7QUFHSTs7QUFFSjtBQUNJOztBQUVBO0FBQ0o7QUFDSTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7O0FBRUQ7O0FBM0JSO0FBK0JIO0FBQ0o7O0FBRUQ7O0FBbERJOztBQTNFQTs7QUFvSVo7QUFDSTtBQURJOztBQUlSOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIOztBQUdEO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBRUg7O0FBRUQ7QUFDSTs7QUFFQTtBQUNBO0FBQ0g7O0FBSUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVIOztBQUVEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSTs7O0FBR0E7QUFDQTs7QUFHSTs7QUFFQTtBQUNBO0FBQ0g7QUFDSjs7QUFJRDs7QUFFSTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBTUQ7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTtBQUNIOztBQUdEOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFHRDtBQUNBOztBQUdJO0FBQ0E7QUFDQTtBQUNBOztBQUVJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7O0FBRUk7OztBQUdBOztBQUVBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFJSTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUVKOztBQUVHO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFFSjtBQUNKOztBQUVEO0FBQ0g7O0FBR0Q7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBQ0c7QUFDSDtBQUVKO0FBQ0c7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBOVdJOzs7Ozs7Ozs7O0FDTFQ7O0FBR0E7QUFDSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSTtBQUNJO0FBQW1CO0FBQ25CO0FBQW9CO0FBQ3BCO0FBQW1CO0FBQ25CO0FBQWtCO0FBQ2xCO0FBQW1CO0FBQ25CO0FBQXFCO0FBQ3JCO0FBQW9CO0FBQ3BCO0FBQVE7QUFSWjtBQVVIO0FBWk07O0FBZVg7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7OztBQUdBOztBQUdBO0FBQ0k7QUFDSTtBQUNIO0FBSEY7QUF0Q0s7O0FBNkNaO0FBQ0E7O0FBakRLOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZLOztBQUtUO0FBQ0k7QUFDQTtBQUZJOztBQUtSO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIOztBQUdEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFSjtBQUNKO0FBQ0Q7QUE1Qk07O0FBM0JGOztBQTREWjtBQUNBOztBQUVJOztBQUVJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFJQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBaUJBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFSjs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBR0Q7QUFDSDs7QUFHRDtBQUNBOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDSDtBQUNKOztBQUdEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFFSDtBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKO0FBQ0Q7QUFDQTs7QUFFSTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDSjs7QUFFRDs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNIOztBQUVEOzs7QUFHQTs7QUFFSTtBQUNBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0g7O0FBUUQ7QUFDQTs7QUFFSTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDSDs7QUFHRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDs7QUFHRDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7O0FBR0Q7O0FBRUk7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUk7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTtBQUdJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7QUFFSjtBQUNKOztBQUlEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7QUFHSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFDSDs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUdBO0FBQ0g7O0FBR0Q7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUdEO0FBQ0g7O0FBR0Q7OztBQUdBOztBQUdJOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNBOztBQUVBOztBQUVJOzs7O0FBSUE7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBO0FBR0k7QUFDSDtBQUNKO0FBQ0c7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNBO0FBQXdEOzs7QUFFcEQ7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUlIO0FBQ0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBR0Q7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUdKO0FBRUo7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUdEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFSTtBQUNBO0FBRUg7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUVIO0FBR0o7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQVFEOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSDs7QUFLRDtBQUNBOztBQUVJO0FBRUg7O0FBTUQ7QUFDQTs7QUFFSTs7QUFHSTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7O0FBRUE7QUFDQTtBQUNIOztBQUVEO0FBQ0g7QUFFSjtBQTcrQkk7Ozs7Ozs7Ozs7QUNQVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBSFE7O0FBTVo7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7O0FBRUk7QUFDQTtBQUVIO0FBQ0c7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFSTs7QUFFQTtBQUNBOztBQUVBO0FBQ0g7QUFFRzs7QUFFQTs7QUFFQTtBQUNIO0FBRUo7QUFDRztBQUNBOztBQUVBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUE1Q1E7O0FBVEo7O0FBMERaO0FBQ0E7O0FBT0E7QUFDQTs7QUFFSTs7QUFFQzs7QUFFQTs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7OztBQUdDO0FBQ0o7O0FBdEZJOzs7Ozs7Ozs7O0FDSFQ7QUFDQTs7Ozs7Ozs7OztBQ0pBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFGSzs7QUFaRDs7QUFvQlo7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFHRDtBQUNBOztBQUVJOztBQUVIOztBQXBESTs7Ozs7Ozs7OztBQ0VUO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFab0I7O0FBa0J4QjtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUlKO0FBQ0E7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFLSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFNSjs7QUFFSTtBQUNBO0FBQ0E7QUFDQTs7QUFMYSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG5cclxudmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcbnZhciBCb3hTaG93VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U2hvd1R5cGU7XHJcbnZhciBHYW1lX1N0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5HYW1lX1N0YXRlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBzcGVlZDowLFxyXG5cclxuICAgICAgICBzcGVlZE1heDo4MDAsXHJcblxyXG4gICAgICAgIGFjY19zcGVlZDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6OS44LFxyXG4gICAgICAgICAgICB0b29sdG9wOlwi5Yqg6YCf5bqmXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBib3hJdGVtOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOkJveEl0ZW0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2UsXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIF9zaG93VHlwZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6Qm94U2hvd1R5cGUuS19Ob3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U2hvd1R5cGVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzaG93VHlwZTp7XHJcblxyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Nob3dUeXBlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfTm9ybWFsOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19TZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxBcm91bmQ6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbENvbG9yOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxSYW5rOlxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsUmF3OlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgICAgIF9zdGF0ZV9iOntcclxuICAgICAgICAgICAgZGVmYXVsdDpCb3hTdGF0ZS5FTm9ybWFsLFxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG4gICAgICAgICAgICAvLyB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhdGVfYjp7XHJcblxyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlX2I7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc3RhdGVfYiAhPT0gdmFsdWUpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZV9iID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gdGhpcy5zcGVlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FTm9ybWFsOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRmFsbGluZzpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVGYWxsZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGxheShcImFuaV9ib3hcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRURlc3Ryb3k6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaRp+avgeWQuWFzZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmltYXRpb24ucGxheShcImFuaV9kZXN0cm95XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocGFuZWwuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFuZWwuYm94RHJvcF9kZXN0cm95KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoXCJhbmlfZGVzdHJveVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U3RhdGUsXHJcblxyXG4gICAgICAgICAgICAvLyB0b29sdG9wOlwi5pa55Z2X55qE54q25oCBXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc3RhdGljczp7XHJcbiAgICAgICAgQm94U3RhdGU6Qm94U3RhdGVcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdF9pdGVtID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwic2VsXCIpO1xyXG4gICAgICAgIHRoaXMudGl0bGVTaG93ID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiTGFiZWxcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICB1bnVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwieGlhb2h1aVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSAtMTAwMDAwO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcmV1c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNob25neW9uZ1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5jbGlja19hZGQoKTtcclxuICAgICAgICAvLyB0aGlzLnNwZWVkX3ggPSAyMDtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEJveEl0ZW06ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZighdGhpcy5ib3hJdGVtKXtcclxuICAgICAgICAgICAgdGhpcy5ib3hJdGVtID0gbmV3IEJveEl0ZW0oKTsgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja19hY3Rpb246ZnVuY3Rpb24oKXtcclxuICAgICAgICAvKlxyXG4gICAgICAgIOWPquacieWGjXBsYXnnirbmgIHkuIvmiY3og73ngrnlh7tcclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgIGlmKHBhbmVsLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5ICYmXHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi54K55Ye75LqGICAgXCIrXCJyYW5rPVwiK3RoaXMuYm94SXRlbS5yYW5rK1wicm93PVwiK3RoaXMuYm94SXRlbS5yb3cpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVsaW1pbmF0ZSA9IGNjLmZpbmQoXCJHYW1lL0VsaW1pbmF0ZVwiKS5nZXRDb21wb25lbnQoXCJFbGltaW5hdGVcIik7XHJcbiAgICAgICAgICAgIGVsaW1pbmF0ZS5jbGlja19pdGVtKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBib3hfZGVzdHJveTpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v5Yqo55S757uT5p2f5LmL5ZCO55qE5Zue6LCDXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pGn5q+B5Yqo55S75a6M5oiQXCIpO1xyXG5cclxuICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgcGFuZWwuYm94RHJvcF9kZXN0cm95KHRoaXMpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcmVzZXRPcmlnaW5Qb3M6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBib3hTcGVjaWFsbHlTaG93OmZ1bmN0aW9uICh0eXBlKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICAgICAgaWYodHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMTA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG5cclxuICAgICAgICAvL+WmguaenOaYr+ato+WcqOaOieiQveeahCDliLfmlrBlbmR5IOeahOWdkOagh1xyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcgfHxcclxuICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRGVzdHJveSl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzcGVlZF9uID0gdGhpcy5jdXJyZW50U3BlZWQgKyB0aGlzLmFjY19zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIGxldCBzID0gKHNwZWVkX24gKyB0aGlzLmN1cnJlbnRTcGVlZCApKjAuNSAqIGR0O1xyXG5cclxuICAgICAgICAgICAgICAgIHNwZWVkX24gPSBNYXRoLm1pbihzcGVlZF9uLHRoaXMuc3BlZWRNYXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSBzcGVlZF9uO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUueSA8PSB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOaOieiQveWIsOaMh+WumuS9jee9rueahOaXtuWAmeW8ueWKqOS4gOS4i1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5ib3hJdGVtLmFuaV9wb2ludC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi6ZyA6KaB5YGa5YGP56e75pON5L2cIOWIpOaWrVwiKTtcclxuICAgICAgICAgICAgLy8gbGV0IHBvaW50X2EgPSB0aGlzLmJveEl0ZW0uYW5pX3BvaW50XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWrei/meS4quS9jee9rueahHkg6ZyA6KaB5Zyo55qEeOeahOS9jee9rlxyXG4gICAgICAgICAgICAvLyBsZXQgcG9pbnRzID0gdGhpcy5ib3hJdGVtLmFuaV9wb2ludC5maWx0ZXIoZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gdGhpcy5ub2RlLnkgPCBlbGVtLnk7XHJcbiAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGFzdF9wb2ludCA9IHRoaXMuYm94SXRlbS5hbmlfcG9pbnRbMF07XHJcblxyXG4gICAgICAgICAgICBpZihsYXN0X3BvaW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ICE9PSBsYXN0X3BvaW50LnggJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IDwgbGFzdF9wb2ludC55KXtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm94SXRlbS5yYW5rID09PSA2ICYmIHRoaXMuYm94SXRlbS5yb3cgPT09IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi6L+Z5Liq5L2N572u5byC5bi4XCIgKyB0aGlzLmJveEl0ZW0uYW5pX3BvaW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGFzdF9wb2ludC5pc2xlZnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W3pui+ueeahOmAkuWHj1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMubm9kZS54IC0gdGhpcy5zcGVlZCowLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubm9kZS54IDw9IGxhc3RfcG9pbnQueCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT0956e76ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPs+i+ueeahOmAkuWinlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMubm9kZS54ICsgdGhpcy5zcGVlZCowLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubm9kZS54ID49IGxhc3RfcG9pbnQueCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT0956e76ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGFzdF9wb2ludC5pc2xlZnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W3pui+ueeahOmAkuWHj1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMubm9kZS54IC0gdGhpcy5zcGVlZCowLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubm9kZS54IDw9IGxhc3RfcG9pbnQueCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT0956e76ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPs+i+ueeahOmAkuWinlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMubm9kZS54ICsgdGhpcy5zcGVlZCowLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubm9kZS54ID49IGxhc3RfcG9pbnQueCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT0956e76ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCI9PT09XCIgKyBsYXN0X3BvaW50KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZihZSERlYnVnKXtcclxuICAgICAgICAgICAgdGhpcy50aXRsZVNob3cuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZVNob3cuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLmJveEl0ZW0ucmFuayArIFwiX1wiICsgdGhpcy5ib3hJdGVtLnJvdztcclxuICAgICAgICAgICAgaWYodGhpcy5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuV2hpdGUgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLllFTExPVyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5nZXRDb21wb25lbnQoY2MuTGFiZWwpLm5vZGUuY29sb3IgPSBjYy5Db2xvci5CTEFDSztcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZVNob3cuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5ub2RlLmNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA+IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54IC09IHRoaXMuc3BlZWQgKiBkdDtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBpZiAodGhpcy5ub2RlLnggPCB0aGlzLmJveEl0ZW0uYmVnaW5feCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuIiwiXHJcblxyXG5cclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcblxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva54XHJcbiAgICAgICAgYmVnaW5feDowLFxyXG4gICAgICAgIC8v5byA5aeL5o6J6JC955qE5L2N572ueVxyXG4gICAgICAgIGJlZ2luX3kgOiAwLFxyXG4gICAgICAgIC8v6KaB5oq16L6+55qE5L2N572uWVxyXG4gICAgICAgIGVuZF95IDogLTEwMDAsXHJcbiAgICAgICAgLy/mmL7npLrnmoTpopzoibJcclxuICAgICAgICBjb2xvcl90eXBlIDogQm94VHlwZS5XaGl0ZSxcclxuXHJcbiAgICAgICAgY29sb3Jfc2hvdzp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMuY29sb3JfdHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLldoaXRlOnJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuWUVMTE9XOnJldHVybiBjYy5Db2xvci5ZRUxMT1c7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkdyZWVuOnJldHVybiBjYy5Db2xvci5HUkVFTjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmx1ZTpyZXR1cm4gY2MuQ29sb3IuQkxVRTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmxhY2s6cmV0dXJuIGNjLkNvbG9yLkJMQUNLO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CYXJyaWVyOnJldHVybiBjYy5Db2xvci5SRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJsYW5rOiByZXR1cm4gY2MuQ29sb3IuV0hJVEU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpyZXR1cm4gY2MuQ29sb3IuQ1lBTjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6KGMXHJcbiAgICAgICAgcmFuayA6IDAsXHJcbiAgICAgICAgLy/liJdcclxuICAgICAgICByb3cgOiAwLFxyXG5cclxuXHJcbiAgICAgICAgLyrnp7vliqh555qE5L2N572uIOespuWQiOadoeS7tueahOimgeabtOaWsCB455qE5Z2Q5qCHXHJcbiAgICAgICAgKiDph4zpnaLmmK8ge3g6MCx5OjMsaXNsZWZ0OnRydWV9IOWtl+WFuOexu+Wei1xyXG4gICAgICAgICogKi9cclxuICAgICAgICBhbmlfcG9pbnQgOiBbXSxcclxuXHJcblxyXG4gICAgICAgIGlkOntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yYW5rLnRvU3RyaW5nKCkgKyB0aGlzLnJvdy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxyXG5cclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxudmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEdhbWVfU3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkdhbWVfU3RhdGU7XHJcbnZhciBCb3hUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgYm94X3ByZWZhYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jhbms6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi5YiX5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcm93OntcclxuICAgICAgICAgICAgZGVmYXVsdDoxMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuihjOaVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3VwZXJfbm9kZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIF9nYW1lU3RhdGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkdhbWVfU3RhdGUuU3RhcnQsXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnYW1lc3RhdGU6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVTdGF0ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2dhbWVTdGF0ZSAhPT0gdmFsdWUpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcEJlZm9yZSA9IHRoaXMuX2dhbWVTdGF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLlBsYXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlICBpZih2YWx1ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRlbXBCZWZvcmUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aYr+WImuWunuS+i+a4uOaIj+WujOS5i+WQjlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WIm+W7uumanOeijeeJqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJhcnJpZXJDYW52YXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0eXBlOkdhbWVfU3RhdGVcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlbW92ZUJ5VmFsdWUgPSBmdW5jdGlvbihhcnIsdmFsKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpPGFyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0gPT09IHZhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIC8vIEFycmF5LnByb3RvdHlwZS5maWx0ZXJSZXBlYXQgPSBmdW5jdGlvbigpeyAgXHJcbiAgICAgICAgLy8gICAgIC8v55u05o6l5a6a5LmJ57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIC8vICAgICBpZihhcnIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgLy8gICAgICAgICBhcnIucHVzaCh0aGlzWzBdKTtcclxuICAgICAgICAvLyAgICAgfVxyXG5cclxuICAgICAgICAvLyAgICAgZm9yKHZhciBpID0gMTsgaSA8IHRoaXMubGVuZ3RoOyBpKyspeyAgICAvL+S7juaVsOe7hOesrOS6jOmhueW8gOWni+W+queOr+mBjeWOhuatpOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WvueWFg+e0oOi/m+ihjOWIpOaWre+8miAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WmguaenOaVsOe7hOW9k+WJjeWFg+e0oOWcqOatpOaVsOe7hOS4reesrOS4gOasoeWHuueOsOeahOS9jee9ruS4jeaYr2kgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/pgqPkuYjmiJHku6zlj6/ku6XliKTmlq3nrKxp6aG55YWD57Sg5piv6YeN5aSN55qE77yM5ZCm5YiZ55u05o6l5a2Y5YWl57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIGlmKHRoaXMuaW5kZXhPZih0aGlzW2ldKSA9PSBpKXsgIFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGFyci5wdXNoKHRoaXNbaV0pOyAgXHJcbiAgICAgICAgLy8gICAgICAgICB9ICBcclxuICAgICAgICAvLyAgICAgfSAgXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBhcnI7ICBcclxuICAgICAgICAvLyB9ICBcclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1XaWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSAxMDA7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVNwYWNlID0gNTtcclxuXHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl90b3AgPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSArIHRoaXMuaXRlbUhlaWdodCp0aGlzLm51bV9yb3cgKyB0aGlzLml0ZW1TcGFjZSAqICh0aGlzLm51bV9yb3cgLSAxKSArIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl9ib3R0b20gPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSAtIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX3RvcCA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9ib3R0b20gPSAtKHRoaXMuc3VwZXJfbm9kZS5oZWlnaHQpKjAuNSArICB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG5cclxuICAgICAgICB0aGlzLm1hcmdpbl9sZWZ0ID0gIC10aGlzLml0ZW1XaWR0aCp0aGlzLm51bV9yYW5rKjAuNSArIHRoaXMuaXRlbVNwYWNlKih0aGlzLm51bV9yYW5rKjAuNS0xKTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9yaWdodCA9IHRoaXMuaXRlbVdpZHRoICogdGhpcy5udW1fcmFuayAqIDAuNSAtIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JhbmsgKiAwLjUgLSAxKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFzZHMgIFwiICsgdGhpcy5tYXJnaW5fdG9wK1wiICBcIit0aGlzLm1hcmdpbl9ib3R0b20pO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wgPSBuZXcgY2MuTm9kZVBvb2woXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAvKumanOeijeeJqeeahOaWueWdl+WIl+ihqCovXHJcbiAgICAgICAgdGhpcy5saXN0QmFycmllciA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnJlcGxheUdhbWUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/ph43mlrDlvIDlp4vmuLjmiI9cclxuICAgIHJlcGxheUdhbWU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlN0YXJ0O1xyXG5cclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnN1cGVyX25vZGUuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIHdoaWxlKGNoaWxkcmVuLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3hEcm9wX2Rlc3Ryb3koY2hpbGRyZW5baV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5riF56m6cmFua2xpc3RcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICB3aGlsZSAoaXRlbSA9IHRoaXMucmFua0xpc3Quc2hpZnQoKSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5riF56m65oiQPT09PT09PT09PeWKnz09PT09PVwiKTtcclxuXHJcbiAgICAgICAgLy/liJvlu7rmiYDmnInpnaLmnb/nmoTmlbDmja5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXg8dGhpcy5udW1fcmFuazsgaW5kZXgrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUmFua0NvbnRlbnQoaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBbGxCZWdpbk9yaWdpblkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8q5Yib5bu66Zqc56KN54mpIOW4g+WxgFxyXG4gICAgKiAxLuWcqOmanOeijeeJqeS4i+mdoueahOeJqeS9k+aKiuS7lua4heepulxyXG4gICAgKiAyLui/meS4quWIl+eahOaVsOmHj+ayoeacieWPmOi/mOaYr+i/meS6m+aVsOmHj1xyXG4gICAgKiAqL1xyXG4gICAgY3JlYXRlQmFycmllckNhbnZhczpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAzOyBpPHRoaXMubnVtX3JhbmstMzsgaSsrKXtcclxuICAgICAgICAvLyAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGxldCBib3ggPSBsaXN0WzddO1xyXG4gICAgICAgIC8vICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAvLyAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJhcnJpZXIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgbGV0IGJhcnJpZXJMaXN0ID0gW1xyXG5cclxuICAgICAgICAgICAge1wicm93XCI6NyxcInJhbmtcIjoyfSx7XCJyb3dcIjo2LFwicmFua1wiOjJ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjN9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjR9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjV9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjZ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjd9LHtcInJvd1wiOjYsXCJyYW5rXCI6N30sXHJcblxyXG5cclxuICAgICAgICAgICAge1wicm93XCI6MixcInJhbmtcIjoyfSx7XCJyb3dcIjozLFwicmFua1wiOjJ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjoyLFwicmFua1wiOjN9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjoyLFwicmFua1wiOjZ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjoyLFwicmFua1wiOjd9LHtcInJvd1wiOjMsXCJyYW5rXCI6N30sXHJcblxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAvL+WwhmJsYW5r5oyJcm935aSn5bCP5o6S5bqPIOS7juWwj+WIsOWkpyDlupXpg6jliLDpobbpg6gg5o6S5bqP5bqV6YOo5Yiw6aG26YOoXHJcbiAgICAgICAgYmFycmllckxpc3Quc29ydChmdW5jdGlvbiAoYSxiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhLnJvdyAtIGIucm93O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL+iuvue9ruaYryBiYXJyaWVy55qE5pa55Z2X57G75Z6LXHJcbiAgICAgICAgYmFycmllckxpc3QuZm9yRWFjaChmdW5jdGlvbihlbGUpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2VsZS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGJveCA9IGxpc3RbZWxlLnJvd107XHJcbiAgICAgICAgICAgIGlmKGJveCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0QmFycmllci5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hTcGVjaWFsbHlTaG93KEJveFR5cGUuQmFycmllcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLyrorr7nva7ov5nkuKpiYXJyaWVy5LiL55qE5pa55Z2XKi9cclxuICAgICAgICBiYXJyaWVyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbZWxlLnJhbmtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IG51bV9iID0gMDsgbnVtX2I8ZWxlLnJvdztudW1fYisrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/meS4quS9jee9ruiuvue9ruaIkOepuueZveWNoOS9jeS/oeaBr1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3RbbnVtX2JdO1xyXG4gICAgICAgICAgICAgICAgaWYoYm94ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveFNwZWNpYWxseVNob3coQm94VHlwZS5CbGFuayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuYmVnaW5CbGFua0ZpbGwoKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8q5byA5aeL56m65L2N5aGr5YWFKi9cclxuICAgIGJlZ2luQmxhbmtGaWxsOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLyrnnIvmmK/lkKbpnIDopoHliJvlu7og5pa55Z2XIOWOu+Whq+WFheWNoOS9jeaWueWdlyovXHJcblxyXG4gICAgICAgIGlmKHRoaXMubGlzdEJhcnJpZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8v5rKh5pyJ6Zqc56KN54mpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v57uZ6L+Z5Liq6Zqc56KN54mp5LiL6Z2i6KGl5YWF5pa55Z2XXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpc3RCYXJyaWVyLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLmxpc3RCYXJyaWVyW2ldO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ibGFua0NoZWNrUmVwbGFjZUJsYW5rQXZhaWxhYmxlKGJveCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyrmo4DmtYvmmK/lkKblj6/ku6Xmm7/mjaJcclxuICAgICogYm94X2Mg6L+Z5Liq6KaB5pON5L2c55qE5pa55Z2X57G75Z6LICDmmK8g6Zqc56KN54mpXHJcbiAgICAqICovXHJcbiAgICBibGFua0NoZWNrUmVwbGFjZUJsYW5rQXZhaWxhYmxlIDogZnVuY3Rpb24gKGJveCkge1xyXG5cclxuICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgaWYoYm94X2MuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJhcnJpZXIpe1xyXG4gICAgICAgICAgICAvL+aYr+manOeijeeJqVxyXG5cclxuICAgICAgICAgICAgLy/ov5nkuKrpmpznoo3niannmoTovrnnlYzkuKTovrkg54mp5L2T5pivIOi+ueeVjCDjgIHpmpznoo3nianjgIHmlrnlnZdcclxuICAgICAgICAgICAgbGV0IGJveF9sZWZ0ID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmstMV1bYm94X2MuYm94SXRlbS5yb3ddO1xyXG4gICAgICAgICAgICBsZXQgYm94X1JpZ2h0ID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmsrMV1bYm94X2MuYm94SXRlbS5yb3ddO1xyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuXHJcbiAgICAgICAgICAgIC8v5aaC5p6c6L+Z5Liq6Zqc56KN54mpIOS4iiDlt6Yg5Y+zIOmDveacieWFtuS7lueahOmanOeijeeJqSDov5nkuKrpmpznoo3niankuI3lgZrlpITnkIYg55Sx5LuW5LiK5pa55o6J6JC955qE5pa55Z2X5aSE55CGXHJcbiAgICAgICAgICAgIC8vIGxldCBoYXZlUmlnaHQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgZm9yKGxldCBpID0gYm94X2MuYm94SXRlbS5yYW5rKzE7IGkgPCB0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtpXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJhcnJpZXIpe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSkoKTtcclxuICAgICAgICAgICAgLy8gbGV0IGhhdmVMZWZ0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gICAgIGZvcihsZXQgaSA9IGJveF9jLmJveEl0ZW0ucmFuay0xOyBpID49IDA7IGktLSl7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2ldW2JveF9jLmJveEl0ZW0ucm93XTtcclxuICAgICAgICAgICAgLy8gICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKSgpO1xyXG4gICAgICAgICAgICAvLyBsZXQgaGF2ZVRvcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBmb3IobGV0IGkgPSBib3hfYy5ib3hJdGVtLnJvdysxOyBpIDwgdGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmtdW2ldO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CYXJyaWVyKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB9LmJpbmQodGhpcykpKCk7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIGlmKGhhdmVMZWZ0ICYmIGhhdmVSaWdodCAmJmhhdmVUb3Ape1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCLov5nkuKrkuInpnaLpg73mnInpmpznoo3niakgXCIrYm94X2MuYm94SXRlbS5yYW5rICtcIiAgXCIrIGJveF9jLmJveEl0ZW0ucm93KTtcclxuICAgICAgICAgICAgLy8gICAgIC8vIHJldHVybjtcclxuICAgICAgICAgICAgLy8gfWVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG5cclxuICAgICAgICAgICAgaWYoYm94X2JvdHRvbSAhPT0gdW5kZWZpbmVkICYmIGJveF9ib3R0b20uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICAgICAgLy/ov5nkuKrlupXpg6jmmK/nqbrnmoQg5Y+v5Lul5aGr5YWF5pa55Z2XXHJcblxyXG4gICAgICAgICAgICAgICAgLy/loavlhYXlhYgg5bem5YaN5Y+zXHJcbiAgICAgICAgICAgICAgICBpZihib3hfUmlnaHQgIT09IHVuZGVmaW5lZCAmJiBib3hfUmlnaHQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lj7PovrnkvY3nva7mjonokL3loavlhYVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuWPs+i+ueS9jee9riDlvoDlt6bovrnloavlhYXmjonokL3loavlhYVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5Y+m5aSW6L6555WM55qE6YKj5Liq6Zqc56KN54mpXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVkZ2VPdGhlckJveCA9IHRoaXMuYmxhbmtHZXRCb3JkZXJCYXJyaWVyQm94KGJveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v56e76ZmkIOW3pui+uei/meS4quimgeWIoOmZpOeahCDmm7TmlrDmlrDnmoTmlrnlnZfnmoTlvIDlp4vkvY3nva7kv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVtb3ZlSXRlbUF0UmFuayhib3hfUmlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruimgeabv+aNoueahOS9jee9rlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b20sYm94X1JpZ2h0LGVkZ2VPdGhlckJveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtDaGVja1JlcGxhY2VCbGFua0F2YWlsYWJsZShib3gpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihib3hfbGVmdCAhPT0gdW5kZWZpbmVkICYmIGJveF9sZWZ0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5bem6L655L2N572u5o6J6JC95aGr5YWFXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLlt6bovrnkvY3nva7mjonokL3loavlhYUg5b6A5Y+z6L655aGr5YWF5o6J6JC95aGr5YWFXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+WPpuWklui+ueeVjOeahOmCo+S4qumanOeijeeJqVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZGdlT3RoZXJCb3ggPSB0aGlzLmJsYW5rR2V0Qm9yZGVyQmFycmllckJveChib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+enu+mZpCDlt6bovrnov5nkuKropoHliKDpmaTnmoQg5pu05paw5paw55qE5pa55Z2X55qE5byA5aeL5L2N572u5L+h5oGvXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlbW92ZUl0ZW1BdFJhbmsoYm94X2xlZnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruimgeabv+aNoueahOS9jee9rlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b20sYm94X2xlZnQsZWRnZU90aGVyQm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua0NoZWNrUmVwbGFjZUJsYW5rQXZhaWxhYmxlKGJveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+aIluiAhei/meS4qumanOeijeeJqeebuOmCu+WcqOS4gOi1tyDlj6blpJbkuIDovrnnmoTpmpznoo3nialcclxuICAgIGJsYW5rR2V0Qm9yZGVyQmFycmllckJveDpmdW5jdGlvbiAoYm94KSB7XHJcblxyXG4gICAgICAgIGxldCBlZGdlX2I7Ly8gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIGxldCByb3cgPSBib3hfYy5ib3hJdGVtLnJvdztcclxuICAgICAgICBsZXQgcmFuayA9IGJveF9jLmJveEl0ZW0ucmFuaztcclxuXHJcbiAgICAgICAgLy/liKTmlq3ov5nkuKrmlrnlnZfnmoTlj7PovrnmnInmsqHmnIlcclxuICAgICAgICBmb3IobGV0IGkgPSByYW5rKzE7IGkgPCB0aGlzLm51bV9yYW5rOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2ldW3Jvd107XHJcbiAgICAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgIGVkZ2VfYiA9IGI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy/lt6bovrlcclxuICAgICAgICBmb3IobGV0IGogPSByYW5rLTE7IGogPj0gMDsgai0tKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtqXVtyb3ddO1xyXG4gICAgICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfWVsc2UgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICBlZGdlX2IgPSBiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlZGdlX2IgIT09IHVuZGVmaW5lZCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWRnZV9yYW5rID0gZWRnZV9iLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLnJhbms7XHJcbiAgICAgICAgICAgIGxldCBlZGdlX3JvdyA9IGVkZ2VfYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5yb3c7XHJcblxyXG4gICAgICAgICAgICAvL+W6leS4i1xyXG4gICAgICAgICAgICBmb3IobGV0IGsgPSBlZGdlX3Jvdy0xOyBrID49IDA7IGstLSl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJiID0gdGhpcy5yYW5rTGlzdFtlZGdlX3JhbmtdW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYoYmIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGJiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlX2IgPSBiYjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVkZ2VfYjtcclxuICAgIH0sXHJcblxyXG4gICAgLyrmo4DmtYvmmK/lkKblj6/ku6Xmm7/mjaJcclxuICAgICAqIGJveF9jIOi/meS4quimgeaTjeS9nOeahOaWueWdl+exu+WeiyAg5pivIOaWueWdl1xyXG4gICAgICogKi9cclxuICAgIGJsYW5rQ2hlY2tSZXBsYWNlTm9ybWFsQXZhaWxhYmxlIDogZnVuY3Rpb24gKGJveCxlZGdlT3RoZXJCb3gpe1xyXG5cclxuICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgIC8v5piv5pa55Z2XXHJcblxyXG4gICAgICAgICAgICAvL+i/meS4quaWueWdl+eahCDlt6bkuIvmlrkg5Y+z5LiL5pa5IOato+S4i+aWuSDliKTmlq3mmK/lkKbmmK/nqbrkvY1cclxuICAgICAgICAgICAgbGV0IGJveF9ib3R0b21fbGVmdCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rLTFdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbV9SaWdodCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rKzFdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbV96aGVuZyA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgICAgICAgICAgaWYoYm94X2JvdHRvbV96aGVuZyAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICBib3hfYm90dG9tX3poZW5nLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKSB7XHJcbiAgICAgICAgICAgICAgICAvL+ato+S4i+aWueaYr+epuueahCDlvoDmraPkuIvmlrkg5pu/5o2iXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuato+S4i+aWueaYr+epuueahCDlvoDmraPkuIvmlrkg5pu/5o2iXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbV96aGVuZyxib3gsZWRnZU90aGVyQm94KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoYm94X2JvdHRvbV9sZWZ0ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIGJveF9ib3R0b21fbGVmdC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICAvL+W3puS4i+aWueaYr+epuueahCDlvoDlt6bkuIvmlrkg5pu/5o2iXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuW3puS4i+aWuVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b21fbGVmdCxib3gsZWRnZU90aGVyQm94KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoYm94X2JvdHRvbV9SaWdodCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICBib3hfYm90dG9tX1JpZ2h0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgIC8v5Y+z5LiL5pa55piv56m655qEIOW+gOWPs+S4i+aWuSDmm7/mjaJcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5Y+z5LiL5pa5XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbV9SaWdodCxib3gsZWRnZU90aGVyQm94KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8q5pu/5o2i5pa55Z2XIOW5tuaJp+ihjOabv+aNouWIh+aNoueahOWKqOeUu+aViOaenCovXHJcbiAgICBibGFua1JlcGxhY2VCb3ggOmZ1bmN0aW9uIChib3hCbGFuayxib3hSZXBsYWNlLGVkZ2VPdGhlckJveCl7XHJcblxyXG4gICAgICAgIGxldCBib3hfcmUgPSBib3hSZXBsYWNlLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgbGV0IGJveF9ibCA9IGJveEJsYW5rLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG5cclxuICAgICAgICAvL+iuvue9rnjnmoTkvY3nva7lj5jljJbnmoTml7blgJkg54K5XHJcbiAgICAgICAgLy8gbGV0IHJlcGVhdExpc3QgPSBib3hfcmUuYm94SXRlbS5hbmlfcG9pbnQuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gZWxlbS54ID09PSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAvL+imgeWPluacgOWQjuS4gOS4quS9jee9riDmnaXliKTmlq3ov5nkuKrliqjnlLvmmK/lpJ/mt7vliqDov4dcclxuICAgICAgICBsZXQgbGFzdFBvaW50ID0gYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50W2JveF9yZS5ib3hJdGVtLmFuaV9wb2ludC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgLy/lrZjlgqjliqjnlLvnmoToioLngrlcclxuICAgICAgICBsZXQgaXNsZWZ0ID0gYm94X2JsLmJveEl0ZW0uYmVnaW5feCA8IGJveF9yZS5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgaWYobGFzdFBvaW50ID09PSB1bmRlZmluZWQgfHwgbGFzdFBvaW50LnggIT09IGJveF9ibC5ib3hJdGVtLmJlZ2luX3gpe1xyXG4gICAgICAgICAgICBib3hfcmUuYm94SXRlbS5hbmlfcG9pbnQucHVzaCh7XCJ4XCI6IGJveF9ibC5ib3hJdGVtLmJlZ2luX3gsIFwieVwiOiBib3hfYmwuYm94SXRlbS5lbmRfeSArIGJveF9ibC5ub2RlLmhlaWdodCxcImlzbGVmdFwiOmlzbGVmdH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLmJlZ2luX3ggPSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLmVuZF95ID0gYm94X2JsLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgIC8vIGxldCB0ZW1wX3JhbmsgPSBib3hfcmUuYm94SXRlbS5yYW5rO1xyXG5cclxuICAgICAgICBib3hfcmUuYm94SXRlbS5yb3cgPSBib3hfYmwuYm94SXRlbS5yb3c7XHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0ucmFuayA9IGJveF9ibC5ib3hJdGVtLnJhbms7XHJcblxyXG4gICAgICAgIC8v6L+Z5Liq5pa55Z2X57un57ut5b6A5LiL5pu/5o2iXHJcbiAgICAgICAgaWYodGhpcy5ibGFua0NoZWNrUmVwbGFjZU5vcm1hbEF2YWlsYWJsZShib3hSZXBsYWNlLGVkZ2VPdGhlckJveCkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuenu+WKqOWujOaIkCDmm7/mjaI9PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgLy/ljaDkvY3nmoTmlrnlnZcg5L2N572u5pu/5o2i5oiQ6KaB56e75YWl55qE5pa55Z2XICDnp7vpmaTov5nkuKrljaDkvY3mlrnlnZdcclxuICAgICAgICAgICAgdGhpcy5yYW5rTGlzdFtib3hfYmwuYm94SXRlbS5yYW5rXVtib3hfYmwuYm94SXRlbS5yb3ddID0gYm94UmVwbGFjZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94X2JsLm5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8v5ZCO6Z2i6YGN5Y6G55qE5pe25YCZ5oqK5LuW56e76Zmk5o6JXHJcbiAgICAgICAgLy90aGlzLnJhbmtMaXN0W3RlbXBfcmFua10ucmVtb3ZlQnlWYWx1ZSh0aGlzLnJhbmtMaXN0W3RlbXBfcmFua10sYm94UmVwbGFjZSk7XHJcblxyXG5cclxuICAgICAgICAvLyBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgICAgIC8vIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIGJsYW5rUmVtb3ZlSXRlbUF0UmFuazpmdW5jdGlvbiAoYm94UmVtb3ZlKSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfcmUgPSBib3hSZW1vdmUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94X3JlLmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94UmVtb3ZlKTtcclxuXHJcbiAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLnVwZGF0ZVJhbmtFbmRZSW5kZXgoYm94X3JlLmJveEl0ZW0ucmFuayk7XHJcblxyXG4gICAgICAgIGlmKG5ld19ib3ggIT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/ku5bmnKzouqvmmK/mnIDlkI7kuIDkuKog6Lef5YCS5pWw56ys5LqM5Liq5a+55q+UXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RfYm94ID0gbGlzdFtsaXN0Lmxlbmd0aC0yXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihsYXN0X2JveCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gbGFzdF9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmJlZ2luX3kgKyBib3hfYy5ub2RlLmhlaWdodCArIDEwKmxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgc3BhY2VfdG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL+aYr+imgeaOieiQveeahFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuXHJcblxyXG4gICAgLy/liJvlu7rmr4/kuIDliJfnmoTmlbDmja5cclxuICAgIGNyZWF0ZVJhbmtDb250ZW50OmZ1bmN0aW9uKGluZGV4KXtcclxuXHJcbiAgICAgICAgbGV0IHJhbmtfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuICAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubnVtX3JvdzsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgIGJveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIGJveC5oZWlnaHQgPSB0aGlzLml0ZW1IZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvdW50ID0gQm94VHlwZS5UeXBlQ291bnQ7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9IChjYy5yYW5kb20wVG8xKCkqY291bnQpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgcmFua19saXN0LnB1c2goYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QucHVzaChyYW5rX2xpc3QpO1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5omA5pyJ5YiXIGVuZCB555qE5pWw5o2uXHJcbiAgICB1cGRhdGVBbGxSYW5rRW5kWTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAvL+eci+ivpeWIl+eahOaVsOmHj+aYr+WQpiDlsI/kuo4gdGhpcy5udW1fcm93ICDlsJHkuo7nmoTor53liJnooaXlhYVcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJhbmtFbmRZSW5kZXgoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyrmm7TmlrDmn5DliJfnmoTmlbDmja4qL1xyXG4gICAgdXBkYXRlUmFua0VuZFlJbmRleDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCBjcmVhdGVCb3ggPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuXHJcbiAgICAgICAgbGV0IGxpc3Rfc3ViID0gdGhpcy5yYW5rTGlzdFtpbmRleF07XHJcblxyXG4gICAgICAgIHdoaWxlKGxpc3Rfc3ViLmxlbmd0aCA8IHRoaXMubnVtX3Jvdyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3X2JveCA9IHRoaXMuYm94RHJvcF9nZXQoKTtcclxuICAgICAgICAgICAgbmV3X2JveC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBuZXdfYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIG5ld19ib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmluaXRCb3hJdGVtKCk7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSAwO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgIG5ld19ib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgbGlzdF9zdWIucHVzaChuZXdfYm94KTtcclxuXHJcblxyXG4gICAgICAgICAgICBjcmVhdGVCb3ggPSBuZXdfYm94O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxldCBlbmRfYm94X3kgPSB0aGlzLm1hcmdpbl9ib3R0b207XHJcblxyXG4gICAgICAgIC8v5pu05paw5q+P5Liq5YWD57Sg55qEZW5kIHkg5L2N572uXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8bGlzdF9zdWIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gbGlzdF9zdWJbaV07XHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IGl0ZW1fYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKmk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJveDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw5q+P5LiA5YiX5LuW5Lus5Lit55qE5q+P5Liq5YWD57Sg55qE5Yid5aeL55qEb3JpZ2luIHnnmoTlgLxcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQWxsQmVnaW5PcmlnaW5ZOmZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOafkOS4gOWIl+S4rSDku47mnIDlkI7lvIDlp4vpgY3ljobov5Tlm55cclxuICAgICAgICAgKiDnrpflh7rlvIDlp4vmjonkuobnmoTkvY3nva5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpiDlt7Lovr7liLDku5bnmoRlbmR5IOWmguaenOi/mOacqui+vuWIsOWwseaYryDmraPopoHmjonokL1cclxuICAgICAgICAgICAgbGV0IG9mZl90b3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VfdG9wID0gNTtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvL2JveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiAxLuWunuS+i+a4uOaIj+eahOaXtuWAmSDliJ3lp4vlvIDlp4vnmoTkvY3nva5cclxuICAgICAgICAgICAgICAgICAgICAgKiAyLua2iOmZpOeahCDmlrnlnZfkuI3lnKjnlYzpnaLkuK3nmoTorr7nva7ku5bnmoTlvIDlp4vkvY3nva4g5bey5Zyo55WM6Z2i5Lit55qE5LiN5Y676K6+572u5LuWXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB8fCAoYm94X2Mubm9kZS55ID49IGJveF9jLmJveEl0ZW0uYmVnaW5feSkpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgb2ZmX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSBvZmZfdG9wICsgYm94X2Mubm9kZS5oZWlnaHQgKyBzcGFjZV90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZV90b3AgPSBzcGFjZV90b3AgKyAxMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5piv6KaB5o6J6JC955qEXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/kuqTmjaLkuKTkuKrmlrnlnZfnmoTkvY3nva5cclxuICAgIGV4Y2hhbmdlQm94SXRlbTpmdW5jdGlvbihib3gxLGJveDIsdG9DaGVja1ZpYWJsZSA9IHRydWUpe1xyXG5cclxuICAgICAgICBsZXQgYm94SXRlbTEgPSBib3gxLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICBsZXQgYm94SXRlbTIgPSBib3gyLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgaWYoYm94SXRlbTEucmFuayA9PT0gYm94SXRlbTIucmFuayl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA5YiX55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2VuZHkgPSBib3hJdGVtMi5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTIuZW5kX3kgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTEuZW5kX3kgPSB0ZW1wX2VuZHk7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcm93ID0gYm94SXRlbTIucm93O1xyXG5cclxuICAgICAgICAgICAgYm94SXRlbTIucm93ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yb3cgPSB0ZW1wX3JvdzsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0W2JveEl0ZW0xLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTEucm93XSA9IGxpc3RbYm94SXRlbTIucm93XTtcclxuICAgICAgICAgICAgbGlzdFtib3hJdGVtMi5yb3ddID0gdGVtcF9ub2RlO1xyXG5cclxuXHJcblxyXG4gICAgICAgIH1lbHNlIGlmKGJveEl0ZW0xLnJvdyA9PT0gYm94SXRlbTIucm93KXtcclxuICAgICAgICAgICAgLy/lkIzkuIDooYznmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QxID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QyID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMi5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2JlZ2lueCA9IGJveEl0ZW0yLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmJlZ2luX3ggPSBib3hJdGVtMS5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5iZWdpbl94ID0gdGVtcF9iZWdpbng7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcmFuayA9IGJveEl0ZW0yLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJhbmsgPSBib3hJdGVtMS5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yYW5rID0gdGVtcF9yYW5rO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd19pbmRleCA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgbGV0IHRlbXBfbm9kZSA9IGxpc3QxW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QxW3Jvd19pbmRleF0gPSBsaXN0Mltyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0Mltyb3dfaW5kZXhdID0gdGVtcF9ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodG9DaGVja1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXNWaWFibGUgPSB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFpc1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/kuI3lj6/mtojpmaTnmoTor50g5L2N572u5YaN5LqS5o2i5Zue5p2lXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4jeWPr+a2iOmZpFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4Y2hhbmdlQm94SXRlbShib3gyLGJveDEsZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+ajgOa1i+mdouadv+aJgOacieaWueWdlyDmmK/lkKblj6/mtojpmaRcclxuICAgIGNoZWNrUGFuZWxFbGltaW5hdGFibGU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IHdpcGVfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAvL+WIpOaWreWIlyDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZW1wTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcHJlX2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAvKuminOiJsuebuOWQjCDlubbkuJTmmK/mma7pgJrnsbvlnovnmoTpopzoibLnmoTml7blgJkqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9wcmUuY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcm93LTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkod2lwZV9saXN0LHRlbXBMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc1JlcGVhdEl0ZW1JbldpcGUoaXRlbSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8d2lwZV9saXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHdpcGVfbGlzdFtpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uaWQgPT09IGl0ZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+WIpOaWreihjCDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3Jhbms7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5yYW5rTGlzdFtqXVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9wcmUuY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcmFuay0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc1JlcGVhdEl0ZW1JbldpcGUoZWxlbSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXBlX2xpc3QucHVzaChlbGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+a4heepuuaVsOe7hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmKHdpcGVfbGlzdC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93RGVsYXlBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAvL+S4jeaYvuekuua2iOmZpOWKqOeUu1xyXG4gICAgICAgICAgICAgICAgc2hvd0RlbGF5QW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvL+S4jeaYr+WIneWni+WMlueahCDlgZznlZnkuIDkvJrlhL/lho3mtojpmaQg6K6p55So5oi355yL5Yiw6KaB5raI6Zmk5LqG5LuA5LmI5Lic6KW/XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgICAgICAgICAvLyB3aXBlX2xpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gbGV0IGJveCA9IGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBib3guc3RhdGVfYiA9IEJveFN0YXRlLkVEZXN0cm95O1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuYm94RHJvcF9kZXN0cm95KGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aXBlX2xpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guc3RhdGVfYiA9IEJveFN0YXRlLkVEZXN0cm95O1xyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDov5novrnkuIDkuKrlu7bov59cclxuICAgICAgICAgICAgICAgICDlpoLmnpzmuLjmiI/mmK8g5Yid5aeL5YyW55qE6K+d5LiN5bu26L+fXHJcbiAgICAgICAgICAgICAgICAg5LiN5piv5Yid5aeL5YyWIHN0YXJ055qEIOimgeetiemUgOavgeWKqOeUu+WujOaIkOS5i+WQjuWGjeW8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/mnInplIDmr4HlnKjmjonokL1cclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSAhPT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5q2j5Zyo5o6J6JC95aGr5YWFXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5GaWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBbGxSYW5rRW5kWSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwodGhpcy5nYW1lc3RhdGUgIT09IEdhbWVfU3RhdGUuU3RhcnQpPzAuMzowLGZhbHNlKTtcclxuXHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksc2hvd0RlbGF5QW5pbWF0aW9uPzAuMzowLGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlBsYXk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgYm94RHJvcF9nZXQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IGJveCA9IG51bGw7XHJcbiAgICAgICAgaWYodGhpcy5ib3hQb29sLnNpemUoKSA+IDApe1xyXG4gICAgICAgICAgICBib3ggPSB0aGlzLmJveFBvb2wuZ2V0KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGJveCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm94X3ByZWZhYik7XHJcbiAgICAgICAgICAgIGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICB9LFxyXG5cclxuICAgIGJveERyb3BfZGVzdHJveTpmdW5jdGlvbihib3gpe1xyXG5cclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wucHV0KGJveC5ub2RlKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyrmmK/lkKblvIDlkK/osIPor5UqL1xyXG4gICAgZ2FtZVNob3dEZWJ1Z01lc3NhZ2U6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBZSERlYnVnID0gIVlIRGVidWc7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmlsbEludGVydmFsID09PSAxMCl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT095a6a5pe25byA5aeL5Yik5pat5piv5ZCm6YO95bey5o6J6JC95Yiw5bqV6YOo5LqGIGJlZ2luID09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3pg73liLAg5o6J6JC95Yiw5bqV6YOo5LqGIOajgOa1i+aYr+WQpuWPr+a2iOmZpCBlbmQgPT09PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG4vLyB2YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBfc2VsZWN0X2JveDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6YCJ5Lit5p+Q5Liq5pa55Z2XXHJcbiAgICAgICAgc2VsZWN0X2JveDoge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RfYm94O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdF9ib3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9uZXcgPSB2YWx1ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fb2xkID0gdGhpcy5fc2VsZWN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJveEl0ZW1fbmV3LmlkICE9PSBib3hJdGVtX29sZC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIueci+aYr+WQpuimgeS6pOS6kuS9jee9riDov5jmmK/or7TliIfmjaLliLDov5nkuKrpgInkuK3nmoTkvY3nva7lpITnkIZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQxID0gXCIgKyBib3hJdGVtX25ldy5pZCArIFwiICBpZDI9IFwiICsgYm94SXRlbV9vbGQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aXp+eahOWPlua2iOmAieaLqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94LnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0odmFsdWUsIHRoaXMuX3NlbGVjdF9ib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLkuI3mmK/nm7jov5HnmoQg5Y+W5raI5LiK5LiA5Liq6YCJ5oupIOmAieS4reaWsOeCueWHu+eahFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumAieS4reS6huWQjOS4gOS4qiDlj5bmtojpgInmi6lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgbGV0IGJveEl0ZW0gPSBjbGlja19ub2RlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgLy8gIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLmJveERyb3BfZGVzdHJveShjbGlja19ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gIC8v5LiK6Z2i55qE5o6J5LiL5p2lXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLnVwZGF0ZVJhbmtFbmRZKGJveEl0ZW0ucmFuayk7XHJcblxyXG5cclxuICAgICAgICAgdGhpcy5zZWxlY3RfYm94ID0gY2xpY2tfbm9kZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxyXG5cclxuXHJcbi8v5piv5ZCm5byA5ZCv6LCD6K+VXHJcbndpbmRvdy5ZSERlYnVnID0gdHJ1ZTtcclxuIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG5cclxuICAgICAgICBsYWJfc2hvdzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgb2NDYWxsSnM6ZnVuY3Rpb24gKHN0cikge1xyXG5cclxuICAgICAgICB0aGlzLmxhYl9zaG93Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJfc2hvdy5zdHJpbmcgPSBzdHI7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubGFiX3Nob3cubm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgfSw1KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGpzQ2FsbE9jOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy/nsbvlkI0g5pa55rOVICDlj4LmlbAxIOWPguaVsDIg5Y+C5pWwM1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBqc2IucmVmbGVjdGlvbi5jYWxsU3RhdGljTWV0aG9kKFwiSlNCTWFuYWdlclwiLFwieWhKU0JDYWxsOlwiLFwianPov5novrnkvKDlhaXnmoTlj4LmlbBcIik7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwianNfY2FsbF9vYyA9PT09PT09PT0gJUBcIixyZXN1bHQpO1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMub2NDYWxsSnMoXCLmtYvor5Ug5pi+56S66ZqQ6JePXCIpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxyXG5cclxuLyrmlrnlnZfnmoTnsbvlnosqL1xyXG5jb25zdCBCb3hUeXBlID0gY2MuRW51bSh7XHJcbiAgICBZRUxMT1cgOiAtMSxcclxuICAgIEdyZWVuIDogLTEsXHJcbiAgICBCbHVlIDogLTEsXHJcbiAgICBCbGFjayA6IC0xLFxyXG4gICAgV2hpdGUgOiAtMSxcclxuXHJcbiAgICBUeXBlQ291bnQgOiAtMSxcclxuXHJcbiAgICBCYXJyaWVyIDogLTEsICAgICAgIC8v6Zqc56KN54mpXHJcbiAgICBCbGFuayA6IC0xLCAgICAgICAgICAvL+epuueZveWNoOS9jVxyXG5cclxuICAgIENvdW50IDogLTFcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG4vL+aWueWdl+aOieiQveeahOeKtuaAgVxyXG5jb25zdCBCb3hTdGF0ZSA9IGNjLkVudW0oe1xyXG5cclxuICAgIC8vIEVOb25lIDogLTEsICAgICAgLy/ku4DkuYjpg73kuI3mmK9cclxuXHJcbiAgICBFTm9ybWFsIDogLTEsICAgIC8v5q2j5bi4XHJcbiAgICBFRmFsbGluZyA6IC0xLCAgIC8v5o6J6JC9XHJcbiAgICBFRmFsbGVkIDogLTEsICAgIC8v5o6J6JC957uT5p2fXHJcbiAgICBFRGVzdHJveSA6IC0xLCAgIC8v6ZSA5q+BXHJcblxyXG59KTtcclxuXHJcbi8v5pa55Z2X5pi+56S655qE54q25oCBXHJcbmNvbnN0IEJveFNob3dUeXBlID0gY2MuRW51bSh7XHJcblxyXG4gICAgS19Ob3JtYWwgOiAtMSwgICAgICAgICAgLy/mraPluLhcclxuICAgIEtfU2VsZWN0IDogLTEsICAgICAgICAgIC8v6YCJ5LitXHJcblxyXG4gICAgS19Ta2lsbEFyb3VuZCA6IC0xLCAgICAgICAvL+mUgOavgSDlkajovrnnmoTkuZ3kuKpcclxuICAgIEtfU2tpbGxSYW5rIDogLTEsICAgICAgICAgLy/plIDmr4Eg6K+l5YiXXHJcbiAgICBLX1NraWxsUmF3IDogLTEsICAgICAgICAgIC8v6ZSA5q+BIOivpeihjFxyXG4gICAgS19Ta2lsbENvbG9yIDogLTEsICAgICAgICAvL+mUgOavgSDor6XoibJcclxufSk7XHJcblxyXG5cclxuXHJcbi8v5ri45oiP6L+b6KGM55qE54q25oCBXHJcbnZhciBHYW1lX1N0YXRlID0gY2MuRW51bSh7XHJcbiAgICBTdGFydCA6IC0xLCAgICAgLy/lvIDlp4vlrp7kvotcclxuICAgIEZpbGxpbmc6IC0xLCAgICAvL+aWueWdl+ihpem9kOS4rSDmjonokL3kuK1cclxuICAgIC8vIEJsYW5rRmlsbGluZyA6IC0xLCAvL+epuuS9jeihpeWFhSDoh6rliqjmjonokL1cclxuICAgIFBsYXkgOiAtMSwgICAgICAvL+i/m+ihjOS4rVxyXG4gICAgT3ZlciA6IC0xLCAgICAgIC8v57uT5p2fXHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gICAgQm94U3RhdGUsXHJcbiAgICBCb3hTaG93VHlwZSxcclxuICAgIEdhbWVfU3RhdGUsXHJcbiAgICBCb3hUeXBlXHJcblxyXG59OyJdLCJzb3VyY2VSb290IjoiIn0=