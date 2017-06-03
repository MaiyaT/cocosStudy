

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

        box_prefab:{
            default:null,
            type:cc.Prefab,
        },

        num_rank:{
            default:10,
            tooltip:"列数"
        },

        num_row:{
            default:20,
            tooltip:"行数"
        },

        super_node:{
            default:null,
            type:cc.Node,
        },


    },

    // use this for initialization
    onLoad: function () {

        Array.prototype.removeByValue = function(arr,val){

            for (var i = 0; i<arr.length; i++){
                if(arr[i] === val){
                    arr.splice(i,1);
                    break;
                }
            }
        };

        this.rankList = [];

        this.itemWidth = 100;
        this.itemHeight = 100;

        this.itemSpace = 5;

        this.margin_top = (cc.director.getWinSize().height)*0.5 + this.itemHeight*0.5;
        this.margin_bottom = -(cc.director.getWinSize().height)*0.5 - this.itemHeight*0.5;
        this.margin_left =  -this.itemWidth*this.num_rank*0.5 + this.itemSpace*(this.num_rank*0.5-1);
        this.margin_right = this.itemWidth*this.num_rank*0.5 - this.itemSpace*(this.num_rank*0.5-1);

        //console.log("asds  " + this.margin_top+"  "+this.margin_bottom);

        this.boxPool = new cc.NodePool("BoxDrop");

        this.creaePanleContent();
    },

    //创建所有面板的数据
    creaePanleContent:function(){

        for(let index = 0; index<this.num_rank; index++){
            this.createRankContent(index);
        }

    },

    //创建每一列的数据
    createRankContent:function(index){

        var rank_list = [];

        let origin_x = this.margin_left + (this.itemWidth+this.itemSpace)*index;
         
        for(let i = 0; i < this.num_row; i++){

            let box = this.boxDrop_get();
            box.active = true;

            box.width = this.itemWidth;
            box.height = this.itemHeight;

            let box_c = box.getComponent("BoxDrop");
            box_c.initBoxItem();

            box_c.boxItem.begin_x = origin_x;
            box_c.boxItem.begin_y = this.margin_top;
            box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight+this.itemSpace)*(i+1);
            box_c.boxItem.rank = index;
            box_c.boxItem.row = i;
            box_c.boxItem.color_type = (cc.random0To1()*5) | 0;

            box_c.resetOriginPos();

            box.parent = this.super_node;

            rank_list.push(box);
        }

        this.rankList.push(rank_list);
    },


    //更新某一列 end y的数据
    updateRankEndY:function(box){

        //看该列的数量是否 小于 this.num_row  少于的话则补充
        for(let i = 0; i<this.rankList.length; i++){

            let list_sub = this.rankList[i];
            
            while(list_sub.length < this.num_row){

                let new_box = this.boxDrop_get();
                new_box.active = true;

                let box_c = new_box.getComponent("BoxDrop");
                let old_box = box.getComponent("BoxDrop");
                
                box_c.boxItem.begin_x = old_box.boxItem.begin_x;
                box_c.boxItem.begin_y = old_box.boxItem.begin_y;
                box_c.boxItem.rank = old_box.boxItem.rank;
                box_c.boxItem.row = old_box.boxItem.row;
                box_c.boxItem.color_type = (cc.random0To1()*5) | 0;
                box_c.resetOriginPos();

                new_box.parent = this.super_node;

                list_sub.push(new_box);
            }
        }

        let list = this.rankList[box.boxItem.rank];

        //更新每个元素的end y 位置
        for (let i = 0; i<list.length; i++){

            let box = list[i];
            let box_c = box.getComponent("BoxDrop");

            box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight+this.itemSpace)*(i+1);
        }
    },

    


    boxDrop_get:function(){

        let box = null;
        if(this.boxPool.size() > 0){
            box = this.boxPool.get();
        }else{
            box = cc.instantiate(this.box_prefab);
        }

        return box;
    },

    boxDrop_destroy:function(box){

        let list = this.rankList[box.boxItem.rank];
        
        list.removeByValue(list,box.node);

        this.boxPool.put(box.node);
    },



    


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
