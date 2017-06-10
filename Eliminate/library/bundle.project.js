require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BombMng":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f10e7/oG6pOfoB68bIuTf6J', 'BombMng');
// script/Bomb/BombMng.js

"use strict";

var Bomb_box = require("Bomb_box");

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

        bomb: {
            default: null,
            type: cc.Prefab
        },

        parentNode: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.pool = new cc.NodePool(Bomb_box);
    },

    getBombParticleFromPool: function getBombParticleFromPool() {

        var bomb = null;
        if (this.pool.size() > 0) {
            bomb = this.pool.get();
        } else {
            bomb = cc.instantiate(this.bomb);
        }
        return bomb;
    },

    showBombParticleAtPoint: function showBombParticleAtPoint(point) {

        var bomb = this.getBombParticleFromPool();

        this.parentNode.addChild(bomb);
    }

});

cc._RF.pop();
},{"Bomb_box":"Bomb_box"}],"Bomb_box":[function(require,module,exports){
"use strict";
cc._RF.push(module, '1135bJ/JG5MPI43Q5cHFxdd', 'Bomb_box');
// script/Bomb/Bomb_box.js

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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    reuse: function reuse() {},

    unuse: function unuse() {}

});

cc._RF.pop();
},{}],"BoxDrop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '89bc7CJRGxJBZsOHDnUjDFu', 'BoxDrop');
// script/BoxDrop.js

"use strict";

var BoxItem = require("BoxItem");

