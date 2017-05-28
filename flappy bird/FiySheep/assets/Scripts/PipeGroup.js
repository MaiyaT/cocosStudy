
//水管移动和上下位置摆放
cc.Class({
    extends: cc.Component,

    properties: {
        
        bottom_y_rand:{
            type:cc.Vec2,
            default:cc.p(0,0),
            tooltip:"下面一根水管 position y的范围"
        },
        space_rand:{
            type:cc.Vec2,
            default:cc.p(0,0),
            tooltip:"两根水管之间的间距范围"
        },
        speed:0,
        pipe_top:{
            default:null,
            type:cc.Node,
        },
        pipe_bottom:{
            default:null,
            type:cc.Node,
        }
    },

    //水管初始坐标等设置
    configSetup:function(){

        let y_bottom = this.bottom_y_rand.x + (this.bottom_y_rand.y-this.bottom_y_rand.x)*cc.random0To1();
        let space = this.space_rand.x + (this.space_rand.y-this.space_rand.x)*cc.random0To1();
        let y_top = y_bottom + Math.abs(space);

        this.pipe_top.y = y_top;
        this.pipe_bottom = y_bottom;

    },

    // use this for initialization
    onLoad: function () {

        // console.log("======random======"+Math.random());//0~1, 包含1不包含0
        // console.log("======cc.rand======"+cc.rand());//0~0xffffff
        // // console.log("======cc.random======"+cc.random());//没有这个方法
        // console.log("======cc.random0To1======"+cc.random0To1());//0~1
        // console.log("======cc.randomMinus1To1======"+cc.randomMinus1To1());//-1~1

        this.configSetup();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        this.node.x -= dt*this.speed;

        // console.log("水管x坐标1  " + this.node.x);
        // console.log("水管x坐标2  " + this.node.getBoundingBoxToWorld());
        // console.log("水管x坐标3  " + this.node.getBoundingBox());

        if(this.node.getBoundingBoxToWorld().xMax < 0){
            
        }
    },
});