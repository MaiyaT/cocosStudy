require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BoxDrop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '89bc7CJRGxJBZsOHDnUjDFu', 'BoxDrop');
// script/BoxDrop.js

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

        this.boxItem.ani_point = [];
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
            // let point_a = this.boxItem.blank_move_point

            //判断这个位置的y 需要在的x的位置
            // let points = this.boxItem.blank_move_point.filter(function(elem){
            //     return this.node.y < elem.y;
            // }.bind(this));

            var last_point = this.boxItem.ani_point[0];

            if (last_point !== undefined && this.node.x !== last_point.x && this.node.y < last_point.y) {

                // this.node.x = last_point.x;
                // this.boxItem.blank_move_point.shift();//删除第一个元素

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
// script/BoxItem.js

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
// script/BoxPanel.js

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

                    // let tempBefore = this._gameState;
                    //
                    // if(tempBefore === Game_State.Start){
                    //     //是刚实例游戏完之后
                    //     //创建障碍物
                    //     this.createBarrierCanvas();
                    // }

                    this._gameState = value;

                    if (value === Game_State.Play) {
                        //开始掉落
                        this.updateAllBeginOriginY();
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

        this.createBarrierCanvas();

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

        /*  清空数组*/
        this.listBarrier.splice(0, this.listBarrier.length);

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

        this.blankBeginFill();

        this.checkPanelEliminatable();
    },

    /*开始空位填充*/
    blankBeginFill: function blankBeginFill() {

        /*看是否需要创建 方块 去填充占位方块*/

        if (this.listBarrier.length === 0) {
            //没有障碍物
            return;
        }

        /*空缺的方块*/
        var listBlank = [];

        //遍历出场景中所有的空位方块
        // for(let b_i = 0; b_i < this.num_row; b_i++){
        for (var b_i = 0; b_i < this.num_row; b_i++) {
            for (var b_j = 0; b_j < this.num_rank; b_j++) {
                var box = this.rankList[b_j][b_i];
                if (box !== undefined && box.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                    //这个位置是空缺的
                    listBlank.push(box);
                }
            }
        }

        var listBlankRightToLeft = listBlank.slice(0);
        var listBlankLeftToRight = listBlank.slice(0);

        //对blank排序 从上到下 从右往左
        listBlankRightToLeft.sort(function (boxa, boxb) {
            if (boxa.getComponent("BoxDrop").boxItem.row === boxb.getComponent("BoxDrop").boxItem.row) {
                return boxb.getComponent("BoxDrop").boxItem.rank - boxa.getComponent("BoxDrop").boxItem.rank;
            } else {
                return boxb.getComponent("BoxDrop").boxItem.row - boxa.getComponent("BoxDrop").boxItem.row;
            }
        });
        //对blank排序 从上到下 从左往右
        listBlankLeftToRight.sort(function (boxa, boxb) {
            if (boxa.getComponent("BoxDrop").boxItem.row === boxb.getComponent("BoxDrop").boxItem.row) {
                return boxa.getComponent("BoxDrop").boxItem.rank - boxb.getComponent("BoxDrop").boxItem.rank;
            } else {
                return boxb.getComponent("BoxDrop").boxItem.row - boxa.getComponent("BoxDrop").boxItem.row;
            }
        });

        if (listBlank.length === 0) {
            //无空缺位置
            return;
        }

        for (var i = 0; i < listBlankRightToLeft.length; i++) {

            if (this.blankAviableFillItem(listBlankRightToLeft[i], false)) {
                this.blankBeginFill();
                return;
            }
        }

        for (var _i = 0; _i < listBlankLeftToRight.length; _i++) {

            if (this.blankAviableFillItem(listBlankLeftToRight[_i], true)) {
                this.blankBeginFill();
                return;
            }
        }

        //去掉可消除的选项
        // this.checkPanelEliminatable();
    },

    /* 填充这个方块
    * 判断这个方块是否可填充
    * 方向顺序 上 左 右*/
    blankAviableFillItem: function blankAviableFillItem(blank_box, isLeftArrow) {

        var box_c = blank_box.getComponent("BoxDrop");

        var box_top = this.rankList[box_c.boxItem.rank][box_c.boxItem.row + 1];
        var box_topLeft = this.rankList[box_c.boxItem.rank - 1][box_c.boxItem.row + 1];
        var box_topRight = this.rankList[box_c.boxItem.rank + 1][box_c.boxItem.row + 1];

        var box_re = undefined;

        //顶部是有方块可以填充
        if (box_top !== undefined && box_top.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount) {
            box_re = box_top;
        } else if (box_topLeft !== undefined && box_topLeft.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount && isLeftArrow) {
            box_re = box_topLeft;
        } else if (box_topRight !== undefined && box_topRight.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount && !isLeftArrow) {
            box_re = box_topRight;
        }

        if (box_re !== undefined) {

            //替换到 本身之前就是 空缺方块的位置 重新开始 填充
            return this.blankReplaceBox(blank_box, box_re);
        }

        return false;
    },

    /*替换方块 并执行替换切换的动画效果*/
    blankReplaceBox: function blankReplaceBox(boxBlank, boxReplace) {

        var box_re = boxReplace.getComponent("BoxDrop");
        var box_bl = boxBlank.getComponent("BoxDrop");

        //要取最后一个位置 来判断这个动画是够添加过
        var lastPoint = box_re.boxItem.ani_point[box_re.boxItem.ani_point.length - 1];

        //存储动画的节点
        var isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
        if (lastPoint === undefined || lastPoint.x !== box_bl.boxItem.begin_x) {
            box_re.boxItem.ani_point.push({
                "x": box_bl.boxItem.begin_x,
                "y": box_bl.boxItem.end_y + box_bl.node.height,
                "isleft": isleft
            });
        }

        var tempBeginy = box_re.boxItem.begin_y;

        var haveTop = this.blankTopBoxExit(boxReplace);
        if (!haveTop) {
            this.blankRemoveItemAtRank(boxReplace);
        }

        var tempBeginx = box_re.boxItem.begin_x;
        var tempEndy = box_re.boxItem.end_y;
        var tempRow = box_re.boxItem.row;
        var tempRank = box_re.boxItem.rank;

        box_re.boxItem.begin_x = box_bl.boxItem.begin_x;
        box_re.boxItem.end_y = box_bl.boxItem.end_y;
        box_re.boxItem.row = box_bl.boxItem.row;
        box_re.boxItem.rank = box_bl.boxItem.rank;

        box_bl.boxItem.begin_x = tempBeginx;
        box_bl.boxItem.end_y = tempEndy;
        box_bl.boxItem.row = tempRow;
        box_bl.boxItem.rank = tempRank;
        box_bl.boxItem.begin_y = tempBeginy;

        if (haveTop) {
            //这个位置的方块设置成空缺的状态
            //占位的方块 位置替换成要移入的方块  移除这个占位方块
            this.rankList[box_re.boxItem.rank][box_re.boxItem.row] = boxReplace;
            this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxBlank;

            box_bl.resetOriginPos();

            //从头开始重新遍历
            return true;
        } else {

            //占位的方块 位置替换成要移入的方块  移除这个占位方块
            this.rankList[box_re.boxItem.rank][box_re.boxItem.row] = boxReplace;

            this.boxPool.put(box_bl.node);

            return false;
        }
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

    blankTopBoxExit: function blankTopBoxExit(box) {

        var box_b = box.getComponent("BoxDrop");

        for (var i = box_b.boxItem.row + 1; i < this.num_row; i++) {
            var b = this.rankList[box_b.boxItem.rank][i];
            if (b !== undefined && b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier) {
                return true;
            }
        }
        return false;
    },

    // /*检测是否可以替换
    // * box_c 这个要操作的方块类型  是 障碍物
    // * */
    // blankCheckReplaceBlankAvailable : function (box) {
    //
    //     let box_c = box.getComponent("BoxDrop");
    //
    //     if(box_c.boxItem.color_type === BoxType.Barrier){
    //         //是障碍物
    //
    //         //这个障碍物的边界两边 物体是 边界 、障碍物、方块
    //         let box_left = this.rankList[box_c.boxItem.rank-1][box_c.boxItem.row];
    //         let box_Right = this.rankList[box_c.boxItem.rank+1][box_c.boxItem.row];
    //         let box_bottom = this.rankList[box_c.boxItem.rank][box_c.boxItem.row-1];
    //
    //         //如果这个障碍物 上 左 右 都有其他的障碍物 这个障碍物不做处理 由他上方掉落的方块处理
    //         // let haveRight = (function () {
    //         //     for(let i = box_c.boxItem.rank+1; i < this.num_rank; i++){
    //         //         let b = this.rankList[i][box_c.boxItem.row];
    //         //         if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
    //         //             return true;
    //         //         }
    //         //     }
    //         //     return false;
    //         // }.bind(this))();
    //         // let haveLeft = (function () {
    //         //     for(let i = box_c.boxItem.rank-1; i >= 0; i--){
    //         //         let b = this.rankList[i][box_c.boxItem.row];
    //         //         if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
    //         //             return true;
    //         //         }
    //         //     }
    //         //     return false;
    //         // }.bind(this))();
    //         let haveTop = (function () {
    //             for(let i = box_c.boxItem.row+1; i < this.num_row; i++){
    //                 let b = this.rankList[box_c.boxItem.rank][i];
    //                 if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
    //                     return true;
    //                 }
    //             }
    //             return false;
    //         }.bind(this))();
    //         //
    //         // if(haveLeft && haveRight &&haveTop){
    //         //     console.log("这个三面都有障碍物 "+box_c.boxItem.rank +"  "+ box_c.boxItem.row);
    //         //     // return;
    //         // }else {
    //         //     return;
    //         // }
    //
    //
    //         if(box_bottom !== undefined && box_bottom.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
    //             //这个底部是空的 可以填充方块
    //
    //             //填充先 左再右
    //             if(box_Right !== undefined && box_Right.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount){
    //                 //右边位置掉落填充
    //                 console.log("右边位置 往左边填充掉落填充");
    //
    //                 //另外边界的那个障碍物
    //                 let edgeOtherBox = this.blankGetBorderBarrierBox(box);
    //
    //                 //移除 左边这个要删除的 更新新的方块的开始位置信息
    //                 this.blankRemoveItemAtRank(box_Right);
    //
    //                 //设置要替换的位置
    //                 this.blankReplaceBox(box_bottom,box_Right,edgeOtherBox);
    //
    //                 this.blankCheckReplaceBlankAvailable(box);
    //             }
    //             else if(box_left !== undefined && box_left.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount){
    //                 //左边位置掉落填充
    //                 console.log("左边位置掉落填充 往右边填充掉落填充");
    //
    //                 //另外边界的那个障碍物
    //                 let edgeOtherBox = this.blankGetBorderBarrierBox(box);
    //
    //                 //移除 左边这个要删除的 更新新的方块的开始位置信息
    //                 this.blankRemoveItemAtRank(box_left);
    //
    //                 //设置要替换的位置
    //                 this.blankReplaceBox(box_bottom,box_left,edgeOtherBox);
    //
    //                 this.blankCheckReplaceBlankAvailable(box);
    //
    //             }
    //         }
    //     }
    // },
    //
    // //或者这个障碍物相邻在一起 另外一边的障碍物
    // blankGetBorderBarrierBox:function (box) {
    //
    //     let edge_b;// = undefined;
    //
    //     let box_c = box.getComponent("BoxDrop");
    //     let row = box_c.boxItem.row;
    //     let rank = box_c.boxItem.rank;
    //
    //     //判断这个方块的右边有没有
    //     for(let i = rank+1; i < this.num_rank; i++){
    //
    //         let b = this.rankList[i][row];
    //         if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount){
    //             break;
    //         }else if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank){
    //             edge_b = b;
    //         }
    //     }
    //     //左边
    //     for(let j = rank-1; j >= 0; j--){
    //
    //         let b = this.rankList[j][row];
    //         if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount){
    //             break;
    //         }else if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank){
    //             edge_b = b;
    //         }
    //     }
    //
    //     if(edge_b !== undefined){
    //
    //         let edge_rank = edge_b.getComponent(BoxDrop).boxItem.rank;
    //         let edge_row = edge_b.getComponent(BoxDrop).boxItem.row;
    //
    //         //底下
    //         for(let k = edge_row-1; k >= 0; k--){
    //
    //             let bb = this.rankList[edge_rank][k];
    //             if(bb.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount){
    //                 break;
    //             }else if(bb.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank){
    //                 edge_b = bb;
    //             }
    //         }
    //     }
    //
    //     return edge_b;
    // },
    //
    // /*检测是否可以替换
    //  * box_c 这个要操作的方块类型  是 方块
    //  * */
    // blankCheckReplaceNormalAvailable : function (box,edgeOtherBox){
    //
    //     let box_c = box.getComponent("BoxDrop");
    //     if(box_c.boxItem.color_type < BoxType.TypeCount){
    //         //是方块
    //
    //         //这个方块的 左下方 右下方 正下方 判断是否是空位
    //         let box_bottom_left = this.rankList[box_c.boxItem.rank-1][box_c.boxItem.row-1];
    //         let box_bottom_Right = this.rankList[box_c.boxItem.rank+1][box_c.boxItem.row-1];
    //         let box_bottom_zheng = this.rankList[box_c.boxItem.rank][box_c.boxItem.row-1];
    //         if(box_bottom_zheng !== undefined &&
    //             box_bottom_zheng.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
    //             //正下方是空的 往正下方 替换
    //             console.log("正下方是空的 往正下方 替换");
    //             this.blankReplaceBox(box_bottom_zheng,box,edgeOtherBox);
    //             return false;
    //         }else if(box_bottom_left !== undefined &&
    //             box_bottom_left.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
    //             //左下方是空的 往左下方 替换
    //             console.log("左下方");
    //             this.blankReplaceBox(box_bottom_left,box,edgeOtherBox);
    //             return false;
    //         }else if(box_bottom_Right !== undefined &&
    //             box_bottom_Right.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
    //             //右下方是空的 往右下方 替换
    //             console.log("右下方");
    //             this.blankReplaceBox(box_bottom_Right,box,edgeOtherBox);
    //             return false;
    //         }
    //     }
    //
    //     return true;
    // },
    //
    //
    //
    //
    //
    //
    //
    // /*替换方块 并执行替换切换的动画效果*/
    // blankReplaceBox :function (boxBlank,boxReplace,edgeOtherBox){
    //
    //     let box_re = boxReplace.getComponent("BoxDrop");
    //     let box_bl = boxBlank.getComponent("BoxDrop");
    //
    //
    //     //设置x的位置变化的时候 点
    //     // let repeatList = box_re.boxItem.ani_point.filter(function(elem){
    //     //     return elem.x === box_bl.boxItem.begin_x;
    //     // });
    //
    //     //要取最后一个位置 来判断这个动画是够添加过
    //     let lastPoint = box_re.boxItem.ani_point[box_re.boxItem.ani_point.length - 1];
    //
    //     //存储动画的节点
    //     let isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
    //     if(lastPoint === undefined || lastPoint.x !== box_bl.boxItem.begin_x){
    //         box_re.boxItem.ani_point.push({"x": box_bl.boxItem.begin_x, "y": box_bl.boxItem.end_y + box_bl.node.height,"isleft":isleft});
    //     }
    //
    //
    //     box_re.boxItem.begin_x = box_bl.boxItem.begin_x;
    //     box_re.boxItem.end_y = box_bl.boxItem.end_y;
    //
    //     // let temp_rank = box_re.boxItem.rank;
    //
    //     box_re.boxItem.row = box_bl.boxItem.row;
    //     box_re.boxItem.rank = box_bl.boxItem.rank;
    //
    //     //这个方块继续往下替换
    //     if(this.blankCheckReplaceNormalAvailable(boxReplace,edgeOtherBox)){
    //         console.log("移动完成 替换=======");
    //
    //         //占位的方块 位置替换成要移入的方块  移除这个占位方块
    //         this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxReplace;
    //
    //         this.boxPool.put(box_bl.node);
    //     }
    //
    //
    //     //后面遍历的时候把他移除掉
    //     //this.rankList[temp_rank].removeByValue(this.rankList[temp_rank],boxReplace);
    //
    //
    //     // boxDrop_destroy:function(box){
    //     //
    //     //     let list = this.rankList[box.boxItem.rank];
    //     //
    //     //     list.removeByValue(list,box.node);
    //     //
    //     //     this.boxPool.put(box.node);
    //     // },
    //
    // },


    // blankRemoveItemAtRank:function (boxRemove) {
    //
    //     let box_re = boxRemove.getComponent("BoxDrop");
    //     let list = this.rankList[box_re.boxItem.rank];
    //     list.removeByValue(list,boxRemove);
    //
    //     let new_box = this.updateRankEndYIndex(box_re.boxItem.rank);
    //
    //     if(new_box !== null){
    //
    //         let box_c = new_box.getComponent("BoxDrop");
    //         if(box_c.node.y !== box_c.boxItem.end_y){
    //
    //             if((this.gamestate === Game_State.Start) || (box_c.node.y >= box_c.boxItem.begin_y)){
    //
    //                 //他本身是最后一个 跟倒数第二个对比
    //                 let last_box = list[list.length-2];
    //                 if(last_box !== undefined){
    //                     box_c.boxItem.begin_y = last_box.getComponent("BoxDrop").boxItem.begin_y + box_c.node.height + 10*list.length;
    //                 }
    //                 else {
    //                     box_c.boxItem.begin_y = this.margin_top + space_top;
    //                     box_c.node.y = box_c.boxItem.begin_y;
    //                 }
    //                 box_c.node.y = box_c.boxItem.begin_y;
    //             }
    //
    //             //是要掉落的
    //             if(this.gamestate === Game_State.Play ||
    //                 this.gamestate === Game_State.Filling ||
    //                 this.gamestate === Game_State.Start){
    //                 box_c.state_b = BoxState.EFalling;
    //             }
    //         }else{
    //             box_c.state_b = BoxState.EFalled;
    //         }
    //
    //     }
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

        if (this.gamestate !== Game_State.Start) {

            //不是初始化游戏的  填充 障碍物下方的方块
            this.blankBeginFill();
        }

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
                    if ((this.gamestate === Game_State.Start || box_c.node.y >= box_c.boxItem.begin_y) && box_c.boxItem.color_type < BoxType.TypeCount) {

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

                    var haveTop = this.blankTopBoxExit(elem);

                    if (haveTop) {
                        //如果这个方块顶部是有障碍物的话 这个方块不销毁 将它设置成 Blank类型
                        box.boxSpeciallyShow(BoxType.Blank);
                    } else {
                        box.state_b = BoxState.EDestroy;
                    }
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
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem","States":"States"}],"Global":[function(require,module,exports){
"use strict";
cc._RF.push(module, '22f7dE3zhxMiZn1mbV88ZRS', 'Global');
// script/State/Global.js

"use strict";

//是否开启调试
window.YHDebug = false;

cc._RF.pop();
},{}],"JSBCall":[function(require,module,exports){
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvR2xvYmFsLmpzIiwiYXNzZXRzL3NjcmlwdC9KU0JDYWxsLmpzIiwiYXNzZXRzL3NjcmlwdC9TdGF0ZS9TdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBQ0E7QUFISTs7QUFPUjtBQUNJO0FBQ0E7QUFGTTs7QUFLVjs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7QUFDSTtBQUNJOztBQUVBOztBQUVKO0FBQ0k7O0FBRUE7O0FBRUo7O0FBR0k7O0FBRUo7O0FBR0k7O0FBRUo7O0FBSUk7O0FBRUo7O0FBRUk7O0FBN0JSO0FBaUNIO0FBekNJOztBQThDVDtBQUNJO0FBQ0E7QUFGSzs7QUFNVDs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTs7QUFFSTs7QUFFSjs7QUFHSTs7QUFFSjtBQUNJOztBQUVBO0FBQ0o7QUFDSTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7O0FBRUQ7O0FBM0JSO0FBK0JIO0FBQ0o7O0FBRUQ7O0FBbERJOztBQTNFQTs7QUFvSVo7QUFDSTtBQURJOztBQUlSOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIOztBQUdEO0FBQ0k7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7QUFDSTs7QUFFQTtBQUNBO0FBQ0g7O0FBSUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVIOztBQUVEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSTs7O0FBR0E7QUFDQTs7QUFHSTs7QUFFQTtBQUNBO0FBQ0g7QUFDSjs7QUFJRDs7QUFFSTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBTUQ7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTtBQUNIOztBQUdEOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFHRDtBQUNBOztBQUdJO0FBQ0E7QUFDQTtBQUNBOztBQUVJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7O0FBRUk7OztBQUdBOztBQUVBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFJSTtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNIOztBQUdEO0FBQ0k7QUFDQTtBQUNBO0FBRUk7QUFDSDtBQUNHO0FBQ0g7QUFFSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQXRWSTs7Ozs7Ozs7OztBQ0xUOztBQUdBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0k7QUFDSTtBQUFtQjtBQUNuQjtBQUFvQjtBQUNwQjtBQUFtQjtBQUNuQjtBQUFrQjtBQUNsQjtBQUFtQjtBQUNuQjtBQUFxQjtBQUNyQjtBQUFvQjtBQUNwQjtBQUFRO0FBUlo7QUFVSDtBQVpNOztBQWVYO0FBQ0E7QUFDQTtBQUNBOztBQUdBOzs7QUFHQTs7QUFHQTtBQUNJO0FBQ0k7QUFDSDtBQUhGO0FBdENLOztBQTZDWjtBQUNBOztBQWpESzs7Ozs7Ozs7OztBQ0pUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGSzs7QUFLVDtBQUNJO0FBQ0E7QUFGSTs7QUFLUjtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0k7QUFDSDtBQUNEOztBQUVJOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUdKO0FBQ0o7QUFDRDtBQTVCTTs7QUEzQkY7O0FBNERaO0FBQ0E7O0FBRUk7O0FBRUk7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFJQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBOztBQUlBOztBQUVBO0FBQ0E7QUFDSTtBQUNIOztBQUVEOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQWlCQTtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBRUo7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEOztBQUVBO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFSTs7QUFFQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDSjs7QUFJRDtBQUNJO0FBQ0E7QUFDSDs7QUFHRDs7QUFFSTtBQUNJO0FBQ0E7QUFDSDtBQUNKOztBQUVEOztBQUVJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7O0FBSUQ7QUFDQTtBQUNIOztBQUdEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBRUc7QUFDSDs7QUFFRDs7QUFFSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUgwQjtBQUtqQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0k7QUFDSDs7QUFHRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUVIOztBQUVHO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDtBQUNKOztBQUdEOztBQUVJO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBOztBQUVJOztBQUVJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFHSTtBQUNIO0FBQ0o7QUFDRztBQUNIO0FBRUo7QUFDSjs7QUFJRDs7QUFFSTs7QUFFQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQVFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSUE7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUdIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUk7QUFDQTtBQUVIOztBQUVEO0FBQ0E7O0FBRUk7QUFDSDs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUdBO0FBQ0g7O0FBR0Q7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUdEO0FBQ0g7O0FBR0Q7OztBQUdBOztBQUdJOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNBOztBQUVBOztBQUVJOzs7O0FBSUE7O0FBR0k7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBO0FBR0k7QUFDSDtBQUNKO0FBQ0c7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNBO0FBQXdEOzs7QUFFcEQ7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUlIO0FBQ0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBR0Q7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUdKO0FBRUo7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUdEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0g7QUFFSjs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBRUg7QUFHSjs7QUFFRDtBQUNIOztBQUVEOztBQUVBO0FBQ0g7O0FBUUQ7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFSTs7QUFFQTs7QUFFQTtBQUNIOztBQUtEO0FBQ0E7O0FBRUk7QUFFSDs7QUFNRDtBQUNBOztBQUVJOztBQUdJOztBQUVBOztBQUVJOztBQUVBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjs7QUFHRDs7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSDtBQUVKO0FBL3RDSTs7Ozs7Ozs7OztBQ1BUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBQ0E7QUFIUTs7QUFNWjtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTs7QUFFSTtBQUNBO0FBRUg7QUFDRztBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUVJOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHOztBQUVBOztBQUVBO0FBQ0g7QUFFSjtBQUNHO0FBQ0E7O0FBRUE7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQTVDUTs7QUFUSjs7QUEwRFo7QUFDQTs7QUFPQTtBQUNBOztBQUVJOztBQUVDOztBQUVBOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0M7QUFDSjs7QUF0Rkk7Ozs7Ozs7Ozs7QUNIVDtBQUNBOzs7Ozs7Ozs7O0FDSkE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUZLOztBQVpEOztBQW9CWjs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUVIO0FBRUo7O0FBRUQ7O0FBRUk7QUFDQTs7QUFFQTtBQUVIOztBQUdEO0FBQ0E7O0FBRUk7O0FBRUg7O0FBcERJOzs7Ozs7Ozs7O0FDRVQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQVpvQjs7QUFrQnhCO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBSUo7QUFDQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUtKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU1KOztBQUVJO0FBQ0E7QUFDQTtBQUNBOztBQUxhIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBCb3hJdGVtID0gcmVxdWlyZShcIkJveEl0ZW1cIik7XHJcblxyXG52YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94VHlwZTtcclxudmFyIEJveFNob3dUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTaG93VHlwZTtcclxudmFyIEdhbWVfU3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkdhbWVfU3RhdGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNwZWVkOjAsXHJcblxyXG4gICAgICAgIHNwZWVkTWF4OjgwMCxcclxuXHJcbiAgICAgICAgYWNjX3NwZWVkOntcclxuICAgICAgICAgICAgZGVmYXVsdDo5LjgsXHJcbiAgICAgICAgICAgIHRvb2x0b3A6XCLliqDpgJ/luqZcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJveEl0ZW06e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94SXRlbSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgX3Nob3dUeXBlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpCb3hTaG93VHlwZS5LX05vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hTaG93VHlwZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNob3dUeXBlOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hvd1R5cGU7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ob3JtYWw6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NlbGVjdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbEFyb3VuZDpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsQ29sb3I6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbFJhbms6XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxSYXc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAgICAgX3N0YXRlX2I6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFN0YXRlLkVOb3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U3RhdGUsXHJcbiAgICAgICAgICAgIC8vIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdGF0ZV9iOntcclxuXHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVfYjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9zdGF0ZV9iICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlX2IgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVOb3JtYWw6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVGYWxsaW5nOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxlZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2JveFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRGVzdHJveTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5pGn5q+B5ZC5YXNkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2Rlc3Ryb3lcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihwYW5lbC5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lbC5ib3hEcm9wX2Rlc3Ryb3kodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGxheShcImFuaV9kZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdHlwZTpCb3hTdGF0ZSxcclxuXHJcbiAgICAgICAgICAgIC8vIHRvb2x0b3A6XCLmlrnlnZfnmoTnirbmgIFcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzdGF0aWNzOntcclxuICAgICAgICBCb3hTdGF0ZTpCb3hTdGF0ZVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJzZWxcIik7XHJcbiAgICAgICAgdGhpcy50aXRsZVNob3cgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJMYWJlbFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVudXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ4aWFvaHVpXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IC0xMDAwMDA7XHJcblxyXG4gICAgICAgIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQgPSBbXTtcclxuICAgIH0sXHJcblxyXG4gICAgcmV1c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNob25neW9uZ1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5jbGlja19hZGQoKTtcclxuICAgICAgICAvLyB0aGlzLnNwZWVkX3ggPSAyMDtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEJveEl0ZW06ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZighdGhpcy5ib3hJdGVtKXtcclxuICAgICAgICAgICAgdGhpcy5ib3hJdGVtID0gbmV3IEJveEl0ZW0oKTsgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja19hY3Rpb246ZnVuY3Rpb24oKXtcclxuICAgICAgICAvKlxyXG4gICAgICAgIOWPquacieWGjXBsYXnnirbmgIHkuIvmiY3og73ngrnlh7tcclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgIGlmKHBhbmVsLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5ICYmXHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi54K55Ye75LqGICAgXCIrXCJyYW5rPVwiK3RoaXMuYm94SXRlbS5yYW5rK1wicm93PVwiK3RoaXMuYm94SXRlbS5yb3cpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVsaW1pbmF0ZSA9IGNjLmZpbmQoXCJHYW1lL0VsaW1pbmF0ZVwiKS5nZXRDb21wb25lbnQoXCJFbGltaW5hdGVcIik7XHJcbiAgICAgICAgICAgIGVsaW1pbmF0ZS5jbGlja19pdGVtKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBib3hfZGVzdHJveTpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v5Yqo55S757uT5p2f5LmL5ZCO55qE5Zue6LCDXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pGn5q+B5Yqo55S75a6M5oiQXCIpO1xyXG5cclxuICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgcGFuZWwuYm94RHJvcF9kZXN0cm95KHRoaXMpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcmVzZXRPcmlnaW5Qb3M6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBib3hTcGVjaWFsbHlTaG93OmZ1bmN0aW9uICh0eXBlKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICAgICAgaWYodHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMTA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG5cclxuICAgICAgICAvL+WmguaenOaYr+ato+WcqOaOieiQveeahCDliLfmlrBlbmR5IOeahOWdkOagh1xyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcgfHxcclxuICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRGVzdHJveSl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzcGVlZF9uID0gdGhpcy5jdXJyZW50U3BlZWQgKyB0aGlzLmFjY19zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIGxldCBzID0gKHNwZWVkX24gKyB0aGlzLmN1cnJlbnRTcGVlZCApKjAuNSAqIGR0O1xyXG5cclxuICAgICAgICAgICAgICAgIHNwZWVkX24gPSBNYXRoLm1pbihzcGVlZF9uLHRoaXMuc3BlZWRNYXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSBzcGVlZF9uO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUueSA8PSB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOaOieiQveWIsOaMh+WumuS9jee9rueahOaXtuWAmeW8ueWKqOS4gOS4i1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5ib3hJdGVtLmFuaV9wb2ludC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi6ZyA6KaB5YGa5YGP56e75pON5L2cIOWIpOaWrVwiKTtcclxuICAgICAgICAgICAgLy8gbGV0IHBvaW50X2EgPSB0aGlzLmJveEl0ZW0uYmxhbmtfbW92ZV9wb2ludFxyXG5cclxuICAgICAgICAgICAgLy/liKTmlq3ov5nkuKrkvY3nva7nmoR5IOmcgOimgeWcqOeahHjnmoTkvY3nva5cclxuICAgICAgICAgICAgLy8gbGV0IHBvaW50cyA9IHRoaXMuYm94SXRlbS5ibGFua19tb3ZlX3BvaW50LmZpbHRlcihmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiB0aGlzLm5vZGUueSA8IGVsZW0ueTtcclxuICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsYXN0X3BvaW50ID0gdGhpcy5ib3hJdGVtLmFuaV9wb2ludFswXTtcclxuXHJcbiAgICAgICAgICAgIGlmKGxhc3RfcG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggIT09IGxhc3RfcG9pbnQueCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgPCBsYXN0X3BvaW50Lnkpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMubm9kZS54ID0gbGFzdF9wb2ludC54O1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5ib3hJdGVtLmJsYW5rX21vdmVfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG5cclxuICAgICAgICAgICAgICAgIGlmKGxhc3RfcG9pbnQuaXNsZWZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAvL+W3pui+ueeahOmAkuWHj1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ub2RlLnggLSB0aGlzLnNwZWVkKjAuNTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm5vZGUueCA8PSBsYXN0X3BvaW50Lngpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3hJdGVtLmFuaV9wb2ludC5zaGlmdCgpOy8v5Yig6Zmk56ys5LiA5Liq5YWD57SgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09Peenu+mZpFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lj7PovrnnmoTpgJLlop5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMubm9kZS54ICsgdGhpcy5zcGVlZCowLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ub2RlLnggPj0gbGFzdF9wb2ludC54KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSBsYXN0X3BvaW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT3np7vpmaRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj09PT1cIiArIGxhc3RfcG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmKFlIRGVidWcpe1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuYm94SXRlbS5yYW5rICsgXCJfXCIgKyB0aGlzLmJveEl0ZW0ucm93O1xyXG4gICAgICAgICAgICBpZih0aGlzLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5XaGl0ZSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuWUVMTE9XKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGVTaG93LmdldENvbXBvbmVudChjYy5MYWJlbCkubm9kZS5jb2xvciA9IGNjLkNvbG9yLkJMQUNLO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5nZXRDb21wb25lbnQoY2MuTGFiZWwpLm5vZGUuY29sb3IgPSBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGVTaG93LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMubm9kZS54ID4gdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5ub2RlLnggLT0gdGhpcy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA8IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxufSk7XHJcblxyXG4iLCJcclxuXHJcblxyXG52YXIgQm94VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94VHlwZTtcclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnhcclxuICAgICAgICBiZWdpbl94OjAsXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva55XHJcbiAgICAgICAgYmVnaW5feSA6IDAsXHJcbiAgICAgICAgLy/opoHmirXovr7nmoTkvY3nva5ZXHJcbiAgICAgICAgZW5kX3kgOiAtMTAwMCxcclxuICAgICAgICAvL+aYvuekuueahOminOiJslxyXG4gICAgICAgIGNvbG9yX3R5cGUgOiBCb3hUeXBlLldoaXRlLFxyXG5cclxuICAgICAgICBjb2xvcl9zaG93OntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuV2hpdGU6cmV0dXJuIGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5ZRUxMT1c6cmV0dXJuIGNjLkNvbG9yLllFTExPVztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuR3JlZW46cmV0dXJuIGNjLkNvbG9yLkdSRUVOO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbHVlOnJldHVybiBjYy5Db2xvci5CTFVFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbGFjazpyZXR1cm4gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJhcnJpZXI6cmV0dXJuIGNjLkNvbG9yLlJFRDtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmxhbms6IHJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OnJldHVybiBjYy5Db2xvci5DWUFOO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/ooYxcclxuICAgICAgICByYW5rIDogMCxcclxuICAgICAgICAvL+WIl1xyXG4gICAgICAgIHJvdyA6IDAsXHJcblxyXG5cclxuICAgICAgICAvKuenu+WKqHnnmoTkvY3nva4g56ym5ZCI5p2h5Lu255qE6KaB5pu05pawIHjnmoTlnZDmoIdcclxuICAgICAgICAqIOmHjOmdouaYryB7eDowLHk6Myxpc2xlZnQ6dHJ1ZX0g5a2X5YW457G75Z6LXHJcbiAgICAgICAgKiAqL1xyXG4gICAgICAgIGFuaV9wb2ludCA6IFtdLFxyXG5cclxuXHJcbiAgICAgICAgaWQ6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJhbmsudG9TdHJpbmcoKSArIHRoaXMucm93LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiXHJcblxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG52YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICBib3hfcHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcmFuazp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLliJfmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yb3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi6KGM5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdXBlcl9ub2RlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2dhbWVTdGF0ZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6R2FtZV9TdGF0ZS5TdGFydCxcclxuICAgICAgICAgICAgdHlwZTpHYW1lX1N0YXRlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdhbWVzdGF0ZTp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZVN0YXRlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCB0ZW1wQmVmb3JlID0gdGhpcy5fZ2FtZVN0YXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYodGVtcEJlZm9yZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8v5piv5Yia5a6e5L6L5ri45oiP5a6M5LmL5ZCOXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8v5Yib5bu66Zqc56KN54mpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuY3JlYXRlQmFycmllckNhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLlBsYXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlICBpZih2YWx1ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0eXBlOkdhbWVfU3RhdGVcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlbW92ZUJ5VmFsdWUgPSBmdW5jdGlvbihhcnIsdmFsKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpPGFyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0gPT09IHZhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIC8vIEFycmF5LnByb3RvdHlwZS5maWx0ZXJSZXBlYXQgPSBmdW5jdGlvbigpeyAgXHJcbiAgICAgICAgLy8gICAgIC8v55u05o6l5a6a5LmJ57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIC8vICAgICBpZihhcnIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgLy8gICAgICAgICBhcnIucHVzaCh0aGlzWzBdKTtcclxuICAgICAgICAvLyAgICAgfVxyXG5cclxuICAgICAgICAvLyAgICAgZm9yKHZhciBpID0gMTsgaSA8IHRoaXMubGVuZ3RoOyBpKyspeyAgICAvL+S7juaVsOe7hOesrOS6jOmhueW8gOWni+W+queOr+mBjeWOhuatpOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WvueWFg+e0oOi/m+ihjOWIpOaWre+8miAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WmguaenOaVsOe7hOW9k+WJjeWFg+e0oOWcqOatpOaVsOe7hOS4reesrOS4gOasoeWHuueOsOeahOS9jee9ruS4jeaYr2kgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/pgqPkuYjmiJHku6zlj6/ku6XliKTmlq3nrKxp6aG55YWD57Sg5piv6YeN5aSN55qE77yM5ZCm5YiZ55u05o6l5a2Y5YWl57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIGlmKHRoaXMuaW5kZXhPZih0aGlzW2ldKSA9PSBpKXsgIFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGFyci5wdXNoKHRoaXNbaV0pOyAgXHJcbiAgICAgICAgLy8gICAgICAgICB9ICBcclxuICAgICAgICAvLyAgICAgfSAgXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBhcnI7ICBcclxuICAgICAgICAvLyB9ICBcclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1XaWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSAxMDA7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVNwYWNlID0gNTtcclxuXHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl90b3AgPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSArIHRoaXMuaXRlbUhlaWdodCp0aGlzLm51bV9yb3cgKyB0aGlzLml0ZW1TcGFjZSAqICh0aGlzLm51bV9yb3cgLSAxKSArIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcbiAgICAgICAgLy90aGlzLm1hcmdpbl9ib3R0b20gPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSAtIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX3RvcCA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9ib3R0b20gPSAtKHRoaXMuc3VwZXJfbm9kZS5oZWlnaHQpKjAuNSArICB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG5cclxuICAgICAgICB0aGlzLm1hcmdpbl9sZWZ0ID0gIC10aGlzLml0ZW1XaWR0aCp0aGlzLm51bV9yYW5rKjAuNSArIHRoaXMuaXRlbVNwYWNlKih0aGlzLm51bV9yYW5rKjAuNS0xKTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9yaWdodCA9IHRoaXMuaXRlbVdpZHRoICogdGhpcy5udW1fcmFuayAqIDAuNSAtIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JhbmsgKiAwLjUgLSAxKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFzZHMgIFwiICsgdGhpcy5tYXJnaW5fdG9wK1wiICBcIit0aGlzLm1hcmdpbl9ib3R0b20pO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wgPSBuZXcgY2MuTm9kZVBvb2woXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAvKumanOeijeeJqeeahOaWueWdl+WIl+ihqCovXHJcbiAgICAgICAgdGhpcy5saXN0QmFycmllciA9IFtdO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVwbGF5R2FtZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+mHjeaWsOW8gOWni+a4uOaIj1xyXG4gICAgcmVwbGF5R2FtZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuU3RhcnQ7XHJcblxyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuc3VwZXJfbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgd2hpbGUoY2hpbGRyZW4ubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShjaGlsZHJlbltpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/muIXnqbpyYW5rbGlzdFxyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHdoaWxlIChpdGVtID0gdGhpcy5yYW5rTGlzdC5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmuIXnqbrmiJA9PT09PT09PT095YqfPT09PT09XCIpO1xyXG5cclxuICAgICAgICAvL+WIm+W7uuaJgOaciemdouadv+eahOaVsOaNrlxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleDx0aGlzLm51bV9yYW5rOyBpbmRleCsrKXtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSYW5rQ29udGVudChpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUJhcnJpZXJDYW52YXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8q5Yib5bu66Zqc56KN54mpIOW4g+WxgFxyXG4gICAgKiAxLuWcqOmanOeijeeJqeS4i+mdoueahOeJqeS9k+aKiuS7lua4heepulxyXG4gICAgKiAyLui/meS4quWIl+eahOaVsOmHj+ayoeacieWPmOi/mOaYr+i/meS6m+aVsOmHj1xyXG4gICAgKiAqL1xyXG4gICAgY3JlYXRlQmFycmllckNhbnZhczpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAzOyBpPHRoaXMubnVtX3JhbmstMzsgaSsrKXtcclxuICAgICAgICAvLyAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGxldCBib3ggPSBsaXN0WzddO1xyXG4gICAgICAgIC8vICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAvLyAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJhcnJpZXIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLyogIOa4heepuuaVsOe7hCovXHJcbiAgICAgICAgdGhpcy5saXN0QmFycmllci5zcGxpY2UoMCx0aGlzLmxpc3RCYXJyaWVyLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIGxldCBiYXJyaWVyTGlzdCA9IFtcclxuXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6Mn0se1wicm93XCI6NixcInJhbmtcIjoyfSxcclxuICAgICAgICAgICAge1wicm93XCI6NyxcInJhbmtcIjozfSxcclxuICAgICAgICAgICAge1wicm93XCI6NyxcInJhbmtcIjo0fSxcclxuICAgICAgICAgICAge1wicm93XCI6NyxcInJhbmtcIjo1fSxcclxuICAgICAgICAgICAge1wicm93XCI6NyxcInJhbmtcIjo2fSxcclxuICAgICAgICAgICAge1wicm93XCI6NyxcInJhbmtcIjo3fSx7XCJyb3dcIjo2LFwicmFua1wiOjd9LFxyXG5cclxuXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjIsXCJyYW5rXCI6Mn0se1wicm93XCI6MyxcInJhbmtcIjoyfSxcclxuICAgICAgICAgICAge1wicm93XCI6MixcInJhbmtcIjozfSxcclxuICAgICAgICAgICAge1wicm93XCI6MixcInJhbmtcIjo2fSxcclxuICAgICAgICAgICAge1wicm93XCI6MixcInJhbmtcIjo3fSx7XCJyb3dcIjozLFwicmFua1wiOjd9LFxyXG5cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy/lsIZibGFua+aMiXJvd+Wkp+Wwj+aOkuW6jyDku47lsI/liLDlpKcg5bqV6YOo5Yiw6aG26YOoIOaOkuW6j+W6lemDqOWIsOmhtumDqFxyXG4gICAgICAgIGJhcnJpZXJMaXN0LnNvcnQoZnVuY3Rpb24gKGEsYikge1xyXG4gICAgICAgICAgICByZXR1cm4gYS5yb3cgLSBiLnJvdztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy/orr7nva7mmK8gYmFycmllcueahOaWueWdl+exu+Wei1xyXG4gICAgICAgIGJhcnJpZXJMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtlbGUucmFua107XHJcbiAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2VsZS5yb3ddO1xyXG4gICAgICAgICAgICBpZihib3ggIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdEJhcnJpZXIucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJhcnJpZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8q6K6+572u6L+Z5LiqYmFycmllcuS4i+eahOaWueWdlyovXHJcbiAgICAgICAgYmFycmllckxpc3QuZm9yRWFjaChmdW5jdGlvbihlbGUpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2VsZS5yYW5rXTtcclxuICAgICAgICAgICAgZm9yKGxldCBudW1fYiA9IDA7IG51bV9iPGVsZS5yb3c7bnVtX2IrKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/ov5nkuKrkvY3nva7orr7nva7miJDnqbrnmb3ljaDkvY3kv6Hmga9cclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W251bV9iXTtcclxuICAgICAgICAgICAgICAgIGlmKGJveCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYm94X2MuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hTcGVjaWFsbHlTaG93KEJveFR5cGUuQmxhbmspO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmJsYW5rQmVnaW5GaWxsKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyrlvIDlp4vnqbrkvY3loavlhYUqL1xyXG4gICAgYmxhbmtCZWdpbkZpbGw6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKueci+aYr+WQpumcgOimgeWIm+W7uiDmlrnlnZcg5Y675aGr5YWF5Y2g5L2N5pa55Z2XKi9cclxuXHJcbiAgICAgICAgaWYodGhpcy5saXN0QmFycmllci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy/msqHmnInpmpznoo3nialcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyrnqbrnvLrnmoTmlrnlnZcqL1xyXG4gICAgICAgIGxldCBsaXN0QmxhbmsgPSBbXTtcclxuXHJcbiAgICAgICAgLy/pgY3ljoblh7rlnLrmma/kuK3miYDmnInnmoTnqbrkvY3mlrnlnZdcclxuICAgICAgICAvLyBmb3IobGV0IGJfaSA9IDA7IGJfaSA8IHRoaXMubnVtX3JvdzsgYl9pKyspe1xyXG4gICAgICAgIGZvcihsZXQgYl9pID0gMDsgYl9pIDwgdGhpcy5udW1fcm93OyBiX2krKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgYl9qID0gMDsgYl9qIDwgdGhpcy5udW1fcmFuazsgYl9qKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMucmFua0xpc3RbYl9qXVtiX2ldO1xyXG4gICAgICAgICAgICAgICAgaWYoYm94ICE9PSB1bmRlZmluZWQgJiYgIGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/ov5nkuKrkvY3nva7mmK/nqbrnvLrnmoRcclxuICAgICAgICAgICAgICAgICAgICBsaXN0QmxhbmsucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGlzdEJsYW5rUmlnaHRUb0xlZnQgPSBsaXN0Qmxhbmsuc2xpY2UoMCk7XHJcbiAgICAgICAgbGV0IGxpc3RCbGFua0xlZnRUb1JpZ2h0ID0gbGlzdEJsYW5rLnNsaWNlKDApO1xyXG5cclxuICAgICAgICAvL+WvuWJsYW5r5o6S5bqPIOS7juS4iuWIsOS4iyDku47lj7PlvoDlt6ZcclxuICAgICAgICBsaXN0QmxhbmtSaWdodFRvTGVmdC5zb3J0KGZ1bmN0aW9uKGJveGEsYm94Yil7XHJcbiAgICAgICAgICAgIGlmKGJveGEuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLnJvdyA9PT0gYm94Yi5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucm93KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib3hiLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yYW5rIC0gYm94YS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucmFuaztcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJveGIuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLnJvdyAtIGJveGEuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLnJvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8v5a+5YmxhbmvmjpLluo8g5LuO5LiK5Yiw5LiLIOS7juW3puW+gOWPs1xyXG4gICAgICAgIGxpc3RCbGFua0xlZnRUb1JpZ2h0LnNvcnQoZnVuY3Rpb24oYm94YSxib3hiKXtcclxuICAgICAgICAgICAgaWYoYm94YS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucm93ID09PSBib3hiLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yb3cpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJveGEuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLnJhbmsgLSBib3hiLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yYW5rO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm94Yi5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucm93IC0gYm94YS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucm93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYobGlzdEJsYW5rLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgICAgIC8v5peg56m657y65L2N572uXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGlzdEJsYW5rUmlnaHRUb0xlZnQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJsYW5rQXZpYWJsZUZpbGxJdGVtKGxpc3RCbGFua1JpZ2h0VG9MZWZ0W2ldLGZhbHNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGFua0JlZ2luRmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGlzdEJsYW5rTGVmdFRvUmlnaHQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJsYW5rQXZpYWJsZUZpbGxJdGVtKGxpc3RCbGFua0xlZnRUb1JpZ2h0W2ldLHRydWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQmVnaW5GaWxsKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy/ljrvmjonlj6/mtojpmaTnmoTpgInpoblcclxuICAgICAgICAvLyB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qIOWhq+WFhei/meS4quaWueWdl1xyXG4gICAgKiDliKTmlq3ov5nkuKrmlrnlnZfmmK/lkKblj6/loavlhYVcclxuICAgICog5pa55ZCR6aG65bqPIOS4iiDlt6Yg5Y+zKi9cclxuICAgIGJsYW5rQXZpYWJsZUZpbGxJdGVtOmZ1bmN0aW9uIChibGFua19ib3gsaXNMZWZ0QXJyb3cpIHtcclxuXHJcbiAgICAgICAgbGV0IGJveF9jID0gYmxhbmtfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIGxldCBib3hfdG9wID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmtdW2JveF9jLmJveEl0ZW0ucm93KzFdO1xyXG4gICAgICAgIGxldCBib3hfdG9wTGVmdCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rLTFdW2JveF9jLmJveEl0ZW0ucm93KzFdO1xyXG4gICAgICAgIGxldCBib3hfdG9wUmlnaHQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuaysxXVtib3hfYy5ib3hJdGVtLnJvdysxXTtcclxuXHJcbiAgICAgICAgbGV0IGJveF9yZSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgLy/pobbpg6jmmK/mnInmlrnlnZflj6/ku6XloavlhYVcclxuICAgICAgICBpZihib3hfdG9wICE9PSB1bmRlZmluZWQgJiYgYm94X3RvcC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgYm94X3JlID0gYm94X3RvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihib3hfdG9wTGVmdCAhPT0gdW5kZWZpbmVkICYmIGJveF90b3BMZWZ0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQgJiYgaXNMZWZ0QXJyb3cpe1xyXG4gICAgICAgICAgICBib3hfcmUgPSBib3hfdG9wTGVmdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihib3hfdG9wUmlnaHQgIT09IHVuZGVmaW5lZCAmJiBib3hfdG9wUmlnaHQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCAmJiAhaXNMZWZ0QXJyb3cpe1xyXG4gICAgICAgICAgICBib3hfcmUgPSBib3hfdG9wUmlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihib3hfcmUgIT09IHVuZGVmaW5lZCl7XHJcblxyXG4gICAgICAgICAgICAvL+abv+aNouWIsCDmnKzouqvkuYvliY3lsLHmmK8g56m657y65pa55Z2X55qE5L2N572uIOmHjeaWsOW8gOWniyDloavlhYVcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJsYW5rX2JveCxib3hfcmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKuabv+aNouaWueWdlyDlubbmiafooYzmm7/mjaLliIfmjaLnmoTliqjnlLvmlYjmnpwqL1xyXG4gICAgYmxhbmtSZXBsYWNlQm94IDpmdW5jdGlvbiAoYm94QmxhbmssYm94UmVwbGFjZSkge1xyXG5cclxuICAgICAgICBsZXQgYm94X3JlID0gYm94UmVwbGFjZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIGxldCBib3hfYmwgPSBib3hCbGFuay5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAvL+imgeWPluacgOWQjuS4gOS4quS9jee9riDmnaXliKTmlq3ov5nkuKrliqjnlLvmmK/lpJ/mt7vliqDov4dcclxuICAgICAgICBsZXQgbGFzdFBvaW50ID0gYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50W2JveF9yZS5ib3hJdGVtLmFuaV9wb2ludC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgLy/lrZjlgqjliqjnlLvnmoToioLngrlcclxuICAgICAgICBsZXQgaXNsZWZ0ID0gYm94X2JsLmJveEl0ZW0uYmVnaW5feCA8IGJveF9yZS5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgaWYgKGxhc3RQb2ludCA9PT0gdW5kZWZpbmVkIHx8IGxhc3RQb2ludC54ICE9PSBib3hfYmwuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgICAgIGJveF9yZS5ib3hJdGVtLmFuaV9wb2ludC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIFwieFwiOiBib3hfYmwuYm94SXRlbS5iZWdpbl94LFxyXG4gICAgICAgICAgICAgICAgXCJ5XCI6IGJveF9ibC5ib3hJdGVtLmVuZF95ICsgYm94X2JsLm5vZGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgXCJpc2xlZnRcIjogaXNsZWZ0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRlbXBCZWdpbnkgPSBib3hfcmUuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuICAgICAgICBsZXQgaGF2ZVRvcCA9IHRoaXMuYmxhbmtUb3BCb3hFeGl0KGJveFJlcGxhY2UpO1xyXG4gICAgICAgIGlmKCFoYXZlVG9wKXtcclxuICAgICAgICAgICAgdGhpcy5ibGFua1JlbW92ZUl0ZW1BdFJhbmsoYm94UmVwbGFjZSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGV0IHRlbXBCZWdpbnggPSBib3hfcmUuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIGxldCB0ZW1wRW5keSA9IGJveF9yZS5ib3hJdGVtLmVuZF95O1xyXG4gICAgICAgIGxldCB0ZW1wUm93ID0gYm94X3JlLmJveEl0ZW0ucm93O1xyXG4gICAgICAgIGxldCB0ZW1wUmFuayA9IGJveF9yZS5ib3hJdGVtLnJhbms7XHJcblxyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLmJlZ2luX3ggPSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLmVuZF95ID0gYm94X2JsLmJveEl0ZW0uZW5kX3k7XHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0ucm93ID0gYm94X2JsLmJveEl0ZW0ucm93O1xyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLnJhbmsgPSBib3hfYmwuYm94SXRlbS5yYW5rO1xyXG5cclxuICAgICAgICBib3hfYmwuYm94SXRlbS5iZWdpbl94ID0gdGVtcEJlZ2lueDtcclxuICAgICAgICBib3hfYmwuYm94SXRlbS5lbmRfeSA9IHRlbXBFbmR5O1xyXG4gICAgICAgIGJveF9ibC5ib3hJdGVtLnJvdyA9IHRlbXBSb3c7XHJcbiAgICAgICAgYm94X2JsLmJveEl0ZW0ucmFuayA9IHRlbXBSYW5rO1xyXG4gICAgICAgIGJveF9ibC5ib3hJdGVtLmJlZ2luX3kgPSB0ZW1wQmVnaW55O1xyXG5cclxuXHJcbiAgICAgICAgaWYoaGF2ZVRvcCl7XHJcbiAgICAgICAgICAgIC8v6L+Z5Liq5L2N572u55qE5pa55Z2X6K6+572u5oiQ56m657y655qE54q25oCBXHJcbiAgICAgICAgICAgIC8v5Y2g5L2N55qE5pa55Z2XIOS9jee9ruabv+aNouaIkOimgeenu+WFpeeahOaWueWdlyAg56e76Zmk6L+Z5Liq5Y2g5L2N5pa55Z2XXHJcbiAgICAgICAgICAgIHRoaXMucmFua0xpc3RbYm94X3JlLmJveEl0ZW0ucmFua11bYm94X3JlLmJveEl0ZW0ucm93XSA9IGJveFJlcGxhY2U7XHJcbiAgICAgICAgICAgIHRoaXMucmFua0xpc3RbYm94X2JsLmJveEl0ZW0ucmFua11bYm94X2JsLmJveEl0ZW0ucm93XSA9IGJveEJsYW5rO1xyXG5cclxuICAgICAgICAgICAgYm94X2JsLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICAvL+S7juWktOW8gOWni+mHjeaWsOmBjeWOhlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgfWVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy/ljaDkvY3nmoTmlrnlnZcg5L2N572u5pu/5o2i5oiQ6KaB56e75YWl55qE5pa55Z2XICDnp7vpmaTov5nkuKrljaDkvY3mlrnlnZdcclxuICAgICAgICAgICAgdGhpcy5yYW5rTGlzdFtib3hfcmUuYm94SXRlbS5yYW5rXVtib3hfcmUuYm94SXRlbS5yb3ddID0gYm94UmVwbGFjZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94X2JsLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIGJsYW5rUmVtb3ZlSXRlbUF0UmFuazpmdW5jdGlvbiAoYm94UmVtb3ZlKSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfcmUgPSBib3hSZW1vdmUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94X3JlLmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94UmVtb3ZlKTtcclxuXHJcbiAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLnVwZGF0ZVJhbmtFbmRZSW5kZXgoYm94X3JlLmJveEl0ZW0ucmFuayk7XHJcblxyXG4gICAgICAgIGlmKG5ld19ib3ggIT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/ku5bmnKzouqvmmK/mnIDlkI7kuIDkuKog6Lef5YCS5pWw56ys5LqM5Liq5a+55q+UXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RfYm94ID0gbGlzdFtsaXN0Lmxlbmd0aC0yXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihsYXN0X2JveCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gbGFzdF9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmJlZ2luX3kgKyBib3hfYy5ub2RlLmhlaWdodCArIDEwKmxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgc3BhY2VfdG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL+aYr+imgeaOieiQveeahFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBibGFua1RvcEJveEV4aXQ6ZnVuY3Rpb24gKGJveCkge1xyXG5cclxuICAgICAgICBsZXQgYm94X2IgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gYm94X2IuYm94SXRlbS5yb3crMTsgaSA8IHRoaXMubnVtX3JvdzsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2JveF9iLmJveEl0ZW0ucmFua11baV07XHJcbiAgICAgICAgICAgIGlmKGIgIT09IHVuZGVmaW5lZCAmJiBiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vIC8q5qOA5rWL5piv5ZCm5Y+v5Lul5pu/5o2iXHJcbiAgICAvLyAqIGJveF9jIOi/meS4quimgeaTjeS9nOeahOaWueWdl+exu+WeiyAg5pivIOmanOeijeeJqVxyXG4gICAgLy8gKiAqL1xyXG4gICAgLy8gYmxhbmtDaGVja1JlcGxhY2VCbGFua0F2YWlsYWJsZSA6IGZ1bmN0aW9uIChib3gpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmKGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CYXJyaWVyKXtcclxuICAgIC8vICAgICAgICAgLy/mmK/pmpznoo3nialcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIC8v6L+Z5Liq6Zqc56KN54mp55qE6L6555WM5Lik6L65IOeJqeS9k+aYryDovrnnlYwg44CB6Zqc56KN54mp44CB5pa55Z2XXHJcbiAgICAvLyAgICAgICAgIGxldCBib3hfbGVmdCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rLTFdW2JveF9jLmJveEl0ZW0ucm93XTtcclxuICAgIC8vICAgICAgICAgbGV0IGJveF9SaWdodCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rKzFdW2JveF9jLmJveEl0ZW0ucm93XTtcclxuICAgIC8vICAgICAgICAgbGV0IGJveF9ib3R0b20gPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFua11bYm94X2MuYm94SXRlbS5yb3ctMV07XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAvL+WmguaenOi/meS4qumanOeijeeJqSDkuIog5bemIOWPsyDpg73mnInlhbbku5bnmoTpmpznoo3niakg6L+Z5Liq6Zqc56KN54mp5LiN5YGa5aSE55CGIOeUseS7luS4iuaWueaOieiQveeahOaWueWdl+WkhOeQhlxyXG4gICAgLy8gICAgICAgICAvLyBsZXQgaGF2ZVJpZ2h0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vICAgICAgICAgLy8gICAgIGZvcihsZXQgaSA9IGJveF9jLmJveEl0ZW0ucmFuaysxOyBpIDwgdGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgIC8vICAgICAgICAgLy8gICAgICAgICBsZXQgYiA9IHRoaXMucmFua0xpc3RbaV1bYm94X2MuYm94SXRlbS5yb3ddO1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CYXJyaWVyKXtcclxuICAgIC8vICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gICAgICAgICAvLyB9LmJpbmQodGhpcykpKCk7XHJcbiAgICAvLyAgICAgICAgIC8vIGxldCBoYXZlTGVmdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICBmb3IobGV0IGkgPSBib3hfYy5ib3hJdGVtLnJhbmstMTsgaSA+PSAwOyBpLS0pe1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtpXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJhcnJpZXIpe1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIC8vICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgIC8vIH0uYmluZCh0aGlzKSkoKTtcclxuICAgIC8vICAgICAgICAgbGV0IGhhdmVUb3AgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICAgICAgICAgICAgZm9yKGxldCBpID0gYm94X2MuYm94SXRlbS5yb3crMTsgaSA8IHRoaXMubnVtX3JvdzsgaSsrKXtcclxuICAgIC8vICAgICAgICAgICAgICAgICBsZXQgYiA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rXVtpXTtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICAgICAgfS5iaW5kKHRoaXMpKSgpO1xyXG4gICAgLy8gICAgICAgICAvL1xyXG4gICAgLy8gICAgICAgICAvLyBpZihoYXZlTGVmdCAmJiBoYXZlUmlnaHQgJiZoYXZlVG9wKXtcclxuICAgIC8vICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwi6L+Z5Liq5LiJ6Z2i6YO95pyJ6Zqc56KN54mpIFwiK2JveF9jLmJveEl0ZW0ucmFuayArXCIgIFwiKyBib3hfYy5ib3hJdGVtLnJvdyk7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICAvLyByZXR1cm47XHJcbiAgICAvLyAgICAgICAgIC8vIH1lbHNlIHtcclxuICAgIC8vICAgICAgICAgLy8gICAgIHJldHVybjtcclxuICAgIC8vICAgICAgICAgLy8gfVxyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGlmKGJveF9ib3R0b20gIT09IHVuZGVmaW5lZCAmJiBib3hfYm90dG9tLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKXtcclxuICAgIC8vICAgICAgICAgICAgIC8v6L+Z5Liq5bqV6YOo5piv56m655qEIOWPr+S7peWhq+WFheaWueWdl1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIC8v5aGr5YWF5YWIIOW3puWGjeWPs1xyXG4gICAgLy8gICAgICAgICAgICAgaWYoYm94X1JpZ2h0ICE9PSB1bmRlZmluZWQgJiYgYm94X1JpZ2h0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8v5Y+z6L655L2N572u5o6J6JC95aGr5YWFXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLlj7PovrnkvY3nva4g5b6A5bem6L655aGr5YWF5o6J6JC95aGr5YWFXCIpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+WPpuWklui+ueeVjOeahOmCo+S4qumanOeijeeJqVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBlZGdlT3RoZXJCb3ggPSB0aGlzLmJsYW5rR2V0Qm9yZGVyQmFycmllckJveChib3gpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+enu+mZpCDlt6bovrnov5nkuKropoHliKDpmaTnmoQg5pu05paw5paw55qE5pa55Z2X55qE5byA5aeL5L2N572u5L+h5oGvXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlbW92ZUl0ZW1BdFJhbmsoYm94X1JpZ2h0KTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy/orr7nva7opoHmm7/mjaLnmoTkvY3nva5cclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVwbGFjZUJveChib3hfYm90dG9tLGJveF9SaWdodCxlZGdlT3RoZXJCb3gpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQ2hlY2tSZXBsYWNlQmxhbmtBdmFpbGFibGUoYm94KTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIGVsc2UgaWYoYm94X2xlZnQgIT09IHVuZGVmaW5lZCAmJiBib3hfbGVmdC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+W3pui+ueS9jee9ruaOieiQveWhq+WFhVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5bem6L655L2N572u5o6J6JC95aGr5YWFIOW+gOWPs+i+ueWhq+WFheaOieiQveWhq+WFhVwiKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy/lj6blpJbovrnnlYznmoTpgqPkuKrpmpznoo3nialcclxuICAgIC8vICAgICAgICAgICAgICAgICBsZXQgZWRnZU90aGVyQm94ID0gdGhpcy5ibGFua0dldEJvcmRlckJhcnJpZXJCb3goYm94KTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy/np7vpmaQg5bem6L656L+Z5Liq6KaB5Yig6Zmk55qEIOabtOaWsOaWsOeahOaWueWdl+eahOW8gOWni+S9jee9ruS/oeaBr1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZW1vdmVJdGVtQXRSYW5rKGJveF9sZWZ0KTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy/orr7nva7opoHmm7/mjaLnmoTkvY3nva5cclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVwbGFjZUJveChib3hfYm90dG9tLGJveF9sZWZ0LGVkZ2VPdGhlckJveCk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtDaGVja1JlcGxhY2VCbGFua0F2YWlsYWJsZShib3gpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH0sXHJcbiAgICAvL1xyXG4gICAgLy8gLy/miJbogIXov5nkuKrpmpznoo3niannm7jpgrvlnKjkuIDotbcg5Y+m5aSW5LiA6L6555qE6Zqc56KN54mpXHJcbiAgICAvLyBibGFua0dldEJvcmRlckJhcnJpZXJCb3g6ZnVuY3Rpb24gKGJveCkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgZWRnZV9iOy8vID0gdW5kZWZpbmVkO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgIC8vICAgICBsZXQgcm93ID0gYm94X2MuYm94SXRlbS5yb3c7XHJcbiAgICAvLyAgICAgbGV0IHJhbmsgPSBib3hfYy5ib3hJdGVtLnJhbms7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIC8v5Yik5pat6L+Z5Liq5pa55Z2X55qE5Y+z6L655pyJ5rKh5pyJXHJcbiAgICAvLyAgICAgZm9yKGxldCBpID0gcmFuaysxOyBpIDwgdGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtpXVtyb3ddO1xyXG4gICAgLy8gICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAgIC8vICAgICAgICAgfWVsc2UgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5CbGFuayl7XHJcbiAgICAvLyAgICAgICAgICAgICBlZGdlX2IgPSBiO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIC8v5bem6L65XHJcbiAgICAvLyAgICAgZm9yKGxldCBqID0gcmFuay0xOyBqID49IDA7IGotLSl7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBsZXQgYiA9IHRoaXMucmFua0xpc3Rbal1bcm93XTtcclxuICAgIC8vICAgICAgICAgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgLy8gICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAvLyAgICAgICAgIH1lbHNlIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuQmxhbmspe1xyXG4gICAgLy8gICAgICAgICAgICAgZWRnZV9iID0gYjtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYoZWRnZV9iICE9PSB1bmRlZmluZWQpe1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgbGV0IGVkZ2VfcmFuayA9IGVkZ2VfYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5yYW5rO1xyXG4gICAgLy8gICAgICAgICBsZXQgZWRnZV9yb3cgPSBlZGdlX2IuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0ucm93O1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgLy/lupXkuItcclxuICAgIC8vICAgICAgICAgZm9yKGxldCBrID0gZWRnZV9yb3ctMTsgayA+PSAwOyBrLS0pe1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGxldCBiYiA9IHRoaXMucmFua0xpc3RbZWRnZV9yYW5rXVtrXTtcclxuICAgIC8vICAgICAgICAgICAgIGlmKGJiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAvLyAgICAgICAgICAgICB9ZWxzZSBpZihiYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5CbGFuayl7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgZWRnZV9iID0gYmI7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIHJldHVybiBlZGdlX2I7XHJcbiAgICAvLyB9LFxyXG4gICAgLy9cclxuICAgIC8vIC8q5qOA5rWL5piv5ZCm5Y+v5Lul5pu/5o2iXHJcbiAgICAvLyAgKiBib3hfYyDov5nkuKropoHmk43kvZznmoTmlrnlnZfnsbvlnosgIOaYryDmlrnlnZdcclxuICAgIC8vICAqICovXHJcbiAgICAvLyBibGFua0NoZWNrUmVwbGFjZU5vcm1hbEF2YWlsYWJsZSA6IGZ1bmN0aW9uIChib3gsZWRnZU90aGVyQm94KXtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAvLyAgICAgaWYoYm94X2MuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgLy8gICAgICAgICAvL+aYr+aWueWdl1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgLy/ov5nkuKrmlrnlnZfnmoQg5bem5LiL5pa5IOWPs+S4i+aWuSDmraPkuIvmlrkg5Yik5pat5piv5ZCm5piv56m65L2NXHJcbiAgICAvLyAgICAgICAgIGxldCBib3hfYm90dG9tX2xlZnQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuay0xXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgIC8vICAgICAgICAgbGV0IGJveF9ib3R0b21fUmlnaHQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuaysxXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgIC8vICAgICAgICAgbGV0IGJveF9ib3R0b21femhlbmcgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFua11bYm94X2MuYm94SXRlbS5yb3ctMV07XHJcbiAgICAvLyAgICAgICAgIGlmKGJveF9ib3R0b21femhlbmcgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgLy8gICAgICAgICAgICAgYm94X2JvdHRvbV96aGVuZy5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuaykge1xyXG4gICAgLy8gICAgICAgICAgICAgLy/mraPkuIvmlrnmmK/nqbrnmoQg5b6A5q2j5LiL5pa5IOabv+aNolxyXG4gICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCLmraPkuIvmlrnmmK/nqbrnmoQg5b6A5q2j5LiL5pa5IOabv+aNolwiKTtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b21femhlbmcsYm94LGVkZ2VPdGhlckJveCk7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgIH1lbHNlIGlmKGJveF9ib3R0b21fbGVmdCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAvLyAgICAgICAgICAgICBib3hfYm90dG9tX2xlZnQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgLy8gICAgICAgICAgICAgLy/lt6bkuIvmlrnmmK/nqbrnmoQg5b6A5bem5LiL5pa5IOabv+aNolxyXG4gICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCLlt6bkuIvmlrlcIik7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmJsYW5rUmVwbGFjZUJveChib3hfYm90dG9tX2xlZnQsYm94LGVkZ2VPdGhlckJveCk7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgIH1lbHNlIGlmKGJveF9ib3R0b21fUmlnaHQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgLy8gICAgICAgICAgICAgYm94X2JvdHRvbV9SaWdodC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAvLyAgICAgICAgICAgICAvL+WPs+S4i+aWueaYr+epuueahCDlvoDlj7PkuIvmlrkg5pu/5o2iXHJcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuWPs+S4i+aWuVwiKTtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b21fUmlnaHQsYm94LGVkZ2VPdGhlckJveCk7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gfSxcclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyAvKuabv+aNouaWueWdlyDlubbmiafooYzmm7/mjaLliIfmjaLnmoTliqjnlLvmlYjmnpwqL1xyXG4gICAgLy8gYmxhbmtSZXBsYWNlQm94IDpmdW5jdGlvbiAoYm94QmxhbmssYm94UmVwbGFjZSxlZGdlT3RoZXJCb3gpe1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgYm94X3JlID0gYm94UmVwbGFjZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgLy8gICAgIGxldCBib3hfYmwgPSBib3hCbGFuay5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyAgICAgLy/orr7nva5455qE5L2N572u5Y+Y5YyW55qE5pe25YCZIOeCuVxyXG4gICAgLy8gICAgIC8vIGxldCByZXBlYXRMaXN0ID0gYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50LmZpbHRlcihmdW5jdGlvbihlbGVtKXtcclxuICAgIC8vICAgICAvLyAgICAgcmV0dXJuIGVsZW0ueCA9PT0gYm94X2JsLmJveEl0ZW0uYmVnaW5feDtcclxuICAgIC8vICAgICAvLyB9KTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgLy/opoHlj5bmnIDlkI7kuIDkuKrkvY3nva4g5p2l5Yik5pat6L+Z5Liq5Yqo55S75piv5aSf5re75Yqg6L+HXHJcbiAgICAvLyAgICAgbGV0IGxhc3RQb2ludCA9IGJveF9yZS5ib3hJdGVtLmFuaV9wb2ludFtib3hfcmUuYm94SXRlbS5hbmlfcG9pbnQubGVuZ3RoIC0gMV07XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIC8v5a2Y5YKo5Yqo55S755qE6IqC54K5XHJcbiAgICAvLyAgICAgbGV0IGlzbGVmdCA9IGJveF9ibC5ib3hJdGVtLmJlZ2luX3ggPCBib3hfcmUuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgLy8gICAgIGlmKGxhc3RQb2ludCA9PT0gdW5kZWZpbmVkIHx8IGxhc3RQb2ludC54ICE9PSBib3hfYmwuYm94SXRlbS5iZWdpbl94KXtcclxuICAgIC8vICAgICAgICAgYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50LnB1c2goe1wieFwiOiBib3hfYmwuYm94SXRlbS5iZWdpbl94LCBcInlcIjogYm94X2JsLmJveEl0ZW0uZW5kX3kgKyBib3hfYmwubm9kZS5oZWlnaHQsXCJpc2xlZnRcIjppc2xlZnR9KTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vICAgICBib3hfcmUuYm94SXRlbS5iZWdpbl94ID0gYm94X2JsLmJveEl0ZW0uYmVnaW5feDtcclxuICAgIC8vICAgICBib3hfcmUuYm94SXRlbS5lbmRfeSA9IGJveF9ibC5ib3hJdGVtLmVuZF95O1xyXG4gICAgLy9cclxuICAgIC8vICAgICAvLyBsZXQgdGVtcF9yYW5rID0gYm94X3JlLmJveEl0ZW0ucmFuaztcclxuICAgIC8vXHJcbiAgICAvLyAgICAgYm94X3JlLmJveEl0ZW0ucm93ID0gYm94X2JsLmJveEl0ZW0ucm93O1xyXG4gICAgLy8gICAgIGJveF9yZS5ib3hJdGVtLnJhbmsgPSBib3hfYmwuYm94SXRlbS5yYW5rO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAvL+i/meS4quaWueWdl+e7p+e7reW+gOS4i+abv+aNolxyXG4gICAgLy8gICAgIGlmKHRoaXMuYmxhbmtDaGVja1JlcGxhY2VOb3JtYWxBdmFpbGFibGUoYm94UmVwbGFjZSxlZGdlT3RoZXJCb3gpKXtcclxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCLnp7vliqjlrozmiJAg5pu/5o2iPT09PT09PVwiKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIC8v5Y2g5L2N55qE5pa55Z2XIOS9jee9ruabv+aNouaIkOimgeenu+WFpeeahOaWueWdlyAg56e76Zmk6L+Z5Liq5Y2g5L2N5pa55Z2XXHJcbiAgICAvLyAgICAgICAgIHRoaXMucmFua0xpc3RbYm94X2JsLmJveEl0ZW0ucmFua11bYm94X2JsLmJveEl0ZW0ucm93XSA9IGJveFJlcGxhY2U7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICB0aGlzLmJveFBvb2wucHV0KGJveF9ibC5ub2RlKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vICAgICAvL+WQjumdoumBjeWOhueahOaXtuWAmeaKiuS7luenu+mZpOaOiVxyXG4gICAgLy8gICAgIC8vdGhpcy5yYW5rTGlzdFt0ZW1wX3JhbmtdLnJlbW92ZUJ5VmFsdWUodGhpcy5yYW5rTGlzdFt0ZW1wX3JhbmtdLGJveFJlcGxhY2UpO1xyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyAgICAgLy8gYm94RHJvcF9kZXN0cm95OmZ1bmN0aW9uKGJveCl7XHJcbiAgICAvLyAgICAgLy9cclxuICAgIC8vICAgICAvLyAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveC5ib3hJdGVtLnJhbmtdO1xyXG4gICAgLy8gICAgIC8vXHJcbiAgICAvLyAgICAgLy8gICAgIGxpc3QucmVtb3ZlQnlWYWx1ZShsaXN0LGJveC5ub2RlKTtcclxuICAgIC8vICAgICAvL1xyXG4gICAgLy8gICAgIC8vICAgICB0aGlzLmJveFBvb2wucHV0KGJveC5ub2RlKTtcclxuICAgIC8vICAgICAvLyB9LFxyXG4gICAgLy9cclxuICAgIC8vIH0sXHJcblxyXG5cclxuICAgIC8vIGJsYW5rUmVtb3ZlSXRlbUF0UmFuazpmdW5jdGlvbiAoYm94UmVtb3ZlKSB7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGxldCBib3hfcmUgPSBib3hSZW1vdmUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94X3JlLmJveEl0ZW0ucmFua107XHJcbiAgICAvLyAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94UmVtb3ZlKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgbGV0IG5ld19ib3ggPSB0aGlzLnVwZGF0ZVJhbmtFbmRZSW5kZXgoYm94X3JlLmJveEl0ZW0ucmFuayk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmKG5ld19ib3ggIT09IG51bGwpe1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgLy8gICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy/ku5bmnKzouqvmmK/mnIDlkI7kuIDkuKog6Lef5YCS5pWw56ys5LqM5Liq5a+55q+UXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGxhc3RfYm94ID0gbGlzdFtsaXN0Lmxlbmd0aC0yXTtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZihsYXN0X2JveCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gbGFzdF9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmJlZ2luX3kgKyBib3hfYy5ub2RlLmhlaWdodCArIDEwKmxpc3QubGVuZ3RoO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgc3BhY2VfdG9wO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAvL+aYr+imgeaOieiQveeahFxyXG4gICAgLy8gICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcgfHxcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9ZWxzZXtcclxuICAgIC8vICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH0sXHJcbiAgICBcclxuXHJcblxyXG4gICAgLy/liJvlu7rmr4/kuIDliJfnmoTmlbDmja5cclxuICAgIGNyZWF0ZVJhbmtDb250ZW50OmZ1bmN0aW9uKGluZGV4KXtcclxuXHJcbiAgICAgICAgbGV0IHJhbmtfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuICAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubnVtX3JvdzsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgIGJveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIGJveC5oZWlnaHQgPSB0aGlzLml0ZW1IZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvdW50ID0gQm94VHlwZS5UeXBlQ291bnQ7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9IChjYy5yYW5kb20wVG8xKCkqY291bnQpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgcmFua19saXN0LnB1c2goYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QucHVzaChyYW5rX2xpc3QpO1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5omA5pyJ5YiXIGVuZCB555qE5pWw5o2uXHJcbiAgICB1cGRhdGVBbGxSYW5rRW5kWTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSAhPT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcblxyXG4gICAgICAgICAgICAvL+S4jeaYr+WIneWni+WMlua4uOaIj+eahCAg5aGr5YWFIOmanOeijeeJqeS4i+aWueeahOaWueWdl1xyXG4gICAgICAgICAgICB0aGlzLmJsYW5rQmVnaW5GaWxsKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/nnIvor6XliJfnmoTmlbDph4/mmK/lkKYg5bCP5LqOIHRoaXMubnVtX3JvdyAg5bCR5LqO55qE6K+d5YiZ6KGl5YWFXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVSYW5rRW5kWUluZGV4KGkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBbGxCZWdpbk9yaWdpblkoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8q5pu05paw5p+Q5YiX55qE5pWw5o2uKi9cclxuICAgIHVwZGF0ZVJhbmtFbmRZSW5kZXg6ZnVuY3Rpb24oaW5kZXgpe1xyXG5cclxuICAgICAgICBsZXQgY3JlYXRlQm94ID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaW5kZXg7XHJcblxyXG4gICAgICAgIGxldCBsaXN0X3N1YiA9IHRoaXMucmFua0xpc3RbaW5kZXhdO1xyXG5cclxuICAgICAgICB3aGlsZShsaXN0X3N1Yi5sZW5ndGggPCB0aGlzLm51bV9yb3cpe1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgIG5ld19ib3guYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgbmV3X2JveC53aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG4gICAgICAgICAgICBuZXdfYm94LmhlaWdodCA9IHRoaXMuaXRlbUhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IG5ld19ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gMDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5jb2xvcl90eXBlID0gKGNjLnJhbmRvbTBUbzEoKSo1KSB8IDA7XHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBuZXdfYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgIGxpc3Rfc3ViLnB1c2gobmV3X2JveCk7XHJcblxyXG5cclxuICAgICAgICAgICAgY3JlYXRlQm94ID0gbmV3X2JveDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsZXQgZW5kX2JveF95ID0gdGhpcy5tYXJnaW5fYm90dG9tO1xyXG5cclxuICAgICAgICAvL+abtOaWsOavj+S4quWFg+e0oOeahGVuZCB5IOS9jee9rlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPGxpc3Rfc3ViLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGxpc3Rfc3ViW2ldO1xyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBpdGVtX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IGk7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSppO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiBjcmVhdGVCb3g7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOavj+S4gOWIl+S7luS7rOS4reeahOavj+S4quWFg+e0oOeahOWIneWni+eahG9yaWdpbiB555qE5YC8XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUFsbEJlZ2luT3JpZ2luWTpmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmn5DkuIDliJfkuK0g5LuO5pyA5ZCO5byA5aeL6YGN5Y6G6L+U5ZueXHJcbiAgICAgICAgICog566X5Ye65byA5aeL5o6J5LqG55qE5L2N572uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG5cclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKYg5bey6L6+5Yiw5LuW55qEZW5keSDlpoLmnpzov5jmnKrovr7liLDlsLHmmK8g5q2j6KaB5o6J6JC9XHJcbiAgICAgICAgICAgIGxldCBvZmZfdG9wID0gMDtcclxuICAgICAgICAgICAgbGV0IHNwYWNlX3RvcCA9IDU7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9ib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYm94X2Mubm9kZS55ICE9PSBib3hfYy5ib3hJdGVtLmVuZF95KXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogMS7lrp7kvovmuLjmiI/nmoTml7blgJkg5Yid5aeL5byA5aeL55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAgICAgICogMi7mtojpmaTnmoQg5pa55Z2X5LiN5Zyo55WM6Z2i5Lit55qE6K6+572u5LuW55qE5byA5aeL5L2N572uIOW3suWcqOeVjOmdouS4reeahOS4jeWOu+iuvue9ruS7llxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCgodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpIHx8IChib3hfYy5ub2RlLnkgPj0gYm94X2MuYm94SXRlbS5iZWdpbl95KSkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgb2ZmX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSBvZmZfdG9wICsgYm94X2Mubm9kZS5oZWlnaHQgKyBzcGFjZV90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZV90b3AgPSBzcGFjZV90b3AgKyAxMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5piv6KaB5o6J6JC955qEXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/kuqTmjaLkuKTkuKrmlrnlnZfnmoTkvY3nva5cclxuICAgIGV4Y2hhbmdlQm94SXRlbTpmdW5jdGlvbihib3gxLGJveDIsdG9DaGVja1ZpYWJsZSA9IHRydWUpe1xyXG5cclxuICAgICAgICBsZXQgYm94SXRlbTEgPSBib3gxLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICBsZXQgYm94SXRlbTIgPSBib3gyLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgaWYoYm94SXRlbTEucmFuayA9PT0gYm94SXRlbTIucmFuayl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA5YiX55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2VuZHkgPSBib3hJdGVtMi5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTIuZW5kX3kgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTEuZW5kX3kgPSB0ZW1wX2VuZHk7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcm93ID0gYm94SXRlbTIucm93O1xyXG5cclxuICAgICAgICAgICAgYm94SXRlbTIucm93ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yb3cgPSB0ZW1wX3JvdzsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0W2JveEl0ZW0xLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTEucm93XSA9IGxpc3RbYm94SXRlbTIucm93XTtcclxuICAgICAgICAgICAgbGlzdFtib3hJdGVtMi5yb3ddID0gdGVtcF9ub2RlO1xyXG5cclxuXHJcblxyXG4gICAgICAgIH1lbHNlIGlmKGJveEl0ZW0xLnJvdyA9PT0gYm94SXRlbTIucm93KXtcclxuICAgICAgICAgICAgLy/lkIzkuIDooYznmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QxID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QyID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMi5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2JlZ2lueCA9IGJveEl0ZW0yLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmJlZ2luX3ggPSBib3hJdGVtMS5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5iZWdpbl94ID0gdGVtcF9iZWdpbng7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcmFuayA9IGJveEl0ZW0yLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJhbmsgPSBib3hJdGVtMS5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yYW5rID0gdGVtcF9yYW5rO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd19pbmRleCA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgbGV0IHRlbXBfbm9kZSA9IGxpc3QxW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QxW3Jvd19pbmRleF0gPSBsaXN0Mltyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0Mltyb3dfaW5kZXhdID0gdGVtcF9ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodG9DaGVja1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXNWaWFibGUgPSB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFpc1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/kuI3lj6/mtojpmaTnmoTor50g5L2N572u5YaN5LqS5o2i5Zue5p2lXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4jeWPr+a2iOmZpFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4Y2hhbmdlQm94SXRlbShib3gyLGJveDEsZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+ajgOa1i+mdouadv+aJgOacieaWueWdlyDmmK/lkKblj6/mtojpmaRcclxuICAgIGNoZWNrUGFuZWxFbGltaW5hdGFibGU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IHdpcGVfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAvL+WIpOaWreWIlyDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZW1wTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcHJlX2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAvKuminOiJsuebuOWQjCDlubbkuJTmmK/mma7pgJrnsbvlnovnmoTpopzoibLnmoTml7blgJkqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9wcmUuY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcm93LTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkod2lwZV9saXN0LHRlbXBMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc1JlcGVhdEl0ZW1JbldpcGUoaXRlbSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8d2lwZV9saXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHdpcGVfbGlzdFtpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uaWQgPT09IGl0ZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+WIpOaWreihjCDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3Jhbms7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5yYW5rTGlzdFtqXVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9wcmUuY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcmFuay0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc1JlcGVhdEl0ZW1JbldpcGUoZWxlbSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXBlX2xpc3QucHVzaChlbGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+a4heepuuaVsOe7hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmKHdpcGVfbGlzdC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93RGVsYXlBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAvL+S4jeaYvuekuua2iOmZpOWKqOeUu1xyXG4gICAgICAgICAgICAgICAgc2hvd0RlbGF5QW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvL+S4jeaYr+WIneWni+WMlueahCDlgZznlZnkuIDkvJrlhL/lho3mtojpmaQg6K6p55So5oi355yL5Yiw6KaB5raI6Zmk5LqG5LuA5LmI5Lic6KW/XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgICAgICAgICAvLyB3aXBlX2xpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gbGV0IGJveCA9IGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBib3guc3RhdGVfYiA9IEJveFN0YXRlLkVEZXN0cm95O1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuYm94RHJvcF9kZXN0cm95KGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aXBlX2xpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhdmVUb3AgPSB0aGlzLmJsYW5rVG9wQm94RXhpdChlbGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaGF2ZVRvcCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c6L+Z5Liq5pa55Z2X6aG26YOo5piv5pyJ6Zqc56KN54mp55qE6K+dIOi/meS4quaWueWdl+S4jemUgOavgSDlsIblroPorr7nva7miJAgQmxhbmvnsbvlnotcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94LmJveFNwZWNpYWxseVNob3coQm94VHlwZS5CbGFuayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guc3RhdGVfYiA9IEJveFN0YXRlLkVEZXN0cm95O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog6L+Z6L655LiA5Liq5bu26L+fXHJcbiAgICAgICAgICAgICAgICAg5aaC5p6c5ri45oiP5pivIOWIneWni+WMlueahOivneS4jeW7tui/n1xyXG4gICAgICAgICAgICAgICAgIOS4jeaYr+WIneWni+WMliBzdGFydOeahCDopoHnrYnplIDmr4HliqjnlLvlrozmiJDkuYvlkI7lho3lvIDlp4vmjonokL1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5pyJ6ZSA5q+B5Zyo5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgIT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+ato+WcqOaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuRmlsbGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsUmFua0VuZFkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksKHRoaXMuZ2FtZXN0YXRlICE9PSBHYW1lX1N0YXRlLlN0YXJ0KT8wLjM6MCxmYWxzZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLHNob3dEZWxheUFuaW1hdGlvbj8wLjM6MCxmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIGJveERyb3BfZ2V0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCBib3ggPSBudWxsO1xyXG4gICAgICAgIGlmKHRoaXMuYm94UG9vbC5zaXplKCkgPiAwKXtcclxuICAgICAgICAgICAgYm94ID0gdGhpcy5ib3hQb29sLmdldCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBib3ggPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJveF9wcmVmYWIpO1xyXG4gICAgICAgICAgICBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5pbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfSxcclxuXHJcbiAgICBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuXHJcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveC5ib3hJdGVtLnJhbmtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxpc3QucmVtb3ZlQnlWYWx1ZShsaXN0LGJveC5ub2RlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hQb29sLnB1dChib3gubm9kZSk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuICAgIC8q5piv5ZCm5byA5ZCv6LCD6K+VKi9cclxuICAgIGdhbWVTaG93RGVidWdNZXNzYWdlOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgWUhEZWJ1ZyA9ICFZSERlYnVnO1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyB8fFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmZpbGxJbnRlcnZhbCA9PT0gMTApe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PeWumuaXtuW8gOWni+WIpOaWreaYr+WQpumDveW3suaOieiQveWIsOW6lemDqOS6hiBiZWdpbiA9PT09PVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaTxzZWxmLm51bV9yYW5rOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHNlbGYucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZi5udW1fcm93OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3hfY19pID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGJveF9jX2kuc3RhdGVfYiAhPT0gQm94U3RhdGUuRUZhbGxlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT096YO95YiwIOaOieiQveWIsOW6lemDqOS6hiDmo4DmtYvmmK/lkKblj6/mtojpmaQgZW5kID09PT09PT09PVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuUGxheTtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCArPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG59KTtcclxuXHJcblxyXG4iLCJcclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuLy8gdmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEJveFNob3dUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTaG93VHlwZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX3NlbGVjdF9ib3g6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+mAieS4reafkOS4quaWueWdl1xyXG4gICAgICAgIHNlbGVjdF9ib3g6IHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0X2JveDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RfYm94KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19TZWxlY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fbmV3ID0gdmFsdWUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hJdGVtX29sZCA9IHRoaXMuX3NlbGVjdF9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChib3hJdGVtX25ldy5pZCAhPT0gYm94SXRlbV9vbGQuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLnnIvmmK/lkKbopoHkuqTkupLkvY3nva4g6L+Y5piv6K+05YiH5o2i5Yiw6L+Z5Liq6YCJ5Lit55qE5L2N572u5aSE55CGXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkMSA9IFwiICsgYm94SXRlbV9uZXcuaWQgKyBcIiAgaWQyPSBcIiArIGJveEl0ZW1fb2xkLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/ml6fnmoTlj5bmtojpgInmi6lcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveC5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChib3hJdGVtX25ldy5yYW5rID09PSBib3hJdGVtX29sZC5yYW5rICYmIE1hdGguYWJzKGJveEl0ZW1fbmV3LnJvdyAtIGJveEl0ZW1fb2xkLnJvdykgPT09IDEpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYm94SXRlbV9uZXcucm93ID09PSBib3hJdGVtX29sZC5yb3cgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucmFuayAtIGJveEl0ZW1fb2xkLnJhbmspID09PSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmmK/nm7jov5HnmoQg5Lqk5o2i5L2N572uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94UGFuZWwuZXhjaGFuZ2VCb3hJdGVtKHZhbHVlLCB0aGlzLl9zZWxlY3RfYm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5LiN5piv55u46L+R55qEIOWPlua2iOS4iuS4gOS4qumAieaLqSDpgInkuK3mlrDngrnlh7vnmoRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLpgInkuK3kuoblkIzkuIDkuKog5Y+W5raI6YCJ5oupXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/ngrnlh7vkuoYg5p+Q5Liq6YCJ6aG5XHJcbiAgICBjbGlja19pdGVtOmZ1bmN0aW9uKGNsaWNrX25vZGUpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coaXRlbSk7XHJcblxyXG4gICAgICAgICBsZXQgYm94UGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hJdGVtID0gY2xpY2tfbm9kZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgIC8vICAvL+a2iOmZpOaOiVxyXG4gICAgICAgIC8vICBib3hQYW5lbC5ib3hEcm9wX2Rlc3Ryb3koY2xpY2tfbm9kZSk7XHJcblxyXG4gICAgICAgIC8vICAvL+S4iumdoueahOaOieS4i+adpVxyXG4gICAgICAgIC8vICBib3hQYW5lbC51cGRhdGVSYW5rRW5kWShib3hJdGVtLnJhbmspO1xyXG5cclxuXHJcbiAgICAgICAgIHRoaXMuc2VsZWN0X2JveCA9IGNsaWNrX25vZGU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJcblxuXG4vL+aYr+WQpuW8gOWQr+iwg+ivlVxud2luZG93LllIRGVidWcgPSBmYWxzZTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgbGFiX3Nob3c6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgfSxcblxuXG4gICAgb2NDYWxsSnM6ZnVuY3Rpb24gKHN0cikge1xuXG4gICAgICAgIHRoaXMubGFiX3Nob3cubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubGFiX3Nob3cuc3RyaW5nID0gc3RyO1xuXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdGhpcy5sYWJfc2hvdy5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIH0sNSk7XG5cbiAgICB9LFxuXG4gICAganNDYWxsT2M6ZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8v57G75ZCNIOaWueazlSAg5Y+C5pWwMSDlj4LmlbAyIOWPguaVsDNcbiAgICAgICAgdmFyIHJlc3VsdCA9IGpzYi5yZWZsZWN0aW9uLmNhbGxTdGF0aWNNZXRob2QoXCJKU0JNYW5hZ2VyXCIsXCJ5aEpTQkNhbGw6XCIsXCJqc+i/mei+ueS8oOWFpeeahOWPguaVsFwiKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcImpzX2NhbGxfb2MgPT09PT09PT09ICVAXCIscmVzdWx0KTtcblxuICAgIH0sXG5cblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIHRoaXMub2NDYWxsSnMoXCLmtYvor5Ug5pi+56S66ZqQ6JePXCIpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsIlxuXG4vKuaWueWdl+eahOexu+WeiyovXG5jb25zdCBCb3hUeXBlID0gY2MuRW51bSh7XG4gICAgWUVMTE9XIDogLTEsXG4gICAgR3JlZW4gOiAtMSxcbiAgICBCbHVlIDogLTEsXG4gICAgQmxhY2sgOiAtMSxcbiAgICBXaGl0ZSA6IC0xLFxuXG4gICAgVHlwZUNvdW50IDogLTEsXG5cbiAgICBCYXJyaWVyIDogLTEsICAgICAgIC8v6Zqc56KN54mpXG4gICAgQmxhbmsgOiAtMSwgICAgICAgICAgLy/nqbrnmb3ljaDkvY1cblxuICAgIENvdW50IDogLTFcbn0pO1xuXG5cblxuXG4vL+aWueWdl+aOieiQveeahOeKtuaAgVxuY29uc3QgQm94U3RhdGUgPSBjYy5FbnVtKHtcblxuICAgIC8vIEVOb25lIDogLTEsICAgICAgLy/ku4DkuYjpg73kuI3mmK9cblxuICAgIEVOb3JtYWwgOiAtMSwgICAgLy/mraPluLhcbiAgICBFRmFsbGluZyA6IC0xLCAgIC8v5o6J6JC9XG4gICAgRUZhbGxlZCA6IC0xLCAgICAvL+aOieiQvee7k+adn1xuICAgIEVEZXN0cm95IDogLTEsICAgLy/plIDmr4FcblxufSk7XG5cbi8v5pa55Z2X5pi+56S655qE54q25oCBXG5jb25zdCBCb3hTaG93VHlwZSA9IGNjLkVudW0oe1xuXG4gICAgS19Ob3JtYWwgOiAtMSwgICAgICAgICAgLy/mraPluLhcbiAgICBLX1NlbGVjdCA6IC0xLCAgICAgICAgICAvL+mAieS4rVxuXG4gICAgS19Ta2lsbEFyb3VuZCA6IC0xLCAgICAgICAvL+mUgOavgSDlkajovrnnmoTkuZ3kuKpcbiAgICBLX1NraWxsUmFuayA6IC0xLCAgICAgICAgIC8v6ZSA5q+BIOivpeWIl1xuICAgIEtfU2tpbGxSYXcgOiAtMSwgICAgICAgICAgLy/plIDmr4Eg6K+l6KGMXG4gICAgS19Ta2lsbENvbG9yIDogLTEsICAgICAgICAvL+mUgOavgSDor6XoibJcbn0pO1xuXG5cblxuLy/muLjmiI/ov5vooYznmoTnirbmgIFcbnZhciBHYW1lX1N0YXRlID0gY2MuRW51bSh7XG4gICAgU3RhcnQgOiAtMSwgICAgIC8v5byA5aeL5a6e5L6LXG4gICAgRmlsbGluZzogLTEsICAgIC8v5pa55Z2X6KGl6b2Q5LitIOaOieiQveS4rVxuICAgIC8vIEJsYW5rRmlsbGluZyA6IC0xLCAvL+epuuS9jeihpeWFhSDoh6rliqjmjonokL1cbiAgICBQbGF5IDogLTEsICAgICAgLy/ov5vooYzkuK1cbiAgICBPdmVyIDogLTEsICAgICAgLy/nu5PmnZ9cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIEJveFN0YXRlLFxuICAgIEJveFNob3dUeXBlLFxuICAgIEdhbWVfU3RhdGUsXG4gICAgQm94VHlwZVxuXG59OyJdLCJzb3VyY2VSb290IjoiIn0=