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