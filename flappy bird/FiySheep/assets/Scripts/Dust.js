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

        aim:{
            default:null,
            type:cc.Animation
        }

    },

    

    playAnimation:function(animationName, callback){

        this.aim.play(animationName);

        this.callback = callback;
        this.aim.on("finished",this.playFinish,this);
    },

    playFinish:function(){

        console.log("动画播放完成");
        this.aim.off("finished",this.playFinish,this);

        this.callback(this);
        // this.pool_dust.put(this.node);
    },

    unuse:function(){
        console.log("pool 调用 unuse");
    },

    reuse:function(){
        console.log("pool 调用 reuse");
    },

    finish(){
        console.log("这是什么东西");
    },

    // finish(){

    //     this.pool_dust.put(this);
    //     console.log("==================动画播放完成");

    // },



    // use this for initialization
    onLoad: function () {

        /**
         * http://www.cocos.com/docs/creator/scripting/pooling.html
         * http://www.cocos.com/docs/creator/api/classes/NodePool.html
         * 节点缓存池 管理对象节点反复创建和销毁
         * NodePool 需要实例之后才能使用  不同的节点对象需要不用的对象池实例   多个prefab就对应创建NodePool 
         * get 获取  size-1
         * put 放入 调用的节点会自动 removeFromParent  size+1
         * 
         * 添加到对象池里面的节点 如Dust 在对象Dust中 有 unuse和reuse 方法 
         * 当get的时候调用reuse方法  put的时候调用unuse方法  可以进行事件操作
         * get的时候可以传入参数
        */
        // this.pool_dust = new cc.NodePool("Dust");

        // this.pool_dust.pu

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
