//
//  JSBManager.m
//  Eliminate
//
//  Created by 林宁宁 on 2017/6/12.
//
//

#import "JSBManager.h"
#import "UIView+Alert.h"
#import "cocos2d.h"

#import "ScriptingCore.h"


@implementation JSBManager

+ (NSString *)yhJSBCall:(NSString *)passValue{
    
    /**
     auto sc = ScriptingCore::getInstance();
     // JS 上下文对象
     auto context = sc->getGlobalContext();
     // 需要返回值
     JS::RootedValue outVal(context);
     sc->evalString(string, &outVal)
     // 不需要返回值
     sc->evalString(string)
     其中 string 是代码字符串
     */
    
    [[[UIApplication sharedApplication].keyWindow showAlertWithTitle:@"提醒" message:passValue completionBlock:^(NSUInteger buttonIndex, UIAlertView *alertView) {
    
        
        /**
         
         要先找到 node 再找到 component  然后再执行这个 component里面的某个 function
         
         或者 直接定义全局的 global
         
         */
        NSString * jsEval = [NSString stringWithFormat:@"cc.find(\"Game/Call\").getComponent(\"JSBCall\").ocCallJs('%@')",@"oc_to_call_js"];
        
        ScriptingCore::getInstance()->evalString([jsEval UTF8String]);
        
        
        /**
         
         js -> oc 
         //类名 方法  参数1 参数2 参数3
         var result = jsb.reflection.callStaticMethod("JSBManager","yhJSBCall:","js这边传入的参数");
         
         */
        
    } cancelButtonTitle:@"取消" otherButtonTitles:@[@"确定"]] show];
    
    
    return @"oc_return_to_js";
    
}

@end
