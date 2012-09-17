//
//  BorderControl.h
//  templateapp
//
//  Created by Connor Dunn on 18/01/2012.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "templateappViewController.h"

@interface BorderControl : NSObject {
}

+ (void)setContext:(templateappViewController *)newContext;
+ (templateappViewController *)context;
+ (void)setWebView:(UIWebView *)newWebView;
+ (UIWebView *)webView;
+ (void)runTask:(NSDictionary *)data;
+ (void)returnResult:(NSDictionary *)data;
+ (void)addAPIMethod:(NSString *)jsMethod withClass:(NSString *)className andSelector:(NSString *)selector;
+ (NSDictionary*)getAPIMethodInfo;

@end
