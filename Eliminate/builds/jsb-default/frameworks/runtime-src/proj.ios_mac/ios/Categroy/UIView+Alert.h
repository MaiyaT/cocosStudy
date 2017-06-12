//
//  UIView+Alert.h
//  SuoShi
//
//  Created by 林宁宁 on 16/1/5.
//  Copyright © 2016年 林宁宁. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (Alert)<UIAlertViewDelegate>

@property (strong, nonatomic) void(^AlertClickBlick)(NSUInteger buttonIndex, UIAlertView *alertView);

- (UIAlertView *)showAlertWithTitle:(NSString *)title message:(NSString *)message
                    completionBlock:(void (^)(NSUInteger buttonIndex, UIAlertView *alertView))block
                  cancelButtonTitle:(NSString *)cancelButtonTitle
                  otherButtonTitles:(NSArray *)otherTitles;


@end
