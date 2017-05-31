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

        let menu = cc.find("Menu");
        let audio_m = menu.getComponent("MenuAudio");

        let ani_scale1 = cc.scaleTo(0.1,0.8);
        let ani_scale2 = cc.scaleTo(0.2,1);


        let self = this;

        // var listener = {

        //     event:cc.EventListener.TOUCH_ONE_BY_ONE,

        //     onTouchBegan:function(touches,event){
        //         // console.log("onTouchBegan");
                
                // audio_m.play_btn_audio();
                // self.node.stopAllActions();
                // self.node.runAction(ani_scale1);

        //         return true;
        //     },
        //     onTouchCancelled:function(touches,event){
        //         // console.log("onTouchCancelled");

        //         self.node.stopAllActions();
        //         self.node.runAction(ani_scale2);
        //     },
        //     onTouchEnded:function(touches,event){
        //         // console.log("onTouchEnded");
        //         self.node.stopAllActions();
        //         self.node.runAction(ani_scale2);
        //     },
        //     onTouchMoved:function(touches,event){
        //         // console.log("onTouchMoved");
        //     },

        // };  

        // cc.eventManager.addListener(listener,this.node);


   
        function onTouchDown (event) {
            // console.log("onTouchDown");            
            audio_m.play_btn_audio();
            self.node.stopAllActions();
            self.node.runAction(ani_scale1);
        }
        function onTouchUp (event) {
            // console.log("onTouchUp");
            self.node.stopAllActions();
            self.node.runAction(ani_scale2);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    

    },

    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
