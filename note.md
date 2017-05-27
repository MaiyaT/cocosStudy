# Cocoscreator 笔记



---

#[属性参数](http://www.cocos.com/docs/creator/scripting/reference/attributes.html)

 - type: 数据类型
 - visible: 在属性检查器中是否可见，或者属性名字是已 `_`开头，也不显示，是否显示以`visible`为准
 - displayName: 在属性检查器面板中显示的名字
 - tooltip: 在属性检查器上鼠标移动到属性上显示出来的说明
 - multiline: 是否允许多行文本框 拉大文本框
 - readonly: 只读，加锁了不能更改
 - min: 最小输入的值
 - max: 最大输入的值
 - step: 调节输入的步长
 - range: 一次性设置 min,max,step , step可选
 - slide: 显示滚动条
 - url: 用来访问Asset里面的资源
 - override: 与父类同名，需要设置
 - get: get方法
 - set: set方法
 - default: 默认值

> 定义属性的时候 必须声明 default，get，set中的一个。


  
```
    properties: {

         pro1:{
            default:null,
            type:cc.Node,
            displayName:"展示的名字",
            tooltip:"说明说明"
         },

         pro2:{
            default:null,
            type:cc.Button,
            visible:false,  //不在属性检查器显示
         },

         pro3:{
            default:10,
            readonly:true
         },

         pro4:{
            default:"设置文本框",
            multiline:true
         },

         pro5:{
            default:10,
            min : 2,
            max : 20,
            step : 1
         },

         pro6:{
            default : 8,
            range : [4,30,2]
         },

         pro7:{
            default : 50,
            range:[0,100,2],
            slide:true
         },
         
         _pro8:{
            default : "这样子也可以不显示",
         },
         pro9:{
            default:function(){
                return [1,2,3];
            },
         },

         pro10:{
            default:"",
            serializable:false
         },

         pro11:{
            default:"",
            url:cc.Texture2D,
         },

         pro12:{
            get:function(){
                return this.pro7;
            }
         },
         
         pro14:{
            default:Order_type.normal,
            type:Order_type
         }
    },
```


---



#[枚举](http://cocos.com/docs/creator/api/modules/cc.html#method_Enum)

> 他是一个对象，用户可以设置成任意的整形，
如果是-1，系统将会分配上一个枚举值 +1
必须要给他设置初始值
如果自动加1的 数值有重复的会报错

```
var Order_type = cc.Enum({
    normal : -1,
    shinei : -1,
    chengji : -1,
    wangyue : -1,
    kuaijian : -1,
    baoche : -1
});

Order_type.normal  的值 == 1
Order_type[0]   的值 == "normal"

```



---


#[模块化脚本](http://www.cocos.com/docs/creator/scripting/modular-script.html#require)

> 每一个单独的脚本文件就构成一个模块
每一个模块都是单独的作用域
require 方法引用其他模块
module.exports 导出变量

`require`:
```
var test = require("test");
```
返回的就是导出模块的对象
可以再任何地方任意时刻调用

`module.exports`
每一个脚本文件，都会自动创建一个module对象，这个对象都有一个exports属性，初始值是{}
```
module.exports = {};
```

```
var cfg = {
    moveSpeed: 10,
    version: "0.15",
    showTutorial: true,

    load: function () {
        // ...
    }
};
cfg.load();

module.exports = cfg;
```

`window.`:全局变量
新建一个global文件，将他作为插件或者其他地方一开始就要调用他
```
window.D = {
    // types
    GameManager: null,
    // singletons
    game: null,
    pipeManager: null,
};

```


---

#[cc.EventListener](http://www.cocos.com/docs/creator/api/classes/EventListener.html#method_create)

`cc.EventListener.TOUCH_ONE_BY_ONE`:单点触摸，多个手指同时触摸时候，出发多次点击事件

`cc.EventLister.TOUCN_ALL_AT_ONCE`:多点触摸，多个手机同时触摸时候，只出发一次点击事件

```

var listener =
{
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    onTouchBegan: function (touches, event) {

        var target = event.getCurrentTarget();//获取事件所绑定的target
        var locationInNode = target.convertToNodeSpace(touches.getLocation());
        //cc.log('locationInNode: ' + locationInNode.x);
        if(locationInNode.x>self.node.width/2){
           self.playerMoveRight();//player向右移动
        }else{
           self.playerMoveLeft();//player向左移动
        }
        return true; //这里必须要写 return true
    },
    onTouchMoved: function (touches, event) {
              
    },
    onTouchEnded: function (touches, event) {
           
    },
    onTouchCancelled: function (touches, event) {
    
    }
}

cc.eventManager.addListener(listener, self.node);

```

`cc.EventListener.KEYBOARD`:键盘事件监听

```
cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    onKeyPressed: function (keyCode, event) {
        cc.log('pressed key: ' + keyCode);
    },
    onKeyReleased: function (keyCode, event) {
        cc.log('released key: ' + keyCode);
    }
});
```
`cc.EventListener.ACCELERATION`:加速器事件监
```
cc.EventListener.create({
    event: cc.EventListener.ACCELERATION,
    callback: function (acc, event) {
        cc.log('acc: ' + keyCode);
    }
});
```




---
#[碰撞系统回调](http://www.cocos.com/docs/creator/physics/collision-manager.html)


```
获取碰撞检测系统
var manager = cc.director.getCollisionManager();
默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
manager.enabled = true;
默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制
manager.enabledDebugDraw = true;
如果还希望显示碰撞组件的包围盒，那么可以通过以下接口来进行设置
manager.enabledDrawBoundingBox = true;


/**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
onCollisionEnter: function (other, self) {
    console.log('on collision enter');

    // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
    var world = self.world;

    // 碰撞组件的 aabb 碰撞框
    var aabb = world.aabb;

    // 上一次计算的碰撞组件的 aabb 碰撞框
    var preAabb = world.preAabb;

    // 碰撞框的世界矩阵
    var t = world.transform;

    // 以下属性为圆形碰撞组件特有属性
    var r = world.radius;
    var p = world.position;

    // 以下属性为 矩形 和 多边形 碰撞组件特有属性
    var ps = world.points;
},
/**
 * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
onCollisionStay: function (other, self) {
    console.log('on collision stay');
},
/**
 * 当碰撞结束后调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
onCollisionExit: function (other, self) {
    console.log('on collision exit');
}
```
