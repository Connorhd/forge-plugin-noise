//
//  ForgeActivity.h
//  templateapp
//
//  Created by Connor Dunn on 13/03/2012.
//  Copyright (c) 2012 Trigger Corp. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ForgeActivity : NSObject {
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
- (void)application:(UIApplication *)application preDidFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)newDeviceToken;
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo;
- (void)applicationDidEnterBackground:(UIApplication *)application;
- (void)applicationWillEnterForeground:(UIApplication *)application;
- (void)preFirstWebViewLoad;
- (void)firstWebViewLoad;
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url;
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation;
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation;
- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration;

@end
