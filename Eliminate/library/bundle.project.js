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

                /*判断左下方 或者 右下方 要填充的这个方块 与他的边界障碍物做判断 这个方块是由这边路口掉落 还是另外一边*/

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
        var repeatList = box_re.boxItem.ani_point.filter(function (elem) {
            return elem.x === box_bl.boxItem.begin_x;
        });

        //存储动画的节点
        var isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
        if (repeatList.length === 0) {
            box_re.boxItem.ani_point.push({ "x": box_bl.boxItem.begin_x, "y": box_bl.boxItem.end_y + box_bl.node.height, "isleft": isleft });
        }
        // else if(repeatList.length === 1){
        //     let dic = repeatList[0];
        //     dic.x = box_bl.boxItem.begin_x;
        //     dic.isleft = isleft;
        // }


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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvR2xvYmFsLmpzIiwiYXNzZXRzL3NjcmlwdC9KU0JDYWxsLmpzIiwiYXNzZXRzL3NjcmlwdC9TdGF0ZS9TdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBQ0E7QUFISTs7QUFPUjtBQUNJO0FBQ0E7QUFGTTs7QUFLVjs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7QUFDSTtBQUNJOztBQUVBOztBQUVKO0FBQ0k7O0FBRUE7O0FBRUo7O0FBR0k7O0FBRUo7O0FBR0k7O0FBRUo7O0FBSUk7O0FBRUo7O0FBRUk7O0FBN0JSO0FBaUNIO0FBekNJOztBQThDVDtBQUNJO0FBQ0E7QUFGSzs7QUFNVDs7QUFFSTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTs7QUFFSTs7QUFFSjs7QUFHSTs7QUFFSjtBQUNJOztBQUVBO0FBQ0o7QUFDSTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7O0FBRUQ7O0FBM0JSO0FBK0JIO0FBQ0o7O0FBRUQ7O0FBbERJOztBQTNFQTs7QUFvSVo7QUFDSTtBQURJOztBQUlSOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIOzs7QUFHRDtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUVIOztBQUVEO0FBQ0k7O0FBRUE7QUFDQTtBQUNIOztBQUlEO0FBQ0E7O0FBRUk7QUFDQTs7QUFFSDs7QUFFRDtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0k7OztBQUdBO0FBQ0E7O0FBR0k7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7O0FBSUQ7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQU1EOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDs7QUFHRDs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7O0FBR0Q7QUFDQTs7QUFHSTtBQUNBO0FBQ0E7QUFDQTs7QUFFSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNIOztBQUVEOztBQUVJOzs7QUFHQTs7QUFFQTtBQUNJO0FBQ0g7QUFDSjtBQUNKOztBQUdEOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBSUk7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRztBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDSDs7QUFHRDtBQUNJO0FBQ0E7QUFDQTtBQUVJO0FBQ0g7QUFDRztBQUNIO0FBRUo7QUFDRztBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFyVkk7Ozs7Ozs7Ozs7QUNMVDs7QUFHQTtBQUNJOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNJO0FBQ0k7QUFBbUI7QUFDbkI7QUFBb0I7QUFDcEI7QUFBbUI7QUFDbkI7QUFBa0I7QUFDbEI7QUFBbUI7QUFDbkI7QUFBcUI7QUFDckI7QUFBb0I7QUFDcEI7QUFBUTtBQVJaO0FBVUg7QUFaTTs7QUFlWDtBQUNBO0FBQ0E7QUFDQTs7QUFHQTs7O0FBR0E7O0FBR0E7QUFDSTtBQUNJO0FBQ0g7QUFIRjtBQXRDSzs7QUE2Q1o7QUFDQTs7QUFqREs7Ozs7Ozs7Ozs7QUNKVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNBO0FBRks7O0FBS1Q7QUFDSTtBQUNBO0FBRkk7O0FBS1I7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNJO0FBQ0g7QUFDRDs7QUFFSTs7QUFFSTs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0g7O0FBR0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVKO0FBQ0o7QUFDRDtBQTVCTTs7QUEzQkY7O0FBNERaO0FBQ0E7O0FBRUk7O0FBRUk7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBOztBQUlBOztBQUVBO0FBQ0E7QUFDSTtBQUNIOztBQUVEOztBQUVBO0FBQ0g7O0FBRUQ7Ozs7QUFJQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFpQkE7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVKOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNIOztBQUdEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFQTtBQUNIO0FBQ0o7O0FBR0Q7OztBQUdBOztBQUVJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUVIO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7QUFDRDtBQUNBOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0g7O0FBRUQ7OztBQUdBOztBQUVJO0FBQ0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNKOztBQUVEO0FBQ0g7O0FBUUQ7QUFDQTs7QUFFSTtBQUNBOztBQUdBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDs7QUFHRDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7O0FBR0Q7O0FBRUk7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUk7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTtBQUdJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7QUFFSjtBQUNKOztBQUlEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7QUFHSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFDSDs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUdBO0FBQ0g7O0FBR0Q7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUdEO0FBQ0g7O0FBR0Q7OztBQUdBOztBQUdJOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNBOztBQUVBOztBQUVJOzs7O0FBSUE7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBO0FBR0k7QUFDSDtBQUNKO0FBQ0c7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNBO0FBQXdEOzs7QUFFcEQ7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUlIO0FBQ0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBR0Q7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUdKO0FBRUo7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUdEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFSTtBQUNBO0FBRUg7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUVIO0FBR0o7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQVFEOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSDs7QUFLRDtBQUNBOztBQUVJO0FBRUg7O0FBTUQ7QUFDQTs7QUFFSTs7QUFHSTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7O0FBRUE7QUFDQTtBQUNIOztBQUVEO0FBQ0g7QUFFSjtBQW4vQkk7Ozs7Ozs7Ozs7QUNQVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBSFE7O0FBTVo7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7O0FBRUk7QUFDQTtBQUVIO0FBQ0c7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFSTs7QUFFQTtBQUNBOztBQUVBO0FBQ0g7QUFFRzs7QUFFQTs7QUFFQTtBQUNIO0FBRUo7QUFDRztBQUNBOztBQUVBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUE1Q1E7O0FBVEo7O0FBMERaO0FBQ0E7O0FBT0E7QUFDQTs7QUFFSTs7QUFFQzs7QUFFQTs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7OztBQUdDO0FBQ0o7O0FBdEZJOzs7Ozs7Ozs7O0FDSFQ7QUFDQTs7Ozs7Ozs7OztBQ0pBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFGSzs7QUFaRDs7QUFvQlo7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFHRDtBQUNBOztBQUVJOztBQUVIOztBQXBESTs7Ozs7Ozs7OztBQ0VUO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFab0I7O0FBa0J4QjtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUlKO0FBQ0E7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFLSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFNSjs7QUFFSTtBQUNBO0FBQ0E7QUFDQTs7QUFMYSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG5cclxudmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcbnZhciBCb3hTaG93VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U2hvd1R5cGU7XHJcbnZhciBHYW1lX1N0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5HYW1lX1N0YXRlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBzcGVlZDowLFxyXG5cclxuICAgICAgICBzcGVlZE1heDo4MDAsXHJcblxyXG4gICAgICAgIGFjY19zcGVlZDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6OS44LFxyXG4gICAgICAgICAgICB0b29sdG9wOlwi5Yqg6YCf5bqmXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBib3hJdGVtOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOkJveEl0ZW0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2UsXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIF9zaG93VHlwZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6Qm94U2hvd1R5cGUuS19Ob3JtYWwsXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U2hvd1R5cGVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzaG93VHlwZTp7XHJcblxyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Nob3dUeXBlO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfTm9ybWFsOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19TZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxBcm91bmQ6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbENvbG9yOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxSYW5rOlxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsUmF3OlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgICAgIF9zdGF0ZV9iOntcclxuICAgICAgICAgICAgZGVmYXVsdDpCb3hTdGF0ZS5FTm9ybWFsLFxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG4gICAgICAgICAgICAvLyB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhdGVfYjp7XHJcblxyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlX2I7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc3RhdGVfYiAhPT0gdmFsdWUpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZV9iID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gdGhpcy5zcGVlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FTm9ybWFsOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRmFsbGluZzpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVGYWxsZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGxheShcImFuaV9ib3hcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRURlc3Ryb3k6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaRp+avgeWQuWFzZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmltYXRpb24ucGxheShcImFuaV9kZXN0cm95XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocGFuZWwuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFuZWwuYm94RHJvcF9kZXN0cm95KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoXCJhbmlfZGVzdHJveVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHR5cGU6Qm94U3RhdGUsXHJcblxyXG4gICAgICAgICAgICAvLyB0b29sdG9wOlwi5pa55Z2X55qE54q25oCBXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc3RhdGljczp7XHJcbiAgICAgICAgQm94U3RhdGU6Qm94U3RhdGVcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdCgpe1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdF9pdGVtID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwic2VsXCIpO1xyXG4gICAgICAgIHRoaXMudGl0bGVTaG93ID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiTGFiZWxcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICB1bnVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwieGlhb2h1aVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSAtMTAwMDAwO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcmV1c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNob25neW9uZ1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgICAgICB0aGlzLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5jbGlja19hZGQoKTtcclxuICAgICAgICAvLyB0aGlzLnNwZWVkX3ggPSAyMDtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEJveEl0ZW06ZnVuY3Rpb24oKXtcclxuICAgICAgICBpZighdGhpcy5ib3hJdGVtKXtcclxuICAgICAgICAgICAgdGhpcy5ib3hJdGVtID0gbmV3IEJveEl0ZW0oKTsgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjbGlja19hY3Rpb246ZnVuY3Rpb24oKXtcclxuICAgICAgICAvKlxyXG4gICAgICAgIOWPquacieWGjXBsYXnnirbmgIHkuIvmiY3og73ngrnlh7tcclxuICAgICAgICAqL1xyXG4gICAgICAgIGxldCBwYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG4gICAgICAgIGlmKHBhbmVsLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5QbGF5ICYmXHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi54K55Ye75LqGICAgXCIrXCJyYW5rPVwiK3RoaXMuYm94SXRlbS5yYW5rK1wicm93PVwiK3RoaXMuYm94SXRlbS5yb3cpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGVsaW1pbmF0ZSA9IGNjLmZpbmQoXCJHYW1lL0VsaW1pbmF0ZVwiKS5nZXRDb21wb25lbnQoXCJFbGltaW5hdGVcIik7XHJcbiAgICAgICAgICAgIGVsaW1pbmF0ZS5jbGlja19pdGVtKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuXHJcbiAgICBib3hfZGVzdHJveTpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v5Yqo55S757uT5p2f5LmL5ZCO55qE5Zue6LCDXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pGn5q+B5Yqo55S75a6M5oiQXCIpO1xyXG5cclxuICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgcGFuZWwuYm94RHJvcF9kZXN0cm95KHRoaXMpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgcmVzZXRPcmlnaW5Qb3M6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBib3hTcGVjaWFsbHlTaG93OmZ1bmN0aW9uICh0eXBlKSB7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgIHRoaXMuYm94SXRlbS5jb2xvcl90eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm5vZGUuY29sb3IgPSB0aGlzLmJveEl0ZW0uY29sb3Jfc2hvdztcclxuXHJcbiAgICAgICAgaWYodHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMTA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG5cclxuICAgICAgICAvL+WmguaenOaYr+ato+WcqOaOieiQveeahCDliLfmlrBlbmR5IOeahOWdkOagh1xyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcgfHxcclxuICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRGVzdHJveSl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzcGVlZF9uID0gdGhpcy5jdXJyZW50U3BlZWQgKyB0aGlzLmFjY19zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIGxldCBzID0gKHNwZWVkX24gKyB0aGlzLmN1cnJlbnRTcGVlZCApKjAuNSAqIGR0O1xyXG5cclxuICAgICAgICAgICAgICAgIHNwZWVkX24gPSBNYXRoLm1pbihzcGVlZF9uLHRoaXMuc3BlZWRNYXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSBzcGVlZF9uO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUueSA8PSB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOaOieiQveWIsOaMh+WumuS9jee9rueahOaXtuWAmeW8ueWKqOS4gOS4i1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5ib3hJdGVtLmFuaV9wb2ludC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi6ZyA6KaB5YGa5YGP56e75pON5L2cIOWIpOaWrVwiKTtcclxuICAgICAgICAgICAgLy8gbGV0IHBvaW50X2EgPSB0aGlzLmJveEl0ZW0uYW5pX3BvaW50XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWrei/meS4quS9jee9rueahHkg6ZyA6KaB5Zyo55qEeOeahOS9jee9rlxyXG4gICAgICAgICAgICAvLyBsZXQgcG9pbnRzID0gdGhpcy5ib3hJdGVtLmFuaV9wb2ludC5maWx0ZXIoZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gdGhpcy5ub2RlLnkgPCBlbGVtLnk7XHJcbiAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGFzdF9wb2ludCA9IHRoaXMuYm94SXRlbS5hbmlfcG9pbnRbMF07XHJcblxyXG4gICAgICAgICAgICBpZihsYXN0X3BvaW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ICE9PSBsYXN0X3BvaW50LnggJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IDwgbGFzdF9wb2ludC55KXtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG5cclxuICAgICAgICAgICAgICAgIGlmKGxhc3RfcG9pbnQuaXNsZWZ0KXtcclxuICAgICAgICAgICAgICAgICAgICAvL+W3pui+ueeahOmAkuWHj1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ub2RlLnggLSB0aGlzLnNwZWVkKjAuNTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm5vZGUueCA8PSBsYXN0X3BvaW50Lngpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3hJdGVtLmFuaV9wb2ludC5zaGlmdCgpOy8v5Yig6Zmk56ys5LiA5Liq5YWD57SgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09Peenu+mZpFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lj7PovrnnmoTpgJLlop5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMubm9kZS54ICsgdGhpcy5zcGVlZCowLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ub2RlLnggPj0gbGFzdF9wb2ludC54KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSBsYXN0X3BvaW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm94SXRlbS5hbmlfcG9pbnQuc2hpZnQoKTsvL+WIoOmZpOesrOS4gOS4quWFg+e0oFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT3np7vpmaRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj09PT1cIiArIGxhc3RfcG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmKFlIRGVidWcpe1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuYm94SXRlbS5yYW5rICsgXCJfXCIgKyB0aGlzLmJveEl0ZW0ucm93O1xyXG4gICAgICAgICAgICBpZih0aGlzLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5XaGl0ZSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuWUVMTE9XKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGVTaG93LmdldENvbXBvbmVudChjYy5MYWJlbCkubm9kZS5jb2xvciA9IGNjLkNvbG9yLkJMQUNLO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlU2hvdy5nZXRDb21wb25lbnQoY2MuTGFiZWwpLm5vZGUuY29sb3IgPSBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGVTaG93LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMubm9kZS54ID4gdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5ub2RlLnggLT0gdGhpcy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA8IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxufSk7XHJcblxyXG4iLCJcclxuXHJcblxyXG52YXIgQm94VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94VHlwZTtcclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnhcclxuICAgICAgICBiZWdpbl94OjAsXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva55XHJcbiAgICAgICAgYmVnaW5feSA6IDAsXHJcbiAgICAgICAgLy/opoHmirXovr7nmoTkvY3nva5ZXHJcbiAgICAgICAgZW5kX3kgOiAtMTAwMCxcclxuICAgICAgICAvL+aYvuekuueahOminOiJslxyXG4gICAgICAgIGNvbG9yX3R5cGUgOiBCb3hUeXBlLldoaXRlLFxyXG5cclxuICAgICAgICBjb2xvcl9zaG93OntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuV2hpdGU6cmV0dXJuIGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5ZRUxMT1c6cmV0dXJuIGNjLkNvbG9yLllFTExPVztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuR3JlZW46cmV0dXJuIGNjLkNvbG9yLkdSRUVOO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbHVlOnJldHVybiBjYy5Db2xvci5CTFVFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbGFjazpyZXR1cm4gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJhcnJpZXI6cmV0dXJuIGNjLkNvbG9yLlJFRDtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmxhbms6IHJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OnJldHVybiBjYy5Db2xvci5DWUFOO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/ooYxcclxuICAgICAgICByYW5rIDogMCxcclxuICAgICAgICAvL+WIl1xyXG4gICAgICAgIHJvdyA6IDAsXHJcblxyXG5cclxuICAgICAgICAvKuenu+WKqHnnmoTkvY3nva4g56ym5ZCI5p2h5Lu255qE6KaB5pu05pawIHjnmoTlnZDmoIdcclxuICAgICAgICAqIOmHjOmdouaYryB7eDowLHk6Myxpc2xlZnQ6dHJ1ZX0g5a2X5YW457G75Z6LXHJcbiAgICAgICAgKiAqL1xyXG4gICAgICAgIGFuaV9wb2ludCA6IFtdLFxyXG5cclxuXHJcbiAgICAgICAgaWQ6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJhbmsudG9TdHJpbmcoKSArIHRoaXMucm93LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiXHJcblxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG52YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICBib3hfcHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcmFuazp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLliJfmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yb3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi6KGM5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdXBlcl9ub2RlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2dhbWVTdGF0ZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6R2FtZV9TdGF0ZS5TdGFydCxcclxuICAgICAgICAgICAgdHlwZTpHYW1lX1N0YXRlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdhbWVzdGF0ZTp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZVN0YXRlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wQmVmb3JlID0gdGhpcy5fZ2FtZVN0YXRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lU3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUgPT09IEdhbWVfU3RhdGUuUGxheSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA5aeL5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsQmVnaW5PcmlnaW5ZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEJlZm9yZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5piv5Yia5a6e5L6L5ri45oiP5a6M5LmL5ZCOXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yib5bu66Zqc56KN54mpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmFycmllckNhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVtb3ZlQnlWYWx1ZSA9IGZ1bmN0aW9uKGFycix2YWwpe1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGk8YXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKGFycltpXSA9PT0gdmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy8gQXJyYXkucHJvdG90eXBlLmZpbHRlclJlcGVhdCA9IGZ1bmN0aW9uKCl7ICBcclxuICAgICAgICAvLyAgICAgLy/nm7TmjqXlrprkuYnnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgLy8gICAgIGlmKGFyci5sZW5ndGggPiAwKXtcclxuICAgICAgICAvLyAgICAgICAgIGFyci5wdXNoKHRoaXNbMF0pO1xyXG4gICAgICAgIC8vICAgICB9XHJcblxyXG4gICAgICAgIC8vICAgICBmb3IodmFyIGkgPSAxOyBpIDwgdGhpcy5sZW5ndGg7IGkrKyl7ICAgIC8v5LuO5pWw57uE56ys5LqM6aG55byA5aeL5b6q546v6YGN5Y6G5q2k5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5a+55YWD57Sg6L+b6KGM5Yik5pat77yaICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5aaC5p6c5pWw57uE5b2T5YmN5YWD57Sg5Zyo5q2k5pWw57uE5Lit56ys5LiA5qyh5Ye6546w55qE5L2N572u5LiN5pivaSAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+mCo+S5iOaIkeS7rOWPr+S7peWIpOaWreesrGnpobnlhYPntKDmmK/ph43lpI3nmoTvvIzlkKbliJnnm7TmjqXlrZjlhaXnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICAgICAgaWYodGhpcy5pbmRleE9mKHRoaXNbaV0pID09IGkpeyAgXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgYXJyLnB1c2godGhpc1tpXSk7ICBcclxuICAgICAgICAvLyAgICAgICAgIH0gIFxyXG4gICAgICAgIC8vICAgICB9ICBcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGFycjsgIFxyXG4gICAgICAgIC8vIH0gIFxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0ID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gMTAwO1xyXG4gICAgICAgIHRoaXMuaXRlbUhlaWdodCA9IDEwMDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtU3BhY2UgPSA1O1xyXG5cclxuICAgICAgICAvL3RoaXMubWFyZ2luX3RvcCA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICAvL3RoaXMubWFyZ2luX2JvdHRvbSA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41IC0gdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW5fdG9wID0gLSh0aGlzLnN1cGVyX25vZGUuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqdGhpcy5udW1fcm93ICsgdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcm93IC0gMSkgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2JvdHRvbSA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX2xlZnQgPSAgLXRoaXMuaXRlbVdpZHRoKnRoaXMubnVtX3JhbmsqMC41ICsgdGhpcy5pdGVtU3BhY2UqKHRoaXMubnVtX3JhbmsqMC41LTEpO1xyXG4gICAgICAgIHRoaXMubWFyZ2luX3JpZ2h0ID0gdGhpcy5pdGVtV2lkdGggKiB0aGlzLm51bV9yYW5rICogMC41IC0gdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcmFuayAqIDAuNSAtIDEpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXNkcyAgXCIgKyB0aGlzLm1hcmdpbl90b3ArXCIgIFwiK3RoaXMubWFyZ2luX2JvdHRvbSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIC8q6Zqc56KN54mp55qE5pa55Z2X5YiX6KGoKi9cclxuICAgICAgICB0aGlzLmxpc3RCYXJyaWVyID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucmVwbGF5R2FtZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+mHjeaWsOW8gOWni+a4uOaIj1xyXG4gICAgcmVwbGF5R2FtZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuU3RhcnQ7XHJcblxyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuc3VwZXJfbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgd2hpbGUoY2hpbGRyZW4ubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShjaGlsZHJlbltpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/muIXnqbpyYW5rbGlzdFxyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHdoaWxlIChpdGVtID0gdGhpcy5yYW5rTGlzdC5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmuIXnqbrmiJA9PT09PT09PT095YqfPT09PT09XCIpO1xyXG5cclxuICAgICAgICAvL+WIm+W7uuaJgOaciemdouadv+eahOaVsOaNrlxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleDx0aGlzLm51bV9yYW5rOyBpbmRleCsrKXtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSYW5rQ29udGVudChpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyrliJvlu7rpmpznoo3niakg5biD5bGAXHJcbiAgICAqIDEu5Zyo6Zqc56KN54mp5LiL6Z2i55qE54mp5L2T5oqK5LuW5riF56m6XHJcbiAgICAqIDIu6L+Z5Liq5YiX55qE5pWw6YeP5rKh5pyJ5Y+Y6L+Y5piv6L+Z5Lqb5pWw6YePXHJcbiAgICAqICovXHJcbiAgICBjcmVhdGVCYXJyaWVyQ2FudmFzOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDM7IGk8dGhpcy5udW1fcmFuay0zOyBpKyspe1xyXG4gICAgICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGV0IGJveCA9IGxpc3RbN107XHJcbiAgICAgICAgLy8gICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIC8vICAgICBib3hfYy5ib3hTcGVjaWFsbHlTaG93KEJveFR5cGUuQmFycmllcik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBsZXQgYmFycmllckxpc3QgPSBbXHJcblxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjJ9LHtcInJvd1wiOjYsXCJyYW5rXCI6Mn0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6M30sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6NH0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6NX0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6Nn0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6N30se1wicm93XCI6NixcInJhbmtcIjo3fSxcclxuXHJcblxyXG4gICAgICAgICAgICB7XCJyb3dcIjoyLFwicmFua1wiOjJ9LHtcInJvd1wiOjMsXCJyYW5rXCI6Mn0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjIsXCJyYW5rXCI6M30sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjIsXCJyYW5rXCI6Nn0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjIsXCJyYW5rXCI6N30se1wicm93XCI6MyxcInJhbmtcIjo3fSxcclxuXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgIC8v5bCGYmxhbmvmjIlyb3flpKflsI/mjpLluo8g5LuO5bCP5Yiw5aSnIOW6lemDqOWIsOmhtumDqCDmjpLluo/lupXpg6jliLDpobbpg6hcclxuICAgICAgICBiYXJyaWVyTGlzdC5zb3J0KGZ1bmN0aW9uIChhLGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEucm93IC0gYi5yb3c7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v6K6+572u5pivIGJhcnJpZXLnmoTmlrnlnZfnsbvlnotcclxuICAgICAgICBiYXJyaWVyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbZWxlLnJhbmtdO1xyXG4gICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtlbGUucm93XTtcclxuICAgICAgICAgICAgaWYoYm94ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RCYXJyaWVyLnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveFNwZWNpYWxseVNob3coQm94VHlwZS5CYXJyaWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvKuiuvue9rui/meS4qmJhcnJpZXLkuIvnmoTmlrnlnZcqL1xyXG4gICAgICAgIGJhcnJpZXJMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtlbGUucmFua107XHJcbiAgICAgICAgICAgIGZvcihsZXQgbnVtX2IgPSAwOyBudW1fYjxlbGUucm93O251bV9iKyspe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z5Liq5L2N572u6K6+572u5oiQ56m655m95Y2g5L2N5L+h5oGvXHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtudW1fYl07XHJcbiAgICAgICAgICAgICAgICBpZihib3ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJsYW5rKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5iZWdpbkJsYW5rRmlsbCgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyrlvIDlp4vnqbrkvY3loavlhYUqL1xyXG4gICAgYmVnaW5CbGFua0ZpbGw6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKueci+aYr+WQpumcgOimgeWIm+W7uiDmlrnlnZcg5Y675aGr5YWF5Y2g5L2N5pa55Z2XKi9cclxuXHJcbiAgICAgICAgaWYodGhpcy5saXN0QmFycmllci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy/msqHmnInpmpznoo3nialcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/nu5nov5nkuKrpmpznoo3niankuIvpnaLooaXlhYXmlrnlnZdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdEJhcnJpZXIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMubGlzdEJhcnJpZXJbaV07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJsYW5rQ2hlY2tSZXBsYWNlQmxhbmtBdmFpbGFibGUoYm94KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKuajgOa1i+aYr+WQpuWPr+S7peabv+aNolxyXG4gICAgKiBib3hfYyDov5nkuKropoHmk43kvZznmoTmlrnlnZfnsbvlnosgIOaYryDpmpznoo3nialcclxuICAgICogKi9cclxuICAgIGJsYW5rQ2hlY2tSZXBsYWNlQmxhbmtBdmFpbGFibGUgOiBmdW5jdGlvbiAoYm94KSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAgICAgICAgIC8v5piv6Zqc56KN54mpXHJcblxyXG4gICAgICAgICAgICAvL+i/meS4qumanOeijeeJqeeahOi+ueeVjOS4pOi+uSDniankvZPmmK8g6L6555WMIOOAgemanOeijeeJqeOAgeaWueWdl1xyXG4gICAgICAgICAgICBsZXQgYm94X2xlZnQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuay0xXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAgICAgICAgIGxldCBib3hfUmlnaHQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuaysxXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmtdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG5cclxuICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrpmpznoo3niakg5LiKIOW3piDlj7Mg6YO95pyJ5YW25LuW55qE6Zqc56KN54mpIOi/meS4qumanOeijeeJqeS4jeWBmuWkhOeQhiDnlLHku5bkuIrmlrnmjonokL3nmoTmlrnlnZflpITnkIZcclxuICAgICAgICAgICAgLy8gbGV0IGhhdmVSaWdodCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBmb3IobGV0IGkgPSBib3hfYy5ib3hJdGVtLnJhbmsrMTsgaSA8IHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2ldW2JveF9jLmJveEl0ZW0ucm93XTtcclxuICAgICAgICAgICAgLy8gICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKSgpO1xyXG4gICAgICAgICAgICAvLyBsZXQgaGF2ZUxlZnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgZm9yKGxldCBpID0gYm94X2MuYm94SXRlbS5yYW5rLTE7IGkgPj0gMDsgaS0tKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICBsZXQgYiA9IHRoaXMucmFua0xpc3RbaV1bYm94X2MuYm94SXRlbS5yb3ddO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CYXJyaWVyKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB9LmJpbmQodGhpcykpKCk7XHJcbiAgICAgICAgICAgIC8vIGxldCBoYXZlVG9wID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gICAgIGZvcihsZXQgaSA9IGJveF9jLmJveEl0ZW0ucm93KzE7IGkgPCB0aGlzLm51bV9yb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFua11baV07XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJhcnJpZXIpe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSkoKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gaWYoaGF2ZUxlZnQgJiYgaGF2ZVJpZ2h0ICYmaGF2ZVRvcCl7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIui/meS4quS4iemdoumDveaciemanOeijeeJqSBcIitib3hfYy5ib3hJdGVtLnJhbmsgK1wiICBcIisgYm94X2MuYm94SXRlbS5yb3cpO1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyB9ZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcblxyXG4gICAgICAgICAgICBpZihib3hfYm90dG9tICE9PSB1bmRlZmluZWQgJiYgYm94X2JvdHRvbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICAvL+i/meS4quW6lemDqOaYr+epuueahCDlj6/ku6XloavlhYXmlrnlnZdcclxuXHJcbiAgICAgICAgICAgICAgICAvL+Whq+WFheWFiCDlt6blho3lj7NcclxuICAgICAgICAgICAgICAgIGlmKGJveF9SaWdodCAhPT0gdW5kZWZpbmVkICYmIGJveF9SaWdodC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAvL+WPs+i+ueS9jee9ruaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5Y+z6L655L2N572uIOW+gOW3pui+ueWhq+WFheaOieiQveWhq+WFhVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/lj6blpJbovrnnlYznmoTpgqPkuKrpmpznoo3nialcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWRnZU90aGVyQm94ID0gdGhpcy5ibGFua0dldEJvcmRlckJhcnJpZXJCb3goYm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/np7vpmaQg5bem6L656L+Z5Liq6KaB5Yig6Zmk55qEIOabtOaWsOaWsOeahOaWueWdl+eahOW8gOWni+S9jee9ruS/oeaBr1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZW1vdmVJdGVtQXRSYW5rKGJveF9SaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v6K6+572u6KaB5pu/5o2i55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbSxib3hfUmlnaHQsZWRnZU90aGVyQm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua0NoZWNrUmVwbGFjZUJsYW5rQXZhaWxhYmxlKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGJveF9sZWZ0ICE9PSB1bmRlZmluZWQgJiYgYm94X2xlZnQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lt6bovrnkvY3nva7mjonokL3loavlhYVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuW3pui+ueS9jee9ruaOieiQveWhq+WFhSDlvoDlj7PovrnloavlhYXmjonokL3loavlhYVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5Y+m5aSW6L6555WM55qE6YKj5Liq6Zqc56KN54mpXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVkZ2VPdGhlckJveCA9IHRoaXMuYmxhbmtHZXRCb3JkZXJCYXJyaWVyQm94KGJveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v56e76ZmkIOW3pui+uei/meS4quimgeWIoOmZpOeahCDmm7TmlrDmlrDnmoTmlrnlnZfnmoTlvIDlp4vkvY3nva7kv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVtb3ZlSXRlbUF0UmFuayhib3hfbGVmdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v6K6+572u6KaB5pu/5o2i55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbSxib3hfbGVmdCxlZGdlT3RoZXJCb3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQ2hlY2tSZXBsYWNlQmxhbmtBdmFpbGFibGUoYm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5oiW6ICF6L+Z5Liq6Zqc56KN54mp55u46YK75Zyo5LiA6LW3IOWPpuWkluS4gOi+ueeahOmanOeijeeJqVxyXG4gICAgYmxhbmtHZXRCb3JkZXJCYXJyaWVyQm94OmZ1bmN0aW9uIChib3gpIHtcclxuXHJcbiAgICAgICAgbGV0IGVkZ2VfYjsvLyA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgbGV0IHJvdyA9IGJveF9jLmJveEl0ZW0ucm93O1xyXG4gICAgICAgIGxldCByYW5rID0gYm94X2MuYm94SXRlbS5yYW5rO1xyXG5cclxuICAgICAgICAvL+WIpOaWrei/meS4quaWueWdl+eahOWPs+i+ueacieayoeaciVxyXG4gICAgICAgIGZvcihsZXQgaSA9IHJhbmsrMTsgaSA8IHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYiA9IHRoaXMucmFua0xpc3RbaV1bcm93XTtcclxuICAgICAgICAgICAgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICAgICAgZWRnZV9iID0gYjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL+W3pui+uVxyXG4gICAgICAgIGZvcihsZXQgaiA9IHJhbmstMTsgaiA+PSAwOyBqLS0pe1xyXG5cclxuICAgICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2pdW3Jvd107XHJcbiAgICAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgIGVkZ2VfYiA9IGI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGVkZ2VfYiAhPT0gdW5kZWZpbmVkKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBlZGdlX3JhbmsgPSBlZGdlX2IuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0ucmFuaztcclxuICAgICAgICAgICAgbGV0IGVkZ2Vfcm93ID0gZWRnZV9iLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLnJvdztcclxuXHJcbiAgICAgICAgICAgIC8v5bqV5LiLXHJcbiAgICAgICAgICAgIGZvcihsZXQgayA9IGVkZ2Vfcm93LTE7IGsgPj0gMDsgay0tKXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYmIgPSB0aGlzLnJhbmtMaXN0W2VkZ2VfcmFua11ba107XHJcbiAgICAgICAgICAgICAgICBpZihiYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoYmIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VfYiA9IGJiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZWRnZV9iO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKuajgOa1i+aYr+WQpuWPr+S7peabv+aNolxyXG4gICAgICogYm94X2Mg6L+Z5Liq6KaB5pON5L2c55qE5pa55Z2X57G75Z6LICDmmK8g5pa55Z2XXHJcbiAgICAgKiAqL1xyXG4gICAgYmxhbmtDaGVja1JlcGxhY2VOb3JtYWxBdmFpbGFibGUgOiBmdW5jdGlvbiAoYm94LGVkZ2VPdGhlckJveCl7XHJcblxyXG4gICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIGlmKGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgLy/mmK/mlrnlnZdcclxuXHJcbiAgICAgICAgICAgIC8v6L+Z5Liq5pa55Z2X55qEIOW3puS4i+aWuSDlj7PkuIvmlrkg5q2j5LiL5pa5IOWIpOaWreaYr+WQpuaYr+epuuS9jVxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbV9sZWZ0ID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmstMV1bYm94X2MuYm94SXRlbS5yb3ctMV07XHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tX1JpZ2h0ID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmsrMV1bYm94X2MuYm94SXRlbS5yb3ctMV07XHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tX3poZW5nID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmtdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG4gICAgICAgICAgICBpZihib3hfYm90dG9tX3poZW5nICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIGJveF9ib3R0b21femhlbmcuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmxhbmspIHtcclxuICAgICAgICAgICAgICAgIC8v5q2j5LiL5pa55piv56m655qEIOW+gOato+S4i+aWuSDmm7/mjaJcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5q2j5LiL5pa55piv56m655qEIOW+gOato+S4i+aWuSDmm7/mjaJcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVwbGFjZUJveChib3hfYm90dG9tX3poZW5nLGJveCxlZGdlT3RoZXJCb3gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihib3hfYm90dG9tX2xlZnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgYm94X2JvdHRvbV9sZWZ0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgIC8v5bem5LiL5pa55piv56m655qEIOW+gOW3puS4i+aWuSDmm7/mjaJcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5bem5LiL5pa5XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8q5Yik5pat5bem5LiL5pa5IOaIluiAhSDlj7PkuIvmlrkg6KaB5aGr5YWF55qE6L+Z5Liq5pa55Z2XIOS4juS7lueahOi+ueeVjOmanOeijeeJqeWBmuWIpOaWrSDov5nkuKrmlrnlnZfmmK/nlLHov5novrnot6/lj6PmjonokL0g6L+Y5piv5Y+m5aSW5LiA6L65Ki9cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVwbGFjZUJveChib3hfYm90dG9tX2xlZnQsYm94LGVkZ2VPdGhlckJveCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKGJveF9ib3R0b21fUmlnaHQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgYm94X2JvdHRvbV9SaWdodC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICAvL+WPs+S4i+aWueaYr+epuueahCDlvoDlj7PkuIvmlrkg5pu/5o2iXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuWPs+S4i+aWuVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b21fUmlnaHQsYm94LGVkZ2VPdGhlckJveCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyrmm7/mjaLmlrnlnZcg5bm25omn6KGM5pu/5o2i5YiH5o2i55qE5Yqo55S75pWI5p6cKi9cclxuICAgIGJsYW5rUmVwbGFjZUJveCA6ZnVuY3Rpb24gKGJveEJsYW5rLGJveFJlcGxhY2UsZWRnZU90aGVyQm94KXtcclxuXHJcbiAgICAgICAgbGV0IGJveF9yZSA9IGJveFJlcGxhY2UuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICBsZXQgYm94X2JsID0gYm94QmxhbmsuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcblxyXG4gICAgICAgIC8v6K6+572ueOeahOS9jee9ruWPmOWMlueahOaXtuWAmSDngrlcclxuICAgICAgICBsZXQgcmVwZWF0TGlzdCA9IGJveF9yZS5ib3hJdGVtLmFuaV9wb2ludC5maWx0ZXIoZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtLnggPT09IGJveF9ibC5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v5a2Y5YKo5Yqo55S755qE6IqC54K5XHJcbiAgICAgICAgbGV0IGlzbGVmdCA9IGJveF9ibC5ib3hJdGVtLmJlZ2luX3ggPCBib3hfcmUuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIGlmKHJlcGVhdExpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGJveF9yZS5ib3hJdGVtLmFuaV9wb2ludC5wdXNoKHtcInhcIjogYm94X2JsLmJveEl0ZW0uYmVnaW5feCwgXCJ5XCI6IGJveF9ibC5ib3hJdGVtLmVuZF95ICsgYm94X2JsLm5vZGUuaGVpZ2h0LFwiaXNsZWZ0XCI6aXNsZWZ0fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2UgaWYocmVwZWF0TGlzdC5sZW5ndGggPT09IDEpe1xyXG4gICAgICAgIC8vICAgICBsZXQgZGljID0gcmVwZWF0TGlzdFswXTtcclxuICAgICAgICAvLyAgICAgZGljLnggPSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIC8vICAgICBkaWMuaXNsZWZ0ID0gaXNsZWZ0O1xyXG4gICAgICAgIC8vIH1cclxuXHJcblxyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLmJlZ2luX3ggPSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLmVuZF95ID0gYm94X2JsLmJveEl0ZW0uZW5kX3k7XHJcblxyXG4gICAgICAgIC8vIGxldCB0ZW1wX3JhbmsgPSBib3hfcmUuYm94SXRlbS5yYW5rO1xyXG5cclxuICAgICAgICBib3hfcmUuYm94SXRlbS5yb3cgPSBib3hfYmwuYm94SXRlbS5yb3c7XHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0ucmFuayA9IGJveF9ibC5ib3hJdGVtLnJhbms7XHJcblxyXG4gICAgICAgIC8v6L+Z5Liq5pa55Z2X57un57ut5b6A5LiL5pu/5o2iXHJcbiAgICAgICAgaWYodGhpcy5ibGFua0NoZWNrUmVwbGFjZU5vcm1hbEF2YWlsYWJsZShib3hSZXBsYWNlLGVkZ2VPdGhlckJveCkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuenu+WKqOWujOaIkCDmm7/mjaI9PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgLy/ljaDkvY3nmoTmlrnlnZcg5L2N572u5pu/5o2i5oiQ6KaB56e75YWl55qE5pa55Z2XICDnp7vpmaTov5nkuKrljaDkvY3mlrnlnZdcclxuICAgICAgICAgICAgdGhpcy5yYW5rTGlzdFtib3hfYmwuYm94SXRlbS5yYW5rXVtib3hfYmwuYm94SXRlbS5yb3ddID0gYm94UmVwbGFjZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94X2JsLm5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8v5ZCO6Z2i6YGN5Y6G55qE5pe25YCZ5oqK5LuW56e76Zmk5o6JXHJcbiAgICAgICAgLy90aGlzLnJhbmtMaXN0W3RlbXBfcmFua10ucmVtb3ZlQnlWYWx1ZSh0aGlzLnJhbmtMaXN0W3RlbXBfcmFua10sYm94UmVwbGFjZSk7XHJcblxyXG5cclxuICAgICAgICAvLyBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgICAgIC8vIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIGJsYW5rUmVtb3ZlSXRlbUF0UmFuazpmdW5jdGlvbiAoYm94UmVtb3ZlKSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfcmUgPSBib3hSZW1vdmUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94X3JlLmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94UmVtb3ZlKTtcclxuXHJcbiAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLnVwZGF0ZVJhbmtFbmRZSW5kZXgoYm94X3JlLmJveEl0ZW0ucmFuayk7XHJcblxyXG4gICAgICAgIGlmKG5ld19ib3ggIT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/ku5bmnKzouqvmmK/mnIDlkI7kuIDkuKog6Lef5YCS5pWw56ys5LqM5Liq5a+55q+UXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RfYm94ID0gbGlzdFtsaXN0Lmxlbmd0aC0yXTtcclxuICAgICAgICAgICAgICAgICAgICBpZihsYXN0X2JveCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gbGFzdF9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmJlZ2luX3kgKyBib3hfYy5ub2RlLmhlaWdodCArIDEwKmxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgc3BhY2VfdG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL+aYr+imgeaOieiQveeahFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuXHJcblxyXG4gICAgLy/liJvlu7rmr4/kuIDliJfnmoTmlbDmja5cclxuICAgIGNyZWF0ZVJhbmtDb250ZW50OmZ1bmN0aW9uKGluZGV4KXtcclxuXHJcbiAgICAgICAgbGV0IHJhbmtfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuICAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubnVtX3JvdzsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgIGJveC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIGJveC5oZWlnaHQgPSB0aGlzLml0ZW1IZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNvdW50ID0gQm94VHlwZS5UeXBlQ291bnQ7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9IChjYy5yYW5kb20wVG8xKCkqY291bnQpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgcmFua19saXN0LnB1c2goYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QucHVzaChyYW5rX2xpc3QpO1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5omA5pyJ5YiXIGVuZCB555qE5pWw5o2uXHJcbiAgICB1cGRhdGVBbGxSYW5rRW5kWTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAvL+eci+ivpeWIl+eahOaVsOmHj+aYr+WQpiDlsI/kuo4gdGhpcy5udW1fcm93ICDlsJHkuo7nmoTor53liJnooaXlhYVcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJhbmtFbmRZSW5kZXgoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyrmm7TmlrDmn5DliJfnmoTmlbDmja4qL1xyXG4gICAgdXBkYXRlUmFua0VuZFlJbmRleDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCBjcmVhdGVCb3ggPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppbmRleDtcclxuXHJcbiAgICAgICAgbGV0IGxpc3Rfc3ViID0gdGhpcy5yYW5rTGlzdFtpbmRleF07XHJcblxyXG4gICAgICAgIHdoaWxlKGxpc3Rfc3ViLmxlbmd0aCA8IHRoaXMubnVtX3Jvdyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3X2JveCA9IHRoaXMuYm94RHJvcF9nZXQoKTtcclxuICAgICAgICAgICAgbmV3X2JveC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBuZXdfYm94LndpZHRoID0gdGhpcy5pdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIG5ld19ib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmluaXRCb3hJdGVtKCk7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSAwO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgIG5ld19ib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgbGlzdF9zdWIucHVzaChuZXdfYm94KTtcclxuXHJcblxyXG4gICAgICAgICAgICBjcmVhdGVCb3ggPSBuZXdfYm94O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGxldCBlbmRfYm94X3kgPSB0aGlzLm1hcmdpbl9ib3R0b207XHJcblxyXG4gICAgICAgIC8v5pu05paw5q+P5Liq5YWD57Sg55qEZW5kIHkg5L2N572uXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8bGlzdF9zdWIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gbGlzdF9zdWJbaV07XHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IGl0ZW1fYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKmk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJveDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw5q+P5LiA5YiX5LuW5Lus5Lit55qE5q+P5Liq5YWD57Sg55qE5Yid5aeL55qEb3JpZ2luIHnnmoTlgLxcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQWxsQmVnaW5PcmlnaW5ZOmZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOafkOS4gOWIl+S4rSDku47mnIDlkI7lvIDlp4vpgY3ljobov5Tlm55cclxuICAgICAgICAgKiDnrpflh7rlvIDlp4vmjonkuobnmoTkvY3nva5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpiDlt7Lovr7liLDku5bnmoRlbmR5IOWmguaenOi/mOacqui+vuWIsOWwseaYryDmraPopoHmjonokL1cclxuICAgICAgICAgICAgbGV0IG9mZl90b3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VfdG9wID0gNTtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvL2JveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihib3hfYy5ub2RlLnkgIT09IGJveF9jLmJveEl0ZW0uZW5kX3kpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiAxLuWunuS+i+a4uOaIj+eahOaXtuWAmSDliJ3lp4vlvIDlp4vnmoTkvY3nva5cclxuICAgICAgICAgICAgICAgICAgICAgKiAyLua2iOmZpOeahCDmlrnlnZfkuI3lnKjnlYzpnaLkuK3nmoTorr7nva7ku5bnmoTlvIDlp4vkvY3nva4g5bey5Zyo55WM6Z2i5Lit55qE5LiN5Y676K6+572u5LuWXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KSB8fCAoYm94X2Mubm9kZS55ID49IGJveF9jLmJveEl0ZW0uYmVnaW5feSkpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wICsgb2ZmX3RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgPSBvZmZfdG9wICsgYm94X2Mubm9kZS5oZWlnaHQgKyBzcGFjZV90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZV90b3AgPSBzcGFjZV90b3AgKyAxMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5piv6KaB5o6J6JC955qEXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVGYWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/kuqTmjaLkuKTkuKrmlrnlnZfnmoTkvY3nva5cclxuICAgIGV4Y2hhbmdlQm94SXRlbTpmdW5jdGlvbihib3gxLGJveDIsdG9DaGVja1ZpYWJsZSA9IHRydWUpe1xyXG5cclxuICAgICAgICBsZXQgYm94SXRlbTEgPSBib3gxLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICBsZXQgYm94SXRlbTIgPSBib3gyLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgaWYoYm94SXRlbTEucmFuayA9PT0gYm94SXRlbTIucmFuayl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA5YiX55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2VuZHkgPSBib3hJdGVtMi5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTIuZW5kX3kgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgYm94SXRlbTEuZW5kX3kgPSB0ZW1wX2VuZHk7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcm93ID0gYm94SXRlbTIucm93O1xyXG5cclxuICAgICAgICAgICAgYm94SXRlbTIucm93ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yb3cgPSB0ZW1wX3JvdzsgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0W2JveEl0ZW0xLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTEucm93XSA9IGxpc3RbYm94SXRlbTIucm93XTtcclxuICAgICAgICAgICAgbGlzdFtib3hJdGVtMi5yb3ddID0gdGVtcF9ub2RlO1xyXG5cclxuXHJcblxyXG4gICAgICAgIH1lbHNlIGlmKGJveEl0ZW0xLnJvdyA9PT0gYm94SXRlbTIucm93KXtcclxuICAgICAgICAgICAgLy/lkIzkuIDooYznmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QxID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QyID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMi5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2JlZ2lueCA9IGJveEl0ZW0yLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmJlZ2luX3ggPSBib3hJdGVtMS5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5iZWdpbl94ID0gdGVtcF9iZWdpbng7XHJcblxyXG4gICAgICAgICAgICBib3gxLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMS5iZWdpbl94LGJveEl0ZW0xLmVuZF95KSkpO1xyXG4gICAgICAgICAgICBib3gyLm5vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjIsY2MucChib3hJdGVtMi5iZWdpbl94LGJveEl0ZW0yLmVuZF95KSkpO1xyXG4gICAgICAgICAgICAvLyBib3gxLm5vZGUueSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICAvLyBib3gyLm5vZGUueSA9IGJveEl0ZW0yLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkv6Hmga9cclxuICAgICAgICAgICAgbGV0IHRlbXBfcmFuayA9IGJveEl0ZW0yLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJhbmsgPSBib3hJdGVtMS5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMS5yYW5rID0gdGVtcF9yYW5rO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJvd19pbmRleCA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgbGV0IHRlbXBfbm9kZSA9IGxpc3QxW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QxW3Jvd19pbmRleF0gPSBsaXN0Mltyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0Mltyb3dfaW5kZXhdID0gdGVtcF9ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodG9DaGVja1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgaXNWaWFibGUgPSB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFpc1ZpYWJsZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/kuI3lj6/mtojpmaTnmoTor50g5L2N572u5YaN5LqS5o2i5Zue5p2lXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuS4jeWPr+a2iOmZpFwiKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4Y2hhbmdlQm94SXRlbShib3gyLGJveDEsZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+ajgOa1i+mdouadv+aJgOacieaWueWdlyDmmK/lkKblj6/mtojpmaRcclxuICAgIGNoZWNrUGFuZWxFbGltaW5hdGFibGU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IHdpcGVfbGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAvL+WIpOaWreWIlyDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCB0ZW1wTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcHJlX2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcm93OyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGxpc3Rbal07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAvKuminOiJsuebuOWQjCDlubbkuJTmmK/mma7pgJrnsbvlnovnmoTpopzoibLnmoTml7blgJkqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9wcmUuY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcm93LTEpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0b0FkZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRlbXBMaXN0Lmxlbmd0aCA+PSAzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+95Yqg5Yiwd2lwZemHjOmdolxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkod2lwZV9saXN0LHRlbXBMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc1JlcGVhdEl0ZW1JbldpcGUoaXRlbSl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8d2lwZV9saXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHdpcGVfbGlzdFtpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uaWQgPT09IGl0ZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+WIpOaWreihjCDmmK/lkKbmnInkuInkuKrku6Xlj4rkuInkuKrku6XkuIrnmoTkuIDmoLfnmoToibLlnZfov57lnKjkuIDotbdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3Jhbms7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5yYW5rTGlzdFtqXVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9wcmUuY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcmFuay0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc1JlcGVhdEl0ZW1JbldpcGUoZWxlbSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXBlX2xpc3QucHVzaChlbGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+a4heepuuaVsOe7hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmKHdpcGVfbGlzdC5sZW5ndGggPiAwKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93RGVsYXlBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAvL+S4jeaYvuekuua2iOmZpOWKqOeUu1xyXG4gICAgICAgICAgICAgICAgc2hvd0RlbGF5QW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvL+S4jeaYr+WIneWni+WMlueahCDlgZznlZnkuIDkvJrlhL/lho3mtojpmaQg6K6p55So5oi355yL5Yiw6KaB5raI6Zmk5LqG5LuA5LmI5Lic6KW/XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgICAgICAgICAvLyB3aXBlX2xpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gbGV0IGJveCA9IGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBib3guc3RhdGVfYiA9IEJveFN0YXRlLkVEZXN0cm95O1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuYm94RHJvcF9kZXN0cm95KGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aXBlX2xpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveCA9IGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBib3guc3RhdGVfYiA9IEJveFN0YXRlLkVEZXN0cm95O1xyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiDov5novrnkuIDkuKrlu7bov59cclxuICAgICAgICAgICAgICAgICDlpoLmnpzmuLjmiI/mmK8g5Yid5aeL5YyW55qE6K+d5LiN5bu26L+fXHJcbiAgICAgICAgICAgICAgICAg5LiN5piv5Yid5aeL5YyWIHN0YXJ055qEIOimgeetiemUgOavgeWKqOeUu+WujOaIkOS5i+WQjuWGjeW8gOWni+aOieiQvVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy/mnInplIDmr4HlnKjmjonokL1cclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSAhPT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5q2j5Zyo5o6J6JC95aGr5YWFXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5GaWxsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBbGxSYW5rRW5kWSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwodGhpcy5nYW1lc3RhdGUgIT09IEdhbWVfU3RhdGUuU3RhcnQpPzAuMzowLGZhbHNlKTtcclxuXHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksc2hvd0RlbGF5QW5pbWF0aW9uPzAuMzowLGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlBsYXk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgYm94RHJvcF9nZXQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IGJveCA9IG51bGw7XHJcbiAgICAgICAgaWYodGhpcy5ib3hQb29sLnNpemUoKSA+IDApe1xyXG4gICAgICAgICAgICBib3ggPSB0aGlzLmJveFBvb2wuZ2V0KCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGJveCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm94X3ByZWZhYik7XHJcbiAgICAgICAgICAgIGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmluaXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBib3g7XHJcbiAgICB9LFxyXG5cclxuICAgIGJveERyb3BfZGVzdHJveTpmdW5jdGlvbihib3gpe1xyXG5cclxuICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94LmJveEl0ZW0ucmFua107XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGlzdC5yZW1vdmVCeVZhbHVlKGxpc3QsYm94Lm5vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wucHV0KGJveC5ub2RlKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyrmmK/lkKblvIDlkK/osIPor5UqL1xyXG4gICAgZ2FtZVNob3dEZWJ1Z01lc3NhZ2U6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBZSERlYnVnID0gIVlIRGVidWc7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmlsbEludGVydmFsID09PSAxMCl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT095a6a5pe25byA5aeL5Yik5pat5piv5ZCm6YO95bey5o6J6JC95Yiw5bqV6YOo5LqGIGJlZ2luID09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3pg73liLAg5o6J6JC95Yiw5bqV6YOo5LqGIOajgOa1i+aYr+WQpuWPr+a2iOmZpCBlbmQgPT09PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG4vLyB2YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBfc2VsZWN0X2JveDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6YCJ5Lit5p+Q5Liq5pa55Z2XXHJcbiAgICAgICAgc2VsZWN0X2JveDoge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RfYm94O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdF9ib3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9uZXcgPSB2YWx1ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fb2xkID0gdGhpcy5fc2VsZWN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJveEl0ZW1fbmV3LmlkICE9PSBib3hJdGVtX29sZC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIueci+aYr+WQpuimgeS6pOS6kuS9jee9riDov5jmmK/or7TliIfmjaLliLDov5nkuKrpgInkuK3nmoTkvY3nva7lpITnkIZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQxID0gXCIgKyBib3hJdGVtX25ldy5pZCArIFwiICBpZDI9IFwiICsgYm94SXRlbV9vbGQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aXp+eahOWPlua2iOmAieaLqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94LnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0odmFsdWUsIHRoaXMuX3NlbGVjdF9ib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLkuI3mmK/nm7jov5HnmoQg5Y+W5raI5LiK5LiA5Liq6YCJ5oupIOmAieS4reaWsOeCueWHu+eahFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumAieS4reS6huWQjOS4gOS4qiDlj5bmtojpgInmi6lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgbGV0IGJveEl0ZW0gPSBjbGlja19ub2RlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgLy8gIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLmJveERyb3BfZGVzdHJveShjbGlja19ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gIC8v5LiK6Z2i55qE5o6J5LiL5p2lXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLnVwZGF0ZVJhbmtFbmRZKGJveEl0ZW0ucmFuayk7XHJcblxyXG5cclxuICAgICAgICAgdGhpcy5zZWxlY3RfYm94ID0gY2xpY2tfbm9kZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxuXG5cbi8v5piv5ZCm5byA5ZCv6LCD6K+VXG53aW5kb3cuWUhEZWJ1ZyA9IGZhbHNlO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cblxuICAgICAgICBsYWJfc2hvdzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICB9LFxuXG5cbiAgICBvY0NhbGxKczpmdW5jdGlvbiAoc3RyKSB7XG5cbiAgICAgICAgdGhpcy5sYWJfc2hvdy5ub2RlLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5sYWJfc2hvdy5zdHJpbmcgPSBzdHI7XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB0aGlzLmxhYl9zaG93Lm5vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgfSw1KTtcblxuICAgIH0sXG5cbiAgICBqc0NhbGxPYzpmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy/nsbvlkI0g5pa55rOVICDlj4LmlbAxIOWPguaVsDIg5Y+C5pWwM1xuICAgICAgICB2YXIgcmVzdWx0ID0ganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIkpTQk1hbmFnZXJcIixcInloSlNCQ2FsbDpcIixcImpz6L+Z6L655Lyg5YWl55qE5Y+C5pWwXCIpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwianNfY2FsbF9vYyA9PT09PT09PT0gJUBcIixyZXN1bHQpO1xuXG4gICAgfSxcblxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gdGhpcy5vY0NhbGxKcyhcIua1i+ivlSDmmL7npLrpmpDol49cIik7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiXG5cbi8q5pa55Z2X55qE57G75Z6LKi9cbmNvbnN0IEJveFR5cGUgPSBjYy5FbnVtKHtcbiAgICBZRUxMT1cgOiAtMSxcbiAgICBHcmVlbiA6IC0xLFxuICAgIEJsdWUgOiAtMSxcbiAgICBCbGFjayA6IC0xLFxuICAgIFdoaXRlIDogLTEsXG5cbiAgICBUeXBlQ291bnQgOiAtMSxcblxuICAgIEJhcnJpZXIgOiAtMSwgICAgICAgLy/pmpznoo3nialcbiAgICBCbGFuayA6IC0xLCAgICAgICAgICAvL+epuueZveWNoOS9jVxuXG4gICAgQ291bnQgOiAtMVxufSk7XG5cblxuXG5cbi8v5pa55Z2X5o6J6JC955qE54q25oCBXG5jb25zdCBCb3hTdGF0ZSA9IGNjLkVudW0oe1xuXG4gICAgLy8gRU5vbmUgOiAtMSwgICAgICAvL+S7gOS5iOmDveS4jeaYr1xuXG4gICAgRU5vcm1hbCA6IC0xLCAgICAvL+ato+W4uFxuICAgIEVGYWxsaW5nIDogLTEsICAgLy/mjonokL1cbiAgICBFRmFsbGVkIDogLTEsICAgIC8v5o6J6JC957uT5p2fXG4gICAgRURlc3Ryb3kgOiAtMSwgICAvL+mUgOavgVxuXG59KTtcblxuLy/mlrnlnZfmmL7npLrnmoTnirbmgIFcbmNvbnN0IEJveFNob3dUeXBlID0gY2MuRW51bSh7XG5cbiAgICBLX05vcm1hbCA6IC0xLCAgICAgICAgICAvL+ato+W4uFxuICAgIEtfU2VsZWN0IDogLTEsICAgICAgICAgIC8v6YCJ5LitXG5cbiAgICBLX1NraWxsQXJvdW5kIDogLTEsICAgICAgIC8v6ZSA5q+BIOWRqOi+ueeahOS5neS4qlxuICAgIEtfU2tpbGxSYW5rIDogLTEsICAgICAgICAgLy/plIDmr4Eg6K+l5YiXXG4gICAgS19Ta2lsbFJhdyA6IC0xLCAgICAgICAgICAvL+mUgOavgSDor6XooYxcbiAgICBLX1NraWxsQ29sb3IgOiAtMSwgICAgICAgIC8v6ZSA5q+BIOivpeiJslxufSk7XG5cblxuXG4vL+a4uOaIj+i/m+ihjOeahOeKtuaAgVxudmFyIEdhbWVfU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBTdGFydCA6IC0xLCAgICAgLy/lvIDlp4vlrp7kvotcbiAgICBGaWxsaW5nOiAtMSwgICAgLy/mlrnlnZfooaXpvZDkuK0g5o6J6JC95LitXG4gICAgLy8gQmxhbmtGaWxsaW5nIDogLTEsIC8v56m65L2N6KGl5YWFIOiHquWKqOaOieiQvVxuICAgIFBsYXkgOiAtMSwgICAgICAvL+i/m+ihjOS4rVxuICAgIE92ZXIgOiAtMSwgICAgICAvL+e7k+adn1xufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgQm94U3RhdGUsXG4gICAgQm94U2hvd1R5cGUsXG4gICAgR2FtZV9TdGF0ZSxcbiAgICBCb3hUeXBlXG5cbn07Il0sInNvdXJjZVJvb3QiOiIifQ==