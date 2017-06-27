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

            if (last_point !== undefined &&
            // this.node.x !== last_point.x &&
            this.node.y < last_point.y) {

                if (last_point.isleft) {
                    //左边的递减
                    this.node.x = this.node.x - this.speed * 0.3;
                    if (this.node.x <= last_point.x) {
                        this.node.x = last_point.x;
                        this.boxItem.ani_point.shift(); //删除第一个元素
                        console.log("=======移除");
                    }
                } else {
                    //右边的递增
                    this.node.x = this.node.x + this.speed * 0.3;
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
        // let lastPoint = box_re.boxItem.ani_point[box_re.boxItem.ani_point.length - 1];

        //存储动画的节点
        var isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;

        box_re.boxItem.ani_point.push({
            "x": box_bl.boxItem.begin_x,
            "y": box_bl.boxItem.end_y + box_bl.node.height,
            "isleft": isleft
        });

        // boxReplace.y = box_bl.boxItem.end_y + box_bl.node.height;
        // boxReplace.x = box_bl.boxItem.begin_x;


        var tempBeginy = box_re.boxItem.begin_y;

        var haveTop = this.blankTopBoxExit(boxReplace);
        if (!haveTop) {
            this.blankRemoveItemAtRank(boxReplace);
        }

        var tempBeginx = box_re.boxItem.begin_x;
        var tempBeginY = box_re.boxItem.begin_y;
        var tempEndy = box_re.boxItem.end_y;
        var tempRow = box_re.boxItem.row;
        var tempRank = box_re.boxItem.rank;

        box_re.boxItem.begin_x = box_bl.boxItem.begin_x;
        box_re.boxItem.begin_y = box_bl.boxItem.begin_y;
        box_re.boxItem.end_y = box_bl.boxItem.end_y;
        box_re.boxItem.row = box_bl.boxItem.row;
        box_re.boxItem.rank = box_bl.boxItem.rank;

        box_bl.boxItem.begin_x = tempBeginx;
        box_bl.boxItem.end_y = tempEndy;
        box_bl.boxItem.row = tempRow;
        box_bl.boxItem.rank = tempRank;
        box_bl.boxItem.begin_y = tempBeginy;
        box_bl.boxItem.begin_y = tempBeginY;

        if (haveTop) {
            //这个位置的方块设置成空缺的状态
            //占位的方块 位置替换成要移入的方块  移除这个占位方块
            this.rankList[box_re.boxItem.rank][box_re.boxItem.row] = boxReplace;
            this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxBlank;

            box_bl.boxSpeciallyShow(BoxType.Blank);

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvR2xvYmFsLmpzIiwiYXNzZXRzL3NjcmlwdC9KU0JDYWxsLmpzIiwiYXNzZXRzL3NjcmlwdC9TdGF0ZS9TdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBQ0E7QUFISTs7QUFPUjtBQUNJO0FBQ0E7QUFGTTs7QUFLVjs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7QUFDSTtBQUNJOztBQUVBOztBQUVKO0FBQ0k7O0FBRUE7O0FBRUo7O0FBR0k7O0FBRUo7O0FBR0k7O0FBRUo7O0FBSUk7O0FBRUo7O0FBRUk7O0FBN0JSO0FBaUNIO0FBekNJOztBQThDVDtBQUNJO0FBQ0E7QUFGSzs7QUFNVDs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTs7QUFFSTs7QUFFSjs7QUFHSTs7QUFFSjtBQUNJOztBQUVBO0FBQ0o7QUFDSTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7O0FBRUQ7O0FBM0JSO0FBK0JIO0FBQ0o7O0FBRUQ7O0FBbERJOztBQTNFQTs7QUFvSVo7QUFDSTtBQURJOztBQUlSOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIOztBQUdEO0FBQ0k7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7QUFDSTs7QUFFQTtBQUNBO0FBQ0g7O0FBSUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVIOztBQUVEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSTs7O0FBR0E7QUFDQTs7QUFHSTs7QUFFQTtBQUNBO0FBQ0g7QUFDSjs7QUFJRDs7QUFFSTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBTUQ7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTtBQUNIOztBQUdEOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFHRDtBQUNBOztBQUdJO0FBQ0E7QUFDQTtBQUNBOztBQUVJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0g7O0FBRUQ7O0FBRUk7OztBQUdBOztBQUVBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0g7O0FBR0Q7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBQ0c7QUFDSDtBQUVKO0FBQ0c7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBblZJOzs7Ozs7Ozs7O0FDTFQ7O0FBR0E7QUFDSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSTtBQUNJO0FBQW1CO0FBQ25CO0FBQW9CO0FBQ3BCO0FBQW1CO0FBQ25CO0FBQWtCO0FBQ2xCO0FBQW1CO0FBQ25CO0FBQXFCO0FBQ3JCO0FBQW9CO0FBQ3BCO0FBQVE7QUFSWjtBQVVIO0FBWk07O0FBZVg7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7OztBQUdBOztBQUdBO0FBQ0k7QUFDSTtBQUNIO0FBSEY7QUF0Q0s7O0FBNkNaO0FBQ0E7O0FBakRLOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZLOztBQUtUO0FBQ0k7QUFDQTtBQUZJOztBQUtSO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7O0FBRUk7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIO0FBR0o7QUFDSjtBQUNEO0FBNUJNOztBQTNCRjs7QUE0RFo7QUFDQTs7QUFFSTs7QUFFSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUlBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7O0FBSUE7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDs7OztBQUlBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBaUJBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFSjs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBR0Q7O0FBRUE7QUFDSDs7QUFHRDtBQUNBOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQUlEO0FBQ0k7QUFDQTtBQUNIOztBQUdEOztBQUVJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7O0FBRUk7QUFDSTtBQUNBO0FBQ0g7QUFDSjs7QUFJRDtBQUNBO0FBQ0g7O0FBR0Q7OztBQUdBOztBQUVJOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFFRztBQUNIOztBQUVEOztBQUVJO0FBQ0E7QUFDSDs7QUFFRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFIMEI7O0FBTzlCO0FBQ0E7OztBQUtBOztBQUVBO0FBQ0E7QUFDSTtBQUNIOztBQUdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBRUg7O0FBRUc7QUFDQTs7QUFFQTs7QUFFQTtBQUNIO0FBQ0o7O0FBR0Q7O0FBRUk7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUk7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTtBQUdJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7QUFFSjtBQUNKOztBQUlEOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7O0FBUUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFJQTtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBR0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFSTtBQUNBO0FBRUg7O0FBRUQ7QUFDQTs7QUFFSTtBQUNIOztBQUVEOztBQUVBO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBR0E7QUFDSDs7QUFHRDs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBR0Q7QUFDSDs7QUFHRDs7O0FBR0E7O0FBR0k7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7Ozs7QUFJQTs7QUFHSTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7QUFHSTtBQUNIO0FBQ0o7QUFDRztBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFBd0Q7OztBQUVwRDtBQUNBOztBQUVBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBSUg7QUFDRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFHRDs7QUFFSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTs7QUFFQTtBQUNBO0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7O0FBRUk7QUFDSTtBQUNIO0FBR0o7QUFFSjtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVJOztBQUVBOztBQUVBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUVKOztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFFSDtBQUdKOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUE7QUFDSDs7QUFRRDs7QUFFSTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0E7QUFDSDs7QUFFRDtBQUNIOztBQUVEOztBQUVJOztBQUVBOztBQUVBO0FBQ0g7O0FBS0Q7QUFDQTs7QUFFSTtBQUVIOztBQU1EO0FBQ0E7O0FBRUk7O0FBR0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKOztBQUdEOztBQUVBO0FBQ0E7QUFDSDs7QUFFRDtBQUNIO0FBRUo7QUF4dUNJOzs7Ozs7Ozs7O0FDUFQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFDQTtBQUhROztBQU1aO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJOztBQUVJO0FBQ0E7QUFFSDtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUk7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7O0FBRUE7O0FBRUE7QUFDSDtBQUVKO0FBQ0c7QUFDQTs7QUFFQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBNUNROztBQVRKOztBQTBEWjtBQUNBOztBQU9BO0FBQ0E7O0FBRUk7O0FBRUM7O0FBRUE7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQztBQUNKOztBQXRGSTs7Ozs7Ozs7OztBQ0hUO0FBQ0E7Ozs7Ozs7Ozs7QUNKQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBRks7O0FBWkQ7O0FBb0JaOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBRUg7QUFFSjs7QUFFRDs7QUFFSTtBQUNBOztBQUVBO0FBRUg7O0FBR0Q7QUFDQTs7QUFFSTs7QUFFSDs7QUFwREk7Ozs7Ozs7Ozs7QUNFVDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBWm9COztBQWtCeEI7QUFDQTs7QUFFSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFJSjtBQUNBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBS0o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBTUo7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7O0FBTGEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBCb3hUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hUeXBlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3BlZWQ6MCxcclxuXHJcbiAgICAgICAgc3BlZWRNYXg6ODAwLFxyXG5cclxuICAgICAgICBhY2Nfc3BlZWQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjkuOCxcclxuICAgICAgICAgICAgdG9vbHRvcDpcIuWKoOmAn+W6plwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYm94SXRlbTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hJdGVtLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICBfc2hvd1R5cGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFNob3dUeXBlLktfTm9ybWFsLFxyXG4gICAgICAgICAgICB0eXBlOkJveFNob3dUeXBlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2hvd1R5cGU6e1xyXG5cclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaG93VHlwZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX05vcm1hbDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsQXJvdW5kOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxDb2xvcjpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsUmFuazpcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbFJhdzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG5cclxuICAgICAgICBfc3RhdGVfYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6Qm94U3RhdGUuRU5vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hTdGF0ZSxcclxuICAgICAgICAgICAgLy8gdmlzaWJsZTpmYWxzZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN0YXRlX2I6e1xyXG5cclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZV9iO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3N0YXRlX2IgIT09IHZhbHVlKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGVfYiA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IHRoaXMuc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRU5vcm1hbDpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxpbmc6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRmFsbGVkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoXCJhbmlfYm94XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVEZXN0cm95OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmkafmr4HlkLlhc2RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5pbWF0aW9uLnBsYXkoXCJhbmlfZGVzdHJveVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhbmVsLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbmVsLmJveERyb3BfZGVzdHJveSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2Rlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG5cclxuICAgICAgICAgICAgLy8gdG9vbHRvcDpcIuaWueWdl+eahOeKtuaAgVwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXRpY3M6e1xyXG4gICAgICAgIEJveFN0YXRlOkJveFN0YXRlXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RfaXRlbSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcInNlbFwiKTtcclxuICAgICAgICB0aGlzLnRpdGxlU2hvdyA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIkxhYmVsXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgdW51c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInhpYW9odWlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gLTEwMDAwMDtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hJdGVtLmFuaV9wb2ludCA9IFtdO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2hvbmd5b25nXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG4gICAgICAgIHRoaXMuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX05vcm1hbDtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLmNsaWNrX2FkZCgpO1xyXG4gICAgICAgIC8vIHRoaXMuc3BlZWRfeCA9IDIwO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Qm94SXRlbTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCF0aGlzLmJveEl0ZW0pe1xyXG4gICAgICAgICAgICB0aGlzLmJveEl0ZW0gPSBuZXcgQm94SXRlbSgpOyAgICBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNsaWNrX2FjdGlvbjpmdW5jdGlvbigpe1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAg5Y+q5pyJ5YaNcGxheeeKtuaAgeS4i+aJjeiDveeCueWHu1xyXG4gICAgICAgICovXHJcbiAgICAgICAgbGV0IHBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgaWYocGFuZWwuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlBsYXkgJiZcclxuICAgICAgICAgICAgdGhpcy5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCkge1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLngrnlh7vkuoYgICBcIitcInJhbms9XCIrdGhpcy5ib3hJdGVtLnJhbmsrXCJyb3c9XCIrdGhpcy5ib3hJdGVtLnJvdyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWxpbWluYXRlID0gY2MuZmluZChcIkdhbWUvRWxpbWluYXRlXCIpLmdldENvbXBvbmVudChcIkVsaW1pbmF0ZVwiKTtcclxuICAgICAgICAgICAgZWxpbWluYXRlLmNsaWNrX2l0ZW0odGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIGJveF9kZXN0cm95OmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy/liqjnlLvnu5PmnZ/kuYvlkI7nmoTlm57osINcclxuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmkafmr4HliqjnlLvlrozmiJBcIik7XHJcblxyXG4gICAgICAgIGxldCBwYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICBwYW5lbC5ib3hEcm9wX2Rlc3Ryb3kodGhpcyk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICByZXNldE9yaWdpblBvczpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3k7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5jb2xvciA9IHRoaXMuYm94SXRlbS5jb2xvcl9zaG93O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIGJveFNwZWNpYWxseVNob3c6ZnVuY3Rpb24gKHR5cGUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5lbmRfeTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hJdGVtLmNvbG9yX3R5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMubm9kZS5jb2xvciA9IHRoaXMuYm94SXRlbS5jb2xvcl9zaG93O1xyXG5cclxuICAgICAgICBpZih0eXBlID09PSBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAxMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcblxyXG4gICAgICAgIC8v5aaC5p6c5piv5q2j5Zyo5o6J6JC955qEIOWIt+aWsGVuZHkg55qE5Z2Q5qCHXHJcbiAgICAgICAgLy8gaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyB8fFxyXG4gICAgICAgIC8vICAgICB0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVEZXN0cm95KXtcclxuICAgICAgICBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tID0gdGhpcy5ub2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0ICogMC41O1xyXG5cclxuICAgICAgICAgICAgaWYgKGJveF9ib3R0b20gPiB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuICAgICAgICAgICAgICAgIC8v5Yqg6YCf5bqm5o6J6JC9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNwZWVkX24gPSB0aGlzLmN1cnJlbnRTcGVlZCArIHRoaXMuYWNjX3NwZWVkKmR0O1xyXG4gICAgICAgICAgICAgICAgbGV0IHMgPSAoc3BlZWRfbiArIHRoaXMuY3VycmVudFNwZWVkICkqMC41ICogZHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgc3BlZWRfbiA9IE1hdGgubWluKHNwZWVkX24sdGhpcy5zcGVlZE1heCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IHNwZWVkX247XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgLT0gcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS55IDw9IHRoaXMuYm94SXRlbS5lbmRfeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog5o6J6JC95Yiw5oyH5a6a5L2N572u55qE5pe25YCZ5by55Yqo5LiA5LiLXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZih0aGlzLmJveEl0ZW0uYW5pX3BvaW50Lmxlbmd0aCA+IDApe1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLpnIDopoHlgZrlgY/np7vmk43kvZwg5Yik5patXCIpO1xyXG4gICAgICAgICAgICAvLyBsZXQgcG9pbnRfYSA9IHRoaXMuYm94SXRlbS5ibGFua19tb3ZlX3BvaW50XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWrei/meS4quS9jee9rueahHkg6ZyA6KaB5Zyo55qEeOeahOS9jee9rlxyXG4gICAgICAgICAgICAvLyBsZXQgcG9pbnRzID0gdGhpcy5ib3hJdGVtLmJsYW5rX21vdmVfcG9pbnQuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIHRoaXMubm9kZS55IDwgZWxlbS55O1xyXG4gICAgICAgICAgICAvLyB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxhc3RfcG9pbnQgPSB0aGlzLmJveEl0ZW0uYW5pX3BvaW50WzBdO1xyXG5cclxuICAgICAgICAgICAgaWYobGFzdF9wb2ludCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm5vZGUueCAhPT0gbGFzdF9wb2ludC54ICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA8IGxhc3RfcG9pbnQueSl7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYobGFzdF9wb2ludC5pc2xlZnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5bem6L6555qE6YCS5YePXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLm5vZGUueCAtIHRoaXMuc3BlZWQqMC4zO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubm9kZS54IDw9IGxhc3RfcG9pbnQueCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gbGFzdF9wb2ludC54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJveEl0ZW0uYW5pX3BvaW50LnNoaWZ0KCk7Ly/liKDpmaTnrKzkuIDkuKrlhYPntKBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT0956e76ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+WPs+i+ueeahOmAkuWinlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ub2RlLnggKyB0aGlzLnNwZWVkKjAuMztcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm5vZGUueCA+PSBsYXN0X3BvaW50Lngpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3hJdGVtLmFuaV9wb2ludC5zaGlmdCgpOy8v5Yig6Zmk56ys5LiA5Liq5YWD57SgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09Peenu+mZpFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPT09PVwiICsgbGFzdF9wb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYoWUhEZWJ1Zyl7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGVTaG93LmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGVTaG93LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGhpcy5ib3hJdGVtLnJhbmsgKyBcIl9cIiArIHRoaXMuYm94SXRlbS5yb3c7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLldoaXRlIHx8XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5ZRUxMT1cpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZVNob3cuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5ub2RlLmNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGVTaG93LmdldENvbXBvbmVudChjYy5MYWJlbCkubm9kZS5jb2xvciA9IGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50aXRsZVNob3cuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiAodGhpcy5ub2RlLnggPiB0aGlzLmJveEl0ZW0uYmVnaW5feCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5vZGUueCAtPSB0aGlzLnNwZWVkICogZHQ7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gaWYgKHRoaXMubm9kZS54IDwgdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICAvLyB9XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbiIsIlxyXG5cclxuXHJcbnZhciBCb3hUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hUeXBlO1xyXG5cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgICAgIC8v5byA5aeL5o6J6JC955qE5L2N572ueFxyXG4gICAgICAgIGJlZ2luX3g6MCxcclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnlcclxuICAgICAgICBiZWdpbl95IDogMCxcclxuICAgICAgICAvL+imgeaKtei+vueahOS9jee9rllcclxuICAgICAgICBlbmRfeSA6IC0xMDAwLFxyXG4gICAgICAgIC8v5pi+56S655qE6aKc6ImyXHJcbiAgICAgICAgY29sb3JfdHlwZSA6IEJveFR5cGUuV2hpdGUsXHJcblxyXG4gICAgICAgIGNvbG9yX3Nob3c6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCh0aGlzLmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5XaGl0ZTpyZXR1cm4gY2MuQ29sb3IuV0hJVEU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLllFTExPVzpyZXR1cm4gY2MuQ29sb3IuWUVMTE9XO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5HcmVlbjpyZXR1cm4gY2MuQ29sb3IuR1JFRU47XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJsdWU6cmV0dXJuIGNjLkNvbG9yLkJMVUU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJsYWNrOnJldHVybiBjYy5Db2xvci5CTEFDSztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmFycmllcjpyZXR1cm4gY2MuQ29sb3IuUkVEO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbGFuazogcmV0dXJuIGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6cmV0dXJuIGNjLkNvbG9yLkNZQU47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+ihjFxyXG4gICAgICAgIHJhbmsgOiAwLFxyXG4gICAgICAgIC8v5YiXXHJcbiAgICAgICAgcm93IDogMCxcclxuXHJcblxyXG4gICAgICAgIC8q56e75YqoeeeahOS9jee9riDnrKblkIjmnaHku7bnmoTopoHmm7TmlrAgeOeahOWdkOagh1xyXG4gICAgICAgICog6YeM6Z2i5pivIHt4OjAseTozLGlzbGVmdDp0cnVlfSDlrZflhbjnsbvlnotcclxuICAgICAgICAqICovXHJcbiAgICAgICAgYW5pX3BvaW50IDogW10sXHJcblxyXG5cclxuICAgICAgICBpZDp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFuay50b1N0cmluZygpICsgdGhpcy5yb3cudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJcclxuXHJcbnZhciBCb3hEcm9wID0gcmVxdWlyZShcIkJveERyb3BcIik7XHJcbnZhciBCb3hJdGVtID0gcmVxdWlyZShcIkJveEl0ZW1cIik7XHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBHYW1lX1N0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5HYW1lX1N0YXRlO1xyXG52YXIgQm94VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94VHlwZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgICAgIGJveF9wcmVmYWI6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yYW5rOntcclxuICAgICAgICAgICAgZGVmYXVsdDoxMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuWIl+aVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jvdzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLooYzmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN1cGVyX25vZGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBfZ2FtZVN0YXRlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpHYW1lX1N0YXRlLlN0YXJ0LFxyXG4gICAgICAgICAgICB0eXBlOkdhbWVfU3RhdGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2FtZXN0YXRlOntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nYW1lU3RhdGU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9nYW1lU3RhdGUgIT09IHZhbHVlKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGV0IHRlbXBCZWZvcmUgPSB0aGlzLl9nYW1lU3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZih0ZW1wQmVmb3JlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy/mmK/liJrlrp7kvovmuLjmiI/lrozkuYvlkI5cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy/liJvlu7rpmpznoo3nialcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5jcmVhdGVCYXJyaWVyQ2FudmFzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lU3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUgPT09IEdhbWVfU3RhdGUuUGxheSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA5aeL5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsQmVnaW5PcmlnaW5ZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVtb3ZlQnlWYWx1ZSA9IGZ1bmN0aW9uKGFycix2YWwpe1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGk8YXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKGFycltpXSA9PT0gdmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy8gQXJyYXkucHJvdG90eXBlLmZpbHRlclJlcGVhdCA9IGZ1bmN0aW9uKCl7ICBcclxuICAgICAgICAvLyAgICAgLy/nm7TmjqXlrprkuYnnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgLy8gICAgIGlmKGFyci5sZW5ndGggPiAwKXtcclxuICAgICAgICAvLyAgICAgICAgIGFyci5wdXNoKHRoaXNbMF0pO1xyXG4gICAgICAgIC8vICAgICB9XHJcblxyXG4gICAgICAgIC8vICAgICBmb3IodmFyIGkgPSAxOyBpIDwgdGhpcy5sZW5ndGg7IGkrKyl7ICAgIC8v5LuO5pWw57uE56ys5LqM6aG55byA5aeL5b6q546v6YGN5Y6G5q2k5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5a+55YWD57Sg6L+b6KGM5Yik5pat77yaICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5aaC5p6c5pWw57uE5b2T5YmN5YWD57Sg5Zyo5q2k5pWw57uE5Lit56ys5LiA5qyh5Ye6546w55qE5L2N572u5LiN5pivaSAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+mCo+S5iOaIkeS7rOWPr+S7peWIpOaWreesrGnpobnlhYPntKDmmK/ph43lpI3nmoTvvIzlkKbliJnnm7TmjqXlrZjlhaXnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICAgICAgaWYodGhpcy5pbmRleE9mKHRoaXNbaV0pID09IGkpeyAgXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgYXJyLnB1c2godGhpc1tpXSk7ICBcclxuICAgICAgICAvLyAgICAgICAgIH0gIFxyXG4gICAgICAgIC8vICAgICB9ICBcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGFycjsgIFxyXG4gICAgICAgIC8vIH0gIFxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0ID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gMTAwO1xyXG4gICAgICAgIHRoaXMuaXRlbUhlaWdodCA9IDEwMDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtU3BhY2UgPSA1O1xyXG5cclxuICAgICAgICAvL3RoaXMubWFyZ2luX3RvcCA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICAvL3RoaXMubWFyZ2luX2JvdHRvbSA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41IC0gdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW5fdG9wID0gLSh0aGlzLnN1cGVyX25vZGUuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqdGhpcy5udW1fcm93ICsgdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcm93IC0gMSkgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2JvdHRvbSA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX2xlZnQgPSAgLXRoaXMuaXRlbVdpZHRoKnRoaXMubnVtX3JhbmsqMC41ICsgdGhpcy5pdGVtU3BhY2UqKHRoaXMubnVtX3JhbmsqMC41LTEpO1xyXG4gICAgICAgIHRoaXMubWFyZ2luX3JpZ2h0ID0gdGhpcy5pdGVtV2lkdGggKiB0aGlzLm51bV9yYW5rICogMC41IC0gdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcmFuayAqIDAuNSAtIDEpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXNkcyAgXCIgKyB0aGlzLm1hcmdpbl90b3ArXCIgIFwiK3RoaXMubWFyZ2luX2JvdHRvbSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIC8q6Zqc56KN54mp55qE5pa55Z2X5YiX6KGoKi9cclxuICAgICAgICB0aGlzLmxpc3RCYXJyaWVyID0gW107XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZXBsYXlHYW1lKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v6YeN5paw5byA5aeL5ri45oiPXHJcbiAgICByZXBsYXlHYW1lOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5TdGFydDtcclxuXHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5zdXBlcl9ub2RlLmNoaWxkcmVuO1xyXG5cclxuICAgICAgICB3aGlsZShjaGlsZHJlbi5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm94RHJvcF9kZXN0cm95KGNoaWxkcmVuW2ldLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+a4heepunJhbmtsaXN0XHJcbiAgICAgICAgdmFyIGl0ZW07XHJcbiAgICAgICAgd2hpbGUgKGl0ZW0gPSB0aGlzLnJhbmtMaXN0LnNoaWZ0KCkpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIua4heepuuaIkD09PT09PT09PT3lip89PT09PT1cIik7XHJcblxyXG4gICAgICAgIC8v5Yib5bu65omA5pyJ6Z2i5p2/55qE5pWw5o2uXHJcbiAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGluZGV4PHRoaXMubnVtX3Jhbms7IGluZGV4Kyspe1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJhbmtDb250ZW50KGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQWxsQmVnaW5PcmlnaW5ZKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlQmFycmllckNhbnZhcygpO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyrliJvlu7rpmpznoo3niakg5biD5bGAXHJcbiAgICAqIDEu5Zyo6Zqc56KN54mp5LiL6Z2i55qE54mp5L2T5oqK5LuW5riF56m6XHJcbiAgICAqIDIu6L+Z5Liq5YiX55qE5pWw6YeP5rKh5pyJ5Y+Y6L+Y5piv6L+Z5Lqb5pWw6YePXHJcbiAgICAqICovXHJcbiAgICBjcmVhdGVCYXJyaWVyQ2FudmFzOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDM7IGk8dGhpcy5udW1fcmFuay0zOyBpKyspe1xyXG4gICAgICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGV0IGJveCA9IGxpc3RbN107XHJcbiAgICAgICAgLy8gICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIC8vICAgICBib3hfYy5ib3hTcGVjaWFsbHlTaG93KEJveFR5cGUuQmFycmllcik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvKiAg5riF56m65pWw57uEKi9cclxuICAgICAgICB0aGlzLmxpc3RCYXJyaWVyLnNwbGljZSgwLHRoaXMubGlzdEJhcnJpZXIubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgbGV0IGJhcnJpZXJMaXN0ID0gW1xyXG5cclxuICAgICAgICAgICAge1wicm93XCI6NyxcInJhbmtcIjoyfSx7XCJyb3dcIjo2LFwicmFua1wiOjJ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjN9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjR9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjV9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjZ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjd9LHtcInJvd1wiOjYsXCJyYW5rXCI6N30sXHJcblxyXG5cclxuICAgICAgICAgICAge1wicm93XCI6MixcInJhbmtcIjoyfSx7XCJyb3dcIjozLFwicmFua1wiOjJ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjoyLFwicmFua1wiOjN9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjoyLFwicmFua1wiOjZ9LFxyXG4gICAgICAgICAgICB7XCJyb3dcIjoyLFwicmFua1wiOjd9LHtcInJvd1wiOjMsXCJyYW5rXCI6N30sXHJcblxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAvL+WwhmJsYW5r5oyJcm935aSn5bCP5o6S5bqPIOS7juWwj+WIsOWkpyDlupXpg6jliLDpobbpg6gg5o6S5bqP5bqV6YOo5Yiw6aG26YOoXHJcbiAgICAgICAgYmFycmllckxpc3Quc29ydChmdW5jdGlvbiAoYSxiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhLnJvdyAtIGIucm93O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL+iuvue9ruaYryBiYXJyaWVy55qE5pa55Z2X57G75Z6LXHJcbiAgICAgICAgYmFycmllckxpc3QuZm9yRWFjaChmdW5jdGlvbihlbGUpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2VsZS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGJveCA9IGxpc3RbZWxlLnJvd107XHJcbiAgICAgICAgICAgIGlmKGJveCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0QmFycmllci5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hTcGVjaWFsbHlTaG93KEJveFR5cGUuQmFycmllcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLyrorr7nva7ov5nkuKpiYXJyaWVy5LiL55qE5pa55Z2XKi9cclxuICAgICAgICBiYXJyaWVyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbZWxlLnJhbmtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IG51bV9iID0gMDsgbnVtX2I8ZWxlLnJvdztudW1fYisrKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+i/meS4quS9jee9ruiuvue9ruaIkOepuueZveWNoOS9jeS/oeaBr1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3RbbnVtX2JdO1xyXG4gICAgICAgICAgICAgICAgaWYoYm94ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveFNwZWNpYWxseVNob3coQm94VHlwZS5CbGFuayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuYmxhbmtCZWdpbkZpbGwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKuW8gOWni+epuuS9jeWhq+WFhSovXHJcbiAgICBibGFua0JlZ2luRmlsbDpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8q55yL5piv5ZCm6ZyA6KaB5Yib5bu6IOaWueWdlyDljrvloavlhYXljaDkvY3mlrnlnZcqL1xyXG5cclxuICAgICAgICBpZih0aGlzLmxpc3RCYXJyaWVyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvL+ayoeaciemanOeijeeJqVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKuepuue8uueahOaWueWdlyovXHJcbiAgICAgICAgbGV0IGxpc3RCbGFuayA9IFtdO1xyXG5cclxuICAgICAgICAvL+mBjeWOhuWHuuWcuuaZr+S4reaJgOacieeahOepuuS9jeaWueWdl1xyXG4gICAgICAgIC8vIGZvcihsZXQgYl9pID0gMDsgYl9pIDwgdGhpcy5udW1fcm93OyBiX2krKyl7XHJcbiAgICAgICAgZm9yKGxldCBiX2kgPSAwOyBiX2kgPCB0aGlzLm51bV9yb3c7IGJfaSsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCBiX2ogPSAwOyBiX2ogPCB0aGlzLm51bV9yYW5rOyBiX2orKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5yYW5rTGlzdFtiX2pdW2JfaV07XHJcbiAgICAgICAgICAgICAgICBpZihib3ggIT09IHVuZGVmaW5lZCAmJiAgYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgICAgICAvL+i/meS4quS9jee9ruaYr+epuue8uueahFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RCbGFuay5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsaXN0QmxhbmtSaWdodFRvTGVmdCA9IGxpc3RCbGFuay5zbGljZSgwKTtcclxuICAgICAgICBsZXQgbGlzdEJsYW5rTGVmdFRvUmlnaHQgPSBsaXN0Qmxhbmsuc2xpY2UoMCk7XHJcblxyXG4gICAgICAgIC8v5a+5YmxhbmvmjpLluo8g5LuO5LiK5Yiw5LiLIOS7juWPs+W+gOW3plxyXG4gICAgICAgIGxpc3RCbGFua1JpZ2h0VG9MZWZ0LnNvcnQoZnVuY3Rpb24oYm94YSxib3hiKXtcclxuICAgICAgICAgICAgaWYoYm94YS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucm93ID09PSBib3hiLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yb3cpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJveGIuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLnJhbmsgLSBib3hhLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yYW5rO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm94Yi5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucm93IC0gYm94YS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucm93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy/lr7libGFua+aOkuW6jyDku47kuIrliLDkuIsg5LuO5bem5b6A5Y+zXHJcbiAgICAgICAgbGlzdEJsYW5rTGVmdFRvUmlnaHQuc29ydChmdW5jdGlvbihib3hhLGJveGIpe1xyXG4gICAgICAgICAgICBpZihib3hhLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yb3cgPT09IGJveGIuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLnJvdyl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm94YS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0ucmFuayAtIGJveGIuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLnJhbms7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib3hiLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yb3cgLSBib3hhLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5yb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICBpZihsaXN0QmxhbmsubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgLy/ml6DnqbrnvLrkvY3nva5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsaXN0QmxhbmtSaWdodFRvTGVmdC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYmxhbmtBdmlhYmxlRmlsbEl0ZW0obGlzdEJsYW5rUmlnaHRUb0xlZnRbaV0sZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQmVnaW5GaWxsKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsaXN0QmxhbmtMZWZ0VG9SaWdodC5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYmxhbmtBdmlhYmxlRmlsbEl0ZW0obGlzdEJsYW5rTGVmdFRvUmlnaHRbaV0sdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtCZWdpbkZpbGwoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICAvL+WOu+aOieWPr+a2iOmZpOeahOmAiemhuVxyXG4gICAgICAgIC8vIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyog5aGr5YWF6L+Z5Liq5pa55Z2XXHJcbiAgICAqIOWIpOaWrei/meS4quaWueWdl+aYr+WQpuWPr+Whq+WFhVxyXG4gICAgKiDmlrnlkJHpobrluo8g5LiKIOW3piDlj7MqL1xyXG4gICAgYmxhbmtBdmlhYmxlRmlsbEl0ZW06ZnVuY3Rpb24gKGJsYW5rX2JveCxpc0xlZnRBcnJvdykge1xyXG5cclxuICAgICAgICBsZXQgYm94X2MgPSBibGFua19ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGJveF90b3AgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFua11bYm94X2MuYm94SXRlbS5yb3crMV07XHJcbiAgICAgICAgbGV0IGJveF90b3BMZWZ0ID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmstMV1bYm94X2MuYm94SXRlbS5yb3crMV07XHJcbiAgICAgICAgbGV0IGJveF90b3BSaWdodCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rKzFdW2JveF9jLmJveEl0ZW0ucm93KzFdO1xyXG5cclxuICAgICAgICBsZXQgYm94X3JlID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAvL+mhtumDqOaYr+acieaWueWdl+WPr+S7peWhq+WFhVxyXG4gICAgICAgIGlmKGJveF90b3AgIT09IHVuZGVmaW5lZCAmJiBib3hfdG9wLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICBib3hfcmUgPSBib3hfdG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGJveF90b3BMZWZ0ICE9PSB1bmRlZmluZWQgJiYgYm94X3RvcExlZnQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCAmJiBpc0xlZnRBcnJvdyl7XHJcbiAgICAgICAgICAgIGJveF9yZSA9IGJveF90b3BMZWZ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGJveF90b3BSaWdodCAhPT0gdW5kZWZpbmVkICYmIGJveF90b3BSaWdodC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50ICYmICFpc0xlZnRBcnJvdyl7XHJcbiAgICAgICAgICAgIGJveF9yZSA9IGJveF90b3BSaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGJveF9yZSAhPT0gdW5kZWZpbmVkKXtcclxuXHJcbiAgICAgICAgICAgIC8v5pu/5o2i5YiwIOacrOi6q+S5i+WJjeWwseaYryDnqbrnvLrmlrnlnZfnmoTkvY3nva4g6YeN5paw5byA5aeLIOWhq+WFhVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ibGFua1JlcGxhY2VCb3goYmxhbmtfYm94LGJveF9yZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8q5pu/5o2i5pa55Z2XIOW5tuaJp+ihjOabv+aNouWIh+aNoueahOWKqOeUu+aViOaenCovXHJcbiAgICBibGFua1JlcGxhY2VCb3ggOmZ1bmN0aW9uIChib3hCbGFuayxib3hSZXBsYWNlKSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfcmUgPSBib3hSZXBsYWNlLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgbGV0IGJveF9ibCA9IGJveEJsYW5rLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIC8v6KaB5Y+W5pyA5ZCO5LiA5Liq5L2N572uIOadpeWIpOaWrei/meS4quWKqOeUu+aYr+Wkn+a3u+WKoOi/h1xyXG4gICAgICAgIC8vIGxldCBsYXN0UG9pbnQgPSBib3hfcmUuYm94SXRlbS5hbmlfcG9pbnRbYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50Lmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAvL+WtmOWCqOWKqOeUu+eahOiKgueCuVxyXG4gICAgICAgIGxldCBpc2xlZnQgPSBib3hfYmwuYm94SXRlbS5iZWdpbl94IDwgYm94X3JlLmJveEl0ZW0uYmVnaW5feDtcclxuXHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50LnB1c2goe1xyXG4gICAgICAgICAgICBcInhcIjogYm94X2JsLmJveEl0ZW0uYmVnaW5feCxcclxuICAgICAgICAgICAgXCJ5XCI6IGJveF9ibC5ib3hJdGVtLmVuZF95ICsgYm94X2JsLm5vZGUuaGVpZ2h0LFxyXG4gICAgICAgICAgICBcImlzbGVmdFwiOiBpc2xlZnRcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIGJveFJlcGxhY2UueSA9IGJveF9ibC5ib3hJdGVtLmVuZF95ICsgYm94X2JsLm5vZGUuaGVpZ2h0O1xyXG4gICAgICAgIC8vIGJveFJlcGxhY2UueCA9IGJveF9ibC5ib3hJdGVtLmJlZ2luX3g7XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIGxldCB0ZW1wQmVnaW55ID0gYm94X3JlLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgbGV0IGhhdmVUb3AgPSB0aGlzLmJsYW5rVG9wQm94RXhpdChib3hSZXBsYWNlKTtcclxuICAgICAgICBpZighaGF2ZVRvcCl7XHJcbiAgICAgICAgICAgIHRoaXMuYmxhbmtSZW1vdmVJdGVtQXRSYW5rKGJveFJlcGxhY2UpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxldCB0ZW1wQmVnaW54ID0gYm94X3JlLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICBsZXQgdGVtcEJlZ2luWSA9IGJveF9yZS5ib3hJdGVtLmJlZ2luX3k7XHJcbiAgICAgICAgbGV0IHRlbXBFbmR5ID0gYm94X3JlLmJveEl0ZW0uZW5kX3k7XHJcbiAgICAgICAgbGV0IHRlbXBSb3cgPSBib3hfcmUuYm94SXRlbS5yb3c7XHJcbiAgICAgICAgbGV0IHRlbXBSYW5rID0gYm94X3JlLmJveEl0ZW0ucmFuaztcclxuXHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0uYmVnaW5feCA9IGJveF9ibC5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0uYmVnaW5feSA9IGJveF9ibC5ib3hJdGVtLmJlZ2luX3k7XHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0uZW5kX3kgPSBib3hfYmwuYm94SXRlbS5lbmRfeTtcclxuICAgICAgICBib3hfcmUuYm94SXRlbS5yb3cgPSBib3hfYmwuYm94SXRlbS5yb3c7XHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0ucmFuayA9IGJveF9ibC5ib3hJdGVtLnJhbms7XHJcblxyXG4gICAgICAgIGJveF9ibC5ib3hJdGVtLmJlZ2luX3ggPSB0ZW1wQmVnaW54O1xyXG4gICAgICAgIGJveF9ibC5ib3hJdGVtLmVuZF95ID0gdGVtcEVuZHk7XHJcbiAgICAgICAgYm94X2JsLmJveEl0ZW0ucm93ID0gdGVtcFJvdztcclxuICAgICAgICBib3hfYmwuYm94SXRlbS5yYW5rID0gdGVtcFJhbms7XHJcbiAgICAgICAgYm94X2JsLmJveEl0ZW0uYmVnaW5feSA9IHRlbXBCZWdpbnk7XHJcbiAgICAgICAgYm94X2JsLmJveEl0ZW0uYmVnaW5feSA9IHRlbXBCZWdpblk7XHJcblxyXG5cclxuICAgICAgICBpZihoYXZlVG9wKXtcclxuICAgICAgICAgICAgLy/ov5nkuKrkvY3nva7nmoTmlrnlnZforr7nva7miJDnqbrnvLrnmoTnirbmgIFcclxuICAgICAgICAgICAgLy/ljaDkvY3nmoTmlrnlnZcg5L2N572u5pu/5o2i5oiQ6KaB56e75YWl55qE5pa55Z2XICDnp7vpmaTov5nkuKrljaDkvY3mlrnlnZdcclxuICAgICAgICAgICAgdGhpcy5yYW5rTGlzdFtib3hfcmUuYm94SXRlbS5yYW5rXVtib3hfcmUuYm94SXRlbS5yb3ddID0gYm94UmVwbGFjZTtcclxuICAgICAgICAgICAgdGhpcy5yYW5rTGlzdFtib3hfYmwuYm94SXRlbS5yYW5rXVtib3hfYmwuYm94SXRlbS5yb3ddID0gYm94Qmxhbms7XHJcblxyXG4gICAgICAgICAgICBib3hfYmwuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJsYW5rKTtcclxuXHJcbiAgICAgICAgICAgIC8v5LuO5aS05byA5aeL6YeN5paw6YGN5Y6GXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICB9ZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvL+WNoOS9jeeahOaWueWdlyDkvY3nva7mm7/mjaLmiJDopoHnp7vlhaXnmoTmlrnlnZcgIOenu+mZpOi/meS4quWNoOS9jeaWueWdl1xyXG4gICAgICAgICAgICB0aGlzLnJhbmtMaXN0W2JveF9yZS5ib3hJdGVtLnJhbmtdW2JveF9yZS5ib3hJdGVtLnJvd10gPSBib3hSZXBsYWNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ib3hQb29sLnB1dChib3hfYmwubm9kZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgYmxhbmtSZW1vdmVJdGVtQXRSYW5rOmZ1bmN0aW9uIChib3hSZW1vdmUpIHtcclxuXHJcbiAgICAgICAgbGV0IGJveF9yZSA9IGJveFJlbW92ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3hfcmUuYm94SXRlbS5yYW5rXTtcclxuICAgICAgICBsaXN0LnJlbW92ZUJ5VmFsdWUobGlzdCxib3hSZW1vdmUpO1xyXG5cclxuICAgICAgICBsZXQgbmV3X2JveCA9IHRoaXMudXBkYXRlUmFua0VuZFlJbmRleChib3hfcmUuYm94SXRlbS5yYW5rKTtcclxuXHJcbiAgICAgICAgaWYobmV3X2JveCAhPT0gbnVsbCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBuZXdfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGlmKGJveF9jLm5vZGUueSAhPT0gYm94X2MuYm94SXRlbS5lbmRfeSl7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB8fCAoYm94X2Mubm9kZS55ID49IGJveF9jLmJveEl0ZW0uYmVnaW5feSkpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+S7luacrOi6q+aYr+acgOWQjuS4gOS4qiDot5/lgJLmlbDnrKzkuozkuKrlr7nmr5RcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdF9ib3ggPSBsaXN0W2xpc3QubGVuZ3RoLTJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGxhc3RfYm94ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSBsYXN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uYmVnaW5feSArIGJveF9jLm5vZGUuaGVpZ2h0ICsgMTAqbGlzdC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3AgKyBzcGFjZV90b3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYm94X2Mubm9kZS55ID0gYm94X2MuYm94SXRlbS5iZWdpbl95O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8v5piv6KaB5o6J6JC955qEXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIGJsYW5rVG9wQm94RXhpdDpmdW5jdGlvbiAoYm94KSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfYiA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSBib3hfYi5ib3hJdGVtLnJvdysxOyBpIDwgdGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgYiA9IHRoaXMucmFua0xpc3RbYm94X2IuYm94SXRlbS5yYW5rXVtpXTtcclxuICAgICAgICAgICAgaWYoYiAhPT0gdW5kZWZpbmVkICYmIGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CYXJyaWVyKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLy8gLyrmo4DmtYvmmK/lkKblj6/ku6Xmm7/mjaJcclxuICAgIC8vICogYm94X2Mg6L+Z5Liq6KaB5pON5L2c55qE5pa55Z2X57G75Z6LICDmmK8g6Zqc56KN54mpXHJcbiAgICAvLyAqICovXHJcbiAgICAvLyBibGFua0NoZWNrUmVwbGFjZUJsYW5rQXZhaWxhYmxlIDogZnVuY3Rpb24gKGJveCkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYoYm94X2MuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJhcnJpZXIpe1xyXG4gICAgLy8gICAgICAgICAvL+aYr+manOeijeeJqVxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgLy/ov5nkuKrpmpznoo3niannmoTovrnnlYzkuKTovrkg54mp5L2T5pivIOi+ueeVjCDjgIHpmpznoo3nianjgIHmlrnlnZdcclxuICAgIC8vICAgICAgICAgbGV0IGJveF9sZWZ0ID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmstMV1bYm94X2MuYm94SXRlbS5yb3ddO1xyXG4gICAgLy8gICAgICAgICBsZXQgYm94X1JpZ2h0ID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmsrMV1bYm94X2MuYm94SXRlbS5yb3ddO1xyXG4gICAgLy8gICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIC8v5aaC5p6c6L+Z5Liq6Zqc56KN54mpIOS4iiDlt6Yg5Y+zIOmDveacieWFtuS7lueahOmanOeijeeJqSDov5nkuKrpmpznoo3niankuI3lgZrlpITnkIYg55Sx5LuW5LiK5pa55o6J6JC955qE5pa55Z2X5aSE55CGXHJcbiAgICAvLyAgICAgICAgIC8vIGxldCBoYXZlUmlnaHQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgZm9yKGxldCBpID0gYm94X2MuYm94SXRlbS5yYW5rKzE7IGkgPCB0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtpXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJhcnJpZXIpe1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIC8vICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgIC8vIH0uYmluZCh0aGlzKSkoKTtcclxuICAgIC8vICAgICAgICAgLy8gbGV0IGhhdmVMZWZ0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vICAgICAgICAgLy8gICAgIGZvcihsZXQgaSA9IGJveF9jLmJveEl0ZW0ucmFuay0xOyBpID49IDA7IGktLSl7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2ldW2JveF9jLmJveEl0ZW0ucm93XTtcclxuICAgIC8vICAgICAgICAgLy8gICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgLy8gICAgIH1cclxuICAgIC8vICAgICAgICAgLy8gICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKSgpO1xyXG4gICAgLy8gICAgICAgICBsZXQgaGF2ZVRvcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBmb3IobGV0IGkgPSBib3hfYy5ib3hJdGVtLnJvdysxOyBpIDwgdGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmtdW2ldO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CYXJyaWVyKXtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gICAgICAgICB9LmJpbmQodGhpcykpKCk7XHJcbiAgICAvLyAgICAgICAgIC8vXHJcbiAgICAvLyAgICAgICAgIC8vIGlmKGhhdmVMZWZ0ICYmIGhhdmVSaWdodCAmJmhhdmVUb3Ape1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCLov5nkuKrkuInpnaLpg73mnInpmpznoo3niakgXCIrYm94X2MuYm94SXRlbS5yYW5rICtcIiAgXCIrIGJveF9jLmJveEl0ZW0ucm93KTtcclxuICAgIC8vICAgICAgICAgLy8gICAgIC8vIHJldHVybjtcclxuICAgIC8vICAgICAgICAgLy8gfWVsc2Uge1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgICAgICAvLyB9XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgaWYoYm94X2JvdHRvbSAhPT0gdW5kZWZpbmVkICYmIGJveF9ib3R0b20uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgLy8gICAgICAgICAgICAgLy/ov5nkuKrlupXpg6jmmK/nqbrnmoQg5Y+v5Lul5aGr5YWF5pa55Z2XXHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgLy/loavlhYXlhYgg5bem5YaN5Y+zXHJcbiAgICAvLyAgICAgICAgICAgICBpZihib3hfUmlnaHQgIT09IHVuZGVmaW5lZCAmJiBib3hfUmlnaHQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy/lj7PovrnkvY3nva7mjonokL3loavlhYVcclxuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuWPs+i+ueS9jee9riDlvoDlt6bovrnloavlhYXmjonokL3loavlhYVcIik7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8v5Y+m5aSW6L6555WM55qE6YKj5Liq6Zqc56KN54mpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGVkZ2VPdGhlckJveCA9IHRoaXMuYmxhbmtHZXRCb3JkZXJCYXJyaWVyQm94KGJveCk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8v56e76ZmkIOW3pui+uei/meS4quimgeWIoOmZpOeahCDmm7TmlrDmlrDnmoTmlrnlnZfnmoTlvIDlp4vkvY3nva7kv6Hmga9cclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVtb3ZlSXRlbUF0UmFuayhib3hfUmlnaHQpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+iuvue9ruimgeabv+aNoueahOS9jee9rlxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b20sYm94X1JpZ2h0LGVkZ2VPdGhlckJveCk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtDaGVja1JlcGxhY2VCbGFua0F2YWlsYWJsZShib3gpO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgZWxzZSBpZihib3hfbGVmdCAhPT0gdW5kZWZpbmVkICYmIGJveF9sZWZ0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8v5bem6L655L2N572u5o6J6JC95aGr5YWFXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLlt6bovrnkvY3nva7mjonokL3loavlhYUg5b6A5Y+z6L655aGr5YWF5o6J6JC95aGr5YWFXCIpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+WPpuWklui+ueeVjOeahOmCo+S4qumanOeijeeJqVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBlZGdlT3RoZXJCb3ggPSB0aGlzLmJsYW5rR2V0Qm9yZGVyQmFycmllckJveChib3gpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+enu+mZpCDlt6bovrnov5nkuKropoHliKDpmaTnmoQg5pu05paw5paw55qE5pa55Z2X55qE5byA5aeL5L2N572u5L+h5oGvXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlbW92ZUl0ZW1BdFJhbmsoYm94X2xlZnQpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+iuvue9ruimgeabv+aNoueahOS9jee9rlxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b20sYm94X2xlZnQsZWRnZU90aGVyQm94KTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5ibGFua0NoZWNrUmVwbGFjZUJsYW5rQXZhaWxhYmxlKGJveCk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfSxcclxuICAgIC8vXHJcbiAgICAvLyAvL+aIluiAhei/meS4qumanOeijeeJqeebuOmCu+WcqOS4gOi1tyDlj6blpJbkuIDovrnnmoTpmpznoo3nialcclxuICAgIC8vIGJsYW5rR2V0Qm9yZGVyQmFycmllckJveDpmdW5jdGlvbiAoYm94KSB7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGxldCBlZGdlX2I7Ly8gPSB1bmRlZmluZWQ7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgLy8gICAgIGxldCByb3cgPSBib3hfYy5ib3hJdGVtLnJvdztcclxuICAgIC8vICAgICBsZXQgcmFuayA9IGJveF9jLmJveEl0ZW0ucmFuaztcclxuICAgIC8vXHJcbiAgICAvLyAgICAgLy/liKTmlq3ov5nkuKrmlrnlnZfnmoTlj7PovrnmnInmsqHmnIlcclxuICAgIC8vICAgICBmb3IobGV0IGkgPSByYW5rKzE7IGkgPCB0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2ldW3Jvd107XHJcbiAgICAvLyAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgIC8vICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgLy8gICAgICAgICB9ZWxzZSBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLkJsYW5rKXtcclxuICAgIC8vICAgICAgICAgICAgIGVkZ2VfYiA9IGI7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgLy/lt6bovrlcclxuICAgIC8vICAgICBmb3IobGV0IGogPSByYW5rLTE7IGogPj0gMDsgai0tKXtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtqXVtyb3ddO1xyXG4gICAgLy8gICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAgIC8vICAgICAgICAgfWVsc2UgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5CbGFuayl7XHJcbiAgICAvLyAgICAgICAgICAgICBlZGdlX2IgPSBiO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICBpZihlZGdlX2IgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBsZXQgZWRnZV9yYW5rID0gZWRnZV9iLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLnJhbms7XHJcbiAgICAvLyAgICAgICAgIGxldCBlZGdlX3JvdyA9IGVkZ2VfYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5yb3c7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAvL+W6leS4i1xyXG4gICAgLy8gICAgICAgICBmb3IobGV0IGsgPSBlZGdlX3Jvdy0xOyBrID49IDA7IGstLSl7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgbGV0IGJiID0gdGhpcy5yYW5rTGlzdFtlZGdlX3JhbmtdW2tdO1xyXG4gICAgLy8gICAgICAgICAgICAgaWYoYmIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgIC8vICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgIC8vICAgICAgICAgICAgIH1lbHNlIGlmKGJiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLkJsYW5rKXtcclxuICAgIC8vICAgICAgICAgICAgICAgICBlZGdlX2IgPSBiYjtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgcmV0dXJuIGVkZ2VfYjtcclxuICAgIC8vIH0sXHJcbiAgICAvL1xyXG4gICAgLy8gLyrmo4DmtYvmmK/lkKblj6/ku6Xmm7/mjaJcclxuICAgIC8vICAqIGJveF9jIOi/meS4quimgeaTjeS9nOeahOaWueWdl+exu+WeiyAg5pivIOaWueWdl1xyXG4gICAgLy8gICogKi9cclxuICAgIC8vIGJsYW5rQ2hlY2tSZXBsYWNlTm9ybWFsQXZhaWxhYmxlIDogZnVuY3Rpb24gKGJveCxlZGdlT3RoZXJCb3gpe1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgIC8vICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAvLyAgICAgICAgIC8v5piv5pa55Z2XXHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAvL+i/meS4quaWueWdl+eahCDlt6bkuIvmlrkg5Y+z5LiL5pa5IOato+S4i+aWuSDliKTmlq3mmK/lkKbmmK/nqbrkvY1cclxuICAgIC8vICAgICAgICAgbGV0IGJveF9ib3R0b21fbGVmdCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rLTFdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG4gICAgLy8gICAgICAgICBsZXQgYm94X2JvdHRvbV9SaWdodCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rKzFdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG4gICAgLy8gICAgICAgICBsZXQgYm94X2JvdHRvbV96aGVuZyA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgIC8vICAgICAgICAgaWYoYm94X2JvdHRvbV96aGVuZyAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAvLyAgICAgICAgICAgICBib3hfYm90dG9tX3poZW5nLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAvL+ato+S4i+aWueaYr+epuueahCDlvoDmraPkuIvmlrkg5pu/5o2iXHJcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuato+S4i+aWueaYr+epuueahCDlvoDmraPkuIvmlrkg5pu/5o2iXCIpO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbV96aGVuZyxib3gsZWRnZU90aGVyQm94KTtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICAgICAgfWVsc2UgaWYoYm94X2JvdHRvbV9sZWZ0ICE9PSB1bmRlZmluZWQgJiZcclxuICAgIC8vICAgICAgICAgICAgIGJveF9ib3R0b21fbGVmdC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAvLyAgICAgICAgICAgICAvL+W3puS4i+aWueaYr+epuueahCDlvoDlt6bkuIvmlrkg5pu/5o2iXHJcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuW3puS4i+aWuVwiKTtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b21fbGVmdCxib3gsZWRnZU90aGVyQm94KTtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICAgICAgfWVsc2UgaWYoYm94X2JvdHRvbV9SaWdodCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAvLyAgICAgICAgICAgICBib3hfYm90dG9tX1JpZ2h0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKXtcclxuICAgIC8vICAgICAgICAgICAgIC8v5Y+z5LiL5pa55piv56m655qEIOW+gOWPs+S4i+aWuSDmm7/mjaJcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5Y+z5LiL5pa5XCIpO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbV9SaWdodCxib3gsZWRnZU90aGVyQm94KTtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyB9LFxyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vIC8q5pu/5o2i5pa55Z2XIOW5tuaJp+ihjOabv+aNouWIh+aNoueahOWKqOeUu+aViOaenCovXHJcbiAgICAvLyBibGFua1JlcGxhY2VCb3ggOmZ1bmN0aW9uIChib3hCbGFuayxib3hSZXBsYWNlLGVkZ2VPdGhlckJveCl7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGxldCBib3hfcmUgPSBib3hSZXBsYWNlLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAvLyAgICAgbGV0IGJveF9ibCA9IGJveEJsYW5rLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vICAgICAvL+iuvue9rnjnmoTkvY3nva7lj5jljJbnmoTml7blgJkg54K5XHJcbiAgICAvLyAgICAgLy8gbGV0IHJlcGVhdExpc3QgPSBib3hfcmUuYm94SXRlbS5hbmlfcG9pbnQuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgLy8gICAgIC8vICAgICByZXR1cm4gZWxlbS54ID09PSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgLy8gICAgIC8vIH0pO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAvL+imgeWPluacgOWQjuS4gOS4quS9jee9riDmnaXliKTmlq3ov5nkuKrliqjnlLvmmK/lpJ/mt7vliqDov4dcclxuICAgIC8vICAgICBsZXQgbGFzdFBvaW50ID0gYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50W2JveF9yZS5ib3hJdGVtLmFuaV9wb2ludC5sZW5ndGggLSAxXTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgLy/lrZjlgqjliqjnlLvnmoToioLngrlcclxuICAgIC8vICAgICBsZXQgaXNsZWZ0ID0gYm94X2JsLmJveEl0ZW0uYmVnaW5feCA8IGJveF9yZS5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAvLyAgICAgaWYobGFzdFBvaW50ID09PSB1bmRlZmluZWQgfHwgbGFzdFBvaW50LnggIT09IGJveF9ibC5ib3hJdGVtLmJlZ2luX3gpe1xyXG4gICAgLy8gICAgICAgICBib3hfcmUuYm94SXRlbS5hbmlfcG9pbnQucHVzaCh7XCJ4XCI6IGJveF9ibC5ib3hJdGVtLmJlZ2luX3gsIFwieVwiOiBib3hfYmwuYm94SXRlbS5lbmRfeSArIGJveF9ibC5ub2RlLmhlaWdodCxcImlzbGVmdFwiOmlzbGVmdH0pO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGJveF9yZS5ib3hJdGVtLmJlZ2luX3ggPSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgLy8gICAgIGJveF9yZS5ib3hJdGVtLmVuZF95ID0gYm94X2JsLmJveEl0ZW0uZW5kX3k7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIC8vIGxldCB0ZW1wX3JhbmsgPSBib3hfcmUuYm94SXRlbS5yYW5rO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBib3hfcmUuYm94SXRlbS5yb3cgPSBib3hfYmwuYm94SXRlbS5yb3c7XHJcbiAgICAvLyAgICAgYm94X3JlLmJveEl0ZW0ucmFuayA9IGJveF9ibC5ib3hJdGVtLnJhbms7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIC8v6L+Z5Liq5pa55Z2X57un57ut5b6A5LiL5pu/5o2iXHJcbiAgICAvLyAgICAgaWYodGhpcy5ibGFua0NoZWNrUmVwbGFjZU5vcm1hbEF2YWlsYWJsZShib3hSZXBsYWNlLGVkZ2VPdGhlckJveCkpe1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIuenu+WKqOWujOaIkCDmm7/mjaI9PT09PT09XCIpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgLy/ljaDkvY3nmoTmlrnlnZcg5L2N572u5pu/5o2i5oiQ6KaB56e75YWl55qE5pa55Z2XICDnp7vpmaTov5nkuKrljaDkvY3mlrnlnZdcclxuICAgIC8vICAgICAgICAgdGhpcy5yYW5rTGlzdFtib3hfYmwuYm94SXRlbS5yYW5rXVtib3hfYmwuYm94SXRlbS5yb3ddID0gYm94UmVwbGFjZTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94X2JsLm5vZGUpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy8gICAgIC8v5ZCO6Z2i6YGN5Y6G55qE5pe25YCZ5oqK5LuW56e76Zmk5o6JXHJcbiAgICAvLyAgICAgLy90aGlzLnJhbmtMaXN0W3RlbXBfcmFua10ucmVtb3ZlQnlWYWx1ZSh0aGlzLnJhbmtMaXN0W3RlbXBfcmFua10sYm94UmVwbGFjZSk7XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vICAgICAvLyBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuICAgIC8vICAgICAvL1xyXG4gICAgLy8gICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAvLyAgICAgLy9cclxuICAgIC8vICAgICAvLyAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG4gICAgLy8gICAgIC8vXHJcbiAgICAvLyAgICAgLy8gICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgLy8gICAgIC8vIH0sXHJcbiAgICAvL1xyXG4gICAgLy8gfSxcclxuXHJcblxyXG4gICAgLy8gYmxhbmtSZW1vdmVJdGVtQXRSYW5rOmZ1bmN0aW9uIChib3hSZW1vdmUpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgbGV0IGJveF9yZSA9IGJveFJlbW92ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgLy8gICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3hfcmUuYm94SXRlbS5yYW5rXTtcclxuICAgIC8vICAgICBsaXN0LnJlbW92ZUJ5VmFsdWUobGlzdCxib3hSZW1vdmUpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBsZXQgbmV3X2JveCA9IHRoaXMudXBkYXRlUmFua0VuZFlJbmRleChib3hfcmUuYm94SXRlbS5yYW5rKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYobmV3X2JveCAhPT0gbnVsbCl7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBsZXQgYm94X2MgPSBuZXdfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAvLyAgICAgICAgIGlmKGJveF9jLm5vZGUueSAhPT0gYm94X2MuYm94SXRlbS5lbmRfeSl7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgaWYoKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB8fCAoYm94X2Mubm9kZS55ID49IGJveF9jLmJveEl0ZW0uYmVnaW5feSkpe1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAvL+S7luacrOi6q+aYr+acgOWQjuS4gOS4qiDot5/lgJLmlbDnrKzkuozkuKrlr7nmr5RcclxuICAgIC8vICAgICAgICAgICAgICAgICBsZXQgbGFzdF9ib3ggPSBsaXN0W2xpc3QubGVuZ3RoLTJdO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmKGxhc3RfYm94ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSBsYXN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uYmVnaW5feSArIGJveF9jLm5vZGUuaGVpZ2h0ICsgMTAqbGlzdC5sZW5ndGg7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3AgKyBzcGFjZV90b3A7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgYm94X2Mubm9kZS55ID0gYm94X2MuYm94SXRlbS5iZWdpbl95O1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIC8v5piv6KaB5o6J6JC955qEXHJcbiAgICAvLyAgICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5IHx8XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyB8fFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgIC8vICAgICAgICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxpbmc7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH1lbHNle1xyXG4gICAgLy8gICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsZWQ7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfSxcclxuICAgIFxyXG5cclxuXHJcbiAgICAvL+WIm+W7uuavj+S4gOWIl+eahOaVsOaNrlxyXG4gICAgY3JlYXRlUmFua0NvbnRlbnQ6ZnVuY3Rpb24oaW5kZXgpe1xyXG5cclxuICAgICAgICBsZXQgcmFua19saXN0ID0gW107XHJcblxyXG4gICAgICAgIGxldCBvcmlnaW5feCA9IHRoaXMubWFyZ2luX2xlZnQgKyAodGhpcy5pdGVtV2lkdGgrdGhpcy5pdGVtU3BhY2UpKmluZGV4O1xyXG4gICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1fcm93OyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMuYm94RHJvcF9nZXQoKTtcclxuICAgICAgICAgICAgYm94LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBib3gud2lkdGggPSB0aGlzLml0ZW1XaWR0aDtcclxuICAgICAgICAgICAgYm94LmhlaWdodCA9IHRoaXMuaXRlbUhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmluaXRCb3hJdGVtKCk7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmVuZF95ID0gdGhpcy5tYXJnaW5fYm90dG9tICsgKHRoaXMuaXRlbUhlaWdodCt0aGlzLml0ZW1TcGFjZSkqKGkrMSk7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucmFuayA9IGluZGV4O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IGk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY291bnQgPSBCb3hUeXBlLlR5cGVDb3VudDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5jb2xvcl90eXBlID0gKGNjLnJhbmRvbTBUbzEoKSpjb3VudCkgfCAwO1xyXG5cclxuICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgIGJveC5wYXJlbnQgPSB0aGlzLnN1cGVyX25vZGU7XHJcblxyXG4gICAgICAgICAgICByYW5rX2xpc3QucHVzaChib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdC5wdXNoKHJhbmtfbGlzdCk7XHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy/mm7TmlrDmiYDmnInliJcgZW5kIHnnmoTmlbDmja5cclxuICAgIHVwZGF0ZUFsbFJhbmtFbmRZOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlICE9PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuXHJcbiAgICAgICAgICAgIC8v5LiN5piv5Yid5aeL5YyW5ri45oiP55qEICDloavlhYUg6Zqc56KN54mp5LiL5pa555qE5pa55Z2XXHJcbiAgICAgICAgICAgIHRoaXMuYmxhbmtCZWdpbkZpbGwoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+eci+ivpeWIl+eahOaVsOmHj+aYr+WQpiDlsI/kuo4gdGhpcy5udW1fcm93ICDlsJHkuo7nmoTor53liJnooaXlhYVcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJhbmtFbmRZSW5kZXgoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyrmm7TmlrDmn5DliJfnmoTmlbDmja4qL1xyXG4gICAgdXBkYXRlUmFua0VuZFlJbmRleDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCBjcmVhdGVCb3ggPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuXHJcbiAgICAgICAgbGV0IGxpc3Rfc3ViID0gdGhpcy5yYW5rTGlzdFtpbmRleF07XHJcblxyXG4gICAgICAgIHdoaWxlKGxpc3Rfc3ViLmxlbmd0aCA8IHRoaXMubnVtX3Jvdyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3X2JveCA9IHRoaXMuYm94RHJvcF9nZXQoKTtcclxuICAgICAgICAgICAgbmV3X2JveC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBuZXdfYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIG5ld19ib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmluaXRCb3hJdGVtKCk7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSAwO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgIG5ld19ib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgbGlzdF9zdWIucHVzaChuZXdfYm94KTtcclxuXHJcblxyXG4gICAgICAgICAgICBjcmVhdGVCb3ggPSBuZXdfYm94O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxldCBlbmRfYm94X3kgPSB0aGlzLm1hcmdpbl9ib3R0b207XHJcblxyXG4gICAgICAgIC8v5pu05paw5q+P5Liq5YWD57Sg55qEZW5kIHkg5L2N572uXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8bGlzdF9zdWIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gbGlzdF9zdWJbaV07XHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IGl0ZW1fYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKmk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJveDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw5q+P5LiA5YiX5LuW5Lus5Lit55qE5q+P5Liq5YWD57Sg55qE5Yid5aeL55qEb3JpZ2luIHnnmoTlgLxcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQWxsQmVnaW5PcmlnaW5ZOmZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOafkOS4gOWIl+S4rSDku47mnIDlkI7lvIDlp4vpgY3ljobov5Tlm55cclxuICAgICAgICAgKiDnrpflh7rlvIDlp4vmjonkuobnmoTkvY3nva5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpiDlt7Lovr7liLDku5bnmoRlbmR5IOWmguaenOi/mOacqui+vuWIsOWwseaYryDmraPopoHmjonokL1cclxuICAgICAgICAgICAgbGV0IG9mZl90b3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VfdG9wID0gNTtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvL2JveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiAxLuWunuS+i+a4uOaIj+eahOaXtuWAmSDliJ3lp4vlvIDlp4vnmoTkvY3nva5cclxuICAgICAgICAgICAgICAgICAgICAgKiAyLua2iOmZpOeahCDmlrnlnZfkuI3lnKjnlYzpnaLkuK3nmoTorr7nva7ku5bnmoTlvIDlp4vkvY3nva4g5bey5Zyo55WM6Z2i5Lit55qE5LiN5Y676K6+572u5LuWXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3AgKyBvZmZfdG9wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Mubm9kZS55ID0gYm94X2MuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmX3RvcCA9IG9mZl90b3AgKyBib3hfYy5ub2RlLmhlaWdodCArIHNwYWNlX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlX3RvcCA9IHNwYWNlX3RvcCArIDEwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/mmK/opoHmjonokL3nmoRcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+S6pOaNouS4pOS4quaWueWdl+eahOS9jee9rlxyXG4gICAgZXhjaGFuZ2VCb3hJdGVtOmZ1bmN0aW9uKGJveDEsYm94Mix0b0NoZWNrVmlhYmxlID0gdHJ1ZSl7XHJcblxyXG4gICAgICAgIGxldCBib3hJdGVtMSA9IGJveDEuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgIGxldCBib3hJdGVtMiA9IGJveDIuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICBpZihib3hJdGVtMS5yYW5rID09PSBib3hJdGVtMi5yYW5rKXtcclxuICAgICAgICAgICAgLy/lkIzkuIDliJfnmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveEl0ZW0xLnJhbmtdO1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkvY3nva5cclxuICAgICAgICAgICAgbGV0IHRlbXBfZW5keSA9IGJveEl0ZW0yLmVuZF95O1xyXG4gICAgICAgICAgICBib3hJdGVtMi5lbmRfeSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5lbmRfeSA9IHRlbXBfZW5keTtcclxuXHJcbiAgICAgICAgICAgIGJveDEubm9kZS5ydW5BY3Rpb24oY2MubW92ZVRvKDAuMixjYy5wKGJveEl0ZW0xLmJlZ2luX3gsYm94SXRlbTEuZW5kX3kpKSk7XHJcbiAgICAgICAgICAgIGJveDIubm9kZS5ydW5BY3Rpb24oY2MubW92ZVRvKDAuMixjYy5wKGJveEl0ZW0yLmJlZ2luX3gsYm94SXRlbTIuZW5kX3kpKSk7XHJcbiAgICAgICAgICAgIC8vIGJveDEubm9kZS55ID0gYm94SXRlbTEuZW5kX3k7XHJcbiAgICAgICAgICAgIC8vIGJveDIubm9kZS55ID0gYm94SXRlbTIuZW5kX3k7XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS/oeaBr1xyXG4gICAgICAgICAgICBsZXQgdGVtcF9yb3cgPSBib3hJdGVtMi5yb3c7XHJcblxyXG4gICAgICAgICAgICBib3hJdGVtMi5yb3cgPSBib3hJdGVtMS5yb3c7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLnJvdyA9IHRlbXBfcm93OyAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgbGV0IHRlbXBfbm9kZSA9IGxpc3RbYm94SXRlbTEucm93XTtcclxuICAgICAgICAgICAgbGlzdFtib3hJdGVtMS5yb3ddID0gbGlzdFtib3hJdGVtMi5yb3ddO1xyXG4gICAgICAgICAgICBsaXN0W2JveEl0ZW0yLnJvd10gPSB0ZW1wX25vZGU7XHJcblxyXG5cclxuXHJcbiAgICAgICAgfWVsc2UgaWYoYm94SXRlbTEucm93ID09PSBib3hJdGVtMi5yb3cpe1xyXG4gICAgICAgICAgICAvL+WQjOS4gOihjOeahFxyXG4gICAgICAgICAgICBsZXQgbGlzdDEgPSB0aGlzLnJhbmtMaXN0W2JveEl0ZW0xLnJhbmtdO1xyXG4gICAgICAgICAgICBsZXQgbGlzdDIgPSB0aGlzLnJhbmtMaXN0W2JveEl0ZW0yLnJhbmtdO1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkvY3nva5cclxuICAgICAgICAgICAgbGV0IHRlbXBfYmVnaW54ID0gYm94SXRlbTIuYmVnaW5feDtcclxuICAgICAgICAgICAgYm94SXRlbTIuYmVnaW5feCA9IGJveEl0ZW0xLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLmJlZ2luX3ggPSB0ZW1wX2JlZ2lueDtcclxuXHJcbiAgICAgICAgICAgIGJveDEubm9kZS5ydW5BY3Rpb24oY2MubW92ZVRvKDAuMixjYy5wKGJveEl0ZW0xLmJlZ2luX3gsYm94SXRlbTEuZW5kX3kpKSk7XHJcbiAgICAgICAgICAgIGJveDIubm9kZS5ydW5BY3Rpb24oY2MubW92ZVRvKDAuMixjYy5wKGJveEl0ZW0yLmJlZ2luX3gsYm94SXRlbTIuZW5kX3kpKSk7XHJcbiAgICAgICAgICAgIC8vIGJveDEubm9kZS55ID0gYm94SXRlbTEuZW5kX3k7XHJcbiAgICAgICAgICAgIC8vIGJveDIubm9kZS55ID0gYm94SXRlbTIuZW5kX3k7XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS/oeaBr1xyXG4gICAgICAgICAgICBsZXQgdGVtcF9yYW5rID0gYm94SXRlbTIucmFuaztcclxuICAgICAgICAgICAgYm94SXRlbTIucmFuayA9IGJveEl0ZW0xLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLnJhbmsgPSB0ZW1wX3Jhbms7XHJcblxyXG4gICAgICAgICAgICBsZXQgcm93X2luZGV4ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdDFbcm93X2luZGV4XTtcclxuICAgICAgICAgICAgbGlzdDFbcm93X2luZGV4XSA9IGxpc3QyW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QyW3Jvd19pbmRleF0gPSB0ZW1wX25vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZih0b0NoZWNrVmlhYmxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBpc1ZpYWJsZSA9IHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWlzVmlhYmxlKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+S4jeWPr+a2iOmZpOeahOivnSDkvY3nva7lho3kupLmjaLlm57mnaVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5LiN5Y+v5raI6ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhjaGFuZ2VCb3hJdGVtKGJveDIsYm94MSxmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDMwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5qOA5rWL6Z2i5p2/5omA5pyJ5pa55Z2XIOaYr+WQpuWPr+a2iOmZpFxyXG4gICAgY2hlY2tQYW5lbEVsaW1pbmF0YWJsZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBsZXQgd2lwZV9saXN0ID0gW107XHJcblxyXG4gICAgICAgIC8v5Yik5pat5YiXIOaYr+WQpuacieS4ieS4quS7peWPiuS4ieS4quS7peS4iueahOS4gOagt+eahOiJsuWdl+i/nuWcqOS4gOi1t1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yb3c7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8q6aKc6Imy55u45ZCMIOW5tuS4lOaYr+aZrumAmuexu+Wei+eahOminOiJsueahOaXtuWAmSovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbV9wcmUuY29sb3JfdHlwZSA9PT0gaXRlbV9ib3guY29sb3JfdHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtX3ByZS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGogPT09ICh0aGlzLm51bV9yb3ctMSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvQWRkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcExpc3QubGVuZ3RoID49IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov73liqDliLB3aXBl6YeM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh3aXBlX2xpc3QsdGVtcExpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+a4heepuuaVsOe7hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzUmVwZWF0SXRlbUluV2lwZShpdGVtKXtcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTx3aXBlX2xpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYod2lwZV9saXN0W2ldLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5pZCA9PT0gaXRlbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uaWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5Yik5pat6KGMIOaYr+WQpuacieS4ieS4quS7peWPiuS4ieS4quS7peS4iueahOS4gOagt+eahOiJsuWdl+i/nuWcqOS4gOi1t1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3JvdzsgaSsrKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0ZW1wTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcHJlX2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcmFuazsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLnJhbmtMaXN0W2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYoIXByZV9ib3gpe1xyXG4gICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fcHJlID0gcHJlX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvQWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbV9wcmUuY29sb3JfdHlwZSA9PT0gaXRlbV9ib3guY29sb3JfdHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtX3ByZS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGogPT09ICh0aGlzLm51bV9yYW5rLTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzUmVwZWF0SXRlbUluV2lwZShlbGVtKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5wdXNoKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYod2lwZV9saXN0Lmxlbmd0aCA+IDApe1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dEZWxheUFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIC8v5LiN5pi+56S65raI6Zmk5Yqo55S7XHJcbiAgICAgICAgICAgICAgICBzaG93RGVsYXlBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8v5LiN5piv5Yid5aeL5YyW55qEIOWBnOeVmeS4gOS8muWEv+WGjea2iOmZpCDorqnnlKjmiLfnnIvliLDopoHmtojpmaTkuobku4DkuYjkuJzopb9cclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/mtojpmaTmjolcclxuICAgICAgICAgICAgICAgIC8vIHdpcGVfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBsZXQgYm94ID0gZWxlbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIGJveC5zdGF0ZV9iID0gQm94U3RhdGUuRURlc3Ryb3k7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5ib3hEcm9wX2Rlc3Ryb3koZWxlbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpKTtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gZWxlbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGF2ZVRvcCA9IHRoaXMuYmxhbmtUb3BCb3hFeGl0KGVsZW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZihoYXZlVG9wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrmlrnlnZfpobbpg6jmmK/mnInpmpznoo3niannmoTor50g6L+Z5Liq5pa55Z2X5LiN6ZSA5q+BIOWwhuWug+iuvue9ruaIkCBCbGFua+exu+Wei1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3guYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJsYW5rKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5zdGF0ZV9iID0gQm94U3RhdGUuRURlc3Ryb3k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDov5novrnkuIDkuKrlu7bov59cclxuICAgICAgICAgICAgICAgICDlpoLmnpzmuLjmiI/mmK8g5Yid5aeL5YyW55qE6K+d5LiN5bu26L+fXHJcbiAgICAgICAgICAgICAgICAg5LiN5piv5Yid5aeL5YyWIHN0YXJ055qEIOimgeetiemUgOavgeWKqOeUu+WujOaIkOS5i+WQjuWGjeW8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/mnInplIDmr4HlnKjmjonokL1cclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSAhPT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5q2j5Zyo5o6J6JC95aGr5YWFXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5GaWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBbGxSYW5rRW5kWSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwodGhpcy5nYW1lc3RhdGUgIT09IEdhbWVfU3RhdGUuU3RhcnQpPzAuMzowLGZhbHNlKTtcclxuXHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksc2hvd0RlbGF5QW5pbWF0aW9uPzAuMzowLGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlBsYXk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgYm94RHJvcF9nZXQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IGJveCA9IG51bGw7XHJcbiAgICAgICAgaWYodGhpcy5ib3hQb29sLnNpemUoKSA+IDApe1xyXG4gICAgICAgICAgICBib3ggPSB0aGlzLmJveFBvb2wuZ2V0KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGJveCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm94X3ByZWZhYik7XHJcbiAgICAgICAgICAgIGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICB9LFxyXG5cclxuICAgIGJveERyb3BfZGVzdHJveTpmdW5jdGlvbihib3gpe1xyXG5cclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wucHV0KGJveC5ub2RlKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyrmmK/lkKblvIDlkK/osIPor5UqL1xyXG4gICAgZ2FtZVNob3dEZWJ1Z01lc3NhZ2U6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBZSERlYnVnID0gIVlIRGVidWc7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmlsbEludGVydmFsID09PSAxMCl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT095a6a5pe25byA5aeL5Yik5pat5piv5ZCm6YO95bey5o6J6JC95Yiw5bqV6YOo5LqGIGJlZ2luID09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3pg73liLAg5o6J6JC95Yiw5bqV6YOo5LqGIOajgOa1i+aYr+WQpuWPr+a2iOmZpCBlbmQgPT09PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG4vLyB2YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBfc2VsZWN0X2JveDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6YCJ5Lit5p+Q5Liq5pa55Z2XXHJcbiAgICAgICAgc2VsZWN0X2JveDoge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RfYm94O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdF9ib3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9uZXcgPSB2YWx1ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fb2xkID0gdGhpcy5fc2VsZWN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJveEl0ZW1fbmV3LmlkICE9PSBib3hJdGVtX29sZC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIueci+aYr+WQpuimgeS6pOS6kuS9jee9riDov5jmmK/or7TliIfmjaLliLDov5nkuKrpgInkuK3nmoTkvY3nva7lpITnkIZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQxID0gXCIgKyBib3hJdGVtX25ldy5pZCArIFwiICBpZDI9IFwiICsgYm94SXRlbV9vbGQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aXp+eahOWPlua2iOmAieaLqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94LnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0odmFsdWUsIHRoaXMuX3NlbGVjdF9ib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLkuI3mmK/nm7jov5HnmoQg5Y+W5raI5LiK5LiA5Liq6YCJ5oupIOmAieS4reaWsOeCueWHu+eahFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumAieS4reS6huWQjOS4gOS4qiDlj5bmtojpgInmi6lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgbGV0IGJveEl0ZW0gPSBjbGlja19ub2RlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgLy8gIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLmJveERyb3BfZGVzdHJveShjbGlja19ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gIC8v5LiK6Z2i55qE5o6J5LiL5p2lXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLnVwZGF0ZVJhbmtFbmRZKGJveEl0ZW0ucmFuayk7XHJcblxyXG5cclxuICAgICAgICAgdGhpcy5zZWxlY3RfYm94ID0gY2xpY2tfbm9kZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxuXG5cbi8v5piv5ZCm5byA5ZCv6LCD6K+VXG53aW5kb3cuWUhEZWJ1ZyA9IGZhbHNlO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cblxuICAgICAgICBsYWJfc2hvdzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICB9LFxuXG5cbiAgICBvY0NhbGxKczpmdW5jdGlvbiAoc3RyKSB7XG5cbiAgICAgICAgdGhpcy5sYWJfc2hvdy5ub2RlLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5sYWJfc2hvdy5zdHJpbmcgPSBzdHI7XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB0aGlzLmxhYl9zaG93Lm5vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgfSw1KTtcblxuICAgIH0sXG5cbiAgICBqc0NhbGxPYzpmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy/nsbvlkI0g5pa55rOVICDlj4LmlbAxIOWPguaVsDIg5Y+C5pWwM1xuICAgICAgICB2YXIgcmVzdWx0ID0ganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIkpTQk1hbmFnZXJcIixcInloSlNCQ2FsbDpcIixcImpz6L+Z6L655Lyg5YWl55qE5Y+C5pWwXCIpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwianNfY2FsbF9vYyA9PT09PT09PT0gJUBcIixyZXN1bHQpO1xuXG4gICAgfSxcblxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gdGhpcy5vY0NhbGxKcyhcIua1i+ivlSDmmL7npLrpmpDol49cIik7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiXG5cbi8q5pa55Z2X55qE57G75Z6LKi9cbmNvbnN0IEJveFR5cGUgPSBjYy5FbnVtKHtcbiAgICBZRUxMT1cgOiAtMSxcbiAgICBHcmVlbiA6IC0xLFxuICAgIEJsdWUgOiAtMSxcbiAgICBCbGFjayA6IC0xLFxuICAgIFdoaXRlIDogLTEsXG5cbiAgICBUeXBlQ291bnQgOiAtMSxcblxuICAgIEJhcnJpZXIgOiAtMSwgICAgICAgLy/pmpznoo3nialcbiAgICBCbGFuayA6IC0xLCAgICAgICAgICAvL+epuueZveWNoOS9jVxuXG4gICAgQ291bnQgOiAtMVxufSk7XG5cblxuXG5cbi8v5pa55Z2X5o6J6JC955qE54q25oCBXG5jb25zdCBCb3hTdGF0ZSA9IGNjLkVudW0oe1xuXG4gICAgLy8gRU5vbmUgOiAtMSwgICAgICAvL+S7gOS5iOmDveS4jeaYr1xuXG4gICAgRU5vcm1hbCA6IC0xLCAgICAvL+ato+W4uFxuICAgIEVGYWxsaW5nIDogLTEsICAgLy/mjonokL1cbiAgICBFRmFsbGVkIDogLTEsICAgIC8v5o6J6JC957uT5p2fXG4gICAgRURlc3Ryb3kgOiAtMSwgICAvL+mUgOavgVxuXG59KTtcblxuLy/mlrnlnZfmmL7npLrnmoTnirbmgIFcbmNvbnN0IEJveFNob3dUeXBlID0gY2MuRW51bSh7XG5cbiAgICBLX05vcm1hbCA6IC0xLCAgICAgICAgICAvL+ato+W4uFxuICAgIEtfU2VsZWN0IDogLTEsICAgICAgICAgIC8v6YCJ5LitXG5cbiAgICBLX1NraWxsQXJvdW5kIDogLTEsICAgICAgIC8v6ZSA5q+BIOWRqOi+ueeahOS5neS4qlxuICAgIEtfU2tpbGxSYW5rIDogLTEsICAgICAgICAgLy/plIDmr4Eg6K+l5YiXXG4gICAgS19Ta2lsbFJhdyA6IC0xLCAgICAgICAgICAvL+mUgOavgSDor6XooYxcbiAgICBLX1NraWxsQ29sb3IgOiAtMSwgICAgICAgIC8v6ZSA5q+BIOivpeiJslxufSk7XG5cblxuXG4vL+a4uOaIj+i/m+ihjOeahOeKtuaAgVxudmFyIEdhbWVfU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBTdGFydCA6IC0xLCAgICAgLy/lvIDlp4vlrp7kvotcbiAgICBGaWxsaW5nOiAtMSwgICAgLy/mlrnlnZfooaXpvZDkuK0g5o6J6JC95LitXG4gICAgLy8gQmxhbmtGaWxsaW5nIDogLTEsIC8v56m65L2N6KGl5YWFIOiHquWKqOaOieiQvVxuICAgIFBsYXkgOiAtMSwgICAgICAvL+i/m+ihjOS4rVxuICAgIE92ZXIgOiAtMSwgICAgICAvL+e7k+adn1xufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgQm94U3RhdGUsXG4gICAgQm94U2hvd1R5cGUsXG4gICAgR2FtZV9TdGF0ZSxcbiAgICBCb3hUeXBlXG5cbn07Il0sInNvdXJjZVJvb3QiOiIifQ==