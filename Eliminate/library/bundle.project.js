require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BoxDrop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '89bc7CJRGxJBZsOHDnUjDFu', 'BoxDrop');
// script/View/BoxDrop.js

"use strict";

var BoxItem = require("BoxItem");

cc.Class({
    extends: cc.Component,

    properties: {

        speed: 0,

        boxItem: {
            default: null,
            type: BoxItem
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        // this.click_add();
        this.boxItem = new BoxItem();
    },

    click_action: function click_action() {

        console.log("dianjile   " + "rank=" + this.boxItem.rank + "row=" + this.boxItem.row);

        var eliminate = cc.find("Game/Eliminate").getComponent("Eliminate");
        eliminate.click_item(this);
    },

    unuse: function unuse() {
        console.log("xiaohui");
    },

    reuse: function reuse() {
        console.log("chongyong");
    },

    resetOriginPos: function resetOriginPos() {

        this.node.x = this.boxItem.begin_x;
        this.node.y = this.boxItem.begin_y;

        this.node.color = this.boxItem.color_show;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        var box_bottom = this.node.y + this.node.height * 0.5;

        if (box_bottom > this.boxItem.end_y) {
            this.node.y -= this.speed * dt;
        }

        if (this.node.y < this.boxItem.end_y) {
            this.node.y = this.boxItem.end_y;
        }
    }
});

// module.exports = {
//     boxItem : this.boxItem
// };

cc._RF.pop();
},{"BoxItem":"BoxItem"}],"BoxItem":[function(require,module,exports){
"use strict";
cc._RF.push(module, '1e9eeXAPpRI2pOXFKZL+0Bg', 'BoxItem');
// script/Module/BoxItem.js

"use strict";

var Color_Box = cc.Enum({

    Red: -1,
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
                    case Color_Box.Red:
                        return cc.Color.RED;
                    case Color_Box.Green:
                        return cc.Color.GREEN;
                    case Color_Box.Blue:
                        return cc.Color.BLUE;
                    case Color_Box.Black:
                        return cc.Color.BLACK;
                    default:
                        return cc.Color.YELLOW;
                }
            }
        },

        //行
        rank: 0,
        //列
        row: 0

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
// script/View/BoxPanel.js

"use strict";

var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");

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

        box_prefab: {
            default: null,
            type: cc.Prefab
        },

        num_rank: {
            default: 10,
            tooltip: "列数"
        },

        num_row: {
            default: 20,
            tooltip: "行数"
        },

        super_node: {
            default: null,
            type: cc.Node
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

        this.rankList = [];

        this.itemWidth = 100;
        this.itemHeight = 100;

        this.itemSpace = 5;

        this.margin_top = -cc.director.getWinSize().height * 0.5 - this.itemHeight * 0.5;
        this.margin_bottom = cc.director.getWinSize().height * 0.5 + this.itemHeight * 0.5;
        this.margin_left = -this.itemWidth * this.num_rank * 0.5 + this.itemSpace * (this.num_rank * 0.5 - 1);
        this.margin_right = this.itemWidth * this.num_rank * 0.5 - this.itemSpace * (this.num_rank * 0.5 - 1);

        //console.log("asds  " + this.margin_top+"  "+this.margin_bottom);

        this.boxPool = new cc.NodePool("BoxDrop");

        this.creaePanleContent();
    },

    //创建所有面板的数据
    creaePanleContent: function creaePanleContent() {

        for (var index = 0; index < this.num_rank; index++) {
            this.createRankContent(index);
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

            box_c.boxItem.begin_x = origin_x;
            box_c.boxItem.begin_y = this.margin_top;
            box_c.boxItem.end_y = this.margin_bottom - (this.itemHeight + this.itemSpace) * (i + 1);
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
    updateRankEndY: function updateRankEndY(box) {

        var list = this.rankList[box.boxItem.rank];

        // for ()
        console.log("list = " + list);
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
// script/Module/Eliminate.js

"use strict";

var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");

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

    //点击了 某个选项
    click_item: function click_item(click_node) {

        //console.log(item);

        var boxPanel = cc.find("Game/Panel").getComponent("BoxPanel");

        //消除掉
        boxPanel.boxDrop_destroy(click_node);

        //上面的掉下来
        boxPanel.updateRankEndY(click_node);
    }

});

cc._RF.pop();
},{"BoxDrop":"BoxDrop","BoxItem":"BoxItem"}]},{},["BoxItem","Eliminate","BoxDrop","BoxPanel"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvVmlldy9Cb3hEcm9wLmpzIiwiYXNzZXRzL3NjcmlwdC9Nb2R1bGUvQm94SXRlbS5qcyIsImFzc2V0cy9zY3JpcHQvVmlldy9Cb3hQYW5lbC5qcyIsImFzc2V0cy9zY3JpcHQvTW9kdWxlL0VsaW1pbmF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTs7QUFFQTtBQUNJO0FBQ0E7QUFGSTtBQUpBOztBQVdaO0FBQ0E7O0FBRUk7QUFDQTtBQUNIOztBQUdEOztBQUVJOztBQUVBO0FBQ0E7QUFDSDs7QUFJRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUdEOztBQUVJO0FBQ0E7O0FBRUE7QUFDSDs7QUFHRDtBQUNBOztBQUVJOztBQUVBO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7QUFDSjtBQTlESTs7QUFrRVQ7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDcEVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBTm9COztBQWN4QjtBQUNJOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNJO0FBQ0k7QUFBcUI7QUFDckI7QUFBbUI7QUFDbkI7QUFBcUI7QUFDckI7QUFBb0I7QUFDcEI7QUFBcUI7QUFDckI7QUFBUTtBQU5aO0FBUUg7QUFWTTs7QUFhWDtBQUNBO0FBQ0E7QUFDQTs7QUEzQlE7O0FBaUNaO0FBQ0E7O0FBckNLOztBQWdEVDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNqRUE7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNBO0FBRks7O0FBS1Q7QUFDSTtBQUNBO0FBRkk7O0FBS1I7QUFDSTtBQUNBO0FBRk87O0FBM0JIOztBQW1DWjtBQUNBOztBQUVJOztBQUVJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0k7QUFDSDtBQUVKOztBQUVEO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFSTs7QUFFQTtBQUNBO0FBRUg7O0FBR0Q7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIOztBQUVEO0FBQ0g7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFDSDs7QUFoSkk7Ozs7Ozs7Ozs7QUNKVDtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7O0FBSUE7QUFDQTs7QUFFSTs7QUFFQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDSjs7QUFqQ0kiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3BlZWQ6MCxcclxuXHJcbiAgICAgICAgYm94SXRlbTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpCb3hJdGVtLFxyXG4gICAgICAgICAgICAvLyB2aXNpYmxlOmZhbHNlLFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5jbGlja19hZGQoKTtcclxuICAgICAgICB0aGlzLmJveEl0ZW0gPSBuZXcgQm94SXRlbSgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgY2xpY2tfYWN0aW9uOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkaWFuamlsZSAgIFwiK1wicmFuaz1cIit0aGlzLmJveEl0ZW0ucmFuaytcInJvdz1cIit0aGlzLmJveEl0ZW0ucm93KTtcclxuXHJcbiAgICAgICAgbGV0IGVsaW1pbmF0ZSA9IGNjLmZpbmQoXCJHYW1lL0VsaW1pbmF0ZVwiKS5nZXRDb21wb25lbnQoXCJFbGltaW5hdGVcIik7XHJcbiAgICAgICAgZWxpbWluYXRlLmNsaWNrX2l0ZW0odGhpcyk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgdW51c2U6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInhpYW9odWlcIik7XHJcbiAgICB9LFxyXG5cclxuICAgIHJldXNlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjaG9uZ3lvbmdcIik7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZXNldE9yaWdpblBvczpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuYm94SXRlbS5iZWdpbl94O1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmJlZ2luX3k7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5jb2xvciA9IHRoaXMuYm94SXRlbS5jb2xvcl9zaG93O1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfYm90dG9tID0gdGhpcy5ub2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0KjAuNTtcclxuXHJcbiAgICAgICAgaWYoYm94X2JvdHRvbSA+IHRoaXMuYm94SXRlbS5lbmRfeSl7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHRoaXMuc3BlZWQqZHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLm5vZGUueSA8IHRoaXMuYm94SXRlbS5lbmRfeSl7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5ib3hJdGVtLmVuZF95O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbi8vIG1vZHVsZS5leHBvcnRzID0ge1xyXG4vLyAgICAgYm94SXRlbSA6IHRoaXMuYm94SXRlbVxyXG4vLyB9OyIsIlxyXG5cclxuXHJcbnZhciBDb2xvcl9Cb3ggPSBjYy5FbnVtKHtcclxuXHJcbiAgICBSZWQgOiAtMSxcclxuICAgIEdyZWVuIDogLTEsXHJcbiAgICBCbHVlIDogLTEsXHJcbiAgICBCbGFjayA6IC0xLFxyXG4gICAgV2hpdGUgOiAtMSxcclxuXHJcblxyXG4gICAgLy8gQ291bnQ6LTEsXHJcbn0pO1xyXG5cclxuXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG5cclxuICAgICAgICAvL+W8gOWni+aOieiQveeahOS9jee9rnhcclxuICAgICAgICBiZWdpbl94OjAsXHJcbiAgICAgICAgLy/lvIDlp4vmjonokL3nmoTkvY3nva55XHJcbiAgICAgICAgYmVnaW5feSA6IDAsXHJcbiAgICAgICAgLy/opoHmirXovr7nmoTkvY3nva5ZXHJcbiAgICAgICAgZW5kX3kgOiAtMTAwMCxcclxuICAgICAgICAvL+aYvuekuueahOminOiJslxyXG4gICAgICAgIGNvbG9yX3R5cGUgOiBDb2xvcl9Cb3guV2hpdGUsXHJcblxyXG4gICAgICAgIGNvbG9yX3Nob3c6e1xyXG4gICAgICAgICAgICBnZXQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCh0aGlzLmNvbG9yX3R5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgQ29sb3JfQm94LldoaXRlOnJldHVybiBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5SZWQ6cmV0dXJuIGNjLkNvbG9yLlJFRDtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5HcmVlbjpyZXR1cm4gY2MuQ29sb3IuR1JFRU47XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDb2xvcl9Cb3guQmx1ZTpyZXR1cm4gY2MuQ29sb3IuQkxVRTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIENvbG9yX0JveC5CbGFjazpyZXR1cm4gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpyZXR1cm4gY2MuQ29sb3IuWUVMTE9XO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy/ooYxcclxuICAgICAgICByYW5rIDogMCxcclxuICAgICAgICAvL+WIl1xyXG4gICAgICAgIHJvdyA6IDAsXHJcblxyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuXHJcblxyXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcclxuLy8gICAgIENvbG9yX0JveCA6IENvbG9yX0JveFxyXG4vLyB9OyIsIlxyXG5cclxudmFyIEJveERyb3AgPSByZXF1aXJlKFwiQm94RHJvcFwiKTtcclxudmFyIEJveEl0ZW0gPSByZXF1aXJlKFwiQm94SXRlbVwiKTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuXHJcbiAgICAgICAgYm94X3ByZWZhYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgbnVtX3Jhbms6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEwLFxyXG4gICAgICAgICAgICB0b29sdGlwOlwi5YiX5pWwXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBudW1fcm93OntcclxuICAgICAgICAgICAgZGVmYXVsdDoyMCxcclxuICAgICAgICAgICAgdG9vbHRpcDpcIuihjOaVsFwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3VwZXJfbm9kZTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlbW92ZUJ5VmFsdWUgPSBmdW5jdGlvbihhcnIsdmFsKXtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpPGFyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0gPT09IHZhbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yYW5rTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1XaWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLml0ZW1IZWlnaHQgPSAxMDA7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVNwYWNlID0gNTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJnaW5fdG9wID0gLShjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkuaGVpZ2h0KSowLjUgLSB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2JvdHRvbSA9IChjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCkuaGVpZ2h0KSowLjUgKyB0aGlzLml0ZW1IZWlnaHQqMC41O1xyXG4gICAgICAgIHRoaXMubWFyZ2luX2xlZnQgPSAgLXRoaXMuaXRlbVdpZHRoKnRoaXMubnVtX3JhbmsqMC41ICsgdGhpcy5pdGVtU3BhY2UqKHRoaXMubnVtX3JhbmsqMC41LTEpO1xyXG4gICAgICAgIHRoaXMubWFyZ2luX3JpZ2h0ID0gdGhpcy5pdGVtV2lkdGgqdGhpcy5udW1fcmFuayowLjUgLSB0aGlzLml0ZW1TcGFjZSoodGhpcy5udW1fcmFuayowLjUtMSk7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJhc2RzICBcIiArIHRoaXMubWFyZ2luX3RvcCtcIiAgXCIrdGhpcy5tYXJnaW5fYm90dG9tKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib3hQb29sID0gbmV3IGNjLk5vZGVQb29sKFwiQm94RHJvcFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhZVBhbmxlQ29udGVudCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL+WIm+W7uuaJgOaciemdouadv+eahOaVsOaNrlxyXG4gICAgY3JlYWVQYW5sZUNvbnRlbnQ6ZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGluZGV4PHRoaXMubnVtX3Jhbms7IGluZGV4Kyspe1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJhbmtDb250ZW50KGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+WIm+W7uuavj+S4gOWIl+eahOaVsOaNrlxyXG4gICAgY3JlYXRlUmFua0NvbnRlbnQ6ZnVuY3Rpb24oaW5kZXgpe1xyXG5cclxuICAgICAgICB2YXIgcmFua19saXN0ID0gW107XHJcblxyXG4gICAgICAgIGxldCBvcmlnaW5feCA9IHRoaXMubWFyZ2luX2xlZnQgKyAodGhpcy5pdGVtV2lkdGgrdGhpcy5pdGVtU3BhY2UpKmluZGV4O1xyXG4gICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1fcm93OyBpKyspe1xyXG5cclxuICAgICAgICAgICAgbGV0IGJveCA9IHRoaXMuYm94RHJvcF9nZXQoKTtcclxuICAgICAgICAgICAgYm94LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBib3gud2lkdGggPSB0aGlzLml0ZW1XaWR0aDtcclxuICAgICAgICAgICAgYm94LmhlaWdodCA9IHRoaXMuaXRlbUhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBib3hfYyA9IGJveC5nZXRDb21wb25lbnQoXCJCb3hEcm9wXCIpO1xyXG5cclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5iZWdpbl94ID0gb3JpZ2luX3g7XHJcbiAgICAgICAgICAgIGJveF9jLmJveEl0ZW0uYmVnaW5feSA9IHRoaXMubWFyZ2luX3RvcDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5lbmRfeSA9IHRoaXMubWFyZ2luX2JvdHRvbSAtICh0aGlzLml0ZW1IZWlnaHQrdGhpcy5pdGVtU3BhY2UpKihpKzEpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLnJhbmsgPSBpbmRleDtcclxuICAgICAgICAgICAgYm94X2MuYm94SXRlbS5yb3cgPSBpO1xyXG4gICAgICAgICAgICBib3hfYy5ib3hJdGVtLmNvbG9yX3R5cGUgPSAoY2MucmFuZG9tMFRvMSgpKjUpIHwgMDtcclxuXHJcbiAgICAgICAgICAgIGJveF9jLnJlc2V0T3JpZ2luUG9zKCk7XHJcblxyXG4gICAgICAgICAgICBib3gucGFyZW50ID0gdGhpcy5zdXBlcl9ub2RlO1xyXG5cclxuICAgICAgICAgICAgcmFua19saXN0LnB1c2goYm94KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFua0xpc3QucHVzaChyYW5rX2xpc3QpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy/mm7TmlrDmn5DkuIDliJcgZW5kIHnnmoTmlbDmja5cclxuICAgIHVwZGF0ZVJhbmtFbmRZOmZ1bmN0aW9uKGJveCl7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3guYm94SXRlbS5yYW5rXTtcclxuXHJcbiAgICAgICAgLy8gZm9yICgpXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsaXN0ID0gXCIrIGxpc3QpO1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIGJveERyb3BfZ2V0OmZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIGxldCBib3ggPSBudWxsO1xyXG4gICAgICAgIGlmKHRoaXMuYm94UG9vbC5zaXplKCkgPiAwKXtcclxuICAgICAgICAgICAgYm94ID0gdGhpcy5ib3hQb29sLmdldCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBib3ggPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJveF9wcmVmYWIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGJveDtcclxuICAgIH0sXHJcblxyXG4gICAgYm94RHJvcF9kZXN0cm95OmZ1bmN0aW9uKGJveCl7XHJcblxyXG4gICAgICAgIGxldCBsaXN0ID0gdGhpcy5yYW5rTGlzdFtib3guYm94SXRlbS5yYW5rXTtcclxuICAgICAgICBcclxuICAgICAgICBsaXN0LnJlbW92ZUJ5VmFsdWUobGlzdCxib3gubm9kZSk7XHJcblxyXG4gICAgICAgIHRoaXMuYm94UG9vbC5wdXQoYm94Lm5vZGUpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIFxyXG5cclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIiwiXHJcbnZhciBCb3hEcm9wID0gcmVxdWlyZShcIkJveERyb3BcIik7XHJcbnZhciBCb3hJdGVtID0gcmVxdWlyZShcIkJveEl0ZW1cIik7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIGZvbzoge1xyXG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcclxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcclxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXHJcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgLy8gLi4uXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+eCueWHu+S6hiDmn5DkuKrpgInpoblcclxuICAgIGNsaWNrX2l0ZW06ZnVuY3Rpb24oY2xpY2tfbm9kZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgIGxldCBib3hQYW5lbCA9IGNjLmZpbmQoXCJHYW1lL1BhbmVsXCIpLmdldENvbXBvbmVudChcIkJveFBhbmVsXCIpO1xyXG5cclxuICAgICAgICAgLy/mtojpmaTmjolcclxuICAgICAgICAgYm94UGFuZWwuYm94RHJvcF9kZXN0cm95KGNsaWNrX25vZGUpO1xyXG5cclxuICAgICAgICAgLy/kuIrpnaLnmoTmjonkuIvmnaVcclxuICAgICAgICAgYm94UGFuZWwudXBkYXRlUmFua0VuZFkoY2xpY2tfbm9kZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9