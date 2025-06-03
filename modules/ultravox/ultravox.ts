'use client';

import {
  UltravoxSession,
  UltravoxSessionStatus,
  Transcript,
  UltravoxExperimentalMessageEvent,
  Role,
} from 'ultravox-client';
import { JoinUrlResponse, CallConfig } from '@/types/ultravox';
import { codeRelatedConfig } from '@/ultravox_config/.codeRelatedConfig';
import { systemDesignConfig } from '@/ultravox_config/.systemDesignConfig';
import { behavioralConfig } from '@/ultravox_config/.behavioralConfig';
import { apiHandler } from '@/core/apiHandler';

let uvSession: UltravoxSession | null = null;
const debugMessages: Set<string> = new Set(['debug']);

interface CallCallbacks {
  onStatusChange: (status: UltravoxSessionStatus | string | undefined) => void;
  onTranscriptChange: (transcripts: Transcript[] | undefined) => void;
  onDebugMessage?: (message: UltravoxExperimentalMessageEvent) => void;
}

export function toggleMute(role: Role): void {
  if (uvSession) {
    // Toggle (user) Mic
    if (role == Role.USER) {
      if (uvSession.isMicMuted) {
        uvSession.unmuteMic();
      } else {
        uvSession.muteMic();
      }
    }
    // Mute (agent) Speaker
    else {
      if (uvSession.isSpeakerMuted) {
        uvSession.unmuteSpeaker();
      } else {
        uvSession.muteSpeaker();
      }
    }
  } else {
    console.error('uvSession is not initialized.');
  }
}

async function createCall(
  callConfig: CallConfig,
  showDebugMessages?: boolean
): Promise<JoinUrlResponse> {
  try {
    if (showDebugMessages) {
      console.log(`Using model ${callConfig.model}`);
    }

    const data = await apiHandler.post<JoinUrlResponse>(
      '/api/ultravox',
      callConfig
    );

    if (showDebugMessages) {
      console.log(`Call created. Join URL: ${data.joinUrl}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating call:', error);
    throw error;
  }
}

export async function createBehavioralCall(
  showDebugMessages?: boolean
): Promise<JoinUrlResponse> {
  return createCall(behavioralConfig.callConfig, showDebugMessages);
}

export async function createSystemDesignCall(
  showDebugMessages?: boolean
): Promise<JoinUrlResponse> {
  return createCall(
    systemDesignConfig('defaultTechnologyStack').callConfig,
    showDebugMessages
  );
}

export async function createCodeInterviewCall(
  programmingLanguage: string,
  showDebugMessages?: boolean
): Promise<JoinUrlResponse> {
  return createCall(
    codeRelatedConfig(programmingLanguage).callConfig,
    showDebugMessages
  );
}

export async function startCall(
  callbacks: CallCallbacks,
  callConfig: CallConfig,
  showDebugMessages?: boolean
): Promise<void> {
  const callData = await createCall(callConfig, showDebugMessages);
  const joinUrl = callData.joinUrl;

  if (!joinUrl && !uvSession) {
    console.error('Join URL is required');
    return;
  } else {
    console.log('Joining call:', joinUrl);

    // Start up our Ultravox Session
    uvSession = new UltravoxSession({ experimentalMessages: debugMessages });

    if (showDebugMessages) {
      console.log('uvSession created:', uvSession);
      console.log(
        'uvSession methods:',
        Object.getOwnPropertyNames(Object.getPrototypeOf(uvSession))
      );
    }

    if (uvSession) {
      uvSession.addEventListener('status', () => {
        callbacks.onStatusChange(uvSession?.status);
      });

      uvSession.addEventListener('transcripts', () => {
        callbacks.onTranscriptChange(uvSession?.transcripts);
      });

      uvSession.addEventListener('experimental_message', (event: Event) => {
        const msg = event as UltravoxExperimentalMessageEvent;
        callbacks?.onDebugMessage?.(msg);
      });

      uvSession.joinCall(joinUrl);
      console.log('Session status:', uvSession.status);
    } else {
      return;
    }
  }

  console.log('Call started!');
}

export async function endCall(): Promise<void> {
  console.log('Call ended.');

  if (uvSession) {
    uvSession.leaveCall();
    uvSession = null;
  }
}
