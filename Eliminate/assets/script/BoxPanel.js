

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

                    // let tempBefore = this._gameState;
                    //
                    // if(tempBefore === Game_State.Start){
                    //     //是刚实例游戏完之后
                    //     //创建障碍物
                    //     this.createBarrierCanvas();
                    // }

                    this._gameState = value;

                    if(value === Game_State.Play){
                        //开始掉落
                        this.updateAllBeginOriginY();
                    }else  if(value === Game_State.Filling){
                        this.fillInterval = 0;
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

        this.updateAllBeginOriginY();

        this.createBarrierCanvas();

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

        /*  清空数组*/
        this.listBarrier.splice(0,this.listBarrier.length);

        let barrierList = [

            {"row":7,"rank":2},{"row":6,"rank":2},
            {"row":7,"rank":3},
            {"row":7,"rank":4},
            {"row":7,"rank":5},
            {"row":7,"rank":6},
            {"row":7,"rank":7},{"row":6,"rank":7},


            {"row":2,"rank":2},{"row":3,"rank":2},
            {"row":2,"rank":3},
            {"row":2,"rank":6},
            {"row":2,"rank":7},{"row":3,"rank":7},

            ];

        //将blank按row大小排序 从小到大 底部到顶部 排序底部到顶部
        barrierList.sort(function (a,b) {
            return a.row - b.row;
        });

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


        this.blankBeginFill();

        this.checkPanelEliminatable();
    },


    /*开始空位填充*/
    blankBeginFill:function () {

        /*看是否需要创建 方块 去填充占位方块*/

        if(this.listBarrier.length === 0) {
            //没有障碍物
            return;
        }

        /*空缺的方块*/
        let listBlank = [];

        //遍历出场景中所有的空位方块
        // for(let b_i = 0; b_i < this.num_row; b_i++){
        for(let b_i = 0; b_i < this.num_row; b_i++){
            for(let b_j = 0; b_j < this.num_rank; b_j++){
                let box = this.rankList[b_j][b_i];
                if(box !== undefined &&  box.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
                    //这个位置是空缺的
                    listBlank.push(box);
                }
            }
        }

        let listBlankRightToLeft = listBlank.slice(0);
        let listBlankLeftToRight = listBlank.slice(0);

        //对blank排序 从上到下 从右往左
        listBlankRightToLeft.sort(function(boxa,boxb){
            if(boxa.getComponent("BoxDrop").boxItem.row === boxb.getComponent("BoxDrop").boxItem.row){
                return boxb.getComponent("BoxDrop").boxItem.rank - boxa.getComponent("BoxDrop").boxItem.rank;
            }else {
                return boxb.getComponent("BoxDrop").boxItem.row - boxa.getComponent("BoxDrop").boxItem.row;
            }
        });
        //对blank排序 从上到下 从左往右
        listBlankLeftToRight.sort(function(boxa,boxb){
            if(boxa.getComponent("BoxDrop").boxItem.row === boxb.getComponent("BoxDrop").boxItem.row){
                return boxa.getComponent("BoxDrop").boxItem.rank - boxb.getComponent("BoxDrop").boxItem.rank;
            }else {
                return boxb.getComponent("BoxDrop").boxItem.row - boxa.getComponent("BoxDrop").boxItem.row;
            }
        });



        if(listBlank.length === 0){
            //无空缺位置
            return;
        }


        for(let i = 0; i < listBlankRightToLeft.length; i++) {

            if (this.blankAviableFillItem(listBlankRightToLeft[i],false)) {
                this.blankBeginFill();
                return;
            }
        }

        for(let i = 0; i < listBlankLeftToRight.length; i++) {

            if (this.blankAviableFillItem(listBlankLeftToRight[i],true)) {
                this.blankBeginFill();
                return;
            }
        }



        //去掉可消除的选项
        // this.checkPanelEliminatable();
    },


    /* 填充这个方块
    * 判断这个方块是否可填充
    * 方向顺序 上 左 右*/
    blankAviableFillItem:function (blank_box,isLeftArrow) {

        let box_c = blank_box.getComponent("BoxDrop");

        let box_top = this.rankList[box_c.boxItem.rank][box_c.boxItem.row+1];
        let box_topLeft = this.rankList[box_c.boxItem.rank-1][box_c.boxItem.row+1];
        let box_topRight = this.rankList[box_c.boxItem.rank+1][box_c.boxItem.row+1];

        let box_re = undefined;

        //顶部是有方块可以填充
        if(box_top !== undefined && box_top.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount){
            box_re = box_top;
        }
        else if(box_topLeft !== undefined && box_topLeft.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount && isLeftArrow){
            box_re = box_topLeft;
        }
        else if(box_topRight !== undefined && box_topRight.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount && !isLeftArrow){
            box_re = box_topRight;
        }

        if(box_re !== undefined){

            //替换到 本身之前就是 空缺方块的位置 重新开始 填充
            return this.blankReplaceBox(blank_box,box_re);
        }

        return false;
    },

    /*替换方块 并执行替换切换的动画效果*/
    blankReplaceBox :function (boxBlank,boxReplace) {

        let box_re = boxReplace.getComponent("BoxDrop");
        let box_bl = boxBlank.getComponent("BoxDrop");

        //要取最后一个位置 来判断这个动画是够添加过
        let lastPoint = box_re.boxItem.ani_point[box_re.boxItem.ani_point.length - 1];

        //存储动画的节点
        let isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
        if (lastPoint === undefined || lastPoint.x !== box_bl.boxItem.begin_x) {
            box_re.boxItem.ani_point.push({
                "x": box_bl.boxItem.begin_x,
                "y": box_bl.boxItem.end_y + box_bl.node.height,
                "isleft": isleft
            });
        }

        let tempBeginy = box_re.boxItem.begin_y;

        let haveTop = this.blankTopBoxExit(boxReplace);
        if(!haveTop){
            this.blankRemoveItemAtRank(boxReplace);
        }


        let tempBeginx = box_re.boxItem.begin_x;
        let tempEndy = box_re.boxItem.end_y;
        let tempRow = box_re.boxItem.row;
        let tempRank = box_re.boxItem.rank;

        box_re.boxItem.begin_x = box_bl.boxItem.begin_x;
        box_re.boxItem.end_y = box_bl.boxItem.end_y;
        box_re.boxItem.row = box_bl.boxItem.row;
        box_re.boxItem.rank = box_bl.boxItem.rank;

        box_bl.boxItem.begin_x = tempBeginx;
        box_bl.boxItem.end_y = tempEndy;
        box_bl.boxItem.row = tempRow;
        box_bl.boxItem.rank = tempRank;
        box_bl.boxItem.begin_y = tempBeginy;


        if(haveTop){
            //这个位置的方块设置成空缺的状态
            //占位的方块 位置替换成要移入的方块  移除这个占位方块
            this.rankList[box_re.boxItem.rank][box_re.boxItem.row] = boxReplace;
            this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxBlank;

            box_bl.resetOriginPos();

            //从头开始重新遍历
            return true;

        }else {

            //占位的方块 位置替换成要移入的方块  移除这个占位方块
            this.rankList[box_re.boxItem.rank][box_re.boxItem.row] = boxReplace;

            this.boxPool.put(box_bl.node);

            return false;
        }
    },


    blankRemoveItemAtRank:function (boxRemove) {

        let box_re = boxRemove.getComponent("BoxDrop");
        let list = this.rankList[box_re.boxItem.rank];
        list.removeByValue(list,boxRemove);

        let new_box = this.updateRankEndYIndex(box_re.boxItem.rank);

        if(new_box !== null){

            let box_c = new_box.getComponent("BoxDrop");
            if(box_c.node.y !== box_c.boxItem.end_y){

                if((this.gamestate === Game_State.Start) || (box_c.node.y >= box_c.boxItem.begin_y)){

                    //他本身是最后一个 跟倒数第二个对比
                    let last_box = list[list.length-2];
                    if(last_box !== undefined){
                        box_c.boxItem.begin_y = last_box.getComponent("BoxDrop").boxItem.begin_y + box_c.node.height + 10*list.length;
                    }
                    else {
                        box_c.boxItem.begin_y = this.margin_top + space_top;
                        box_c.node.y = box_c.boxItem.begin_y;
                    }
                    box_c.node.y = box_c.boxItem.begin_y;
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
    },



    blankTopBoxExit:function (box) {

        let box_b = box.getComponent("BoxDrop");

        for(let i = box_b.boxItem.row+1; i < this.num_row; i++){
            let b = this.rankList[box_b.boxItem.rank][i];
            if(b !== undefined && b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
                return true;
            }
        }
        return false;
    },







    // /*检测是否可以替换
    // * box_c 这个要操作的方块类型  是 障碍物
    // * */
    // blankCheckReplaceBlankAvailable : function (box) {
    //
    //     let box_c = box.getComponent("BoxDrop");
    //
    //     if(box_c.boxItem.color_type === BoxType.Barrier){
    //         //是障碍物
    //
    //         //这个障碍物的边界两边 物体是 边界 、障碍物、方块
    //         let box_left = this.rankList[box_c.boxItem.rank-1][box_c.boxItem.row];
    //         let box_Right = this.rankList[box_c.boxItem.rank+1][box_c.boxItem.row];
    //         let box_bottom = this.rankList[box_c.boxItem.rank][box_c.boxItem.row-1];
    //
    //         //如果这个障碍物 上 左 右 都有其他的障碍物 这个障碍物不做处理 由他上方掉落的方块处理
    //         // let haveRight = (function () {
    //         //     for(let i = box_c.boxItem.rank+1; i < this.num_rank; i++){
    //         //         let b = this.rankList[i][box_c.boxItem.row];
    //         //         if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
    //         //             return true;
    //         //         }
    //         //     }
    //         //     return false;
    //         // }.bind(this))();
    //         // let haveLeft = (function () {
    //         //     for(let i = box_c.boxItem.rank-1; i >= 0; i--){
    //         //         let b = this.rankList[i][box_c.boxItem.row];
    //         //         if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
    //         //             return true;
    //         //         }
    //         //     }
    //         //     return false;
    //         // }.bind(this))();
    //         let haveTop = (function () {
    //             for(let i = box_c.boxItem.row+1; i < this.num_row; i++){
    //                 let b = this.rankList[box_c.boxItem.rank][i];
    //                 if(b.getComponent(BoxDrop).boxItem.color_type === BoxType.Barrier){
    //                     return true;
    //                 }
    //             }
    //             return false;
    //         }.bind(this))();
    //         //
    //         // if(haveLeft && haveRight &&haveTop){
    //         //     console.log("这个三面都有障碍物 "+box_c.boxItem.rank +"  "+ box_c.boxItem.row);
    //         //     // return;
    //         // }else {
    //         //     return;
    //         // }
    //
    //
    //         if(box_bottom !== undefined && box_bottom.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
    //             //这个底部是空的 可以填充方块
    //
    //             //填充先 左再右
    //             if(box_Right !== undefined && box_Right.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount){
    //                 //右边位置掉落填充
    //                 console.log("右边位置 往左边填充掉落填充");
    //
    //                 //另外边界的那个障碍物
    //                 let edgeOtherBox = this.blankGetBorderBarrierBox(box);
    //
    //                 //移除 左边这个要删除的 更新新的方块的开始位置信息
    //                 this.blankRemoveItemAtRank(box_Right);
    //
    //                 //设置要替换的位置
    //                 this.blankReplaceBox(box_bottom,box_Right,edgeOtherBox);
    //
    //                 this.blankCheckReplaceBlankAvailable(box);
    //             }
    //             else if(box_left !== undefined && box_left.getComponent("BoxDrop").boxItem.color_type < BoxType.TypeCount){
    //                 //左边位置掉落填充
    //                 console.log("左边位置掉落填充 往右边填充掉落填充");
    //
    //                 //另外边界的那个障碍物
    //                 let edgeOtherBox = this.blankGetBorderBarrierBox(box);
    //
    //                 //移除 左边这个要删除的 更新新的方块的开始位置信息
    //                 this.blankRemoveItemAtRank(box_left);
    //
    //                 //设置要替换的位置
    //                 this.blankReplaceBox(box_bottom,box_left,edgeOtherBox);
    //
    //                 this.blankCheckReplaceBlankAvailable(box);
    //
    //             }
    //         }
    //     }
    // },
    //
    // //或者这个障碍物相邻在一起 另外一边的障碍物
    // blankGetBorderBarrierBox:function (box) {
    //
    //     let edge_b;// = undefined;
    //
    //     let box_c = box.getComponent("BoxDrop");
    //     let row = box_c.boxItem.row;
    //     let rank = box_c.boxItem.rank;
    //
    //     //判断这个方块的右边有没有
    //     for(let i = rank+1; i < this.num_rank; i++){
    //
    //         let b = this.rankList[i][row];
    //         if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount){
    //             break;
    //         }else if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank){
    //             edge_b = b;
    //         }
    //     }
    //     //左边
    //     for(let j = rank-1; j >= 0; j--){
    //
    //         let b = this.rankList[j][row];
    //         if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount){
    //             break;
    //         }else if(b.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank){
    //             edge_b = b;
    //         }
    //     }
    //
    //     if(edge_b !== undefined){
    //
    //         let edge_rank = edge_b.getComponent(BoxDrop).boxItem.rank;
    //         let edge_row = edge_b.getComponent(BoxDrop).boxItem.row;
    //
    //         //底下
    //         for(let k = edge_row-1; k >= 0; k--){
    //
    //             let bb = this.rankList[edge_rank][k];
    //             if(bb.getComponent(BoxDrop).boxItem.color_type < BoxType.TypeCount){
    //                 break;
    //             }else if(bb.getComponent(BoxDrop).boxItem.color_type < BoxType.Blank){
    //                 edge_b = bb;
    //             }
    //         }
    //     }
    //
    //     return edge_b;
    // },
    //
    // /*检测是否可以替换
    //  * box_c 这个要操作的方块类型  是 方块
    //  * */
    // blankCheckReplaceNormalAvailable : function (box,edgeOtherBox){
    //
    //     let box_c = box.getComponent("BoxDrop");
    //     if(box_c.boxItem.color_type < BoxType.TypeCount){
    //         //是方块
    //
    //         //这个方块的 左下方 右下方 正下方 判断是否是空位
    //         let box_bottom_left = this.rankList[box_c.boxItem.rank-1][box_c.boxItem.row-1];
    //         let box_bottom_Right = this.rankList[box_c.boxItem.rank+1][box_c.boxItem.row-1];
    //         let box_bottom_zheng = this.rankList[box_c.boxItem.rank][box_c.boxItem.row-1];
    //         if(box_bottom_zheng !== undefined &&
    //             box_bottom_zheng.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank) {
    //             //正下方是空的 往正下方 替换
    //             console.log("正下方是空的 往正下方 替换");
    //             this.blankReplaceBox(box_bottom_zheng,box,edgeOtherBox);
    //             return false;
    //         }else if(box_bottom_left !== undefined &&
    //             box_bottom_left.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
    //             //左下方是空的 往左下方 替换
    //             console.log("左下方");
    //             this.blankReplaceBox(box_bottom_left,box,edgeOtherBox);
    //             return false;
    //         }else if(box_bottom_Right !== undefined &&
    //             box_bottom_Right.getComponent("BoxDrop").boxItem.color_type === BoxType.Blank){
    //             //右下方是空的 往右下方 替换
    //             console.log("右下方");
    //             this.blankReplaceBox(box_bottom_Right,box,edgeOtherBox);
    //             return false;
    //         }
    //     }
    //
    //     return true;
    // },
    //
    //
    //
    //
    //
    //
    //
    // /*替换方块 并执行替换切换的动画效果*/
    // blankReplaceBox :function (boxBlank,boxReplace,edgeOtherBox){
    //
    //     let box_re = boxReplace.getComponent("BoxDrop");
    //     let box_bl = boxBlank.getComponent("BoxDrop");
    //
    //
    //     //设置x的位置变化的时候 点
    //     // let repeatList = box_re.boxItem.ani_point.filter(function(elem){
    //     //     return elem.x === box_bl.boxItem.begin_x;
    //     // });
    //
    //     //要取最后一个位置 来判断这个动画是够添加过
    //     let lastPoint = box_re.boxItem.ani_point[box_re.boxItem.ani_point.length - 1];
    //
    //     //存储动画的节点
    //     let isleft = box_bl.boxItem.begin_x < box_re.boxItem.begin_x;
    //     if(lastPoint === undefined || lastPoint.x !== box_bl.boxItem.begin_x){
    //         box_re.boxItem.ani_point.push({"x": box_bl.boxItem.begin_x, "y": box_bl.boxItem.end_y + box_bl.node.height,"isleft":isleft});
    //     }
    //
    //
    //     box_re.boxItem.begin_x = box_bl.boxItem.begin_x;
    //     box_re.boxItem.end_y = box_bl.boxItem.end_y;
    //
    //     // let temp_rank = box_re.boxItem.rank;
    //
    //     box_re.boxItem.row = box_bl.boxItem.row;
    //     box_re.boxItem.rank = box_bl.boxItem.rank;
    //
    //     //这个方块继续往下替换
    //     if(this.blankCheckReplaceNormalAvailable(boxReplace,edgeOtherBox)){
    //         console.log("移动完成 替换=======");
    //
    //         //占位的方块 位置替换成要移入的方块  移除这个占位方块
    //         this.rankList[box_bl.boxItem.rank][box_bl.boxItem.row] = boxReplace;
    //
    //         this.boxPool.put(box_bl.node);
    //     }
    //
    //
    //     //后面遍历的时候把他移除掉
    //     //this.rankList[temp_rank].removeByValue(this.rankList[temp_rank],boxReplace);
    //
    //
    //     // boxDrop_destroy:function(box){
    //     //
    //     //     let list = this.rankList[box.boxItem.rank];
    //     //
    //     //     list.removeByValue(list,box.node);
    //     //
    //     //     this.boxPool.put(box.node);
    //     // },
    //
    // },


    // blankRemoveItemAtRank:function (boxRemove) {
    //
    //     let box_re = boxRemove.getComponent("BoxDrop");
    //     let list = this.rankList[box_re.boxItem.rank];
    //     list.removeByValue(list,boxRemove);
    //
    //     let new_box = this.updateRankEndYIndex(box_re.boxItem.rank);
    //
    //     if(new_box !== null){
    //
    //         let box_c = new_box.getComponent("BoxDrop");
    //         if(box_c.node.y !== box_c.boxItem.end_y){
    //
    //             if((this.gamestate === Game_State.Start) || (box_c.node.y >= box_c.boxItem.begin_y)){
    //
    //                 //他本身是最后一个 跟倒数第二个对比
    //                 let last_box = list[list.length-2];
    //                 if(last_box !== undefined){
    //                     box_c.boxItem.begin_y = last_box.getComponent("BoxDrop").boxItem.begin_y + box_c.node.height + 10*list.length;
    //                 }
    //                 else {
    //                     box_c.boxItem.begin_y = this.margin_top + space_top;
    //                     box_c.node.y = box_c.boxItem.begin_y;
    //                 }
    //                 box_c.node.y = box_c.boxItem.begin_y;
    //             }
    //
    //             //是要掉落的
    //             if(this.gamestate === Game_State.Play ||
    //                 this.gamestate === Game_State.Filling ||
    //                 this.gamestate === Game_State.Start){
    //                 box_c.state_b = BoxState.EFalling;
    //             }
    //         }else{
    //             box_c.state_b = BoxState.EFalled;
    //         }
    //
    //     }
    // },
    


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

        if(this.gamestate !== Game_State.Start){

            //不是初始化游戏的  填充 障碍物下方的方块
            this.blankBeginFill();

        }

        //看该列的数量是否 小于 this.num_row  少于的话则补充
        for(let i = 0; i<this.num_rank; i++){

            this.updateRankEndYIndex(i);
        }

        this.updateAllBeginOriginY();

        if(this.gamestate === Game_State.Start){
            this.checkPanelEliminatable();
        }
    },

    /*更新某列的数据*/
    updateRankEndYIndex:function(index){

        let createBox = null;

        let origin_x = this.margin_left + (this.itemWidth+this.itemSpace)*index;

        let list_sub = this.rankList[index];

        while(list_sub.length < this.num_row){

            let new_box = this.boxDrop_get();
            new_box.active = true;
            new_box.width = this.itemWidth;
            new_box.height = this.itemHeight;

            let box_c = new_box.getComponent("BoxDrop");
            box_c.state_b = BoxState.ENormal;

            box_c.initBoxItem();

            box_c.boxItem.begin_x = origin_x;
            box_c.boxItem.begin_y = this.margin_top;
            box_c.boxItem.rank = index;
            box_c.boxItem.row = 0;
            box_c.boxItem.color_type = (cc.random0To1()*5) | 0;
            box_c.resetOriginPos();

            new_box.parent = this.super_node;

            list_sub.push(new_box);


            createBox = new_box;
        }


        let end_box_y = this.margin_bottom;

        //更新每个元素的end y 位置
        for (let i = 0; i<list_sub.length; i++){

            let item_box = list_sub[i];
            let box_c = item_box.getComponent("BoxDrop");
            box_c.boxItem.row = i;
            box_c.boxItem.end_y = this.margin_bottom + (this.itemHeight+this.itemSpace)*i;
        }


        return createBox;
    },


    /**
     * 更新每一列他们中的每个元素的初始的origin y的值
     */
    updateAllBeginOriginY:function () {


        /**
         * 某一列中 从最后开始遍历返回
         * 算出开始掉了的位置
         */
        for (let i = 0; i<this.num_rank; i++){
            let list = this.rankList[i];

            //判断是否 已达到他的endy 如果还未达到就是 正要掉落
            let off_top = 0;
            let space_top = 5;

            for(let j = 0; j<this.num_row; j++){
                let box = list[j];

                let box_c = box.getComponent("BoxDrop");
                //box_c.boxItem.begin_y = this.margin_top;

                if(box_c.node.y !== box_c.boxItem.end_y){

                    /**
                     * 1.实例游戏的时候 初始开始的位置
                     * 2.消除的 方块不在界面中的设置他的开始位置 已在界面中的不去设置他
                     */
                    if(((this.gamestate === Game_State.Start) || (box_c.node.y >= box_c.boxItem.begin_y)) &&
                        box_c.boxItem.color_type < BoxType.TypeCount){

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

                    let haveTop = this.blankTopBoxExit(elem);

                    if(haveTop){
                        //如果这个方块顶部是有障碍物的话 这个方块不销毁 将它设置成 Blank类型
                        box.boxSpeciallyShow(BoxType.Blank);
                    }else {
                        box.state_b = BoxState.EDestroy;
                    }

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




    /*是否开启调试*/
    gameShowDebugMessage:function () {

        YHDebug = !YHDebug;

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


