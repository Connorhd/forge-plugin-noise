//
//  alert_API.m
//  ForgeInspector
//
//  Created by Connor Dunn on 27/07/2012.
//  Copyright (c) 2012 Trigger Corp. All rights reserved.
//

#import "noise_API.h"
#include "BleepMachine.h"

BleepMachine *m_bleepMachine = nil;

@implementation noise_API

+ (void)start:(ForgeTask*)task {
	if (m_bleepMachine != nil) {
		m_bleepMachine->Stop();
	}
	m_bleepMachine = new BleepMachine;
	m_bleepMachine->Initialise();
	m_bleepMachine->Start();
	[task success:nil];
}

+ (void)setNoise:(ForgeTask*)task x:(NSNumber*)x y:(NSNumber*)y {
	m_bleepMachine->SetWave(round(200+900*[x doubleValue]), [y doubleValue]);
}

+ (void)stop:(ForgeTask*)task {
	m_bleepMachine->Stop();
}

@end
