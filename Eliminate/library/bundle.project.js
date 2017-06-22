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

        var barrierList = [{ "row": 7, "rank": 2 }, { "row": 6, "rank": 2 }, { "row": 7, "rank": 3 }, { "row": 7, "rank": 4 }, { "row": 7, "rank": 5 }, { "row": 7, "rank": 6 }, { "row": 7, "rank": 7 }, { "row": 6, "rank": 7 }];

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

            // //如果这个障碍物 上 左 右 都有其他的障碍物 这个障碍物不做处理 由他上方掉落的方块处理
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

        if (repeatList.length === 0) {
            var isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
            box_re.boxItem.ani_point.push({ "x": box_bl.boxItem.begin_x, "y": box_bl.boxItem.end_y + box_bl.node.height, "isleft": isleft });
        }

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm94RHJvcC5qcyIsImFzc2V0cy9zY3JpcHQvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvQm94UGFuZWwuanMiLCJhc3NldHMvc2NyaXB0L0VsaW1pbmF0ZS5qcyIsImFzc2V0cy9zY3JpcHQvSlNCQ2FsbC5qcyIsImFzc2V0cy9zY3JpcHQvU3RhdGUvU3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJOztBQUVBOztBQUVBO0FBQ0k7QUFDQTtBQUZNOztBQUtWO0FBQ0k7QUFDQTtBQUNBO0FBSEk7O0FBT1I7QUFDSTtBQUNBO0FBRk07O0FBS1Y7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJO0FBQ0k7QUFDSTs7QUFFQTs7QUFFSjtBQUNJOztBQUVBOztBQUVKOztBQUdJOztBQUVKOztBQUdJOztBQUVKOztBQUlJOztBQUVKOztBQUVJOztBQTdCUjtBQWlDSDtBQXpDSTs7QUE4Q1Q7QUFDSTtBQUNBO0FBRks7O0FBTVQ7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUk7O0FBRUo7O0FBR0k7O0FBRUo7QUFDSTs7QUFFQTtBQUNKO0FBQ0k7O0FBRUE7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIOztBQUVEOztBQTNCUjtBQStCSDtBQUNKOztBQUVEOztBQWxESTs7QUEzRUE7O0FBb0laO0FBQ0k7QUFESTs7QUFJUjs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFDSDs7O0FBR0Q7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDtBQUNJOztBQUVBO0FBQ0E7QUFDSDs7QUFJRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUg7O0FBRUQ7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNJOzs7QUFHQTtBQUNBOztBQUdJOztBQUVBO0FBQ0E7QUFDSDtBQUNKOztBQUlEOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFNRDs7QUFFSTtBQUNBOztBQUVBOztBQUVBO0FBQ0g7O0FBR0Q7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7QUFDSDtBQUNKOztBQUdEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7O0FBRUk7O0FBRUE7QUFDSTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDs7QUFFRDs7QUFFSTs7O0FBR0E7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBSUk7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRztBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDSDs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBblVJOzs7Ozs7Ozs7O0FDTFQ7O0FBR0E7QUFDSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSTtBQUNJO0FBQW1CO0FBQ25CO0FBQW9CO0FBQ3BCO0FBQW1CO0FBQ25CO0FBQWtCO0FBQ2xCO0FBQW1CO0FBQ25CO0FBQXFCO0FBQ3JCO0FBQW9CO0FBQ3BCO0FBQVE7QUFSWjtBQVVIO0FBWk07O0FBZVg7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7OztBQUdBOztBQUdBO0FBQ0k7QUFDSTtBQUNIO0FBSEY7QUF0Q0s7O0FBNkNaO0FBQ0E7O0FBakRLOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZLOztBQUtUO0FBQ0k7QUFDQTtBQUZJOztBQUtSO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIOztBQUdEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFSjtBQUNKO0FBQ0Q7QUE1Qk07O0FBM0JGOztBQTREWjtBQUNBOztBQUVJOztBQUVJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFJQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQUVEOzs7O0FBSUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBaUJBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFFSjs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBR0Q7QUFDSDs7QUFHRDtBQUNBOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDSDtBQUNKOztBQUdEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUVIO0FBQ0o7QUFDSjtBQUNKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7QUFDRDtBQUNBOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0g7O0FBRUQ7OztBQUdBOztBQUVJO0FBQ0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNKOztBQUVEO0FBQ0g7O0FBUUQ7QUFDQTs7QUFFSTtBQUNBOztBQUdBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUdEOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDs7QUFHRDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7O0FBR0Q7O0FBRUk7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUk7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTtBQUdJO0FBQ0g7QUFDSjtBQUNHO0FBQ0g7QUFFSjtBQUNKOztBQUlEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7QUFHSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7QUFDSDs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUdBO0FBQ0g7O0FBR0Q7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUdEO0FBQ0g7O0FBR0Q7OztBQUdBOztBQUdJOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNBOztBQUVBOztBQUVJOzs7O0FBSUE7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBO0FBR0k7QUFDSDtBQUNKO0FBQ0c7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNBO0FBQXdEOzs7QUFFcEQ7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUlIO0FBQ0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBR0Q7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUdKO0FBRUo7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUdEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFSTtBQUNBO0FBRUg7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUVIO0FBR0o7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQVFEOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSDs7QUFPRDtBQUNBOztBQUVJOztBQUdJOztBQUVBOztBQUVJOztBQUVBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjs7QUFHRDs7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSDtBQUVKO0FBaitCSTs7Ozs7Ozs7OztBQ1BUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBQ0E7QUFIUTs7QUFNWjtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTs7QUFFSTtBQUNBO0FBRUg7QUFDRztBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUVJOztBQUVBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHOztBQUVBOztBQUVBO0FBQ0g7QUFFSjtBQUNHO0FBQ0E7O0FBRUE7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQTVDUTs7QUFUSjs7QUEwRFo7QUFDQTs7QUFPQTtBQUNBOztBQUVJOztBQUVDOztBQUVBOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0M7QUFDSjs7QUF0Rkk7Ozs7Ozs7Ozs7QUNOVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBRks7O0FBWkQ7O0FBb0JaOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBRUg7QUFFSjs7QUFFRDs7QUFFSTtBQUNBOztBQUVBO0FBRUg7O0FBR0Q7QUFDQTs7QUFFSTs7QUFFSDs7QUFwREk7Ozs7Ozs7Ozs7QUNFVDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBWm9COztBQWtCeEI7QUFDQTs7QUFFSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFJSjtBQUNBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBS0o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBTUo7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7O0FBTGEiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcbnZhciBCb3hUeXBlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hUeXBlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3BlZWQ6MCxcclxuXHJcbiAgICAgICAgc3BlZWRNYXg6ODAwLFxyXG5cclxuICAgICAgICBhY2Nfc3BlZWQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjkuOCxcclxuICAgICAgICAgICAgdG9vbHRvcDpcIuWKoOmAn+W6plwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYm94SXRlbTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hJdGVtLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICBfc2hvd1R5cGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFNob3dUeXBlLktfTm9ybWFsLFxyXG4gICAgICAgICAgICB0eXBlOkJveFNob3dUeXBlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2hvd1R5cGU6e1xyXG5cclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaG93VHlwZTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHNldDpmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX05vcm1hbDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsQXJvdW5kOlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFNob3dUeXBlLktfU2tpbGxDb2xvcjpcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTaG93VHlwZS5LX1NraWxsUmFuazpcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U2hvd1R5cGUuS19Ta2lsbFJhdzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG5cclxuICAgICAgICBfc3RhdGVfYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6Qm94U3RhdGUuRU5vcm1hbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hTdGF0ZSxcclxuICAgICAgICAgICAgLy8gdmlzaWJsZTpmYWxzZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN0YXRlX2I6e1xyXG5cclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZV9iO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgc2V0OmZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3N0YXRlX2IgIT09IHZhbHVlKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGVfYiA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IHRoaXMuc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRU5vcm1hbDpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxpbmc6XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FRmFsbGVkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoXCJhbmlfYm94XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVEZXN0cm95OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLmkafmr4HlkLlhc2RcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5pbWF0aW9uLnBsYXkoXCJhbmlfZGVzdHJveVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhbmVsLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbmVsLmJveERyb3BfZGVzdHJveSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2Rlc3Ryb3lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG5cclxuICAgICAgICAgICAgLy8gdG9vbHRvcDpcIuaWueWdl+eahOeKtuaAgVwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXRpY3M6e1xyXG4gICAgICAgIEJveFN0YXRlOkJveFN0YXRlXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQoKXtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RfaXRlbSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcInNlbFwiKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTcGVlZCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgdW51c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInhpYW9odWlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gLTEwMDAwMDtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJldXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjaG9uZ3lvbmdcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfTm9ybWFsO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuY2xpY2tfYWRkKCk7XHJcbiAgICAgICAgLy8gdGhpcy5zcGVlZF94ID0gMjA7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRCb3hJdGVtOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuYm94SXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbSA9IG5ldyBCb3hJdGVtKCk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tfYWN0aW9uOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLypcclxuICAgICAgICDlj6rmnInlho1wbGF554q25oCB5LiL5omN6IO954K55Ye7XHJcbiAgICAgICAgKi9cclxuICAgICAgICBsZXQgcGFuZWwgPSBjYy5maW5kKFwiR2FtZS9QYW5lbFwiKS5nZXRDb21wb25lbnQoXCJCb3hQYW5lbFwiKTtcclxuICAgICAgICBpZihwYW5lbC5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuUGxheSAmJlxyXG4gICAgICAgICAgICB0aGlzLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KSB7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueCueWHu+S6hiAgIFwiK1wicmFuaz1cIit0aGlzLmJveEl0ZW0ucmFuaytcInJvdz1cIit0aGlzLmJveEl0ZW0ucm93KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBlbGltaW5hdGUgPSBjYy5maW5kKFwiR2FtZS9FbGltaW5hdGVcIikuZ2V0Q29tcG9uZW50KFwiRWxpbWluYXRlXCIpO1xyXG4gICAgICAgICAgICBlbGltaW5hdGUuY2xpY2tfaXRlbSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgYm94X2Rlc3Ryb3k6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvL+WKqOeUu+e7k+adn+S5i+WQjueahOWbnuiwg1xyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIuaRp+avgeWKqOeUu+WujOaIkFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcblxyXG4gICAgICAgIHBhbmVsLmJveERyb3BfZGVzdHJveSh0aGlzKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIHJlc2V0T3JpZ2luUG9zOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLmNvbG9yID0gdGhpcy5ib3hJdGVtLmNvbG9yX3Nob3c7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgYm94U3BlY2lhbGx5U2hvdzpmdW5jdGlvbiAodHlwZSkge1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmVuZF95O1xyXG5cclxuICAgICAgICB0aGlzLmJveEl0ZW0uY29sb3JfdHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5ub2RlLmNvbG9yID0gdGhpcy5ib3hJdGVtLmNvbG9yX3Nob3c7XHJcblxyXG4gICAgICAgIGlmKHR5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDEwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICAvL+WmguaenOaYr+ato+WcqOaOieiQveeahCDliLfmlrBlbmR5IOeahOWdkOagh1xyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdGVfYiA9PT0gQm94U3RhdGUuRUZhbGxpbmcgfHxcclxuICAgICAgICAvLyAgICAgdGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRGVzdHJveSl7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0ZV9iID09PSBCb3hTdGF0ZS5FRmFsbGluZyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbSA9IHRoaXMubm9kZS55ICsgdGhpcy5ub2RlLmhlaWdodCAqIDAuNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzcGVlZF9uID0gdGhpcy5jdXJyZW50U3BlZWQgKyB0aGlzLmFjY19zcGVlZCpkdDtcclxuICAgICAgICAgICAgICAgIGxldCBzID0gKHNwZWVkX24gKyB0aGlzLmN1cnJlbnRTcGVlZCApKjAuNSAqIGR0O1xyXG5cclxuICAgICAgICAgICAgICAgIHNwZWVkX24gPSBNYXRoLm1pbihzcGVlZF9uLHRoaXMuc3BlZWRNYXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSBzcGVlZF9uO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUueSA8PSB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIOaOieiQveWIsOaMh+WumuS9jee9rueahOaXtuWAmeW8ueWKqOS4gOS4i1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlX2IgPT09IEJveFN0YXRlLkVGYWxsaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5ib3hJdGVtLmFuaV9wb2ludC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLpnIDopoHlgZrlgY/np7vmk43kvZwg5Yik5patXCIpO1xyXG4gICAgICAgICAgICAvLyBsZXQgcG9pbnRfYSA9IHRoaXMuYm94SXRlbS5hbmlfcG9pbnRcclxuXHJcbiAgICAgICAgICAgIC8v5Yik5pat6L+Z5Liq5L2N572u55qEeSDpnIDopoHlnKjnmoR455qE5L2N572uXHJcbiAgICAgICAgICAgIC8vIGxldCBwb2ludHMgPSB0aGlzLmJveEl0ZW0uYW5pX3BvaW50LmZpbHRlcihmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiB0aGlzLm5vZGUueSA8IGVsZW0ueTtcclxuICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsYXN0X3BvaW50ID0gdGhpcy5ib3hJdGVtLmFuaV9wb2ludFswXTtcclxuXHJcbiAgICAgICAgICAgIGlmKGxhc3RfcG9pbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggIT09IGxhc3RfcG9pbnQueCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgPCBsYXN0X3BvaW50Lnkpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMubm9kZS54ID0gbGFzdF9wb2ludC54O1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5ib3hJdGVtLmFuaV9wb2ludC5zaGlmdCgpOy8v5Yig6Zmk56ys5LiA5Liq5YWD57SgXHJcblxyXG4gICAgICAgICAgICAgICAgaWYobGFzdF9wb2ludC5pc2xlZnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5bem6L6555qE6YCS5YePXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLm5vZGUueCAtIHRoaXMuc3BlZWQqMC41O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubm9kZS54IDw9IGxhc3RfcG9pbnQueCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gbGFzdF9wb2ludC54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJveEl0ZW0uYW5pX3BvaW50LnNoaWZ0KCk7Ly/liKDpmaTnrKzkuIDkuKrlhYPntKBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT0956e76ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+WPs+i+ueeahOmAkuWinlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ub2RlLnggKyB0aGlzLnNwZWVkKjAuNTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm5vZGUueCA+PSBsYXN0X3BvaW50Lngpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IGxhc3RfcG9pbnQueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3hJdGVtLmFuaV9wb2ludC5zaGlmdCgpOy8v5Yig6Zmk56ys5LiA5Liq5YWD57SgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09Peenu+mZpFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPT09PVwiICsgbGFzdF9wb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMubm9kZS54ID4gdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5ub2RlLnggLT0gdGhpcy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIGlmICh0aGlzLm5vZGUueCA8IHRoaXMuYm94SXRlbS5iZWdpbl94KSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxufSk7XHJcblxyXG4iLCJcclxuXHJcblxyXG52YXIgQm94VHlwZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94VHlwZTtcclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnhcclxuICAgICAgICBiZWdpbl94OjAsXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva55XHJcbiAgICAgICAgYmVnaW5feSA6IDAsXHJcbiAgICAgICAgLy/opoHmirXovr7nmoTkvY3nva5ZXHJcbiAgICAgICAgZW5kX3kgOiAtMTAwMCxcclxuICAgICAgICAvL+aYvuekuueahOminOiJslxyXG4gICAgICAgIGNvbG9yX3R5cGUgOiBCb3hUeXBlLldoaXRlLFxyXG5cclxuICAgICAgICBjb2xvcl9zaG93OntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2godGhpcy5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuV2hpdGU6cmV0dXJuIGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5ZRUxMT1c6cmV0dXJuIGNjLkNvbG9yLllFTExPVztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuR3JlZW46cmV0dXJuIGNjLkNvbG9yLkdSRUVOO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbHVlOnJldHVybiBjYy5Db2xvci5CTFVFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQm94VHlwZS5CbGFjazpyZXR1cm4gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hUeXBlLkJhcnJpZXI6cmV0dXJuIGNjLkNvbG9yLlJFRDtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFR5cGUuQmxhbms6IHJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OnJldHVybiBjYy5Db2xvci5DWUFOO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/ooYxcclxuICAgICAgICByYW5rIDogMCxcclxuICAgICAgICAvL+WIl1xyXG4gICAgICAgIHJvdyA6IDAsXHJcblxyXG5cclxuICAgICAgICAvKuenu+WKqHnnmoTkvY3nva4g56ym5ZCI5p2h5Lu255qE6KaB5pu05pawIHjnmoTlnZDmoIdcclxuICAgICAgICAqIOmHjOmdouaYryB7eDowLHk6Myxpc2xlZnQ6dHJ1ZX0g5a2X5YW457G75Z6LXHJcbiAgICAgICAgKiAqL1xyXG4gICAgICAgIGFuaV9wb2ludCA6IFtdLFxyXG5cclxuXHJcbiAgICAgICAgaWQ6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJhbmsudG9TdHJpbmcoKSArIHRoaXMucm93LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiXHJcblxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG52YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgR2FtZV9TdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuR2FtZV9TdGF0ZTtcclxudmFyIEJveFR5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFR5cGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICBib3hfcHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcmFuazp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLliJfmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yb3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi6KGM5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdXBlcl9ub2RlOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX2dhbWVTdGF0ZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6R2FtZV9TdGF0ZS5TdGFydCxcclxuICAgICAgICAgICAgdHlwZTpHYW1lX1N0YXRlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdhbWVzdGF0ZTp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZVN0YXRlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fZ2FtZVN0YXRlICE9PSB2YWx1ZSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wQmVmb3JlID0gdGhpcy5fZ2FtZVN0YXRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lU3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUgPT09IEdhbWVfU3RhdGUuUGxheSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA5aeL5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsQmVnaW5PcmlnaW5ZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgIGlmKHZhbHVlID09PSBHYW1lX1N0YXRlLkZpbGxpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGVtcEJlZm9yZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5piv5Yia5a6e5L6L5ri45oiP5a6M5LmL5ZCOXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yib5bu66Zqc56KN54mpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmFycmllckNhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVtb3ZlQnlWYWx1ZSA9IGZ1bmN0aW9uKGFycix2YWwpe1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGk8YXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKGFycltpXSA9PT0gdmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLy8gQXJyYXkucHJvdG90eXBlLmZpbHRlclJlcGVhdCA9IGZ1bmN0aW9uKCl7ICBcclxuICAgICAgICAvLyAgICAgLy/nm7TmjqXlrprkuYnnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgLy8gICAgIGlmKGFyci5sZW5ndGggPiAwKXtcclxuICAgICAgICAvLyAgICAgICAgIGFyci5wdXNoKHRoaXNbMF0pO1xyXG4gICAgICAgIC8vICAgICB9XHJcblxyXG4gICAgICAgIC8vICAgICBmb3IodmFyIGkgPSAxOyBpIDwgdGhpcy5sZW5ndGg7IGkrKyl7ICAgIC8v5LuO5pWw57uE56ys5LqM6aG55byA5aeL5b6q546v6YGN5Y6G5q2k5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5a+55YWD57Sg6L+b6KGM5Yik5pat77yaICBcclxuICAgICAgICAvLyAgICAgICAgIC8v5aaC5p6c5pWw57uE5b2T5YmN5YWD57Sg5Zyo5q2k5pWw57uE5Lit56ys5LiA5qyh5Ye6546w55qE5L2N572u5LiN5pivaSAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+mCo+S5iOaIkeS7rOWPr+S7peWIpOaWreesrGnpobnlhYPntKDmmK/ph43lpI3nmoTvvIzlkKbliJnnm7TmjqXlrZjlhaXnu5PmnpzmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICAgICAgaWYodGhpcy5pbmRleE9mKHRoaXNbaV0pID09IGkpeyAgXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgYXJyLnB1c2godGhpc1tpXSk7ICBcclxuICAgICAgICAvLyAgICAgICAgIH0gIFxyXG4gICAgICAgIC8vICAgICB9ICBcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGFycjsgIFxyXG4gICAgICAgIC8vIH0gIFxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0ID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVdpZHRoID0gMTAwO1xyXG4gICAgICAgIHRoaXMuaXRlbUhlaWdodCA9IDEwMDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtU3BhY2UgPSA1O1xyXG5cclxuICAgICAgICAvL3RoaXMubWFyZ2luX3RvcCA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICAvL3RoaXMubWFyZ2luX2JvdHRvbSA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41IC0gdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW5fdG9wID0gLSh0aGlzLnN1cGVyX25vZGUuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqdGhpcy5udW1fcm93ICsgdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcm93IC0gMSkgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2JvdHRvbSA9IC0odGhpcy5zdXBlcl9ub2RlLmhlaWdodCkqMC41ICsgIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcblxyXG4gICAgICAgIHRoaXMubWFyZ2luX2xlZnQgPSAgLXRoaXMuaXRlbVdpZHRoKnRoaXMubnVtX3JhbmsqMC41ICsgdGhpcy5pdGVtU3BhY2UqKHRoaXMubnVtX3JhbmsqMC41LTEpO1xyXG4gICAgICAgIHRoaXMubWFyZ2luX3JpZ2h0ID0gdGhpcy5pdGVtV2lkdGggKiB0aGlzLm51bV9yYW5rICogMC41IC0gdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcmFuayAqIDAuNSAtIDEpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXNkcyAgXCIgKyB0aGlzLm1hcmdpbl90b3ArXCIgIFwiK3RoaXMubWFyZ2luX2JvdHRvbSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbCA9IG5ldyBjYy5Ob2RlUG9vbChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgIC8q6Zqc56KN54mp55qE5pa55Z2X5YiX6KGoKi9cclxuICAgICAgICB0aGlzLmxpc3RCYXJyaWVyID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucmVwbGF5R2FtZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+mHjeaWsOW8gOWni+a4uOaIj1xyXG4gICAgcmVwbGF5R2FtZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuU3RhcnQ7XHJcblxyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuc3VwZXJfbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICAgICAgd2hpbGUoY2hpbGRyZW4ubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShjaGlsZHJlbltpXS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/muIXnqbpyYW5rbGlzdFxyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHdoaWxlIChpdGVtID0gdGhpcy5yYW5rTGlzdC5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmuIXnqbrmiJA9PT09PT09PT095YqfPT09PT09XCIpO1xyXG5cclxuICAgICAgICAvL+WIm+W7uuaJgOaciemdouadv+eahOaVsOaNrlxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleDx0aGlzLm51bV9yYW5rOyBpbmRleCsrKXtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSYW5rQ29udGVudChpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZUFsbEJlZ2luT3JpZ2luWSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyrliJvlu7rpmpznoo3niakg5biD5bGAXHJcbiAgICAqIDEu5Zyo6Zqc56KN54mp5LiL6Z2i55qE54mp5L2T5oqK5LuW5riF56m6XHJcbiAgICAqIDIu6L+Z5Liq5YiX55qE5pWw6YeP5rKh5pyJ5Y+Y6L+Y5piv6L+Z5Lqb5pWw6YePXHJcbiAgICAqICovXHJcbiAgICBjcmVhdGVCYXJyaWVyQ2FudmFzOmZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDM7IGk8dGhpcy5udW1fcmFuay0zOyBpKyspe1xyXG4gICAgICAgIC8vICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGV0IGJveCA9IGxpc3RbN107XHJcbiAgICAgICAgLy8gICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIC8vICAgICBib3hfYy5ib3hTcGVjaWFsbHlTaG93KEJveFR5cGUuQmFycmllcik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBsZXQgYmFycmllckxpc3QgPSBbXHJcblxyXG4gICAgICAgICAgICB7XCJyb3dcIjo3LFwicmFua1wiOjJ9LHtcInJvd1wiOjYsXCJyYW5rXCI6Mn0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6M30sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6NH0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6NX0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6Nn0sXHJcbiAgICAgICAgICAgIHtcInJvd1wiOjcsXCJyYW5rXCI6N30se1wicm93XCI6NixcInJhbmtcIjo3fSxcclxuXHJcblxyXG4gICAgICAgICAgICAvLyB7XCJyb3dcIjoyLFwicmFua1wiOjJ9LHtcInJvd1wiOjMsXCJyYW5rXCI6Mn0sXHJcbiAgICAgICAgICAgIC8vIHtcInJvd1wiOjIsXCJyYW5rXCI6M30sXHJcbiAgICAgICAgICAgIC8vIHtcInJvd1wiOjIsXCJyYW5rXCI6Nn0sXHJcbiAgICAgICAgICAgIC8vIHtcInJvd1wiOjIsXCJyYW5rXCI6N30se1wicm93XCI6MyxcInJhbmtcIjo3fSxcclxuXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgIC8v5bCGYmxhbmvmjIlyb3flpKflsI/mjpLluo8g5LuO5bCP5Yiw5aSnIOW6lemDqOWIsOmhtumDqCDmjpLluo/lupXpg6jliLDpobbpg6hcclxuICAgICAgICBiYXJyaWVyTGlzdC5zb3J0KGZ1bmN0aW9uIChhLGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGEucm93IC0gYi5yb3c7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v6K6+572u5pivIGJhcnJpZXLnmoTmlrnlnZfnsbvlnotcclxuICAgICAgICBiYXJyaWVyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbZWxlLnJhbmtdO1xyXG4gICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtlbGUucm93XTtcclxuICAgICAgICAgICAgaWYoYm94ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RCYXJyaWVyLnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveFNwZWNpYWxseVNob3coQm94VHlwZS5CYXJyaWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvKuiuvue9rui/meS4qmJhcnJpZXLkuIvnmoTmlrnlnZcqL1xyXG4gICAgICAgIGJhcnJpZXJMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtlbGUucmFua107XHJcbiAgICAgICAgICAgIGZvcihsZXQgbnVtX2IgPSAwOyBudW1fYjxlbGUucm93O251bV9iKyspe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v6L+Z5Liq5L2N572u6K6+572u5oiQ56m655m95Y2g5L2N5L+h5oGvXHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtudW1fYl07XHJcbiAgICAgICAgICAgICAgICBpZihib3ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2MuYm94U3BlY2lhbGx5U2hvdyhCb3hUeXBlLkJsYW5rKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5iZWdpbkJsYW5rRmlsbCgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyrlvIDlp4vnqbrkvY3loavlhYUqL1xyXG4gICAgYmVnaW5CbGFua0ZpbGw6ZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvKueci+aYr+WQpumcgOimgeWIm+W7uiDmlrnlnZcg5Y675aGr5YWF5Y2g5L2N5pa55Z2XKi9cclxuXHJcbiAgICAgICAgaWYodGhpcy5saXN0QmFycmllci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy/msqHmnInpmpznoo3nialcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/nu5nov5nkuKrpmpznoo3niankuIvpnaLooaXlhYXmlrnlnZdcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdEJhcnJpZXIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMubGlzdEJhcnJpZXJbaV07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJsYW5rQ2hlY2tSZXBsYWNlQmxhbmtBdmFpbGFibGUoYm94KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKuajgOa1i+aYr+WQpuWPr+S7peabv+aNolxyXG4gICAgKiBib3hfYyDov5nkuKropoHmk43kvZznmoTmlrnlnZfnsbvlnosgIOaYryDpmpznoo3nialcclxuICAgICogKi9cclxuICAgIGJsYW5rQ2hlY2tSZXBsYWNlQmxhbmtBdmFpbGFibGUgOiBmdW5jdGlvbiAoYm94KSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAgICAgICAgIC8v5piv6Zqc56KN54mpXHJcblxyXG4gICAgICAgICAgICAvL+i/meS4qumanOeijeeJqeeahOi+ueeVjOS4pOi+uSDniankvZPmmK8g6L6555WMIOOAgemanOeijeeJqeOAgeaWueWdl1xyXG4gICAgICAgICAgICBsZXQgYm94X2xlZnQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuay0xXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAgICAgICAgIGxldCBib3hfUmlnaHQgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFuaysxXVtib3hfYy5ib3hJdGVtLnJvd107XHJcbiAgICAgICAgICAgIGxldCBib3hfYm90dG9tID0gdGhpcy5yYW5rTGlzdFtib3hfYy5ib3hJdGVtLnJhbmtdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG5cclxuICAgICAgICAgICAgLy8gLy/lpoLmnpzov5nkuKrpmpznoo3niakg5LiKIOW3piDlj7Mg6YO95pyJ5YW25LuW55qE6Zqc56KN54mpIOi/meS4qumanOeijeeJqeS4jeWBmuWkhOeQhiDnlLHku5bkuIrmlrnmjonokL3nmoTmlrnlnZflpITnkIZcclxuICAgICAgICAgICAgLy8gbGV0IGhhdmVSaWdodCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBmb3IobGV0IGkgPSBib3hfYy5ib3hJdGVtLnJhbmsrMTsgaSA8IHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2ldW2JveF9jLmJveEl0ZW0ucm93XTtcclxuICAgICAgICAgICAgLy8gICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmFycmllcil7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgLy8gfS5iaW5kKHRoaXMpKSgpO1xyXG4gICAgICAgICAgICAvLyBsZXQgaGF2ZUxlZnQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgZm9yKGxldCBpID0gYm94X2MuYm94SXRlbS5yYW5rLTE7IGkgPj0gMDsgaS0tKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICBsZXQgYiA9IHRoaXMucmFua0xpc3RbaV1bYm94X2MuYm94SXRlbS5yb3ddO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CYXJyaWVyKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB9LmJpbmQodGhpcykpKCk7XHJcbiAgICAgICAgICAgIC8vIGxldCBoYXZlVG9wID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gICAgIGZvcihsZXQgaSA9IGJveF9jLmJveEl0ZW0ucm93KzE7IGkgPCB0aGlzLm51bV9yb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2JveF9jLmJveEl0ZW0ucmFua11baV07XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJhcnJpZXIpe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSkoKTtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gaWYoaGF2ZUxlZnQgJiYgaGF2ZVJpZ2h0ICYmaGF2ZVRvcCl7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIui/meS4quS4iemdoumDveaciemanOeijeeJqSBcIitib3hfYy5ib3hJdGVtLnJhbmsgK1wiICBcIisgYm94X2MuYm94SXRlbS5yb3cpO1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG5cclxuICAgICAgICAgICAgaWYoYm94X2JvdHRvbSAhPT0gdW5kZWZpbmVkICYmIGJveF9ib3R0b20uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICAgICAgLy/ov5nkuKrlupXpg6jmmK/nqbrnmoQg5Y+v5Lul5aGr5YWF5pa55Z2XXHJcblxyXG4gICAgICAgICAgICAgICAgLy/loavlhYXlhYgg5bem5YaN5Y+zXHJcbiAgICAgICAgICAgICAgICBpZihib3hfUmlnaHQgIT09IHVuZGVmaW5lZCAmJiBib3hfUmlnaHQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/lj7PovrnkvY3nva7mjonokL3loavlhYVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuWPs+i+ueS9jee9riDlvoDlt6bovrnloavlhYXmjonokL3loavlhYVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5Y+m5aSW6L6555WM55qE6YKj5Liq6Zqc56KN54mpXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVkZ2VPdGhlckJveCA9IHRoaXMuYmxhbmtHZXRCb3JkZXJCYXJyaWVyQm94KGJveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v56e76ZmkIOW3pui+uei/meS4quimgeWIoOmZpOeahCDmm7TmlrDmlrDnmoTmlrnlnZfnmoTlvIDlp4vkvY3nva7kv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVtb3ZlSXRlbUF0UmFuayhib3hfUmlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruimgeabv+aNoueahOS9jee9rlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b20sYm94X1JpZ2h0LGVkZ2VPdGhlckJveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtDaGVja1JlcGxhY2VCbGFua0F2YWlsYWJsZShib3gpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZihib3hfbGVmdCAhPT0gdW5kZWZpbmVkICYmIGJveF9sZWZ0LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5UeXBlQ291bnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5bem6L655L2N572u5o6J6JC95aGr5YWFXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLlt6bovrnkvY3nva7mjonokL3loavlhYUg5b6A5Y+z6L655aGr5YWF5o6J6JC95aGr5YWFXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+WPpuWklui+ueeVjOeahOmCo+S4qumanOeijeeJqVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZGdlT3RoZXJCb3ggPSB0aGlzLmJsYW5rR2V0Qm9yZGVyQmFycmllckJveChib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+enu+mZpCDlt6bovrnov5nkuKropoHliKDpmaTnmoQg5pu05paw5paw55qE5pa55Z2X55qE5byA5aeL5L2N572u5L+h5oGvXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlbW92ZUl0ZW1BdFJhbmsoYm94X2xlZnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruimgeabv+aNoueahOS9jee9rlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtSZXBsYWNlQm94KGJveF9ib3R0b20sYm94X2xlZnQsZWRnZU90aGVyQm94KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua0NoZWNrUmVwbGFjZUJsYW5rQXZhaWxhYmxlKGJveCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL+aIluiAhei/meS4qumanOeijeeJqeebuOmCu+WcqOS4gOi1tyDlj6blpJbkuIDovrnnmoTpmpznoo3nialcclxuICAgIGJsYW5rR2V0Qm9yZGVyQmFycmllckJveDpmdW5jdGlvbiAoYm94KSB7XHJcblxyXG4gICAgICAgIGxldCBlZGdlX2I7Ly8gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgIGxldCByb3cgPSBib3hfYy5ib3hJdGVtLnJvdztcclxuICAgICAgICBsZXQgcmFuayA9IGJveF9jLmJveEl0ZW0ucmFuaztcclxuXHJcbiAgICAgICAgLy/liKTmlq3ov5nkuKrmlrnlnZfnmoTlj7PovrnmnInmsqHmnIlcclxuICAgICAgICBmb3IobGV0IGkgPSByYW5rKzE7IGkgPCB0aGlzLm51bV9yYW5rOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGIgPSB0aGlzLnJhbmtMaXN0W2ldW3Jvd107XHJcbiAgICAgICAgICAgIGlmKGIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgIGVkZ2VfYiA9IGI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy/lt6bovrlcclxuICAgICAgICBmb3IobGV0IGogPSByYW5rLTE7IGogPj0gMDsgai0tKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBiID0gdGhpcy5yYW5rTGlzdFtqXVtyb3ddO1xyXG4gICAgICAgICAgICBpZihiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfWVsc2UgaWYoYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5jb2xvcl90eXBlIDwgQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICBlZGdlX2IgPSBiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlZGdlX2IgIT09IHVuZGVmaW5lZCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWRnZV9yYW5rID0gZWRnZV9iLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLnJhbms7XHJcbiAgICAgICAgICAgIGxldCBlZGdlX3JvdyA9IGVkZ2VfYi5nZXRDb21wb25lbnQoQm94RHJvcCkuYm94SXRlbS5yb3c7XHJcblxyXG4gICAgICAgICAgICAvL+W6leS4i1xyXG4gICAgICAgICAgICBmb3IobGV0IGsgPSBlZGdlX3Jvdy0xOyBrID49IDA7IGstLSl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJiID0gdGhpcy5yYW5rTGlzdFtlZGdlX3JhbmtdW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYoYmIuZ2V0Q29tcG9uZW50KEJveERyb3ApLmJveEl0ZW0uY29sb3JfdHlwZSA8IEJveFR5cGUuVHlwZUNvdW50KXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGJiLmdldENvbXBvbmVudChCb3hEcm9wKS5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLkJsYW5rKXtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlX2IgPSBiYjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVkZ2VfYjtcclxuICAgIH0sXHJcblxyXG4gICAgLyrmo4DmtYvmmK/lkKblj6/ku6Xmm7/mjaJcclxuICAgICAqIGJveF9jIOi/meS4quimgeaTjeS9nOeahOaWueWdl+exu+WeiyAg5pivIOaWueWdl1xyXG4gICAgICogKi9cclxuICAgIGJsYW5rQ2hlY2tSZXBsYWNlTm9ybWFsQXZhaWxhYmxlIDogZnVuY3Rpb24gKGJveCxlZGdlT3RoZXJCb3gpe1xyXG5cclxuICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICBpZihib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgIC8v5piv5pa55Z2XXHJcblxyXG4gICAgICAgICAgICAvL+i/meS4quaWueWdl+eahCDlt6bkuIvmlrkg5Y+z5LiL5pa5IOato+S4i+aWuSDliKTmlq3mmK/lkKbmmK/nqbrkvY1cclxuICAgICAgICAgICAgbGV0IGJveF9ib3R0b21fbGVmdCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rLTFdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbV9SaWdodCA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rKzFdW2JveF9jLmJveEl0ZW0ucm93LTFdO1xyXG4gICAgICAgICAgICBsZXQgYm94X2JvdHRvbV96aGVuZyA9IHRoaXMucmFua0xpc3RbYm94X2MuYm94SXRlbS5yYW5rXVtib3hfYy5ib3hJdGVtLnJvdy0xXTtcclxuICAgICAgICAgICAgaWYoYm94X2JvdHRvbV96aGVuZyAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICBib3hfYm90dG9tX3poZW5nLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5jb2xvcl90eXBlID09PSBCb3hUeXBlLkJsYW5rKSB7XHJcbiAgICAgICAgICAgICAgICAvL+ato+S4i+aWueaYr+epuueahCDlvoDmraPkuIvmlrkg5pu/5o2iXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuato+S4i+aWueaYr+epuueahCDlvoDmraPkuIvmlrkg5pu/5o2iXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbV96aGVuZyxib3gsZWRnZU90aGVyQm94KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoYm94X2JvdHRvbV9sZWZ0ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIGJveF9ib3R0b21fbGVmdC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uY29sb3JfdHlwZSA9PT0gQm94VHlwZS5CbGFuayl7XHJcbiAgICAgICAgICAgICAgICAvL+W3puS4i+aWueaYr+epuueahCDlvoDlt6bkuIvmlrkg5pu/5o2iXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuW3puS4i+aWuVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKuWIpOaWreW3puS4i+aWuSDmiJbogIUg5Y+z5LiL5pa5IOimgeWhq+WFheeahOi/meS4quaWueWdlyDkuI7ku5bnmoTovrnnlYzpmpznoo3nianlgZrliKTmlq0g6L+Z5Liq5pa55Z2X5piv55Sx6L+Z6L656Lev5Y+j5o6J6JC9IOi/mOaYr+WPpuWkluS4gOi+uSovXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ibGFua1JlcGxhY2VCb3goYm94X2JvdHRvbV9sZWZ0LGJveCxlZGdlT3RoZXJCb3gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihib3hfYm90dG9tX1JpZ2h0ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIGJveF9ib3R0b21fUmlnaHQuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmNvbG9yX3R5cGUgPT09IEJveFR5cGUuQmxhbmspe1xyXG4gICAgICAgICAgICAgICAgLy/lj7PkuIvmlrnmmK/nqbrnmoQg5b6A5Y+z5LiL5pa5IOabv+aNolxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLlj7PkuIvmlrlcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsYW5rUmVwbGFjZUJveChib3hfYm90dG9tX1JpZ2h0LGJveCxlZGdlT3RoZXJCb3gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8q5pu/5o2i5pa55Z2XIOW5tuaJp+ihjOabv+aNouWIh+aNoueahOWKqOeUu+aViOaenCovXHJcbiAgICBibGFua1JlcGxhY2VCb3ggOmZ1bmN0aW9uIChib3hCbGFuayxib3hSZXBsYWNlLGVkZ2VPdGhlckJveCl7XHJcblxyXG4gICAgICAgIGxldCBib3hfcmUgPSBib3hSZXBsYWNlLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgbGV0IGJveF9ibCA9IGJveEJsYW5rLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG5cclxuICAgICAgICAvL+iuvue9rnjnmoTkvY3nva7lj5jljJbnmoTml7blgJkg54K5XHJcbiAgICAgICAgbGV0IHJlcGVhdExpc3QgPSBib3hfcmUuYm94SXRlbS5hbmlfcG9pbnQuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbS54ID09PSBib3hfYmwuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHJlcGVhdExpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpc2xlZnQgPSBib3hfYmwuYm94SXRlbS5iZWdpbl94IDwgYm94X3JlLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICAgICAgYm94X3JlLmJveEl0ZW0uYW5pX3BvaW50LnB1c2goe1wieFwiOiBib3hfYmwuYm94SXRlbS5iZWdpbl94LCBcInlcIjogYm94X2JsLmJveEl0ZW0uZW5kX3kgKyBib3hfYmwubm9kZS5oZWlnaHQsXCJpc2xlZnRcIjppc2xlZnR9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBib3hfcmUuYm94SXRlbS5lbmRfeSA9IGJveF9ibC5ib3hJdGVtLmVuZF95O1xyXG5cclxuICAgICAgICAvLyBsZXQgdGVtcF9yYW5rID0gYm94X3JlLmJveEl0ZW0ucmFuaztcclxuXHJcbiAgICAgICAgYm94X3JlLmJveEl0ZW0ucm93ID0gYm94X2JsLmJveEl0ZW0ucm93O1xyXG4gICAgICAgIGJveF9yZS5ib3hJdGVtLnJhbmsgPSBib3hfYmwuYm94SXRlbS5yYW5rO1xyXG5cclxuICAgICAgICAvL+i/meS4quaWueWdl+e7p+e7reW+gOS4i+abv+aNolxyXG4gICAgICAgIGlmKHRoaXMuYmxhbmtDaGVja1JlcGxhY2VOb3JtYWxBdmFpbGFibGUoYm94UmVwbGFjZSxlZGdlT3RoZXJCb3gpKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLnp7vliqjlrozmiJAg5pu/5o2iPT09PT09PVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8v5Y2g5L2N55qE5pa55Z2XIOS9jee9ruabv+aNouaIkOimgeenu+WFpeeahOaWueWdlyAg56e76Zmk6L+Z5Liq5Y2g5L2N5pa55Z2XXHJcbiAgICAgICAgICAgIHRoaXMucmFua0xpc3RbYm94X2JsLmJveEl0ZW0ucmFua11bYm94X2JsLmJveEl0ZW0ucm93XSA9IGJveFJlcGxhY2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJveFBvb2wucHV0KGJveF9ibC5ub2RlKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvL+WQjumdoumBjeWOhueahOaXtuWAmeaKiuS7luenu+mZpOaOiVxyXG4gICAgICAgIC8vdGhpcy5yYW5rTGlzdFt0ZW1wX3JhbmtdLnJlbW92ZUJ5VmFsdWUodGhpcy5yYW5rTGlzdFt0ZW1wX3JhbmtdLGJveFJlcGxhY2UpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYm94RHJvcF9kZXN0cm95OmZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveC5ib3hJdGVtLnJhbmtdO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIGxpc3QucmVtb3ZlQnlWYWx1ZShsaXN0LGJveC5ub2RlKTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB0aGlzLmJveFBvb2wucHV0KGJveC5ub2RlKTtcclxuICAgICAgICAvLyB9LFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgXHJcbiAgICBibGFua1JlbW92ZUl0ZW1BdFJhbms6ZnVuY3Rpb24gKGJveFJlbW92ZSkge1xyXG5cclxuICAgICAgICBsZXQgYm94X3JlID0gYm94UmVtb3ZlLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveF9yZS5ib3hJdGVtLnJhbmtdO1xyXG4gICAgICAgIGxpc3QucmVtb3ZlQnlWYWx1ZShsaXN0LGJveFJlbW92ZSk7XHJcblxyXG4gICAgICAgIGxldCBuZXdfYm94ID0gdGhpcy51cGRhdGVSYW5rRW5kWUluZGV4KGJveF9yZS5ib3hJdGVtLnJhbmspO1xyXG5cclxuICAgICAgICBpZihuZXdfYm94ICE9PSBudWxsKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IG5ld19ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgaWYoYm94X2Mubm9kZS55ICE9PSBib3hfYy5ib3hJdGVtLmVuZF95KXtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpIHx8IChib3hfYy5ub2RlLnkgPj0gYm94X2MuYm94SXRlbS5iZWdpbl95KSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5LuW5pys6Lqr5piv5pyA5ZCO5LiA5LiqIOi3n+WAkuaVsOesrOS6jOS4quWvueavlFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0X2JveCA9IGxpc3RbbGlzdC5sZW5ndGgtMl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGFzdF9ib3ggIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IGxhc3RfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5iZWdpbl95ICsgYm94X2Mubm9kZS5oZWlnaHQgKyAxMCpsaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcCArIHNwYWNlX3RvcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94X2Mubm9kZS55ID0gYm94X2MuYm94SXRlbS5iZWdpbl95O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy/mmK/opoHmjonokL3nmoRcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlBsYXkgfHxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxlZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcblxyXG5cclxuICAgIC8v5Yib5bu65q+P5LiA5YiX55qE5pWw5o2uXHJcbiAgICBjcmVhdGVSYW5rQ29udGVudDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCByYW5rX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaW5kZXg7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLm51bV9yb3c7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICBib3guYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGJveC53aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG4gICAgICAgICAgICBib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FTm9ybWFsO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuaW5pdEJveEl0ZW0oKTtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feCA9IG9yaWdpbl94O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSooaSsxKTtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb3VudCA9IEJveFR5cGUuVHlwZUNvdW50O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKmNvdW50KSB8IDA7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5yZXNldE9yaWdpblBvcygpO1xyXG5cclxuICAgICAgICAgICAgYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgIHJhbmtfbGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmtMaXN0LnB1c2gocmFua19saXN0KTtcclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+abtOaWsOaJgOacieWIlyBlbmQgeeeahOaVsOaNrlxyXG4gICAgdXBkYXRlQWxsUmFua0VuZFk6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgLy/nnIvor6XliJfnmoTmlbDph4/mmK/lkKYg5bCP5LqOIHRoaXMubnVtX3JvdyAg5bCR5LqO55qE6K+d5YiZ6KGl5YWFXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVSYW5rRW5kWUluZGV4KGkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBbGxCZWdpbk9yaWdpblkoKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8q5pu05paw5p+Q5YiX55qE5pWw5o2uKi9cclxuICAgIHVwZGF0ZVJhbmtFbmRZSW5kZXg6ZnVuY3Rpb24oaW5kZXgpe1xyXG5cclxuICAgICAgICBsZXQgY3JlYXRlQm94ID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaW5kZXg7XHJcblxyXG4gICAgICAgIGxldCBsaXN0X3N1YiA9IHRoaXMucmFua0xpc3RbaW5kZXhdO1xyXG5cclxuICAgICAgICB3aGlsZShsaXN0X3N1Yi5sZW5ndGggPCB0aGlzLm51bV9yb3cpe1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgIG5ld19ib3guYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgbmV3X2JveC53aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG4gICAgICAgICAgICBuZXdfYm94LmhlaWdodCA9IHRoaXMuaXRlbUhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IG5ld19ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgYm94X2Muc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gMDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5jb2xvcl90eXBlID0gKGNjLnJhbmRvbTBUbzEoKSo1KSB8IDA7XHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBuZXdfYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgIGxpc3Rfc3ViLnB1c2gobmV3X2JveCk7XHJcblxyXG5cclxuICAgICAgICAgICAgY3JlYXRlQm94ID0gbmV3X2JveDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsZXQgZW5kX2JveF95ID0gdGhpcy5tYXJnaW5fYm90dG9tO1xyXG5cclxuICAgICAgICAvL+abtOaWsOavj+S4quWFg+e0oOeahGVuZCB5IOS9jee9rlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPGxpc3Rfc3ViLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGxpc3Rfc3ViW2ldO1xyXG4gICAgICAgICAgICBsZXQgYm94X2MgPSBpdGVtX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IGk7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSppO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiBjcmVhdGVCb3g7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOavj+S4gOWIl+S7luS7rOS4reeahOavj+S4quWFg+e0oOeahOWIneWni+eahG9yaWdpbiB555qE5YC8XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUFsbEJlZ2luT3JpZ2luWTpmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmn5DkuIDliJfkuK0g5LuO5pyA5ZCO5byA5aeL6YGN5Y6G6L+U5ZueXHJcbiAgICAgICAgICog566X5Ye65byA5aeL5o6J5LqG55qE5L2N572uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG5cclxuICAgICAgICAgICAgLy/liKTmlq3mmK/lkKYg5bey6L6+5Yiw5LuW55qEZW5keSDlpoLmnpzov5jmnKrovr7liLDlsLHmmK8g5q2j6KaB5o6J6JC9XHJcbiAgICAgICAgICAgIGxldCBvZmZfdG9wID0gMDtcclxuICAgICAgICAgICAgbGV0IHNwYWNlX3RvcCA9IDU7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9ib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYm94X2Mubm9kZS55ICE9PSBib3hfYy5ib3hJdGVtLmVuZF95KXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogMS7lrp7kvovmuLjmiI/nmoTml7blgJkg5Yid5aeL5byA5aeL55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAgICAgICogMi7mtojpmaTnmoQg5pa55Z2X5LiN5Zyo55WM6Z2i5Lit55qE6K6+572u5LuW55qE5byA5aeL5L2N572uIOW3suWcqOeVjOmdouS4reeahOS4jeWOu+iuvue9ruS7llxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcCArIG9mZl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wID0gb2ZmX3RvcCArIGJveF9jLm5vZGUuaGVpZ2h0ICsgc3BhY2VfdG9wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2VfdG9wID0gc3BhY2VfdG9wICsgMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL+aYr+imgeaOieiQveeahFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlBsYXkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuRmlsbGluZyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLnN0YXRlX2IgPSBCb3hTdGF0ZS5FRmFsbGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBib3hfYy5zdGF0ZV9iID0gQm94U3RhdGUuRUZhbGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8v5Lqk5o2i5Lik5Liq5pa55Z2X55qE5L2N572uXHJcbiAgICBleGNoYW5nZUJveEl0ZW06ZnVuY3Rpb24oYm94MSxib3gyLHRvQ2hlY2tWaWFibGUgPSB0cnVlKXtcclxuXHJcbiAgICAgICAgbGV0IGJveEl0ZW0xID0gYm94MS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgbGV0IGJveEl0ZW0yID0gYm94Mi5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgIGlmKGJveEl0ZW0xLnJhbmsgPT09IGJveEl0ZW0yLnJhbmspe1xyXG4gICAgICAgICAgICAvL+WQjOS4gOWIl+eahFxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9lbmR5ID0gYm94SXRlbTIuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmVuZF95ID0gYm94SXRlbTEuZW5kX3k7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLmVuZF95ID0gdGVtcF9lbmR5O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JvdyA9IGJveEl0ZW0yLnJvdztcclxuXHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJvdyA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgYm94SXRlbTEucm93ID0gdGVtcF9yb3c7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdFtib3hJdGVtMS5yb3ddO1xyXG4gICAgICAgICAgICBsaXN0W2JveEl0ZW0xLnJvd10gPSBsaXN0W2JveEl0ZW0yLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTIucm93XSA9IHRlbXBfbm9kZTtcclxuXHJcblxyXG5cclxuICAgICAgICB9ZWxzZSBpZihib3hJdGVtMS5yb3cgPT09IGJveEl0ZW0yLnJvdyl7XHJcbiAgICAgICAgICAgIC8v5ZCM5LiA6KGM55qEXHJcbiAgICAgICAgICAgIGxldCBsaXN0MSA9IHRoaXMucmFua0xpc3RbYm94SXRlbTEucmFua107XHJcbiAgICAgICAgICAgIGxldCBsaXN0MiA9IHRoaXMucmFua0xpc3RbYm94SXRlbTIucmFua107XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS9jee9rlxyXG4gICAgICAgICAgICBsZXQgdGVtcF9iZWdpbnggPSBib3hJdGVtMi5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMi5iZWdpbl94ID0gYm94SXRlbTEuYmVnaW5feDtcclxuICAgICAgICAgICAgYm94SXRlbTEuYmVnaW5feCA9IHRlbXBfYmVnaW54O1xyXG5cclxuICAgICAgICAgICAgYm94MS5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTEuYmVnaW5feCxib3hJdGVtMS5lbmRfeSkpKTtcclxuICAgICAgICAgICAgYm94Mi5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4yLGNjLnAoYm94SXRlbTIuYmVnaW5feCxib3hJdGVtMi5lbmRfeSkpKTtcclxuICAgICAgICAgICAgLy8gYm94MS5ub2RlLnkgPSBib3hJdGVtMS5lbmRfeTtcclxuICAgICAgICAgICAgLy8gYm94Mi5ub2RlLnkgPSBib3hJdGVtMi5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JhbmsgPSBib3hJdGVtMi5yYW5rO1xyXG4gICAgICAgICAgICBib3hJdGVtMi5yYW5rID0gYm94SXRlbTEucmFuaztcclxuICAgICAgICAgICAgYm94SXRlbTEucmFuayA9IHRlbXBfcmFuaztcclxuXHJcbiAgICAgICAgICAgIGxldCByb3dfaW5kZXggPSBib3hJdGVtMS5yb3c7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wX25vZGUgPSBsaXN0MVtyb3dfaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0MVtyb3dfaW5kZXhdID0gbGlzdDJbcm93X2luZGV4XTtcclxuICAgICAgICAgICAgbGlzdDJbcm93X2luZGV4XSA9IHRlbXBfbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRvQ2hlY2tWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzVmlhYmxlID0gdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICBpZighaXNWaWFibGUpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5LiN5Y+v5raI6Zmk55qE6K+dIOS9jee9ruWGjeS6kuaNouWbnuadpVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLkuI3lj6/mtojpmaRcIik7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leGNoYW5nZUJveEl0ZW0oYm94Mixib3gxLGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy/mo4DmtYvpnaLmnb/miYDmnInmlrnlnZcg5piv5ZCm5Y+v5raI6ZmkXHJcbiAgICBjaGVja1BhbmVsRWxpbWluYXRhYmxlOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCB3aXBlX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgLy/liKTmlq3liJcg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgdGVtcExpc3QgPSBbXTtcclxuICAgICAgICAgICAgbGV0IHByZV9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG4gICAgICAgICAgICAgICAgaWYoIXByZV9ib3gpe1xyXG4gICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fcHJlID0gcHJlX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvQWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgLyrpopzoibLnm7jlkIwg5bm25LiU5piv5pmu6YCa57G75Z6L55qE6aKc6Imy55qE5pe25YCZKi9cclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1fcHJlLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3Jvdy0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHdpcGVfbGlzdCx0ZW1wTGlzdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZXBlYXRJdGVtSW5XaXBlKGl0ZW0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHdpcGVfbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZih3aXBlX2xpc3RbaV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkID09PSBpdGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/liKTmlq3ooYwg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yYW5rOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMucmFua0xpc3Rbal1baV07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1fcHJlLmNvbG9yX3R5cGUgPCBCb3hUeXBlLlR5cGVDb3VudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3JhbmstMSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvQWRkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcExpc3QubGVuZ3RoID49IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov73liqDliLB3aXBl6YeM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNSZXBlYXRJdGVtSW5XaXBlKGVsZW0pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lwZV9saXN0LnB1c2goZWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZih3aXBlX2xpc3QubGVuZ3RoID4gMCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd0RlbGF5QW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgLy/kuI3mmL7npLrmtojpmaTliqjnlLtcclxuICAgICAgICAgICAgICAgIHNob3dEZWxheUFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy/kuI3mmK/liJ3lp4vljJbnmoQg5YGc55WZ5LiA5Lya5YS/5YaN5raI6ZmkIOiuqeeUqOaIt+eci+WIsOimgea2iOmZpOS6huS7gOS5iOS4nOilv1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+a2iOmZpOaOiVxyXG4gICAgICAgICAgICAgICAgLy8gd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIGxldCBib3ggPSBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gYm94LnN0YXRlX2IgPSBCb3hTdGF0ZS5FRGVzdHJveTtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmJveERyb3BfZGVzdHJveShlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2lwZV9saXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3ggPSBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LnN0YXRlX2IgPSBCb3hTdGF0ZS5FRGVzdHJveTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICog6L+Z6L655LiA5Liq5bu26L+fXHJcbiAgICAgICAgICAgICAgICAg5aaC5p6c5ri45oiP5pivIOWIneWni+WMlueahOivneS4jeW7tui/n1xyXG4gICAgICAgICAgICAgICAgIOS4jeaYr+WIneWni+WMliBzdGFydOeahCDopoHnrYnplIDmr4HliqjnlLvlrozmiJDkuYvlkI7lho3lvIDlp4vmjonokL1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8v5pyJ6ZSA5q+B5Zyo5o6J6JC9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lc3RhdGUgIT09IEdhbWVfU3RhdGUuU3RhcnQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+ato+WcqOaOieiQveWhq+WFhVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuRmlsbGluZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsUmFua0VuZFkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksKHRoaXMuZ2FtZXN0YXRlICE9PSBHYW1lX1N0YXRlLlN0YXJ0KT8wLjM6MCxmYWxzZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLHNob3dEZWxheUFuaW1hdGlvbj8wLjM6MCxmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIGJveERyb3BfZ2V0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCBib3ggPSBudWxsO1xyXG4gICAgICAgIGlmKHRoaXMuYm94UG9vbC5zaXplKCkgPiAwKXtcclxuICAgICAgICAgICAgYm94ID0gdGhpcy5ib3hQb29sLmdldCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBib3ggPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJveF9wcmVmYWIpO1xyXG4gICAgICAgICAgICBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5pbml0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYm94O1xyXG4gICAgfSxcclxuXHJcbiAgICBib3hEcm9wX2Rlc3Ryb3k6ZnVuY3Rpb24oYm94KXtcclxuXHJcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveC5ib3hJdGVtLnJhbmtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxpc3QucmVtb3ZlQnlWYWx1ZShsaXN0LGJveC5ub2RlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hQb29sLnB1dChib3gubm9kZSk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5GaWxsaW5nIHx8XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZmlsbEludGVydmFsID09PSAxMCl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW50ZXJ2YWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT095a6a5pe25byA5aeL5Yik5pat5piv5ZCm6YO95bey5o6J6JC95Yiw5bqV6YOo5LqGIGJlZ2luID09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHNlbGYubnVtX3Jhbms7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gc2VsZi5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxmLm51bV9yb3c7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveF9jX2kgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYm94X2NfaS5zdGF0ZV9iICE9PSBCb3hTdGF0ZS5FRmFsbGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT3pg73liLAg5o6J6JC95Yiw5bqV6YOo5LqGIOajgOa1i+aYr+WQpuWPr+a2iOmZpCBlbmQgPT09PT09PT09XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlsbEludGVydmFsICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG4vLyB2YXIgQm94U3RhdGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFN0YXRlO1xyXG52YXIgQm94U2hvd1R5cGUgPSByZXF1aXJlKFwiU3RhdGVzXCIpLkJveFNob3dUeXBlO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBcclxuICAgICAgICBfc2VsZWN0X2JveDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8v6YCJ5Lit5p+Q5Liq5pa55Z2XXHJcbiAgICAgICAgc2VsZWN0X2JveDoge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RfYm94O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdF9ib3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvd1R5cGUgPSBCb3hTaG93VHlwZS5LX1NlbGVjdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9uZXcgPSB2YWx1ZS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJveEl0ZW1fb2xkID0gdGhpcy5fc2VsZWN0X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJveEl0ZW1fbmV3LmlkICE9PSBib3hJdGVtX29sZC5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIueci+aYr+WQpuimgeS6pOS6kuS9jee9riDov5jmmK/or7TliIfmjaLliLDov5nkuKrpgInkuK3nmoTkvY3nva7lpITnkIZcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQxID0gXCIgKyBib3hJdGVtX25ldy5pZCArIFwiICBpZDI9IFwiICsgYm94SXRlbV9vbGQuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aXp+eahOWPlua2iOmAieaLqVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94LnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0odmFsdWUsIHRoaXMuX3NlbGVjdF9ib3gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLkuI3mmK/nm7jov5HnmoQg5Y+W5raI5LiK5LiA5Liq6YCJ5oupIOmAieS4reaWsOeCueWHu+eahFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG93VHlwZSA9IEJveFNob3dUeXBlLktfU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumAieS4reS6huWQjOS4gOS4qiDlj5bmtojpgInmi6lcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNob3dUeXBlID0gQm94U2hvd1R5cGUuS19Ob3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgbGV0IGJveEl0ZW0gPSBjbGlja19ub2RlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgLy8gIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLmJveERyb3BfZGVzdHJveShjbGlja19ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gIC8v5LiK6Z2i55qE5o6J5LiL5p2lXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLnVwZGF0ZVJhbmtFbmRZKGJveEl0ZW0ucmFuayk7XHJcblxyXG5cclxuICAgICAgICAgdGhpcy5zZWxlY3RfYm94ID0gY2xpY2tfbm9kZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuXHJcbiAgICAgICAgbGFiX3Nob3c6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgICAgICB9LFxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9jQ2FsbEpzOmZ1bmN0aW9uIChzdHIpIHtcclxuXHJcbiAgICAgICAgdGhpcy5sYWJfc2hvdy5ub2RlLmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMubGFiX3Nob3cuc3RyaW5nID0gc3RyO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxhYl9zaG93Lm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH0sNSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBqc0NhbGxPYzpmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8v57G75ZCNIOaWueazlSAg5Y+C5pWwMSDlj4LmlbAyIOWPguaVsDNcclxuICAgICAgICB2YXIgcmVzdWx0ID0ganNiLnJlZmxlY3Rpb24uY2FsbFN0YXRpY01ldGhvZChcIkpTQk1hbmFnZXJcIixcInloSlNCQ2FsbDpcIixcImpz6L+Z6L655Lyg5YWl55qE5Y+C5pWwXCIpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImpzX2NhbGxfb2MgPT09PT09PT09ICVAXCIscmVzdWx0KTtcclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLm9jQ2FsbEpzKFwi5rWL6K+VIOaYvuekuumakOiXj1wiKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJcclxuXHJcbi8q5pa55Z2X55qE57G75Z6LKi9cclxuY29uc3QgQm94VHlwZSA9IGNjLkVudW0oe1xyXG4gICAgWUVMTE9XIDogLTEsXHJcbiAgICBHcmVlbiA6IC0xLFxyXG4gICAgQmx1ZSA6IC0xLFxyXG4gICAgQmxhY2sgOiAtMSxcclxuICAgIFdoaXRlIDogLTEsXHJcblxyXG4gICAgVHlwZUNvdW50IDogLTEsXHJcblxyXG4gICAgQmFycmllciA6IC0xLCAgICAgICAvL+manOeijeeJqVxyXG4gICAgQmxhbmsgOiAtMSwgICAgICAgICAgLy/nqbrnmb3ljaDkvY1cclxuXHJcbiAgICBDb3VudCA6IC0xXHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuLy/mlrnlnZfmjonokL3nmoTnirbmgIFcclxuY29uc3QgQm94U3RhdGUgPSBjYy5FbnVtKHtcclxuXHJcbiAgICAvLyBFTm9uZSA6IC0xLCAgICAgIC8v5LuA5LmI6YO95LiN5pivXHJcblxyXG4gICAgRU5vcm1hbCA6IC0xLCAgICAvL+ato+W4uFxyXG4gICAgRUZhbGxpbmcgOiAtMSwgICAvL+aOieiQvVxyXG4gICAgRUZhbGxlZCA6IC0xLCAgICAvL+aOieiQvee7k+adn1xyXG4gICAgRURlc3Ryb3kgOiAtMSwgICAvL+mUgOavgVxyXG5cclxufSk7XHJcblxyXG4vL+aWueWdl+aYvuekuueahOeKtuaAgVxyXG5jb25zdCBCb3hTaG93VHlwZSA9IGNjLkVudW0oe1xyXG5cclxuICAgIEtfTm9ybWFsIDogLTEsICAgICAgICAgIC8v5q2j5bi4XHJcbiAgICBLX1NlbGVjdCA6IC0xLCAgICAgICAgICAvL+mAieS4rVxyXG5cclxuICAgIEtfU2tpbGxBcm91bmQgOiAtMSwgICAgICAgLy/plIDmr4Eg5ZGo6L6555qE5Lmd5LiqXHJcbiAgICBLX1NraWxsUmFuayA6IC0xLCAgICAgICAgIC8v6ZSA5q+BIOivpeWIl1xyXG4gICAgS19Ta2lsbFJhdyA6IC0xLCAgICAgICAgICAvL+mUgOavgSDor6XooYxcclxuICAgIEtfU2tpbGxDb2xvciA6IC0xLCAgICAgICAgLy/plIDmr4Eg6K+l6ImyXHJcbn0pO1xyXG5cclxuXHJcblxyXG4vL+a4uOaIj+i/m+ihjOeahOeKtuaAgVxyXG52YXIgR2FtZV9TdGF0ZSA9IGNjLkVudW0oe1xyXG4gICAgU3RhcnQgOiAtMSwgICAgIC8v5byA5aeL5a6e5L6LXHJcbiAgICBGaWxsaW5nOiAtMSwgICAgLy/mlrnlnZfooaXpvZDkuK0g5o6J6JC95LitXHJcbiAgICAvLyBCbGFua0ZpbGxpbmcgOiAtMSwgLy/nqbrkvY3ooaXlhYUg6Ieq5Yqo5o6J6JC9XHJcbiAgICBQbGF5IDogLTEsICAgICAgLy/ov5vooYzkuK1cclxuICAgIE92ZXIgOiAtMSwgICAgICAvL+e7k+adn1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgIEJveFN0YXRlLFxyXG4gICAgQm94U2hvd1R5cGUsXHJcbiAgICBHYW1lX1N0YXRlLFxyXG4gICAgQm94VHlwZVxyXG5cclxufTsiXSwic291cmNlUm9vdCI6IiJ9