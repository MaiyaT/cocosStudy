
var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
// var BoxState = require("States").BoxState;
var BoxShowType = require("States").BoxShowType;

cc.Class({
    "extends": cc.Component,

    properties: {

        _select_box: {
            "default": null,
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
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },