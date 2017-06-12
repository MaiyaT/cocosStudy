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

        lab_show:{
            default:null,
            type:cc.Label
        },

    },


    ocCallJs:function (str) {

        this.lab_show.node.active = true;

        this.lab_show.string = str;

        this.scheduleOnce(function () {

            this.lab_show.node.active = false;

        },5);

    },

    jsCallOc:function () {

        //类名 方法  参数1 参数2 参数3
        var result = jsb.reflection.callStaticMethod("JSBManager","yhJSBCall:","js这边传入的参数");

        console.log("js_call_oc ========= %@",result);

    },


    // use this for initialization
    onLoad: function () {

        // this.ocCallJs("测试 显示隐藏");

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
