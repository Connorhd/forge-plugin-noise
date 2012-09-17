package io.trigger.forge.android.modules.noise;

import io.trigger.forge.android.core.ForgeParam;
import io.trigger.forge.android.core.ForgeTask;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;

public class API {
	private final static int sampleRate = 44100;
	private final static int numSamples = AudioTrack.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT) / 2;
	private static AudioTrack audioTrack = null;
	private static double phase = 0;
	private static double x = 0;
	private static double y = 0;
	public static void start(final ForgeTask task) {
		if (audioTrack == null) {
			audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, sampleRate,
					AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT,
					2 * numSamples, AudioTrack.MODE_STREAM);
			audioTrack.play();
			audioTrack.setPlaybackPositionUpdateListener(new AudioTrack.OnPlaybackPositionUpdateListener() {
				
				@Override
				public void onPeriodicNotification(AudioTrack track) {
					final double sample[] = new double[numSamples];
					final double freqOfTone = Math.round(200+900*x);
					final double step = 2 * Math.PI * freqOfTone / sampleRate;
	
					final byte newGeneratedSnd[] = new byte[2 * numSamples];
	
					double distortor = Math.pow(2*y, 2);
					
					// fill out the array
					for (int i = 0; i < numSamples; ++i) {
						sample[i] = Math.sin(Math.round(phase/distortor)*distortor);
						phase += step;
					}
					
					phase = phase % (Math.PI * 2);
					
					// convert to 16 bit pcm sound array
					// assumes the sample buffer is normalised.
					int idx = 0;
					for (final double dVal : sample) {
						// scale to maximum amplitude
						final short val = (short) ((dVal * 32767));
						// in 16 bit wav PCM, first byte is the low order byte
						newGeneratedSnd[idx++] = (byte) (val & 0x00ff);
						newGeneratedSnd[idx++] = (byte) ((val & 0xff00) >>> 8);
					}
					track.write(newGeneratedSnd, 0, newGeneratedSnd.length);
				}
				
				@Override
				public void onMarkerReached(AudioTrack track) {
				}
			});
			audioTrack.setPositionNotificationPeriod(numSamples);
			audioTrack.write(new byte[3 * numSamples], 0, 3 * numSamples);				
		}
		task.success();
	}
	
	public static void stop(final ForgeTask task) {
		if (audioTrack != null) {
			audioTrack.stop();
			audioTrack = null;
		}
		task.success();
	}

	public static void setNoise(final ForgeTask task, @ForgeParam("x") final double x,  @ForgeParam("y") final double y) {
		API.x = x;
		API.y = y;
		task.success();
	}
}
