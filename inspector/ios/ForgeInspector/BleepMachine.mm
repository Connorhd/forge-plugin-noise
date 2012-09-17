//
//  BleepMachine.mm
//  WgHeroPrototype
//
//  Created by Andy Buchanan on 05/01/2010.
//  Copyright 2010 Andy Buchanan. All rights reserved.
//

#include "BleepMachine.h"

void BleepMachine::queueCallback( AudioQueueRef outAQ, AudioQueueBufferRef outBuffer )
{
    // Render the wave

    // AudioQueueBufferRef is considered "opaque", but it's a reference to
    // an AudioQueueBuffer which is not. 
    // All the samples manipulate this, so I'm not quite sure what they mean by opaque
    // saying....
    SInt16* coreAudioBuffer = (SInt16*)outBuffer->mAudioData;

    // Specify how many bytes we're providing
    outBuffer->mAudioDataByteSize = kBufferSizeInFrames * m_outFormat.mBytesPerFrame;

    // Generate the sine waves to Signed 16-Bit Stero interleaved ( Little Endian )
    float distort = m_wave.distort;
    float phase = m_wave.phase;
    float fStep = m_wave.fStep;
	
	distort = powf(2*distort, 2);

    for( int s=0; s<kBufferSizeInFrames*2; s+=2 )
    {
        float sample = ( sinf( roundf(phase/distort)*distort ) );

        short sampleI = (int)(sample * 32767.0);

        coreAudioBuffer[s] =   sampleI;
        coreAudioBuffer[s+1] = sampleI;

        phase += fStep;
    }

    m_wave.phase = fmodf( phase, 2 * M_PI );   // Take modulus to preserve precision

    // Enqueue the buffer
    AudioQueueEnqueueBuffer( m_outAQ, outBuffer, 0, NULL ); 
}

bool BleepMachine::SetWave( float frequency, float distort )
{
    m_wave.distort = distort;
    m_wave.frequency = frequency;
    m_wave.fStep = 2 * M_PI * frequency / kSampleRate;

    return true;
}

bool BleepMachine::Initialise()
{
    m_outFormat.mSampleRate = kSampleRate;
    m_outFormat.mFormatID = kAudioFormatLinearPCM;
    m_outFormat.mFormatFlags = kAudioFormatFlagIsSignedInteger | kAudioFormatFlagIsPacked;
    m_outFormat.mFramesPerPacket = 1;
    m_outFormat.mChannelsPerFrame = 2;
    m_outFormat.mBytesPerPacket = m_outFormat.mBytesPerFrame = sizeof(UInt16) * 2;
    m_outFormat.mBitsPerChannel = 16;
    m_outFormat.mReserved = 0;

    OSStatus result = AudioQueueNewOutput(
                                          &m_outFormat,
                                          BleepMachine::staticQueueCallback,
                                          this,
                                          NULL,
                                          NULL,
                                          0,
                                          &m_outAQ
                                          );

    if ( result < 0 )
    {
        printf( "ERROR: %d\n", (int)result );
        return false;
    }

    // Allocate buffers for the audio
    UInt32 bufferSizeBytes = kBufferSizeInFrames * m_outFormat.mBytesPerFrame;

    for ( int buf=0; buf<kNumBuffers; buf++ ) 
    {
        OSStatus result = AudioQueueAllocateBuffer( m_outAQ, bufferSizeBytes, &m_buffers[ buf ] );
        if ( result )
        {
            printf( "ERROR: %d\n", (int)result );
            return false;
        }

        // Prime the buffers
        queueCallback( m_outAQ, m_buffers[ buf ] );
    }

    m_isInitialised = true;
    return true;
}

void BleepMachine::Shutdown()
{
    Stop();

    if ( m_outAQ )
    {
        // AudioQueueDispose also chucks any audio buffers it has
        AudioQueueDispose( m_outAQ, true );
    }

    m_isInitialised = false;
}

BleepMachine::BleepMachine()
: m_isInitialised(false), m_outAQ(0)
{
    for ( int buf=0; buf<kNumBuffers; buf++ ) 
    {
        m_buffers[ buf ] = NULL;
    }
}

BleepMachine::~BleepMachine()
{
    Shutdown();
}

bool BleepMachine::Start()
{
    OSStatus result = AudioQueueSetParameter( m_outAQ, kAudioQueueParam_Volume, 1.0 );
    if ( result ) printf( "ERROR: %d\n", (int)result );

    // Start the queue
    result = AudioQueueStart( m_outAQ, NULL );
    if ( result ) printf( "ERROR: %d\n", (int)result );

    return true;
}

bool BleepMachine::Stop()
{
    OSStatus result = AudioQueueStop( m_outAQ, true );
    if ( result ) printf( "ERROR: %d\n", (int)result );

    return true;
}
