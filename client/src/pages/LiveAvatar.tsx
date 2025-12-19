import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  LiveAvatarSession, 
  SessionState, 
  SessionEvent,
  VoiceChatState,
  VoiceChatEvent,
  AgentEventsEnum
} from '@heygen/liveavatar-web-sdk';

// API Configuration
const API_KEY = '75556a09-d9f7-11f0-a99e-066a7fa2e369';
const AVATAR_ID = '6fe2c441-ea7c-41cc-96b1-9347e953bd6c';
const CONTEXT_ID = '2e3b2daf-222f-4cd4-ab02-ff3397b5f52f';
const VOICE_ID = '1c1f2d85-d15f-431b-9e22-f6626ce44199'; // jedermannhandy

export default function LiveAvatarPage() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.INACTIVE);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [voiceChatActive, setVoiceChatActive] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (msg: string) => {
    console.log(msg);
    setDebugLog(prev => [...prev.slice(-20), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  // Get session token from API
  const getSessionToken = async () => {
    setIsLoading(true);
    setError(null);
    addLog('Getting session token...');
    
    try {
      const response = await fetch('https://api.liveavatar.com/v1/sessions/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
        body: JSON.stringify({
          mode: 'FULL',
          avatar_id: AVATAR_ID,
          avatar_persona: {
            voice_id: VOICE_ID,
            context_id: CONTEXT_ID,
            language: 'de'
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to get session token');
      }

      addLog('Session token received!');
      setSessionToken(data.data.session_token);
      return data.data.session_token;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Error: ${errorMsg}`);
      setError(errorMsg);
      setIsLoading(false);
      return null;
    }
  };

  // Initialize session with SDK
  const initializeSession = useCallback(async (token: string) => {
    addLog('Initializing LiveAvatarSession...');
    
    try {
      // Create session with voice chat enabled
      const session = new LiveAvatarSession(token, {
        voiceChat: true,
      });
      
      sessionRef.current = session;

      // Set up event listeners
      session.on(SessionEvent.SESSION_STATE_CHANGED, (state: SessionState) => {
        addLog(`Session state: ${state}`);
        setSessionState(state);
        
        if (state === SessionState.DISCONNECTED) {
          session.removeAllListeners();
          session.voiceChat.removeAllListeners();
          setIsStreamReady(false);
          setVoiceChatActive(false);
        }
      });

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        addLog('Stream ready!');
        setIsStreamReady(true);
        setIsLoading(false);
        
        // Attach video element
        if (videoRef.current) {
          addLog('Attaching video element...');
          session.attach(videoRef.current);
        }
      });

      // Avatar talking events
      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        addLog('Avatar started speaking');
        setIsAvatarTalking(true);
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        addLog('Avatar stopped speaking');
        setIsAvatarTalking(false);
      });

      // User talking events
      session.on(AgentEventsEnum.USER_SPEAK_STARTED, () => {
        addLog('User started speaking');
        setIsUserTalking(true);
      });

      session.on(AgentEventsEnum.USER_SPEAK_ENDED, () => {
        addLog('User stopped speaking');
        setIsUserTalking(false);
      });

      // Voice chat events
      session.voiceChat.on(VoiceChatEvent.STATE_CHANGED, (state: VoiceChatState) => {
        addLog(`Voice chat state: ${state}`);
        setVoiceChatActive(state === VoiceChatState.ACTIVE);
      });

      // Start the session
      addLog('Starting session...');
      await session.start();
      addLog('Session started!');
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Session error: ${errorMsg}`);
      setError(errorMsg);
      setIsLoading(false);
    }
  }, []);

  // Start avatar session
  const handleStart = async () => {
    const token = await getSessionToken();
    if (token) {
      await initializeSession(token);
    }
  };

  // Stop session
  const handleStop = () => {
    if (sessionRef.current) {
      addLog('Stopping session...');
      sessionRef.current.stop();
      sessionRef.current = null;
      setSessionToken(null);
      setIsStreamReady(false);
      setSessionState(SessionState.INACTIVE);
    }
  };

  // Send text message to avatar
  const handleSendMessage = async () => {
    if (!message.trim() || !sessionRef.current) return;
    
    addLog(`Sending message: ${message}`);
    try {
      // Use the SDK's message() method for FULL mode
      await sessionRef.current.message(message);
      addLog('Message sent!');
      setMessage('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Send error: ${errorMsg}`);
    }
  };

  // Toggle voice chat
  const handleToggleVoiceChat = async () => {
    if (!sessionRef.current) return;
    
    try {
      if (voiceChatActive) {
        addLog('Stopping voice chat...');
        await sessionRef.current.voiceChat.stop();
      } else {
        addLog('Starting voice chat...');
        await sessionRef.current.voiceChat.start();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Voice chat error: ${errorMsg}`);
    }
  };

  // Interrupt avatar
  const handleInterrupt = () => {
    if (!sessionRef.current) return;
    addLog('Interrupting avatar...');
    sessionRef.current.interrupt();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-4">
          LiveAvatar Demo
        </h1>

        {/* Status */}
        <div className="text-center mb-4 text-gray-400">
          {sessionState === SessionState.INACTIVE && 'Bereit zum Starten'}
          {sessionState === SessionState.CONNECTING && 'Verbinde...'}
          {sessionState === SessionState.CONNECTED && !isStreamReady && 'Verbunden, warte auf Stream...'}
          {sessionState === SessionState.CONNECTED && isStreamReady && 'Avatar bereit!'}
          {sessionState === SessionState.DISCONNECTED && 'Getrennt'}
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Video container */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 border-2 border-amber-500/30">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
          
          {/* Talking indicators */}
          {isStreamReady && (
            <div className="absolute top-4 left-4 flex gap-2">
              {isAvatarTalking && (
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                  Avatar spricht...
                </span>
              )}
              {isUserTalking && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  Du sprichst...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Start/Stop buttons */}
          {!sessionToken ? (
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Verbinde...' : 'Avatar starten'}
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Beenden
            </button>
          )}

          {/* Text input - always visible when connected */}
          {isStreamReady && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nachricht eingeben..."
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  Senden
                </button>
              </div>

              {/* Voice and control buttons */}
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={handleToggleVoiceChat}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    voiceChatActive 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {voiceChatActive ? '🎤 Mikrofon An' : '🎤 Mikrofon Aus'}
                </button>
                
                <button
                  onClick={handleInterrupt}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ⏹️ Unterbrechen
                </button>
              </div>
            </>
          )}
        </div>

        {/* Debug log */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
          <h3 className="text-amber-400 font-bold mb-2">Debug Log:</h3>
          <div className="text-xs text-gray-400 font-mono space-y-1">
            {debugLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Dein Avatar "Mathias" mit deiner geklonten Stimme.
          <br />
          Erlaube den Mikrofon-Zugriff für Voice Chat.
        </p>
      </div>
    </div>
  );
}
