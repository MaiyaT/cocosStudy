

var BoxDrop = require("BoxDrop");
var BoxItem = require("BoxItem");
var BoxState = require("States").BoxState;
var Game_State = require("States").Game_State;
var BoxType = require("States").BoxType;

cc.Class({
    extends: cc.Component,

    properties: {

        box_prefab:{
            default:null,
            type:cc.Prefab,
        },

        num_rank:{
            default:10,
            tooltip:"列数"
        },

        num_row:{
            default:10,
            tooltip:"行数"
        },

        super_node:{
            default:null,
            type:cc.Node,
        },

        _gameState:{
            default:Game_State.Start,
            type:Game_State,
        },

        gamestate:{
            get:function () {
                return this._gameState;
            },
            set:function (value) {

                if(this._gameState !== value){

                    let tempBefore = this._gameState;

                    this._gameState = value;

                    if(value === Game_State.Play){
                        //开始掉落
                        this.updateBeginOriginY();
                    }else  if(value === Game_State.Filling){
                        this.fillInterval = 0;
                    }


                    if(tempBefore === Game_State.Start){
                        //是刚实例游戏完之后
                        //创建障碍物
                        this.createBarrierCanvas();
                    }

                }
            },
            type:Game_State
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


        // Array.prototype.filterRepeat = function(){  
        //     //直接定义结果数组  
        //     var arr = [];
        //     if(arr.length > 0){
        //         arr.push(this[0]);
        //     }

        //     for(var i = 1; i < this.length; i++){    //从数组第二项开始循环遍历此数组  
        //         //对元素进行判断：  
        //         //如果数组当前元素在此数组中第一次出现的位置不是i  
        //         //那么我们可以判断第i项元素是重复的，否则直接存入结果数组  
        //         if(this.indexOf(this[i]) == i){  
        //             arr.push(this[i]);  
        //         }  
        //     }  
        //     return arr;  
        // }  

        this.rankList = [];

        this.itemWidth = 100;
        this.itemHeight = 100;

        this.itemSpace = 5;

        //this.margin_top = -(cc.director.getWinSize().height)*0.5 + this.itemHeight*this.num_row + this.itemSpace * (this.num_row - 1) + this.itemHeight*0.5;
        //this.margin_bottom = -(cc.director.getWinSize().height)*0.5 - this.itemHeight*0.5;

        this.margin_top = -(this.super_node.height)*0.5 + this.itemHeight*this.num_row + this.itemSpace * (this.num_row - 1) + this.itemHeight*0.5;
        this.margin_bottom = -(this.super_node.height)*0.5 +  this.itemHeight*0.5;

        this.margin_left =  -this.itemWidth*this.num_rank*0.5 + this.itemSpace*(this.num_rank*0.5-1);
        this.margin_right = this.itemWidth * this.num_rank * 0.5 - this.itemSpace * (this.num_rank * 0.5 - 1);

        //console.log("asds  " + this.margin_top+"  "+this.margin_bottom);

        this.boxPool = new cc.NodePool("BoxDrop");

        /*障碍物的方块列表*/
        this.listBarrier = [];

        this.replayGame();
    },

    //重新开始游戏
    replayGame:function(){

        this.gamestate = Game_State.Start;

        var children = this.super_node.children;

        while(children.length > 0){
            
            for (var i = 0; i < children.length; ++i) {
                this.boxDrop_destroy(children[i].getComponent("BoxDrop"));
            }            
        }

        //清空ranklist
        var item;
        while (item = this.rankList.shift()) {
            
        }

        console.log("清空成==========功======");

        //创建所有面板的数据
        for(let index = 0; index<this.num_rank; index++){
            this.createRankContent(index);
        }

        this.updateBeginOriginY();

        this.checkPanelEliminatable();
    },

    /*创建障碍物 布局
    * 1.在障碍物下面的物体把他清空
    * 2.这个列的数量没有变还是这些数量
    * */
    createBarrierCanvas:function () {

        // for (let i = 3; i<this.num_rank-3; i++){
        //     let list = this.rankList[i];
        //
        //     let box = list[7];
        //     let box_c = box.getComponent("BoxDrop");
        //     box_c.boxSpeciallyShow(BoxType.Barrier);
        // }

        let barrierList = [{"row":7,"rank":5},{"row":7,"rank":6},{"row":7,"rank":7},{"row":7,"rank":8},{"row":6,"rank":5}];

        //设置是 barrier的方块类型
        barrierList.forEach(function(ele){

            let list = this.rankList[ele.rank];
            let box = list[ele.row];
            if(box !== undefined){
                let box_c = box.getComponent("BoxDrop");
                this.listBarrier.push(box);
                box_c.boxSpeciallyShow(BoxType.Barrier);
            }

        }.bind(this));

        /*设置这个barrier下的方块*/
        barrierList.forEach(function(ele){

            let list = this.rankList[ele.rank];
            for(let num_b = 0; num_b<ele.row;num_b++){

                //这个位置设置成空白占位信息
                let box = list[num_b];
                if(box !== undefined) {
                    let box_c = box.getComponent("BoxDrop");
                    if(box_c.boxItem.color_type < BoxType.TypeCount){
                        box_c.boxSpeciallyShow(BoxType.Blank);
                    }
                }
            }
        }.bind(this));


        this.beginBlankFill();
    },


    /*开始空位填充*/
    beginBlankFill:function () {

        /*看是否需要创建 方块 去填充占位方块*/

        if(this.listBarrier.length === 0){
            //没有障碍物
            return;
        }

        //给这个障碍物下面补充方块
        for (let i = 0; i < this.listBarrier.length; i++){

            let box = this.listBarrier[i];

            this.blankCheckReplaceAvailable(box);
        }
    },


    /*检测是否可以替换
    * box_c 这个要操作的方块类型  是 障碍物、方块
    * */
    blankCheckReplaceAvailable : function (box){

        let box_c = box.getComponent("BoxDrop");

        if(box_c.boxItem.color_type === BoxType.Barrier){
            //是障碍物

            //这个障碍物的边界两边 物体是 边界 、障碍物、方块
            let box_left = this.rankList[box_c.boxItem.rank-1][box_c.boxItem.row];
            let box_Right = this.rankList[box_c.boxItem.rank+1][box_c.boxItem.row];
            let box_bottom = this.rankList[box_c.boxItem.rank][box_c.boxItem.row-1];

            if(box_bottom.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
                //这个底部是空的 可以填充方块

                if(box_left.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount){
                    //左边位置掉落填充
                    console.log("左边位置掉落填充");
                    this.blankReplaceBox(box_bottom,box_left);
                    return true;

                }else if(box_Right.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount){
                    //右边位置掉落填充
                    console.log("右边位置掉落填充");
                }
            }
        }else if(box_c.boxItem.color_type < BoxType.TypeCount){
            //是方块

            //这个方块的 左下方 右下方 正下方 判断是否是空位
            let box_bottom_left = this.rankList[box_c.boxItem.rank-1][box_c.boxItem.row-1];
            let box_bottom_Right = this.rankList[box_c.boxItem.rank+1][box_c.boxItem.row-1];
            let box_bottom_zheng = this.rankList[box_c.boxItem.rank][box_c.boxItem.row-1];
            if(box_bottom_zheng !== undefined &&
                box_bottom_zheng.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
                //正下方是空的 往正下方 替换
                console.log("正下方是空的 往正下方 替换");
                this.blankReplaceBox(box_bottom_zheng,box);
                return true;
            }else if(box_bottom_left !== undefined &&
                box_bottom_left.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
                //左下方是空的 往左下方 替换
                console.log("左下方");
            }else if(box_bottom_Right !== undefined &&
                box_bottom_Right.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
                //右下方是空的 往右下方 替换
                console.log("右下方");
            }
        }

        return false;
    },



    /*替换方块 并执行替换切换的动画效果*/
    blankReplaceBox :function (boxBlank,boxReplace){

        let box_re = boxReplace.getComponent("BoxDrop");
        let box_bl = boxBlank.getComponent("BoxDrop");

        let repeatList = box_re.boxItem.ani_point.filter(function(elem){
            return elem.x === box_bl.boxItem.begin_x;
        });
        
        if(repeatList.length === 0) {
            let isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
            box_re.boxItem.ani_point.push({"x": box_bl.boxItem.begin_x, "y": box_bl.boxItem.end_y,"isleft":isleft});
        }
        box_re.boxItem.end_y = box_bl.boxItem.end_y;

        let temp_rank = box_re.boxItem.rank;

        box_re.boxItem.row = box_bl.boxItem.row;
        box_re.boxItem.rank = box_bl.boxItem.rank;



        //占位的方块 位置替换成要移入的方块  移除这个占位方块
        this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxReplace;

        //这个方块继续往下替换
        if(!this.blankCheckReplaceAvailable(box_re)){
            console.log("移动完成 替换=======");

            this.boxPool.put(box_bl.node);
        }



        //后面遍历的时候把他移除掉
        //this.rankList[temp_rank].removeByValue(this.rankList[temp_rank],boxReplace);


        // boxDrop_destroy:function(box){
        //
        //     let list = this.rankList[box.boxItem.rank];
        //
        //     list.removeByValue(list,box.node);
        //
        //     this.boxPool.put(box.node);
        // },

    },



    //创建每一列的数据
    createRankContent:function(index){

        let rank_list = [];

        let origin_x = this.margin_left + (this.itemWidth+this.itemSpace)*index;
         
        for(let i = 0; i < this.num_row; i++){

            let box = this.boxDrop_get();
            box.active = true;

            box.width = this.itemWidth;
            box.height = this.itemHeight;

            let box_c = box.getComponent("BoxDrop");
            box_c.state_b = BoxState.ENormal;

            box_c.initBoxItem();

            box_c.boxItem.begin_x = origin_x;
            box_c.boxItem.begin_y = this.margin_top;
            box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight+this.itemSpace)*(i+1);
            box_c.boxItem.rank = index;
            box_c.boxItem.row = i;

            let count = BoxType.TypeCount;
            box_c.boxItem.color_type = (cc.random0To1()*count) | 0;

            box_c.resetOriginPos();

            box.parent = this.super_node;

            rank_list.push(box);
        }

        this.rankList.push(rank_list);


    },

    //更新所有列 end y的数据
    updateAllRankEndY:function(){

        //看该列的数量是否 小于 this.num_row  少于的话则补充
        for(let i = 0; i<this.num_rank; i++){

            let origin_x = this.margin_left + (this.itemWidth+this.itemSpace)*i;

            let list_sub = this.rankList[i];
            
            while(list_sub.length < this.num_row){

                let new_box = this.boxDrop_get();
                new_box.active = true;

                let box_c = new_box.getComponent("BoxDrop");

                box_c.boxItem.begin_x = origin_x;
                box_c.boxItem.begin_y = this.margin_top;
                box_c.boxItem.rank = i;
                box_c.boxItem.row = 0;
                box_c.boxItem.color_type = (cc.random0To1()*5) | 0;
                box_c.resetOriginPos();

                new_box.parent = this.super_node;

                list_sub.push(new_box);

            }


            let end_box_y = this.margin_bottom;

            //更新每个元素的end y 位置
            for (let i = 0; i<list_sub.length; i++){

                let item_box = list_sub[i];
                let box_c = item_box.getComponent("BoxDrop");
                box_c.boxItem.row = i;
                box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight+this.itemSpace)*i;
            }
        }

        this.updateBeginOriginY();

        if(this.gamestate === Game_State.Start){
            this.checkPanelEliminatable();
        }
    },

    /**
     * 更新每一列他们中的每个元素的初始的origin y的值
     */
    updateBeginOriginY:function () {


        /**
         * 某一列中 从最后开始遍历返回
         * 算出开始掉了的位置
         */
        for (let i = 0; i<this.num_rank; i++){
            let list = this.rankList[i];

            //判断是否 已达到他的endy 如果还未达到就是 正要掉落
            let off_top = 0;
            let space_top = 5;

            // for(let j = this.num_row-1; j>=0; j--){
            for(let j = 0; j<this.num_row; j++){
                let box = list[j];

                let box_c = box.getComponent("BoxDrop");
                //box_c.boxItem.begin_y = this.margin_top;

                if(box_c.node.y !== box_c.boxItem.end_y){

                    /**
                     * 1.实例游戏的时候 初始开始的位置
                     * 2.消除的 方块不在界面中的设置他的开始位置 已在界面中的不去设置他
                     */
                    if((this.gamestate === Game_State.Start) || (box_c.node.y >= box_c.boxItem.begin_y)){

                        box_c.boxItem.begin_y = this.margin_top + off_top;

                        box_c.node.y = box_c.boxItem.begin_y;

                        off_top = off_top + box_c.node.height + space_top;

                        space_top = space_top + 10;
                    }

                    //是要掉落的
                    if(this.gamestate === Game_State.Play ||
                        this.gamestate === Game_State.Filling ||
                        this.gamestate === Game_State.Start){
                        box_c.state_b = BoxState.EFalling;
                    }
                }else{
                    box_c.state_b = BoxState.EFalled;
                }
            }
        }
    },

    
    //交换两个方块的位置
    exchangeBoxItem:function(box1,box2,toCheckViable = true){

        let boxItem1 = box1.getComponent("BoxDrop").boxItem;
        let boxItem2 = box2.getComponent("BoxDrop").boxItem;

        if(boxItem1.rank === boxItem2.rank){
            //同一列的
            let list = this.rankList[boxItem1.rank];

            //交换位置
            let temp_endy = boxItem2.end_y;
            boxItem2.end_y = boxItem1.end_y;
            boxItem1.end_y = temp_endy;

            box1.node.runAction(cc.moveTo(0.2,cc.p(boxItem1.begin_x,boxItem1.end_y)));
            box2.node.runAction(cc.moveTo(0.2,cc.p(boxItem2.begin_x,boxItem2.end_y)));
            // box1.node.y = boxItem1.end_y;
            // box2.node.y = boxItem2.end_y;

            //交换信息
            let temp_row = boxItem2.row;

            boxItem2.row = boxItem1.row;
            boxItem1.row = temp_row;            

            let temp_node = list[boxItem1.row];
            list[boxItem1.row] = list[boxItem2.row];
            list[boxItem2.row] = temp_node;



        }else if(boxItem1.row === boxItem2.row){
            //同一行的
            let list1 = this.rankList[boxItem1.rank];
            let list2 = this.rankList[boxItem2.rank];

            //交换位置
            let temp_beginx = boxItem2.begin_x;
            boxItem2.begin_x = boxItem1.begin_x;
            boxItem1.begin_x = temp_beginx;

            box1.node.runAction(cc.moveTo(0.2,cc.p(boxItem1.begin_x,boxItem1.end_y)));
            box2.node.runAction(cc.moveTo(0.2,cc.p(boxItem2.begin_x,boxItem2.end_y)));
            // box1.node.y = boxItem1.end_y;
            // box2.node.y = boxItem2.end_y;

            //交换信息
            let temp_rank = boxItem2.rank;
            boxItem2.rank = boxItem1.rank;
            boxItem1.rank = temp_rank;

            let row_index = boxItem1.row;
            let temp_node = list1[row_index];
            list1[row_index] = list2[row_index];
            list2[row_index] = temp_node;
        }

        
        if(toCheckViable){

            let isViable = this.checkPanelEliminatable();

            if(!isViable){

                //不可消除的话 位置再互换回来
                console.log("不可消除");
                setTimeout(function() {
                this.exchangeBoxItem(box2,box1,false);
                }.bind(this), 300);
            }
        }
    },

    //检测面板所有方块 是否可消除
    checkPanelEliminatable:function(){

        let wipe_list = [];

        //判断列 是否有三个以及三个以上的一样的色块连在一起
        for (let i = 0; i<this.num_rank; i++){
            let list = this.rankList[i];
            let tempList = [];
            let pre_box = null;
            for(let j = 0; j<this.num_row; j++){
                let box = list[j];
                if(!pre_box){
                    pre_box = box;
                    tempList.push(box);
                }else{
                    let item_pre = pre_box.getComponent("BoxDrop").boxItem;
                    let item_box = box.getComponent("BoxDrop").boxItem;

                    let toAdd = false;
                    /*颜色相同 并且是普通类型的颜色的时候*/
                    if(item_pre.color_type === item_box.color_type &&
                        item_pre.color_type < BoxType.TypeCount){
                        tempList.push(box);
                        if(j === (this.num_row-1)){
                            toAdd = true;
                        }
                    }else{
                        toAdd = true;
                    }

                    if(toAdd){
                        if(tempList.length >= 3){
                            //追加到wipe里面
                            Array.prototype.push.apply(wipe_list,tempList);

                        }
                        //清空数组
                        tempList = [];

                        pre_box = box;
                        tempList.push(box);
                    }
                }
            }
        }


        function isRepeatItemInWipe(item){
            for(let i = 0; i<wipe_list.length; i++){
                if(wipe_list[i].getComponent("BoxDrop").boxItem.id === item.getComponent("BoxDrop").boxItem.id){
                    return true;
                }
            }
            return false;
        }

        //判断行 是否有三个以及三个以上的一样的色块连在一起
        for (let i = 0; i<this.num_row; i++){
            
            let tempList = [];
            let pre_box = null;
            for(let j = 0; j<this.num_rank; j++){
                let box = this.rankList[j][i];
                if(!pre_box){
                    pre_box = box;
                    tempList.push(box);
                }else{
                    let item_pre = pre_box.getComponent("BoxDrop").boxItem;
                    let item_box = box.getComponent("BoxDrop").boxItem;

                    let toAdd = false;
                    if(item_pre.color_type === item_box.color_type &&
                        item_pre.color_type < BoxType.TypeCount){
                        tempList.push(box);
                        if(j === (this.num_rank-1)){
                            toAdd = true;
                        }
                    }else{
                        toAdd = true;
                    }

                    if(toAdd){
                        if(tempList.length >= 3){
                            //追加到wipe里面
                            tempList.forEach(function(elem){

                                if(!isRepeatItemInWipe(elem)){
                                    wipe_list.push(elem);
                                }


                            });

                        }
                        //清空数组
                        tempList = [];

                        pre_box = box;
                        tempList.push(box);
                    }
                }
            }
        }


        if(wipe_list.length > 0){

            let showDelayAnimation = true;
            if(this.gamestate === Game_State.Start){
                //不显示消除动画
                showDelayAnimation = false;
            }


            //不是初始化的 停留一会儿再消除 让用户看到要消除了什么东西
            this.schedule(function () {

                //消除掉
                // wipe_list.forEach(function(elem){
                //
                //     // let box = elem.getComponent("BoxDrop");
                //     // box.state_b = BoxState.EDestroy;
                //     this.boxDrop_destroy(elem.getComponent("BoxDrop"));
                //
                // }.bind(this));

                wipe_list.forEach(function(elem){

                    let box = elem.getComponent("BoxDrop");
                    box.state_b = BoxState.EDestroy;

                }.bind(this));

                /**
                 * 这边一个延迟
                 如果游戏是 初始化的话不延迟
                 不是初始化 start的 要等销毁动画完成之后再开始掉落
                 */
                this.schedule(function () {

                    //有销毁在掉落
                    if(this.gamestate !== Game_State.Start){
                        //正在掉落填充
                        this.gamestate = Game_State.Filling;
                    }

                    this.updateAllRankEndY();

                }.bind(this),(this.gamestate !== Game_State.Start)?0.3:0,false);


            }.bind(this),showDelayAnimation?0.3:0,false);

            return true;
        }

        this.gamestate = Game_State.Play;

        return false;
    },







    boxDrop_get:function(){

        let box = null;
        if(this.boxPool.size() > 0){
            box = this.boxPool.get();
        }else{
            box = cc.instantiate(this.box_prefab);
            box.getComponent("BoxDrop").init();
        }

        return box;
    },

    boxDrop_destroy:function(box){

        let list = this.rankList[box.boxItem.rank];
        
        list.removeByValue(list,box.node);

        this.boxPool.put(box.node);
    },



    


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if(this.gamestate === Game_State.Filling ||
            this.gamestate === Game_State.Start){

            let self = this;

            if(this.fillInterval === 10){

                this.fillInterval = 0;

                console.log("======定时开始判断是否都已掉落到底部了 begin =====");

                for (let i = 0; i<self.num_rank; i++) {
                    let list = self.rankList[i];

                    for (let j = 0; j < self.num_row; j++) {
                        let box = list[j];
                        let box_c_i = box.getComponent("BoxDrop");
                        if(box_c_i.state_b !== BoxState.EFalled){
                            return;
                        }
                    }
                }


                console.log("=========都到 掉落到底部了 检测是否可消除 end =========");

                this.gamestate = Game_State.Play;
                self.checkPanelEliminatable();
            }

            this.fillInterval += 1;
        }

    },
});


