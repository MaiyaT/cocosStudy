
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
    onLoad: function () {

    },

    //点击了 某个选项
    click_item:function(click_node){
        
        //console.log(item);

         let boxPanel = cc.find("Game/Panel").getComponent("BoxPanel");

         //消除掉
         boxPanel.boxDrop_destroy(click_node);

         //上面的掉下来
         boxPanel.updateRankEndY(click_node);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
