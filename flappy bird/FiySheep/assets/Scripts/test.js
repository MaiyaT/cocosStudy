
var Order_type = cc.Enum({
    normal : -1,
    shinei : -1,
    chengji : -1,
    wangyue : -1,
    kuaijian : -1,
    baoche : -1
});

var Order_type_1 = cc.Enum({
    normal : 2,
    shinei : 9,
    chengji : 10,
    wangyue : -1,
    kuaijian : -1,
    baoche : -1
});



cc.Class({
    extends: cc.Component,

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

         pro13:{
            set:function(value){
                this.pro7 = Math.floor(value);
            },
            type:cc.Integer
         },

         pro14:{
            default:Order_type.normal,
            type:Order_type
         }
    },

    // use this for initialization
    onLoad: function () {



        console.log(Order_type.normal+"_"+Order_type.shinei+"_"+Order_type.baoche+"_"+Order_type[0]);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
