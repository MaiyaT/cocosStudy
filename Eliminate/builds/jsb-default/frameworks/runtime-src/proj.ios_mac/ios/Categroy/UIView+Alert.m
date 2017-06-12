//
//  UIView+Alert.m
//  SuoShi
//
//  Created by 林宁宁 on 16/1/5.
//  Copyright © 2016年 林宁宁. All rights reserved.
//

#import "UIView+Alert.h"
#import <objc/runtime.h>


@implementation UIView (Alert)


-(void)setAlertClickBlick:(void (^)(NSUInteger, UIAlertView *))AlertClickBlick
{
    objc_setAssociatedObject(self, @selector(AlertClickBlick), AlertClickBlick, OBJC_ASSOCIATION_RETAIN);
}

-(void (^)(NSUInteger, UIAlertView *))AlertClickBlick
{
    return objc_getAssociatedObject(self, @selector(AlertClickBlick));
}

-(UIAlertView *)showAlertWithTitle:(NSString *)title message:(NSString *)message completionBlock:(void (^)(NSUInteger, UIAlertView *))block cancelButtonTitle:(NSString *)cancelButtonTitle otherButtonTitles:(NSArray *)otherTitles
{
    self.AlertClickBlick = block;
    
    UIAlertView * alertV = [[UIAlertView alloc] initWithTitle:title message:message delegate:self cancelButtonTitle:cancelButtonTitle otherButtonTitles:nil];
    
    [otherTitles enumerateObjectsUsingBlock:^(NSString * obj, NSUInteger idx, BOOL *stop) {
        
        [alertV addButtonWithTitle:obj];
        
    }];
    
    return alertV;
}

-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if(self.AlertClickBlick)
    {
        self.AlertClickBlick(buttonIndex,alertView);
    }
    
    self.AlertClickBlick = nil;
}





@end