var BoxState = require("States").BoxState;

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

        _state_b: {
            default: BoxState.ENone,
            type: BoxState
        },

        state_b: {

            get: function get() {
                return this._state_b;
            },

            set: function set(value) {

                if (this._state_b !== value) {

                    this._state_b = value;

                    switch (value) {
                        case BoxState.ENormal:
                            this.select_item.active = false;

                            break;

                        case BoxState.EFalling:
                            this.select_item.active = false;

                            break;

                        case BoxState.ESelect:
                            this.select_item.active = true;
                            break;

                        case BoxState.EDestroy:
                            this.select_item.active = true;

                            break;

                        case BoxState.ESkillAround:
                            break;

                        case BoxState.ESkillColor:
                            break;

                        case BoxState.ESkillRank:
                            break;

                        case BoxState.ESkillRaw:
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

        this.state_b = BoxState.ENormal;
        this.currentSpeed = this.speed;
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

    unuse: function unuse() {
        console.log("xiaohui");
    },

    reuse: function reuse() {
        console.log("chongyong");

        this.state_b = BoxState.ENormal;
    },

    resetOriginPos: function resetOriginPos() {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;

        this.node.color = this.boxItem.color_show;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        if (this.node.y === this.boxItem.end_y && this.node.x === this.boxItem.begin_x) {
            return;
        }

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

            var animation = this.getComponent(cc.Animation);
            animation.play("ani_box");
        }

        if (this.node.x > this.boxItem.begin_x) {
            this.node.x -= this.speed * dt;
        }

        if (this.node.x < this.boxItem.begin_x) {
            this.node.x = this.boxItem.begin_x;
        }
    }
});

module.exports = {
    BoxState: BoxState
};

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

var Game_State = cc.Enum({
    Start: -1,
    Play: -1,
    Over: -1
});

var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
var BoxState = require("States").BoxState;

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

        gamestate: {
            default: Game_State.Start,
            type: Game_State,
            visible: false
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

        // this.margin_top = (cc.director.getWinSize().height)*0.5 + this.itemHeight*0.5;
        this.margin_top = -cc.director.getWinSize().height * 0.5 + this.itemHeight * this.num_row + this.itemSpace * (this.num_row - 1) + this.itemHeight * 0.5;
        this.margin_bottom = -cc.director.getWinSize().height * 0.5 - this.itemHeight * 0.5;
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

        this.creaePanleContent();
    },

    //创建所有面板的数据
    creaePanleContent: function creaePanleContent() {

        for (var index = 0; index < this.num_rank; index++) {
            this.createRankContent(index);
        }

        this.updateBeginOriginY();

        this.checkPanelEliminatable();
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

    //更新某一列 end y的数据
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

        this.checkPanelEliminatable();
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
            var space_top = 0;

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

                        box_c.boxItem.begin_y = this.margin_top + off_top + space_top;

                        box_c.node.y = box_c.boxItem.begin_y;

                        off_top += box_c.node.height;

                        space_top += space_top + 1;
                    }
                }
            }
        }
    },

    //交换两个方块的位置
    exchangeBoxItem: function exchangeBoxItem(boxItem1, boxItem2) {
        var toCheckViable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


        if (boxItem1.rank === boxItem2.rank) {
            //同一列的
            var list = this.rankList[boxItem1.rank];

            //交换位置
            var temp_endy = boxItem2.end_y;
            boxItem2.end_y = boxItem1.end_y;
            boxItem1.end_y = temp_endy;

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
                    this.exchangeBoxItem(boxItem2, boxItem1, false);
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

                            tempList.forEach(function (elem) {

                                elem.getComponent("BoxDrop").state_b = BoxState.EDestroy;
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

                            _tempList.forEach(function (elem) {

                                elem.getComponent("BoxDrop").state_b = BoxState.EDestroy;
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

            var showDelayAnimation = false;
            if (this.gamestate === Game_State.Start) {
                //不显示消除动画
                showDelayAnimation = true;
            }

            //不是初始化的 停留一会儿再消除
            this.schedule(function () {

                //消除掉
                wipe_list.forEach(function (elem) {

                    this.boxDrop_destroy(elem.getComponent("BoxDrop"));
                }.bind(this));

                this.updateAllRankEndY();
            }.bind(this), showDelayAnimation ? 0 : 1, false);

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

                    value.state_b = BoxState.ESelect;
                    this._select_box = value;
                } else {
                    var boxItem_new = value.getComponent("BoxDrop").boxItem;
                    var boxItem_old = this._select_box.getComponent("BoxDrop").boxItem;
                    if (boxItem_new.id !== boxItem_old.id) {
                        // console.log("看是否要交互位置 还是说切换到这个选中的位置处理");
                        console.log("id1 = " + boxItem_new.id + "  id2= " + boxItem_old.id);
                        //旧的取消选择
                        this._select_box.state_b = BoxState.ENormal;

                        if (boxItem_new.rank === boxItem_old.rank && Math.abs(boxItem_new.row - boxItem_old.row) === 1 || boxItem_new.row === boxItem_old.row && Math.abs(boxItem_new.rank - boxItem_old.rank) === 1) {
                            // console.log("是相近的 交换位置");

                            var boxPanel = cc.find("Game/Panel").getComponent("BoxPanel");
                            boxPanel.exchangeBoxItem(boxItem_new, boxItem_old);

                            this._select_box = null;
                        } else {
                            // console.log("不是相近的 取消上一个选择 选中新点击的");

                            value.state_b = BoxState.ESelect;

                            this._select_box = value;
                        }
                    } else {
                        // console.log("选中了同一个 取消选择");
                        value.state_b = BoxState.ENormal;

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
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem"}],"States":[function(require,module,exports){
"use strict";
cc._RF.push(module, '825dffoY2JNS6LKKSchXyiY', 'States');
// script/State/States.js

"use strict";

var BoxState = cc.Enum({

    ENone: -1, //什么都不是

    ENormal: -1, //正常
    EFalling: -1, //掉落
    ESelect: -1, //选中
    EDestroy: -1, //销毁

    ESkillAround: -1, //销毁 周边的九个
    ESkillRank: -1, //销毁 该列
    ESkillRaw: -1, //销毁 该行
    ESkillColor: -1 });

module.exports = {

    BoxState: BoxState

};

cc._RF.pop();
},{}]},{},["BombMng","Bomb_box","BoxDrop","BoxItem","BoxPanel","Eliminate","States"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm9tYi9Cb21iTW5nLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb21iL0JvbWJfYm94LmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hEcm9wLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hJdGVtLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hQYW5lbC5qcyIsImFzc2V0cy9zY3JpcHQvRWxpbWluYXRlLmpzIiwiYXNzZXRzL3NjcmlwdC9TdGF0ZS9TdGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFGQzs7QUFLTDtBQUNJO0FBQ0E7QUFGTztBQWpCSDs7QUF1Qlo7QUFDQTs7QUFFSTtBQUNIOztBQUVEOztBQUVJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7QUFDSDs7QUFoREk7Ozs7Ozs7Ozs7QUNIVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBOztBQUlBOztBQUlBOztBQXpCSzs7Ozs7Ozs7OztBQ0NUOztBQUVBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBRkk7O0FBT1I7QUFDSTtBQUNBO0FBRks7O0FBTVQ7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVJOztBQUVJOztBQUVBO0FBQ0k7QUFDSTs7QUFFQTs7QUFFSjtBQUNJOztBQUVBOztBQUVKO0FBQ0k7QUFDQTs7QUFFSjtBQUNJOztBQUVBOztBQUVKO0FBQ0k7O0FBRUo7QUFDSTs7QUFFSjtBQUNJOztBQUVKO0FBQ0k7QUE5QlI7QUFpQ0g7QUFDSjs7QUFFRDs7QUFoREk7O0FBdEJBOztBQTZFWjtBQUNJO0FBREk7O0FBSVI7O0FBRUk7O0FBRUE7QUFDQTtBQUVIOzs7QUFFRDtBQUNBOztBQUVJOzs7QUFHSDs7QUFFRDtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEOztBQUVJOztBQUVBO0FBQ0E7QUFDSDs7QUFRRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTs7QUFFQTtBQUNIOztBQUdEOztBQUVJO0FBQ0E7O0FBR0E7QUFFSDs7QUFHRDtBQUNBOztBQUVJO0FBRUk7QUFDSDs7QUFFRDs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDs7QUFFSTs7OztBQUlBOztBQUVBO0FBQ0E7QUFDSDs7QUFHRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIO0FBQ0o7QUF4TEk7O0FBNExUO0FBQ0U7QUFEZTs7Ozs7Ozs7OztBQzlMakI7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFOb0I7O0FBY3hCO0FBQ0k7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0k7QUFDSTtBQUFxQjtBQUNyQjtBQUFzQjtBQUN0QjtBQUFxQjtBQUNyQjtBQUFvQjtBQUNwQjtBQUFxQjtBQUNyQjtBQUFRO0FBTlo7QUFRSDtBQVZNOztBQWFYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBSEY7QUE3Qks7O0FBb0NaO0FBQ0E7O0FBeENLOztBQW1EVDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNyRUE7QUFDSTtBQUNBO0FBQ0E7QUFIcUI7O0FBTXpCO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUZLOztBQUtUO0FBQ0k7QUFDQTtBQUZJOztBQUtSO0FBQ0k7QUFDQTtBQUZPOztBQUtYO0FBQ0k7QUFDQTtBQUNBO0FBSE07O0FBdEJGOztBQThCWjtBQUNBOztBQUVJOztBQUVJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFLQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDSTtBQUNIOztBQUVEOztBQUVBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUdIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNIOztBQUtEOztBQUVBO0FBQ0E7O0FBRUk7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7QUFFQTtBQUNIOztBQUVEOzs7QUFHQTs7QUFHSTs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTs7QUFFQTtBQUNBOztBQUVBOztBQUVJOzs7O0FBSUE7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFBZ0U7OztBQUU1RDtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdIO0FBQ0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBR0Q7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0c7QUFDSDs7QUFFRDtBQUNJO0FBQ0k7QUFDQTs7QUFFQTs7QUFFSTtBQUVIO0FBRUo7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUdKOztBQUVEOztBQUVJO0FBRUg7QUFFSjtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVJO0FBQ0g7O0FBRUQ7QUFFSDs7QUFFRDtBQUNIOztBQUVEOztBQUVBO0FBQ0g7O0FBUUQ7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRDs7QUFFSTs7QUFFQTs7QUFFQTtBQUNIOztBQXJlSTs7Ozs7Ozs7OztBQ1ZUO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFDQTtBQUhROztBQU1aO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJOztBQUVJO0FBQ0E7QUFFSDtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUk7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7O0FBRUE7O0FBRUE7QUFDSDtBQUVKO0FBQ0c7QUFDQTs7QUFFQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBNUNROztBQVRKOztBQTBEWjtBQUNBOztBQU9BO0FBQ0E7O0FBRUk7O0FBRUM7O0FBRUE7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQztBQUNKOztBQXRGSTs7Ozs7Ozs7OztBQ0ZUOztBQUVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQVFKOztBQUVJOztBQUZhIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgQm9tYl9ib3ggPSByZXF1aXJlKFwiQm9tYl9ib3hcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgYm9tYjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJlbnROb2RlOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLnBvb2wgPSBuZXcgY2MuTm9kZVBvb2woQm9tYl9ib3gpO1xuICAgIH0sXG5cbiAgICBnZXRCb21iUGFydGljbGVGcm9tUG9vbDpmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgbGV0IGJvbWIgPSBudWxsO1xuICAgICAgICBpZih0aGlzLnBvb2wuc2l6ZSgpID4gMCl7XG4gICAgICAgICAgICBib21iID0gdGhpcy5wb29sLmdldCgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBib21iID0gY2MuaW5zdGFudGlhdGUodGhpcy5ib21iKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9tYjtcbiAgICB9LFxuXG4gICAgc2hvd0JvbWJQYXJ0aWNsZUF0UG9pbnQ6ZnVuY3Rpb24gKHBvaW50KSB7XG5cbiAgICAgICAgbGV0IGJvbWIgPSB0aGlzLmdldEJvbWJQYXJ0aWNsZUZyb21Qb29sKCk7XG5cbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLmFkZENoaWxkKGJvbWIpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG5cbiAgICByZXVzZTpmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuXG4gICAgdW51c2U6ZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcblxuXG5cblxuXG4iLCJcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbnZhciBCb3hTdGF0ZSA9IHJlcXVpcmUoXCJTdGF0ZXNcIikuQm94U3RhdGU7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNwZWVkOjAsXHJcblxyXG4gICAgICAgIGFjY19zcGVlZDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6OS44LFxyXG4gICAgICAgICAgICB0b29sdG9wOlwi5Yqg6YCf5bqmXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBib3hJdGVtOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOkJveEl0ZW0sXHJcbiAgICAgICAgICAgIC8vdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgX3N0YXRlX2I6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkJveFN0YXRlLkVOb25lLFxyXG4gICAgICAgICAgICB0eXBlOkJveFN0YXRlLFxyXG4gICAgICAgICAgICAvLyB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhdGVfYjp7XHJcblxyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlX2I7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBzZXQ6ZnVuY3Rpb24gKHZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fc3RhdGVfYiAhPT0gdmFsdWUpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZV9iID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FTm9ybWFsOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRUZhbGxpbmc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEJveFN0YXRlLkVEZXN0cm95OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RfaXRlbS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FU2tpbGxBcm91bmQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRVNraWxsQ29sb3I6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQm94U3RhdGUuRVNraWxsUmFuazpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBCb3hTdGF0ZS5FU2tpbGxSYXc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgdHlwZTpCb3hTdGF0ZSxcclxuXHJcbiAgICAgICAgICAgIC8vIHRvb2x0b3A6XCLmlrnlnZfnmoTnirbmgIFcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBzdGF0aWNzOntcclxuICAgICAgICBCb3hTdGF0ZTpCb3hTdGF0ZVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0KCl7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJzZWxcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3BlZWQgPSB0aGlzLnNwZWVkO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5jbGlja19hZGQoKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRCb3hJdGVtOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuYm94SXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbSA9IG5ldyBCb3hJdGVtKCk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tfYWN0aW9uOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLngrnlh7vkuoYgICBcIitcInJhbms9XCIrdGhpcy5ib3hJdGVtLnJhbmsrXCJyb3c9XCIrdGhpcy5ib3hJdGVtLnJvdyk7XHJcblxyXG4gICAgICAgIGxldCBlbGltaW5hdGUgPSBjYy5maW5kKFwiR2FtZS9FbGltaW5hdGVcIikuZ2V0Q29tcG9uZW50KFwiRWxpbWluYXRlXCIpO1xyXG4gICAgICAgIGVsaW1pbmF0ZS5jbGlja19pdGVtKHRoaXMpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICB1bnVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwieGlhb2h1aVwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmV1c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNob25neW9uZ1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZV9iID0gQm94U3RhdGUuRU5vcm1hbDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHJlc2V0T3JpZ2luUG9zOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3g7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5jb2xvciA9IHRoaXMuYm94SXRlbS5jb2xvcl9zaG93O1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgICAgICBpZih0aGlzLm5vZGUueSA9PT0gdGhpcy5ib3hJdGVtLmVuZF95ICYmXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID09PSB0aGlzLmJveEl0ZW0uYmVnaW5feCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBib3hfYm90dG9tID0gdGhpcy5ub2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0ICogMC41O1xyXG5cclxuICAgICAgICBpZiAoYm94X2JvdHRvbSA+IHRoaXMuYm94SXRlbS5lbmRfeSkge1xyXG4gICAgICAgICAgICAvL+WKoOmAn+W6puaOieiQvVxyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkX24gPSB0aGlzLmN1cnJlbnRTcGVlZCArIHRoaXMuYWNjX3NwZWVkKmR0O1xyXG4gICAgICAgICAgICBsZXQgcyA9IChzcGVlZF9uICsgdGhpcy5jdXJyZW50U3BlZWQgKSowLjUgKiBkdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVkID0gc3BlZWRfbjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlLnkgPCB0aGlzLmJveEl0ZW0uZW5kX3kpIHtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDmjonokL3liLDmjIflrprkvY3nva7nmoTml7blgJnlvLnliqjkuIDkuItcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5lbmRfeTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbmltYXRpb24gPSB0aGlzLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xyXG4gICAgICAgICAgICBhbmltYXRpb24ucGxheShcImFuaV9ib3hcIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS54ID4gdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggLT0gdGhpcy5zcGVlZCAqIGR0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS54IDwgdGhpcy5ib3hJdGVtLmJlZ2luX3gpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59KTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBCb3hTdGF0ZVxyXG59OyIsIlxyXG5cclxuXHJcbnZhciBDb2xvcl9Cb3ggPSBjYy5FbnVtKHtcclxuXHJcbiAgICBZRUxMT1cgOiAtMSxcclxuICAgIEdyZWVuIDogLTEsXHJcbiAgICBCbHVlIDogLTEsXHJcbiAgICBCbGFjayA6IC0xLFxyXG4gICAgV2hpdGUgOiAtMSxcclxuXHJcblxyXG4gICAgLy8gQ291bnQ6LTEsXHJcbn0pO1xyXG5cclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnhcclxuICAgICAgICBiZWdpbl94OjAsXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva55XHJcbiAgICAgICAgYmVnaW5feSA6IDAsXHJcbiAgICAgICAgLy/opoHmirXovr7nmoTkvY3nva5ZXHJcbiAgICAgICAgZW5kX3kgOiAtMTAwMCxcclxuICAgICAgICAvL+aYvuekuueahOminOiJslxyXG4gICAgICAgIGNvbG9yX3R5cGUgOiBDb2xvcl9Cb3guV2hpdGUsXHJcblxyXG4gICAgICAgIGNvbG9yX3Nob3c6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCh0aGlzLmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LldoaXRlOnJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5ZRUxMT1c6cmV0dXJuIGNjLkNvbG9yLllFTExPVztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5HcmVlbjpyZXR1cm4gY2MuQ29sb3IuR1JFRU47XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guQmx1ZTpyZXR1cm4gY2MuQ29sb3IuQkxVRTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5CbGFjazpyZXR1cm4gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpyZXR1cm4gY2MuQ29sb3IuUkVEO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/ooYxcclxuICAgICAgICByYW5rIDogMCxcclxuICAgICAgICAvL+WIl1xyXG4gICAgICAgIHJvdyA6IDAsXHJcblxyXG4gICAgICAgIGlkOntcclxuICAgICAgICAgICAgZ2V0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yYW5rLnRvU3RyaW5nKCkgKyB0aGlzLnJvdy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcblxyXG5cclxuLy8gbW9kdWxlLmV4cG9ydHMgPSB7XHJcbi8vICAgICBDb2xvcl9Cb3ggOiBDb2xvcl9Cb3hcclxuLy8gfTsiLCJcclxudmFyIEdhbWVfU3RhdGUgPSBjYy5FbnVtKHtcclxuICAgIFN0YXJ0IDogLTEsXHJcbiAgICBQbGF5IDogLTEsXHJcbiAgICBPdmVyIDogLTEsXHJcbn0pO1xyXG5cclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxudmFyIEJveFN0YXRlID0gcmVxdWlyZShcIlN0YXRlc1wiKS5Cb3hTdGF0ZTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgICAgIGJveF9wcmVmYWI6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG51bV9yYW5rOntcclxuICAgICAgICAgICAgZGVmYXVsdDoxMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuWIl+aVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jvdzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MTAsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6XCLooYzmlbBcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN1cGVyX25vZGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnYW1lc3RhdGU6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OkdhbWVfU3RhdGUuU3RhcnQsXHJcbiAgICAgICAgICAgIHR5cGU6R2FtZV9TdGF0ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucmVtb3ZlQnlWYWx1ZSA9IGZ1bmN0aW9uKGFycix2YWwpe1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGk8YXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKGFycltpXSA9PT0gdmFsKXtcclxuICAgICAgICAgICAgICAgICAgICBhcnIuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBcnJheS5wcm90b3R5cGUuZmlsdGVyUmVwZWF0ID0gZnVuY3Rpb24oKXsgIFxyXG4gICAgICAgIC8vICAgICAvL+ebtOaOpeWumuS5iee7k+aenOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICAvLyAgICAgaWYoYXJyLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIC8vICAgICAgICAgYXJyLnB1c2godGhpc1swXSk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuXHJcbiAgICAgICAgLy8gICAgIGZvcih2YXIgaSA9IDE7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKXsgICAgLy/ku47mlbDnu4TnrKzkuozpobnlvIDlp4vlvqrnjq/pgY3ljobmraTmlbDnu4QgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/lr7nlhYPntKDov5vooYzliKTmlq3vvJogIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/lpoLmnpzmlbDnu4TlvZPliY3lhYPntKDlnKjmraTmlbDnu4TkuK3nrKzkuIDmrKHlh7rnjrDnmoTkvY3nva7kuI3mmK9pICBcclxuICAgICAgICAvLyAgICAgICAgIC8v6YKj5LmI5oiR5Lus5Y+v5Lul5Yik5pat56ysaemhueWFg+e0oOaYr+mHjeWkjeeahO+8jOWQpuWImeebtOaOpeWtmOWFpee7k+aenOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgICAgICBpZih0aGlzLmluZGV4T2YodGhpc1tpXSkgPT0gaSl7ICBcclxuICAgICAgICAvLyAgICAgICAgICAgICBhcnIucHVzaCh0aGlzW2ldKTsgIFxyXG4gICAgICAgIC8vICAgICAgICAgfSAgXHJcbiAgICAgICAgLy8gICAgIH0gIFxyXG4gICAgICAgIC8vICAgICByZXR1cm4gYXJyOyAgXHJcbiAgICAgICAgLy8gfSAgXHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtV2lkdGggPSAxMDA7XHJcbiAgICAgICAgdGhpcy5pdGVtSGVpZ2h0ID0gMTAwO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1TcGFjZSA9IDU7XHJcblxyXG4gICAgICAgIC8vIHRoaXMubWFyZ2luX3RvcCA9IChjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX3RvcCA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41ICsgdGhpcy5pdGVtSGVpZ2h0KnRoaXMubnVtX3JvdyArIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JvdyAtIDEpICsgdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9ib3R0b20gPSAtKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSAtIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5fbGVmdCA9ICAtdGhpcy5pdGVtV2lkdGgqdGhpcy5udW1fcmFuayowLjUgKyB0aGlzLml0ZW1TcGFjZSoodGhpcy5udW1fcmFuayowLjUtMSk7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5fcmlnaHQgPSB0aGlzLml0ZW1XaWR0aCAqIHRoaXMubnVtX3JhbmsgKiAwLjUgLSB0aGlzLml0ZW1TcGFjZSAqICh0aGlzLm51bV9yYW5rICogMC41IC0gMSk7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJhc2RzICBcIiArIHRoaXMubWFyZ2luX3RvcCtcIiAgXCIrdGhpcy5tYXJnaW5fYm90dG9tKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hQb29sID0gbmV3IGNjLk5vZGVQb29sKFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXBsYXlHYW1lKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v6YeN5paw5byA5aeL5ri45oiPXHJcbiAgICByZXBsYXlHYW1lOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5TdGFydDtcclxuXHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5zdXBlcl9ub2RlLmNoaWxkcmVuO1xyXG5cclxuICAgICAgICB3aGlsZShjaGlsZHJlbi5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm94RHJvcF9kZXN0cm95KGNoaWxkcmVuW2ldLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+a4heepunJhbmtsaXN0XHJcbiAgICAgICAgdmFyIGl0ZW07XHJcbiAgICAgICAgd2hpbGUgKGl0ZW0gPSB0aGlzLnJhbmtMaXN0LnNoaWZ0KCkpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIua4heepuuaIkOWKn1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhZVBhbmxlQ29udGVudCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+WIm+W7uuaJgOaciemdouadv+eahOaVsOaNrlxyXG4gICAgY3JlYWVQYW5sZUNvbnRlbnQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGluZGV4PHRoaXMubnVtX3Jhbms7IGluZGV4Kyspe1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJhbmtDb250ZW50KGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQmVnaW5PcmlnaW5ZKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+WIm+W7uuavj+S4gOWIl+eahOaVsOaNrlxyXG4gICAgY3JlYXRlUmFua0NvbnRlbnQ6ZnVuY3Rpb24oaW5kZXgpe1xyXG5cclxuICAgICAgICBsZXQgcmFua19saXN0ID0gW107XHJcblxyXG4gICAgICAgIGxldCBvcmlnaW5feCA9IHRoaXMubWFyZ2luX2xlZnQgKyAodGhpcy5pdGVtV2lkdGgrdGhpcy5pdGVtU3BhY2UpKmluZGV4O1xyXG4gICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1fcm93OyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMuYm94RHJvcF9nZXQoKTtcclxuICAgICAgICAgICAgYm94LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBib3gud2lkdGggPSB0aGlzLml0ZW1XaWR0aDtcclxuICAgICAgICAgICAgYm94LmhlaWdodCA9IHRoaXMuaXRlbUhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICBib3hfYy5pbml0Qm94SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSArICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgcmFua19saXN0LnB1c2goYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QucHVzaChyYW5rX2xpc3QpO1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v5pu05paw5p+Q5LiA5YiXIGVuZCB555qE5pWw5o2uXHJcbiAgICB1cGRhdGVBbGxSYW5rRW5kWTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAvL+eci+ivpeWIl+eahOaVsOmHj+aYr+WQpiDlsI/kuo4gdGhpcy5udW1fcm93ICDlsJHkuo7nmoTor53liJnooaXlhYVcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgb3JpZ2luX3ggPSB0aGlzLm1hcmdpbl9sZWZ0ICsgKHRoaXMuaXRlbVdpZHRoK3RoaXMuaXRlbVNwYWNlKSppO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxpc3Rfc3ViID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlKGxpc3Rfc3ViLmxlbmd0aCA8IHRoaXMubnVtX3Jvdyl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG5ld19ib3ggPSB0aGlzLmJveERyb3BfZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICBuZXdfYm94LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gbmV3X2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feCA9IG9yaWdpbl94O1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yYW5rID0gaTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gMDtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9IChjYy5yYW5kb20wVG8xKCkqNSkgfCAwO1xyXG4gICAgICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdfYm94LnBhcmVudCA9IHRoaXMuc3VwZXJfbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0X3N1Yi5wdXNoKG5ld19ib3gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAvLyBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgLy/mm7TmlrDmr4/kuKrlhYPntKDnmoRlbmQgeSDkvY3nva5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8bGlzdF9zdWIubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGxpc3Rfc3ViW2ldO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveF9jID0gaXRlbV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IGk7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmVuZF95ID0gdGhpcy5tYXJnaW5fYm90dG9tICsgKHRoaXMuaXRlbUhlaWdodCt0aGlzLml0ZW1TcGFjZSkqKGkrMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQmVnaW5PcmlnaW5ZKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pu05paw5q+P5LiA5YiX5LuW5Lus5Lit55qE5q+P5Liq5YWD57Sg55qE5Yid5aeL55qEb3JpZ2luIHnnmoTlgLxcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQmVnaW5PcmlnaW5ZOmZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOafkOS4gOWIl+S4rSDku47mnIDlkI7lvIDlp4vpgY3ljobov5Tlm55cclxuICAgICAgICAgKiDnrpflh7rlvIDlp4vmjonkuobnmoTkvY3nva5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0aGlzLm51bV9yYW5rOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucmFua0xpc3RbaV07XHJcblxyXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpiDlt7Lovr7liLDku5bnmoRlbmR5IOWmguaenOi/mOacqui+vuWIsOWwseaYryDmraPopoHmjonokL1cclxuICAgICAgICAgICAgbGV0IG9mZl90b3AgPSAwO1xyXG4gICAgICAgICAgICBsZXQgc3BhY2VfdG9wID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvcihsZXQgaiA9IHRoaXMubnVtX3Jvdy0xOyBqPj0wOyBqLS0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqPHRoaXMubnVtX3JvdzsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBsaXN0W2pdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9ib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYm94X2Mubm9kZS55ICE9PSBib3hfYy5ib3hJdGVtLmVuZF95KXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogMS7lrp7kvovmuLjmiI/nmoTml7blgJkg5Yid5aeL5byA5aeL55qE5L2N572uXHJcbiAgICAgICAgICAgICAgICAgICAgICogMi7mtojpmaTnmoQg5pa55Z2X5LiN5Zyo55WM6Z2i5Lit55qE6K6+572u5LuW55qE5byA5aeL5L2N572uIOW3suWcqOeVjOmdouS4reeahOS4jeWOu+iuvue9ruS7llxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCh0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCkgfHwgKGJveF9jLm5vZGUueSA+PSBib3hfYy5ib3hJdGVtLmJlZ2luX3kpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcCArIG9mZl90b3AgKyBzcGFjZV90b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hfYy5ub2RlLnkgPSBib3hfYy5ib3hJdGVtLmJlZ2luX3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZfdG9wICs9IGJveF9jLm5vZGUuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2VfdG9wICs9IHNwYWNlX3RvcCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIC8v5Lqk5o2i5Lik5Liq5pa55Z2X55qE5L2N572uXHJcbiAgICBleGNoYW5nZUJveEl0ZW06ZnVuY3Rpb24oYm94SXRlbTEsYm94SXRlbTIsdG9DaGVja1ZpYWJsZSA9IHRydWUpe1xyXG5cclxuICAgICAgICBpZihib3hJdGVtMS5yYW5rID09PSBib3hJdGVtMi5yYW5rKXtcclxuICAgICAgICAgICAgLy/lkIzkuIDliJfnmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveEl0ZW0xLnJhbmtdO1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkvY3nva5cclxuICAgICAgICAgICAgbGV0IHRlbXBfZW5keSA9IGJveEl0ZW0yLmVuZF95O1xyXG4gICAgICAgICAgICBib3hJdGVtMi5lbmRfeSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5lbmRfeSA9IHRlbXBfZW5keTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JvdyA9IGJveEl0ZW0yLnJvdztcclxuXHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJvdyA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgYm94SXRlbTEucm93ID0gdGVtcF9yb3c7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdFtib3hJdGVtMS5yb3ddO1xyXG4gICAgICAgICAgICBsaXN0W2JveEl0ZW0xLnJvd10gPSBsaXN0W2JveEl0ZW0yLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTIucm93XSA9IHRlbXBfbm9kZTtcclxuXHJcblxyXG4gICAgICAgIH1lbHNlIGlmKGJveEl0ZW0xLnJvdyA9PT0gYm94SXRlbTIucm93KXtcclxuICAgICAgICAgICAgLy/lkIzkuIDooYznmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QxID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QyID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMi5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2JlZ2lueCA9IGJveEl0ZW0yLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmJlZ2luX3ggPSBib3hJdGVtMS5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5iZWdpbl94ID0gdGVtcF9iZWdpbng7XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS/oeaBr1xyXG4gICAgICAgICAgICBsZXQgdGVtcF9yYW5rID0gYm94SXRlbTIucmFuaztcclxuICAgICAgICAgICAgYm94SXRlbTIucmFuayA9IGJveEl0ZW0xLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLnJhbmsgPSB0ZW1wX3Jhbms7XHJcblxyXG4gICAgICAgICAgICBsZXQgcm93X2luZGV4ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdDFbcm93X2luZGV4XTtcclxuICAgICAgICAgICAgbGlzdDFbcm93X2luZGV4XSA9IGxpc3QyW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QyW3Jvd19pbmRleF0gPSB0ZW1wX25vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZih0b0NoZWNrVmlhYmxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBpc1ZpYWJsZSA9IHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWlzVmlhYmxlKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+S4jeWPr+a2iOmZpOeahOivnSDkvY3nva7lho3kupLmjaLlm57mnaVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5LiN5Y+v5raI6ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhjaGFuZ2VCb3hJdGVtKGJveEl0ZW0yLGJveEl0ZW0xLGZhbHNlKTsgXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDMwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5qOA5rWL6Z2i5p2/5omA5pyJ5pa55Z2XIOaYr+WQpuWPr+a2iOmZpFxyXG4gICAgY2hlY2tQYW5lbEVsaW1pbmF0YWJsZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBsZXQgd2lwZV9saXN0ID0gW107XHJcblxyXG4gICAgICAgIC8v5Yik5pat5YiXIOaYr+WQpuacieS4ieS4quS7peWPiuS4ieS4quS7peS4iueahOS4gOagt+eahOiJsuWdl+i/nuWcqOS4gOi1t1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yb3c7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGogPT09ICh0aGlzLm51bV9yb3ctMSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvQWRkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcExpc3QubGVuZ3RoID49IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov73liqDliLB3aXBl6YeM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh3aXBlX2xpc3QsdGVtcExpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5zdGF0ZV9iID0gQm94U3RhdGUuRURlc3Ryb3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNSZXBlYXRJdGVtSW5XaXBlKGl0ZW0pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHdpcGVfbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZih3aXBlX2xpc3RbaV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtLmlkID09PSBpdGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/liKTmlq3ooYwg5piv5ZCm5pyJ5LiJ5Liq5Lul5Y+K5LiJ5Liq5Lul5LiK55qE5LiA5qC355qE6Imy5Z2X6L+e5Zyo5LiA6LW3XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dGhpcy5udW1fcm93OyBpKyspe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yYW5rOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMucmFua0xpc3Rbal1baV07XHJcbiAgICAgICAgICAgICAgICBpZighcHJlX2JveCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9wcmUgPSBwcmVfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbV9ib3ggPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdG9BZGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtX3ByZS5jb2xvcl90eXBlID09PSBpdGVtX2JveC5jb2xvcl90eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihqID09PSAodGhpcy5udW1fcmFuay0xKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0FkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodG9BZGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0ZW1wTGlzdC5sZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/veWKoOWIsHdpcGXph4zpnaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc1JlcGVhdEl0ZW1JbldpcGUoZWxlbSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXBlX2xpc3QucHVzaChlbGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5zdGF0ZV9iID0gQm94U3RhdGUuRURlc3Ryb3k7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYod2lwZV9saXN0Lmxlbmd0aCA+IDApe1xyXG5cclxuICAgICAgICAgICAgbGV0IHNob3dEZWxheUFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWVzdGF0ZSA9PT0gR2FtZV9TdGF0ZS5TdGFydCl7XHJcbiAgICAgICAgICAgICAgICAvL+S4jeaYvuekuua2iOmZpOWKqOeUu1xyXG4gICAgICAgICAgICAgICAgc2hvd0RlbGF5QW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/kuI3mmK/liJ3lp4vljJbnmoQg5YGc55WZ5LiA5Lya5YS/5YaN5raI6ZmkXHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgICAgICAgICB3aXBlX2xpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3hEcm9wX2Rlc3Ryb3koZWxlbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpKTtcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBbGxSYW5rRW5kWSgpO1xyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLHNob3dEZWxheUFuaW1hdGlvbj8wOjEsZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhbWVzdGF0ZSA9IEdhbWVfU3RhdGUuUGxheTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICBib3hEcm9wX2dldDpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBsZXQgYm94ID0gbnVsbDtcclxuICAgICAgICBpZih0aGlzLmJveFBvb2wuc2l6ZSgpID4gMCl7XHJcbiAgICAgICAgICAgIGJveCA9IHRoaXMuYm94UG9vbC5nZXQoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgYm94ID0gY2MuaW5zdGFudGlhdGUodGhpcy5ib3hfcHJlZmFiKTtcclxuICAgICAgICAgICAgYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJveDtcclxuICAgIH0sXHJcblxyXG4gICAgYm94RHJvcF9kZXN0cm95OmZ1bmN0aW9uKGJveCl7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3guYm94SXRlbS5yYW5rXTtcclxuICAgICAgICBcclxuICAgICAgICBsaXN0LnJlbW92ZUJ5VmFsdWUobGlzdCxib3gubm9kZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuXHJcblxyXG4iLCJcclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX3NlbGVjdF9ib3g6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+mAieS4reafkOS4quaWueWdl1xyXG4gICAgICAgIHNlbGVjdF9ib3g6IHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0X2JveDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RfYm94KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnN0YXRlX2IgPSBCb3hTdGF0ZS5FU2VsZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hJdGVtX25ldyA9IHZhbHVlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9vbGQgPSB0aGlzLl9zZWxlY3RfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYm94SXRlbV9uZXcuaWQgIT09IGJveEl0ZW1fb2xkLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi55yL5piv5ZCm6KaB5Lqk5LqS5L2N572uIOi/mOaYr+ivtOWIh+aNouWIsOi/meS4qumAieS4reeahOS9jee9ruWkhOeQhlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZDEgPSBcIiArIGJveEl0ZW1fbmV3LmlkICsgXCIgIGlkMj0gXCIgKyBib3hJdGVtX29sZC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5pen55qE5Y+W5raI6YCJ5oupXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3guc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0oYm94SXRlbV9uZXcsIGJveEl0ZW1fb2xkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5LiN5piv55u46L+R55qEIOWPlua2iOS4iuS4gOS4qumAieaLqSDpgInkuK3mlrDngrnlh7vnmoRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3RhdGVfYiA9IEJveFN0YXRlLkVTZWxlY3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0X2JveCA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi6YCJ5Lit5LqG5ZCM5LiA5LiqIOWPlua2iOmAieaLqVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3RhdGVfYiA9IEJveFN0YXRlLkVOb3JtYWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHZpc2libGU6ZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgbGV0IGJveEl0ZW0gPSBjbGlja19ub2RlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgLy8gIC8v5raI6Zmk5o6JXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLmJveERyb3BfZGVzdHJveShjbGlja19ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gIC8v5LiK6Z2i55qE5o6J5LiL5p2lXHJcbiAgICAgICAgLy8gIGJveFBhbmVsLnVwZGF0ZVJhbmtFbmRZKGJveEl0ZW0ucmFuayk7XHJcblxyXG5cclxuICAgICAgICAgdGhpcy5zZWxlY3RfYm94ID0gY2xpY2tfbm9kZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsIlxuXG5jb25zdCBCb3hTdGF0ZSA9IGNjLkVudW0oe1xuXG4gICAgRU5vbmUgOiAtMSwgICAgICAvL+S7gOS5iOmDveS4jeaYr1xuXG4gICAgRU5vcm1hbCA6IC0xLCAgICAvL+ato+W4uFxuICAgIEVGYWxsaW5nIDogLTEsICAgLy/mjonokL1cbiAgICBFU2VsZWN0IDogLTEsICAgIC8v6YCJ5LitXG4gICAgRURlc3Ryb3kgOiAtMSwgICAvL+mUgOavgVxuXG4gICAgRVNraWxsQXJvdW5kIDogLTEsICAgICAgIC8v6ZSA5q+BIOWRqOi+ueeahOS5neS4qlxuICAgIEVTa2lsbFJhbmsgOiAtMSwgICAgICAgICAvL+mUgOavgSDor6XliJdcbiAgICBFU2tpbGxSYXcgOiAtMSwgICAgICAgICAgLy/plIDmr4Eg6K+l6KGMXG4gICAgRVNraWxsQ29sb3IgOiAtMSwgICAgICAgIC8v6ZSA5q+BIOivpeiJslxuXG59KTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIEJveFN0YXRlXG5cbn07Il0sInNvdXJjZVJvb3QiOiIifQ==