

const BoxState = cc.Enum({

    ENone : -1,      //什么都不是

    ENormal : -1,    //正常
    EFalling : -1,   //掉落
    ESelect : -1,    //选中
    EDestroy : -1,   //销毁

    ESkillAround : -1,       //销毁 周边的九个
    ESkillRank : -1,         //销毁 该列
    ESkillRaw : -1,          //销毁 该行
    ESkillColor : -1,        //销毁 该色

});





module.exports = {

    BoxState

};