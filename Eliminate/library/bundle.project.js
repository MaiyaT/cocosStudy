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

cc.Class({
    extends: cc.Component,

    properties: {

        speed: 0,

        select_item: {
            default: null,
            type: cc.Node
        },

        boxItem: {
            default: null,
            type: BoxItem
        }
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

    boxIsSelectState: function boxIsSelectState(isSelect) {

        this.select_item.active = isSelect;
    },

    unuse: function unuse() {
        console.log("xiaohui");
    },

    reuse: function reuse() {
        console.log("chongyong");

        this.select_item.active = false;
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
            this.node.y -= this.speed * dt;
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

cc._RF.pop();
},{"BoxItem":"BoxItem"}],"BoxItem":[function(require,module,exports){
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

                        off_top += box_c.node.height;
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

                                elem.getComponent("BoxDrop").boxIsSelectState(true);
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

                                elem.getComponent("BoxDrop").boxIsSelectState(true);
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
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem"}],"Eliminate":[function(require,module,exports){
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
                    value.boxIsSelectState(true);
                    this._select_box = value;
                } else {
                    var boxItem_new = value.getComponent("BoxDrop").boxItem;
                    var boxItem_old = this._select_box.getComponent("BoxDrop").boxItem;
                    if (boxItem_new.id !== boxItem_old.id) {
                        // console.log("看是否要交互位置 还是说切换到这个选中的位置处理");
                        console.log("id1 = " + boxItem_new.id + "  id2= " + boxItem_old.id);
                        //旧的取消选择
                        this._select_box.boxIsSelectState(false);

                        if (boxItem_new.rank === boxItem_old.rank && Math.abs(boxItem_new.row - boxItem_old.row) === 1 || boxItem_new.row === boxItem_old.row && Math.abs(boxItem_new.rank - boxItem_old.rank) === 1) {
                            // console.log("是相近的 交换位置");

                            var boxPanel = cc.find("Game/Panel").getComponent("BoxPanel");
                            boxPanel.exchangeBoxItem(boxItem_new, boxItem_old);

                            this._select_box = null;
                        } else {
                            // console.log("不是相近的 取消上一个选择 选中新点击的");

                            value.boxIsSelectState(true);

                            this._select_box = value;
                        }
                    } else {
                        // console.log("选中了同一个 取消选择");
                        value.boxIsSelectState(false);

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
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem"}]},{},["BombMng","Bomb_box","BoxDrop","BoxItem","BoxPanel","Eliminate"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQm9tYi9Cb21iTW5nLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb21iL0JvbWJfYm94LmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hEcm9wLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hJdGVtLmpzIiwiYXNzZXRzL3NjcmlwdC9Cb3hQYW5lbC5qcyIsImFzc2V0cy9zY3JpcHQvRWxpbWluYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBRkM7O0FBS0w7QUFDSTtBQUNBO0FBRk87QUFqQkg7O0FBdUJaO0FBQ0E7O0FBRUk7QUFDSDs7QUFFRDs7QUFFSTtBQUNBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDRDtBQUNIOztBQUVEOztBQUVJOztBQUVBO0FBQ0g7O0FBaERJOzs7Ozs7Ozs7O0FDSFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTs7QUFJQTs7QUFJQTs7QUF6Qks7Ozs7Ozs7Ozs7QUNDVDs7QUFFQTtBQUNJOztBQUVBOztBQUVJOztBQUVBO0FBQ0k7QUFDQTtBQUZROztBQUtaO0FBQ0k7QUFDQTtBQUZJO0FBVEE7O0FBZ0JaO0FBQ0E7O0FBRUk7O0FBRUg7O0FBRUQ7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDs7QUFFSTs7QUFFQTtBQUNBO0FBQ0g7O0FBR0Q7O0FBRUk7QUFFSDs7QUFPRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTs7QUFFQTtBQUNIOztBQUdEOztBQUVJO0FBQ0E7O0FBR0E7QUFFSDs7QUFHRDtBQUNBOztBQUVJO0FBRUk7QUFDSDs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUk7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0g7O0FBR0Q7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDtBQUNKO0FBNUdJOzs7Ozs7Ozs7O0FDQVQ7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFOb0I7O0FBY3hCO0FBQ0k7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0k7QUFDSTtBQUFxQjtBQUNyQjtBQUFzQjtBQUN0QjtBQUFxQjtBQUNyQjtBQUFvQjtBQUNwQjtBQUFxQjtBQUNyQjtBQUFRO0FBTlo7QUFRSDtBQVZNOztBQWFYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBSEY7QUE3Qks7O0FBb0NaO0FBQ0E7O0FBeENLOztBQW1EVDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNyRUE7QUFDSTtBQUNBO0FBQ0E7QUFIcUI7O0FBTXpCO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGSzs7QUFLVDtBQUNJO0FBQ0E7QUFGSTs7QUFLUjtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFDQTtBQUhNOztBQXRCRjs7QUE4Qlo7QUFDQTs7QUFFSTs7QUFFSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7O0FBS0E7O0FBRUE7QUFDSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0g7O0FBRUQ7QUFHSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDs7QUFLRDs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7O0FBRUE7QUFDSDs7QUFFRDs7O0FBR0E7O0FBR0k7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7Ozs7QUFJQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNKOztBQUdEO0FBQ0E7QUFBZ0U7OztBQUU1RDtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdIO0FBQ0c7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBR0Q7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNBOztBQUVJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0c7QUFDSDs7QUFFRDtBQUNJO0FBQ0k7QUFDQTs7QUFFQTs7QUFFSTtBQUVIO0FBRUo7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFHRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRztBQUNIOztBQUVEO0FBQ0k7QUFDSTtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUdKOztBQUVEOztBQUVJO0FBRUg7QUFFSjtBQUNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUdEOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTtBQUNBOztBQUVJO0FBQ0g7O0FBRUQ7QUFFSDs7QUFFRDtBQUNIOztBQUVEOztBQUVBO0FBQ0g7O0FBUUQ7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSDs7QUEvZEk7Ozs7Ozs7Ozs7QUNUVDtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBQ0E7QUFIUTs7QUFNWjtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUk7O0FBRUE7QUFDQTs7QUFFQTtBQUNIO0FBRUc7O0FBRUE7O0FBRUE7QUFDSDtBQUVKO0FBQ0c7QUFDQTs7QUFFQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBMUNROztBQVRKOztBQXdEWjtBQUNBOztBQU9BO0FBQ0E7O0FBRUk7O0FBRUM7O0FBRUE7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQztBQUNKOztBQXBGSSIsInNvdXJjZXNDb250ZW50IjpbIlxudmFyIEJvbWJfYm94ID0gcmVxdWlyZShcIkJvbWJfYm94XCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGJvbWI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyZW50Tm9kZTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5wb29sID0gbmV3IGNjLk5vZGVQb29sKEJvbWJfYm94KTtcbiAgICB9LFxuXG4gICAgZ2V0Qm9tYlBhcnRpY2xlRnJvbVBvb2w6ZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGxldCBib21iID0gbnVsbDtcbiAgICAgICAgaWYodGhpcy5wb29sLnNpemUoKSA+IDApe1xuICAgICAgICAgICAgYm9tYiA9IHRoaXMucG9vbC5nZXQoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgYm9tYiA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm9tYik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvbWI7XG4gICAgfSxcblxuICAgIHNob3dCb21iUGFydGljbGVBdFBvaW50OmZ1bmN0aW9uIChwb2ludCkge1xuXG4gICAgICAgIGxldCBib21iID0gdGhpcy5nZXRCb21iUGFydGljbGVGcm9tUG9vbCgpO1xuXG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5hZGRDaGlsZChib21iKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuXG4gICAgcmV1c2U6ZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcblxuICAgIHVudXNlOmZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cblxuXG5cblxuIiwiXHJcbnZhciBCb3hJdGVtID0gcmVxdWlyZShcIkJveEl0ZW1cIik7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNwZWVkOjAsXHJcblxyXG4gICAgICAgIHNlbGVjdF9pdGVtOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBib3hJdGVtOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOkJveEl0ZW0sXHJcbiAgICAgICAgICAgIC8vdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuY2xpY2tfYWRkKCk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRCb3hJdGVtOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoIXRoaXMuYm94SXRlbSl7XHJcbiAgICAgICAgICAgIHRoaXMuYm94SXRlbSA9IG5ldyBCb3hJdGVtKCk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY2xpY2tfYWN0aW9uOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coXCLngrnlh7vkuoYgICBcIitcInJhbms9XCIrdGhpcy5ib3hJdGVtLnJhbmsrXCJyb3c9XCIrdGhpcy5ib3hJdGVtLnJvdyk7XHJcblxyXG4gICAgICAgIGxldCBlbGltaW5hdGUgPSBjYy5maW5kKFwiR2FtZS9FbGltaW5hdGVcIikuZ2V0Q29tcG9uZW50KFwiRWxpbWluYXRlXCIpO1xyXG4gICAgICAgIGVsaW1pbmF0ZS5jbGlja19pdGVtKHRoaXMpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgYm94SXNTZWxlY3RTdGF0ZTpmdW5jdGlvbihpc1NlbGVjdCl7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0uYWN0aXZlID0gaXNTZWxlY3Q7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIHVudXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ4aWFvaHVpXCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXVzZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2hvbmd5b25nXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgcmVzZXRPcmlnaW5Qb3M6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmJveEl0ZW0uYmVnaW5feDtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuYm94SXRlbS5iZWdpbl95O1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLmNvbG9yID0gdGhpcy5ib3hJdGVtLmNvbG9yX3Nob3c7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgICAgIGlmKHRoaXMubm9kZS55ID09PSB0aGlzLmJveEl0ZW0uZW5kX3kgJiZcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPT09IHRoaXMuYm94SXRlbS5iZWdpbl94KXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJveF9ib3R0b20gPSB0aGlzLm5vZGUueSArIHRoaXMubm9kZS5oZWlnaHQgKiAwLjU7XHJcblxyXG4gICAgICAgIGlmIChib3hfYm90dG9tID4gdGhpcy5ib3hJdGVtLmVuZF95KSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHRoaXMuc3BlZWQgKiBkdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vZGUueSA8IHRoaXMuYm94SXRlbS5lbmRfeSkge1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIOaOieiQveWIsOaMh+WumuS9jee9rueahOaXtuWAmeW8ueWKqOS4gOS4i1xyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmVuZF95O1xyXG5cclxuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbiA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KFwiYW5pX2JveFwiKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlLnggPiB0aGlzLmJveEl0ZW0uYmVnaW5feCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUueCAtPSB0aGlzLnNwZWVkICogZHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ub2RlLnggPCB0aGlzLmJveEl0ZW0uYmVnaW5feCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuIiwiXHJcblxyXG5cclxudmFyIENvbG9yX0JveCA9IGNjLkVudW0oe1xyXG5cclxuICAgIFlFTExPVyA6IC0xLFxyXG4gICAgR3JlZW4gOiAtMSxcclxuICAgIEJsdWUgOiAtMSxcclxuICAgIEJsYWNrIDogLTEsXHJcbiAgICBXaGl0ZSA6IC0xLFxyXG5cclxuXHJcbiAgICAvLyBDb3VudDotMSxcclxufSk7XHJcblxyXG5cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgICAgIC8v5byA5aeL5o6J6JC955qE5L2N572ueFxyXG4gICAgICAgIGJlZ2luX3g6MCxcclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnlcclxuICAgICAgICBiZWdpbl95IDogMCxcclxuICAgICAgICAvL+imgeaKtei+vueahOS9jee9rllcclxuICAgICAgICBlbmRfeSA6IC0xMDAwLFxyXG4gICAgICAgIC8v5pi+56S655qE6aKc6ImyXHJcbiAgICAgICAgY29sb3JfdHlwZSA6IENvbG9yX0JveC5XaGl0ZSxcclxuXHJcbiAgICAgICAgY29sb3Jfc2hvdzp7XHJcbiAgICAgICAgICAgIGdldDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKHRoaXMuY29sb3JfdHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guV2hpdGU6cmV0dXJuIGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LllFTExPVzpyZXR1cm4gY2MuQ29sb3IuWUVMTE9XO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LkdyZWVuOnJldHVybiBjYy5Db2xvci5HUkVFTjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5CbHVlOnJldHVybiBjYy5Db2xvci5CTFVFO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LkJsYWNrOnJldHVybiBjYy5Db2xvci5CTEFDSztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OnJldHVybiBjYy5Db2xvci5SRUQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+ihjFxyXG4gICAgICAgIHJhbmsgOiAwLFxyXG4gICAgICAgIC8v5YiXXHJcbiAgICAgICAgcm93IDogMCxcclxuXHJcbiAgICAgICAgaWQ6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJhbmsudG9TdHJpbmcoKSArIHRoaXMucm93LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuXHJcblxyXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcclxuLy8gICAgIENvbG9yX0JveCA6IENvbG9yX0JveFxyXG4vLyB9OyIsIlxyXG52YXIgR2FtZV9TdGF0ZSA9IGNjLkVudW0oe1xyXG4gICAgU3RhcnQgOiAtMSxcclxuICAgIFBsYXkgOiAtMSxcclxuICAgIE92ZXIgOiAtMSxcclxufSk7XHJcblxyXG52YXIgQm94RHJvcCA9IHJlcXVpcmUoXCJCb3hEcm9wXCIpO1xyXG52YXIgQm94SXRlbSA9IHJlcXVpcmUoXCJCb3hJdGVtXCIpO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgICAgICAgYm94X3ByZWZhYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jhbms6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi5YiX5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcm93OntcclxuICAgICAgICAgICAgZGVmYXVsdDoxMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuihjOaVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3VwZXJfbm9kZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdhbWVzdGF0ZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6R2FtZV9TdGF0ZS5TdGFydCxcclxuICAgICAgICAgICAgdHlwZTpHYW1lX1N0YXRlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOmZhbHNlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5yZW1vdmVCeVZhbHVlID0gZnVuY3Rpb24oYXJyLHZhbCl7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaTxhcnIubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYoYXJyW2ldID09PSB2YWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEFycmF5LnByb3RvdHlwZS5maWx0ZXJSZXBlYXQgPSBmdW5jdGlvbigpeyAgXHJcbiAgICAgICAgLy8gICAgIC8v55u05o6l5a6a5LmJ57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIC8vICAgICBpZihhcnIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgLy8gICAgICAgICBhcnIucHVzaCh0aGlzWzBdKTtcclxuICAgICAgICAvLyAgICAgfVxyXG5cclxuICAgICAgICAvLyAgICAgZm9yKHZhciBpID0gMTsgaSA8IHRoaXMubGVuZ3RoOyBpKyspeyAgICAvL+S7juaVsOe7hOesrOS6jOmhueW8gOWni+W+queOr+mBjeWOhuatpOaVsOe7hCAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WvueWFg+e0oOi/m+ihjOWIpOaWre+8miAgXHJcbiAgICAgICAgLy8gICAgICAgICAvL+WmguaenOaVsOe7hOW9k+WJjeWFg+e0oOWcqOatpOaVsOe7hOS4reesrOS4gOasoeWHuueOsOeahOS9jee9ruS4jeaYr2kgIFxyXG4gICAgICAgIC8vICAgICAgICAgLy/pgqPkuYjmiJHku6zlj6/ku6XliKTmlq3nrKxp6aG55YWD57Sg5piv6YeN5aSN55qE77yM5ZCm5YiZ55u05o6l5a2Y5YWl57uT5p6c5pWw57uEICBcclxuICAgICAgICAvLyAgICAgICAgIGlmKHRoaXMuaW5kZXhPZih0aGlzW2ldKSA9PSBpKXsgIFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGFyci5wdXNoKHRoaXNbaV0pOyAgXHJcbiAgICAgICAgLy8gICAgICAgICB9ICBcclxuICAgICAgICAvLyAgICAgfSAgXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBhcnI7ICBcclxuICAgICAgICAvLyB9ICBcclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1XaWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSAxMDA7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVNwYWNlID0gNTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5tYXJnaW5fdG9wID0gKGNjLmRpcmVjdG9yLmdldFdpblNpemUoKS5oZWlnaHQpKjAuNSArIHRoaXMuaXRlbUhlaWdodCowLjU7XHJcbiAgICAgICAgdGhpcy5tYXJnaW5fdG9wID0gLShjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqdGhpcy5udW1fcm93ICsgdGhpcy5pdGVtU3BhY2UgKiAodGhpcy5udW1fcm93IC0gMSkgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2JvdHRvbSA9IC0oY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLmhlaWdodCkqMC41IC0gdGhpcy5pdGVtSGVpZ2h0KjAuNTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9sZWZ0ID0gIC10aGlzLml0ZW1XaWR0aCp0aGlzLm51bV9yYW5rKjAuNSArIHRoaXMuaXRlbVNwYWNlKih0aGlzLm51bV9yYW5rKjAuNS0xKTtcclxuICAgICAgICB0aGlzLm1hcmdpbl9yaWdodCA9IHRoaXMuaXRlbVdpZHRoICogdGhpcy5udW1fcmFuayAqIDAuNSAtIHRoaXMuaXRlbVNwYWNlICogKHRoaXMubnVtX3JhbmsgKiAwLjUgLSAxKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImFzZHMgIFwiICsgdGhpcy5tYXJnaW5fdG9wK1wiICBcIit0aGlzLm1hcmdpbl9ib3R0b20pO1xyXG5cclxuICAgICAgICB0aGlzLmJveFBvb2wgPSBuZXcgY2MuTm9kZVBvb2woXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlcGxheUdhbWUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy/ph43mlrDlvIDlp4vmuLjmiI9cclxuICAgIHJlcGxheUdhbWU6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lc3RhdGUgPSBHYW1lX1N0YXRlLlN0YXJ0O1xyXG5cclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnN1cGVyX25vZGUuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIHdoaWxlKGNoaWxkcmVuLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3hEcm9wX2Rlc3Ryb3koY2hpbGRyZW5baV0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKSk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5riF56m6cmFua2xpc3RcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICB3aGlsZSAoaXRlbSA9IHRoaXMucmFua0xpc3Quc2hpZnQoKSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5riF56m65oiQ5YqfXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWFlUGFubGVDb250ZW50KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5Yib5bu65omA5pyJ6Z2i5p2/55qE5pWw5o2uXHJcbiAgICBjcmVhZVBhbmxlQ29udGVudDpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXg8dGhpcy5udW1fcmFuazsgaW5kZXgrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUmFua0NvbnRlbnQoaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVCZWdpbk9yaWdpblkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja1BhbmVsRWxpbWluYXRhYmxlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5Yib5bu65q+P5LiA5YiX55qE5pWw5o2uXHJcbiAgICBjcmVhdGVSYW5rQ29udGVudDpmdW5jdGlvbihpbmRleCl7XHJcblxyXG4gICAgICAgIGxldCByYW5rX2xpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbl94ID0gdGhpcy5tYXJnaW5fbGVmdCArICh0aGlzLml0ZW1XaWR0aCt0aGlzLml0ZW1TcGFjZSkqaW5kZXg7XHJcbiAgICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLm51bV9yb3c7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ib3hEcm9wX2dldCgpO1xyXG4gICAgICAgICAgICBib3guYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGJveC53aWR0aCA9IHRoaXMuaXRlbVdpZHRoO1xyXG4gICAgICAgICAgICBib3guaGVpZ2h0ID0gdGhpcy5pdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveF9jID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcbiAgICAgICAgICAgIGJveF9jLmluaXRCb3hJdGVtKCk7XHJcblxyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3ggPSBvcmlnaW5feDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmVuZF95ID0gdGhpcy5tYXJnaW5fYm90dG9tICsgKHRoaXMuaXRlbUhlaWdodCt0aGlzLml0ZW1TcGFjZSkqKGkrMSk7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucmFuayA9IGluZGV4O1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJvdyA9IGk7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uY29sb3JfdHlwZSA9IChjYy5yYW5kb20wVG8xKCkqNSkgfCAwO1xyXG5cclxuICAgICAgICAgICAgYm94X2MucmVzZXRPcmlnaW5Qb3MoKTtcclxuXHJcbiAgICAgICAgICAgIGJveC5wYXJlbnQgPSB0aGlzLnN1cGVyX25vZGU7XHJcblxyXG4gICAgICAgICAgICByYW5rX2xpc3QucHVzaChib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdC5wdXNoKHJhbmtfbGlzdCk7XHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy/mm7TmlrDmn5DkuIDliJcgZW5kIHnnmoTmlbDmja5cclxuICAgIHVwZGF0ZUFsbFJhbmtFbmRZOmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIC8v55yL6K+l5YiX55qE5pWw6YeP5piv5ZCmIOWwj+S6jiB0aGlzLm51bV9yb3cgIOWwkeS6jueahOivneWImeihpeWFhVxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy5udW1fcmFuazsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBvcmlnaW5feCA9IHRoaXMubWFyZ2luX2xlZnQgKyAodGhpcy5pdGVtV2lkdGgrdGhpcy5pdGVtU3BhY2UpKmk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlzdF9zdWIgPSB0aGlzLnJhbmtMaXN0W2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUobGlzdF9zdWIubGVuZ3RoIDwgdGhpcy5udW1fcm93KXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3X2JveCA9IHRoaXMuYm94RHJvcF9nZXQoKTtcclxuICAgICAgICAgICAgICAgIG5ld19ib3guYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBuZXdfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLmJlZ2luX3kgPSB0aGlzLm1hcmdpbl90b3A7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSAwO1xyXG4gICAgICAgICAgICAgICAgYm94X2MuYm94SXRlbS5jb2xvcl90eXBlID0gKGNjLnJhbmRvbTBUbzEoKSo1KSB8IDA7XHJcbiAgICAgICAgICAgICAgICBib3hfYy5yZXNldE9yaWdpblBvcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIG5ld19ib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIGxpc3Rfc3ViLnB1c2gobmV3X2JveCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpbmRleF07XHJcblxyXG4gICAgICAgICAgICAvL+abtOaWsOavj+S4quWFg+e0oOeahGVuZCB5IOS9jee9rlxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaTxsaXN0X3N1Yi5sZW5ndGg7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gbGlzdF9zdWJbaV07XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBpdGVtX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0ucm93ID0gaTtcclxuICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uZW5kX3kgPSB0aGlzLm1hcmdpbl9ib3R0b20gKyAodGhpcy5pdGVtSGVpZ2h0K3RoaXMuaXRlbVNwYWNlKSooaSsxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVCZWdpbk9yaWdpblkoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNoZWNrUGFuZWxFbGltaW5hdGFibGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlrDmr4/kuIDliJfku5bku6zkuK3nmoTmr4/kuKrlhYPntKDnmoTliJ3lp4vnmoRvcmlnaW4geeeahOWAvFxyXG4gICAgICovXHJcbiAgICB1cGRhdGVCZWdpbk9yaWdpblk6ZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5p+Q5LiA5YiX5LitIOS7juacgOWQjuW8gOWni+mBjeWOhui/lOWbnlxyXG4gICAgICAgICAqIOeul+WHuuW8gOWni+aOieS6hueahOS9jee9rlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Yik5pat5piv5ZCmIOW3sui+vuWIsOS7lueahGVuZHkg5aaC5p6c6L+Y5pyq6L6+5Yiw5bCx5pivIOato+imgeaOieiQvVxyXG4gICAgICAgICAgICBsZXQgb2ZmX3RvcCA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyBmb3IobGV0IGogPSB0aGlzLm51bV9yb3ctMTsgaj49MDsgai0tKXtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yb3c7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYm94X2MgPSBib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKTtcclxuICAgICAgICAgICAgICAgIC8vYm94X2MuYm94SXRlbS5iZWdpbl95ID0gdGhpcy5tYXJnaW5fdG9wO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGJveF9jLm5vZGUueSAhPT0gYm94X2MuYm94SXRlbS5lbmRfeSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIDEu5a6e5L6L5ri45oiP55qE5pe25YCZIOWIneWni+W8gOWni+eahOS9jee9rlxyXG4gICAgICAgICAgICAgICAgICAgICAqIDIu5raI6Zmk55qEIOaWueWdl+S4jeWcqOeVjOmdouS4reeahOiuvue9ruS7lueahOW8gOWni+S9jee9riDlt7LlnKjnlYzpnaLkuK3nmoTkuI3ljrvorr7nva7ku5ZcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZigodGhpcy5nYW1lc3RhdGUgPT09IEdhbWVfU3RhdGUuU3RhcnQpIHx8IChib3hfYy5ub2RlLnkgPj0gYm94X2MuYm94SXRlbS5iZWdpbl95KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcCArIG9mZl90b3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveF9jLm5vZGUueSA9IGJveF9jLmJveEl0ZW0uYmVnaW5feTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZl90b3AgKz0gYm94X2Mubm9kZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuICAgIC8v5Lqk5o2i5Lik5Liq5pa55Z2X55qE5L2N572uXHJcbiAgICBleGNoYW5nZUJveEl0ZW06ZnVuY3Rpb24oYm94SXRlbTEsYm94SXRlbTIsdG9DaGVja1ZpYWJsZSA9IHRydWUpe1xyXG5cclxuICAgICAgICBpZihib3hJdGVtMS5yYW5rID09PSBib3hJdGVtMi5yYW5rKXtcclxuICAgICAgICAgICAgLy/lkIzkuIDliJfnmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnJhbmtMaXN0W2JveEl0ZW0xLnJhbmtdO1xyXG5cclxuICAgICAgICAgICAgLy/kuqTmjaLkvY3nva5cclxuICAgICAgICAgICAgbGV0IHRlbXBfZW5keSA9IGJveEl0ZW0yLmVuZF95O1xyXG4gICAgICAgICAgICBib3hJdGVtMi5lbmRfeSA9IGJveEl0ZW0xLmVuZF95O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5lbmRfeSA9IHRlbXBfZW5keTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L+h5oGvXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX3JvdyA9IGJveEl0ZW0yLnJvdztcclxuXHJcbiAgICAgICAgICAgIGJveEl0ZW0yLnJvdyA9IGJveEl0ZW0xLnJvdztcclxuICAgICAgICAgICAgYm94SXRlbTEucm93ID0gdGVtcF9yb3c7ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdFtib3hJdGVtMS5yb3ddO1xyXG4gICAgICAgICAgICBsaXN0W2JveEl0ZW0xLnJvd10gPSBsaXN0W2JveEl0ZW0yLnJvd107XHJcbiAgICAgICAgICAgIGxpc3RbYm94SXRlbTIucm93XSA9IHRlbXBfbm9kZTtcclxuXHJcblxyXG4gICAgICAgIH1lbHNlIGlmKGJveEl0ZW0xLnJvdyA9PT0gYm94SXRlbTIucm93KXtcclxuICAgICAgICAgICAgLy/lkIzkuIDooYznmoRcclxuICAgICAgICAgICAgbGV0IGxpc3QxID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMS5yYW5rXTtcclxuICAgICAgICAgICAgbGV0IGxpc3QyID0gdGhpcy5yYW5rTGlzdFtib3hJdGVtMi5yYW5rXTtcclxuXHJcbiAgICAgICAgICAgIC8v5Lqk5o2i5L2N572uXHJcbiAgICAgICAgICAgIGxldCB0ZW1wX2JlZ2lueCA9IGJveEl0ZW0yLmJlZ2luX3g7XHJcbiAgICAgICAgICAgIGJveEl0ZW0yLmJlZ2luX3ggPSBib3hJdGVtMS5iZWdpbl94O1xyXG4gICAgICAgICAgICBib3hJdGVtMS5iZWdpbl94ID0gdGVtcF9iZWdpbng7XHJcblxyXG4gICAgICAgICAgICAvL+S6pOaNouS/oeaBr1xyXG4gICAgICAgICAgICBsZXQgdGVtcF9yYW5rID0gYm94SXRlbTIucmFuaztcclxuICAgICAgICAgICAgYm94SXRlbTIucmFuayA9IGJveEl0ZW0xLnJhbms7XHJcbiAgICAgICAgICAgIGJveEl0ZW0xLnJhbmsgPSB0ZW1wX3Jhbms7XHJcblxyXG4gICAgICAgICAgICBsZXQgcm93X2luZGV4ID0gYm94SXRlbTEucm93O1xyXG4gICAgICAgICAgICBsZXQgdGVtcF9ub2RlID0gbGlzdDFbcm93X2luZGV4XTtcclxuICAgICAgICAgICAgbGlzdDFbcm93X2luZGV4XSA9IGxpc3QyW3Jvd19pbmRleF07XHJcbiAgICAgICAgICAgIGxpc3QyW3Jvd19pbmRleF0gPSB0ZW1wX25vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZih0b0NoZWNrVmlhYmxlKXtcclxuXHJcbiAgICAgICAgICAgIGxldCBpc1ZpYWJsZSA9IHRoaXMuY2hlY2tQYW5lbEVsaW1pbmF0YWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWlzVmlhYmxlKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvL+S4jeWPr+a2iOmZpOeahOivnSDkvY3nva7lho3kupLmjaLlm57mnaVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5LiN5Y+v5raI6ZmkXCIpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhjaGFuZ2VCb3hJdGVtKGJveEl0ZW0yLGJveEl0ZW0xLGZhbHNlKTsgXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDMwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8v5qOA5rWL6Z2i5p2/5omA5pyJ5pa55Z2XIOaYr+WQpuWPr+a2iOmZpFxyXG4gICAgY2hlY2tQYW5lbEVsaW1pbmF0YWJsZTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBsZXQgd2lwZV9saXN0ID0gW107XHJcblxyXG4gICAgICAgIC8v5Yik5pat5YiXIOaYr+WQpuacieS4ieS4quS7peWPiuS4ieS4quS7peS4iueahOS4gOagt+eahOiJsuWdl+i/nuWcqOS4gOi1t1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3Jhbms7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtpXTtcclxuICAgICAgICAgICAgbGV0IHRlbXBMaXN0ID0gW107XHJcbiAgICAgICAgICAgIGxldCBwcmVfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgajx0aGlzLm51bV9yb3c7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gbGlzdFtqXTtcclxuICAgICAgICAgICAgICAgIGlmKCFwcmVfYm94KXtcclxuICAgICAgICAgICAgICAgICAgICBwcmVfYm94ID0gYm94O1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX3ByZSA9IHByZV9ib3guZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtX2JveCA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0b0FkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1fcHJlLmNvbG9yX3R5cGUgPT09IGl0ZW1fYm94LmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKGJveCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGogPT09ICh0aGlzLm51bV9yb3ctMSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvQWRkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcExpc3QubGVuZ3RoID49IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov73liqDliLB3aXBl6YeM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh3aXBlX2xpc3QsdGVtcExpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJc1NlbGVjdFN0YXRlKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+a4heepuuaVsOe7hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlX2JveCA9IGJveDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzUmVwZWF0SXRlbUluV2lwZShpdGVtKXtcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTx3aXBlX2xpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYod2lwZV9saXN0W2ldLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbS5pZCA9PT0gaXRlbS5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW0uaWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5Yik5pat6KGMIOaYr+WQpuacieS4ieS4quS7peWPiuS4ieS4quS7peS4iueahOS4gOagt+eahOiJsuWdl+i/nuWcqOS4gOi1t1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRoaXMubnVtX3JvdzsgaSsrKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0ZW1wTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgcHJlX2JveCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGo8dGhpcy5udW1fcmFuazsgaisrKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLnJhbmtMaXN0W2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYoIXByZV9ib3gpe1xyXG4gICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QucHVzaChib3gpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fcHJlID0gcHJlX2JveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpLmJveEl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1fYm94ID0gYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvQWRkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbV9wcmUuY29sb3JfdHlwZSA9PT0gaXRlbV9ib3guY29sb3JfdHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaiA9PT0gKHRoaXMubnVtX3JhbmstMSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvQWRkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGVtcExpc3QubGVuZ3RoID49IDMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov73liqDliLB3aXBl6YeM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNSZXBlYXRJdGVtSW5XaXBlKGVsZW0pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lwZV9saXN0LnB1c2goZWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXNTZWxlY3RTdGF0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrmlbDnu4RcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZV9ib3ggPSBib3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBMaXN0LnB1c2goYm94KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZih3aXBlX2xpc3QubGVuZ3RoID4gMCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd0RlbGF5QW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZXN0YXRlID09PSBHYW1lX1N0YXRlLlN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIC8v5LiN5pi+56S65raI6Zmk5Yqo55S7XHJcbiAgICAgICAgICAgICAgICBzaG93RGVsYXlBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL+S4jeaYr+WIneWni+WMlueahCDlgZznlZnkuIDkvJrlhL/lho3mtojpmaRcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy/mtojpmaTmjolcclxuICAgICAgICAgICAgICAgIHdpcGVfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJveERyb3BfZGVzdHJveShlbGVtLmdldENvbXBvbmVudChcIkJveERyb3BcIikpO1xyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFsbFJhbmtFbmRZKCk7XHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksc2hvd0RlbGF5QW5pbWF0aW9uPzA6MSxmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZXN0YXRlID0gR2FtZV9TdGF0ZS5QbGF5O1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIGJveERyb3BfZ2V0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCBib3ggPSBudWxsO1xyXG4gICAgICAgIGlmKHRoaXMuYm94UG9vbC5zaXplKCkgPiAwKXtcclxuICAgICAgICAgICAgYm94ID0gdGhpcy5ib3hQb29sLmdldCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBib3ggPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJveF9wcmVmYWIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJveDtcclxuICAgIH0sXHJcblxyXG4gICAgYm94RHJvcF9kZXN0cm95OmZ1bmN0aW9uKGJveCl7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3guYm94SXRlbS5yYW5rXTtcclxuICAgICAgICBcclxuICAgICAgICBsaXN0LnJlbW92ZUJ5VmFsdWUobGlzdCxib3gubm9kZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuXHJcblxyXG4iLCJcclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX3NlbGVjdF9ib3g6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL+mAieS4reafkOS4quaWueWdl1xyXG4gICAgICAgIHNlbGVjdF9ib3g6IHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0X2JveDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RfYm94KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuYm94SXNTZWxlY3RTdGF0ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBib3hJdGVtX25ldyA9IHZhbHVlLmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYm94SXRlbV9vbGQgPSB0aGlzLl9zZWxlY3RfYm94LmdldENvbXBvbmVudChcIkJveERyb3BcIikuYm94SXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYm94SXRlbV9uZXcuaWQgIT09IGJveEl0ZW1fb2xkLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi55yL5piv5ZCm6KaB5Lqk5LqS5L2N572uIOi/mOaYr+ivtOWIh+aNouWIsOi/meS4qumAieS4reeahOS9jee9ruWkhOeQhlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZDEgPSBcIiArIGJveEl0ZW1fbmV3LmlkICsgXCIgIGlkMj0gXCIgKyBib3hJdGVtX29sZC5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5pen55qE5Y+W5raI6YCJ5oupXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3guYm94SXNTZWxlY3RTdGF0ZShmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGJveEl0ZW1fbmV3LnJhbmsgPT09IGJveEl0ZW1fb2xkLnJhbmsgJiYgTWF0aC5hYnMoYm94SXRlbV9uZXcucm93IC0gYm94SXRlbV9vbGQucm93KSA9PT0gMSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib3hJdGVtX25ldy5yb3cgPT09IGJveEl0ZW1fb2xkLnJvdyAmJiBNYXRoLmFicyhib3hJdGVtX25ldy5yYW5rIC0gYm94SXRlbV9vbGQucmFuaykgPT09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIuaYr+ebuOi/keeahCDkuqTmjaLkvY3nva5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hQYW5lbC5leGNoYW5nZUJveEl0ZW0oYm94SXRlbV9uZXcsIGJveEl0ZW1fb2xkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5LiN5piv55u46L+R55qEIOWPlua2iOS4iuS4gOS4qumAieaLqSDpgInkuK3mlrDngrnlh7vnmoRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuYm94SXNTZWxlY3RTdGF0ZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RfYm94ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCLpgInkuK3kuoblkIzkuIDkuKog5Y+W5raI6YCJ5oupXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5ib3hJc1NlbGVjdFN0YXRlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdF9ib3ggPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmlzaWJsZTpmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8v54K55Ye75LqGIOafkOS4qumAiemhuVxyXG4gICAgY2xpY2tfaXRlbTpmdW5jdGlvbihjbGlja19ub2RlKXtcclxuICAgICAgICBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGl0ZW0pO1xyXG5cclxuICAgICAgICAgbGV0IGJveFBhbmVsID0gY2MuZmluZChcIkdhbWUvUGFuZWxcIikuZ2V0Q29tcG9uZW50KFwiQm94UGFuZWxcIik7XHJcblxyXG4gICAgICAgICBsZXQgYm94SXRlbSA9IGNsaWNrX25vZGUuZ2V0Q29tcG9uZW50KFwiQm94RHJvcFwiKS5ib3hJdGVtO1xyXG5cclxuICAgICAgICAvLyAgLy/mtojpmaTmjolcclxuICAgICAgICAvLyAgYm94UGFuZWwuYm94RHJvcF9kZXN0cm95KGNsaWNrX25vZGUpO1xyXG5cclxuICAgICAgICAvLyAgLy/kuIrpnaLnmoTmjonkuIvmnaVcclxuICAgICAgICAvLyAgYm94UGFuZWwudXBkYXRlUmFua0VuZFkoYm94SXRlbS5yYW5rKTtcclxuXHJcblxyXG4gICAgICAgICB0aGlzLnNlbGVjdF9ib3ggPSBjbGlja19ub2RlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==