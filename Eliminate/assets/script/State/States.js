

/*方块的类型*/
const BoxType = cc.Enum({
    YELLOW : -1,
    Green : -1,
    Blue : -1,
    Black : -1,
    White : -1,

    TypeCount : -1,

    Barrier : -1,       //障碍物
    Blank : -1,          //空白占位

    Count : -1
});




//方块掉落的状态
const BoxState = cc.Enum({

    // ENone : -1,      //什么都不是

    ENormal : -1,    //正常
    EFalling : -1,   //掉落
    EFalled : -1,    //掉落结束
    EDestroy : -1,   //销毁

});

//方块显示的状态
const BoxShowType = cc.Enum({

    K_Normal : -1,          //正常
    K_Select : -1,          //选中

    K_SkillAround : -1,       //销毁 周边的九个
    K_SkillRank : -1,         //销毁 该列
    K_SkillRaw : -1,          //销毁 该行
    K_SkillColor : -1,        //销毁 该色
});



//游戏进行的状态
var Game_State = cc.Enum({
    Start : -1,     //开始实例
    Filling: -1,    //方块补齐中 掉落中
    // BlankFilling : -1, //空位补充 自动掉落
    Play : -1,      //进行中
    Over : -1,      //结束
});




module.exports = {

    BoxState,
    BoxShowType,
    Game_State,
    BoxType

};