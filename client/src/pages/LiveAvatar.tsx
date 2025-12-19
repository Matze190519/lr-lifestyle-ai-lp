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
const VOICE_ID = '1c1f2d85-d15f-431b-9e22-f6626ce44199'; // jedermannhandy - geklonte Stimme

export default function LiveAvatarPage() {
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.INACTIVE);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [voiceChatActive, setVoiceChatActive] = useState(false);
  
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get session token from API
  const getSessionToken = async () => {
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
      throw new Error(data.detail || data.message || 'Verbindungsfehler');
    }

    return data.data.session_token;
  };

  // Initialize session with SDK
  const initializeSession = useCallback(async (token: string) => {
    try {
      const session = new LiveAvatarSession(token, {
        voiceChat: true,
      });
      
      sessionRef.current = session;

      // Session state changes
      session.on(SessionEvent.SESSION_STATE_CHANGED, (state: SessionState) => {
        setSessionState(state);
        
        if (state === SessionState.DISCONNECTED) {
          session.removeAllListeners();
          session.voiceChat.removeAllListeners();
          setIsStreamReady(false);
          setVoiceChatActive(false);
        }
      });

      // Stream ready - attach video
      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        setIsStreamReady(true);
        setIsLoading(false);
        
        if (videoRef.current) {
          session.attach(videoRef.current);
        }
      });

      // Avatar talking events
      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        setIsAvatarTalking(true);
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        setIsAvatarTalking(false);
      });

      // Voice chat state
      session.voiceChat.on(VoiceChatEvent.STATE_CHANGED, (state: VoiceChatState) => {
        setVoiceChatActive(state === VoiceChatState.ACTIVE);
      });

      await session.start();
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(errorMsg);
      setIsLoading(false);
    }
  }, []);

  // Start avatar session
  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getSessionToken();
      await initializeSession(token);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Verbindungsfehler';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  // Stop session
  const handleStop = () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
      setIsStreamReady(false);
      setSessionState(SessionState.INACTIVE);
    }
  };

  // Send text message
  const handleSendMessage = async () => {
    if (!message.trim() || !sessionRef.current) return;
    
    try {
      await sessionRef.current.message(message);
      setMessage('');
    } catch (err) {
      console.error('Nachricht konnte nicht gesendet werden');
    }
  };

  // Toggle voice chat
  const handleToggleVoiceChat = async () => {
    if (!sessionRef.current) return;
    
    try {
      if (voiceChatActive) {
        await sessionRef.current.voiceChat.stop();
      } else {
        await sessionRef.current.voiceChat.start();
      }
    } catch (err) {
      console.error('Mikrofon-Fehler');
    }
  };

  // Interrupt avatar
  const handleInterrupt = () => {
    if (sessionRef.current) {
      sessionRef.current.interrupt();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, []);

  const isConnected = sessionState === SessionState.CONNECTED;
  const isInactive = sessionState === SessionState.INACTIVE;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/80 border-b border-amber-500/20 py-4">
        <div className="container">
          <a href="/" className="text-amber-400 hover:text-amber-300 transition-colors">
            ← Zurück zur Startseite
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Sprich mit Mathias
              </span>
            </h1>
            <p className="text-gray-400">
              Dein persönlicher KI-Berater für LR Health & Beauty
            </p>
          </div>

          {/* Avatar Video Container */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-gray-900 to-black shadow-[0_0_30px_rgba(251,191,36,0.1)]">
            
            {/* Video Element */}
            <div className="aspect-video relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={false}
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#000' }}
              />
              
              {/* Overlay when not connected */}
              {!isStreamReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-amber-400">Verbinde mit Mathias...</p>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                        <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Bereit zum Gespräch</h2>
                      <p className="text-gray-400 mb-6">Klicke auf "Gespräch starten" um mit Mathias zu sprechen</p>
                      <button
                        onClick={handleStart}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                      >
                        Gespräch starten
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Talking indicator */}
              {isStreamReady && isAvatarTalking && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full border border-amber-500/30">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-amber-400 text-sm">Mathias spricht...</span>
                  </div>
                </div>
              )}

              {/* Voice chat indicator */}
              {isStreamReady && voiceChatActive && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Mikrofon aktiv</span>
                  </div>
                </div>
              )}
            </div>

            {/* Controls - only when connected */}
            {isStreamReady && (
              <div className="p-4 bg-black/50 border-t border-amber-500/20">
                
                {/* Text Input */}
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Schreibe eine Nachricht..."
                    className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder-gray-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold px-6 py-3 rounded-xl transition-all disabled:cursor-not-allowed"
                  >
                    Senden
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={handleToggleVoiceChat}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                      voiceChatActive 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93V7h2v1c0 2.76 2.24 5 5 5s5-2.24 5-5V7h2v1c0 4.08-3.06 7.44-7 7.93V19h3v2H9v-2h3v-3.07z"/>
                    </svg>
                    {voiceChatActive ? 'Mikrofon aus' : 'Mikrofon an'}
                  </button>
                  
                  <button
                    onClick={handleInterrupt}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                    Stopp
                  </button>
                  
                  <button
                    onClick={handleStop}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-red-900/50 hover:bg-red-900 text-red-300 border border-red-700/50 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Beenden
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-xl text-center">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="ml-4 underline hover:no-underline"
              >
                Schließen
              </button>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-amber-400 text-2xl mb-2">💬</div>
              <h3 className="text-white font-medium mb-1">Text-Chat</h3>
              <p className="text-gray-500 text-sm">Schreibe deine Fragen direkt</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-amber-400 text-2xl mb-2">🎤</div>
              <h3 className="text-white font-medium mb-1">Sprach-Chat</h3>
              <p className="text-gray-500 text-sm">Aktiviere das Mikrofon zum Sprechen</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-amber-400 text-2xl mb-2">🤖</div>
              <h3 className="text-white font-medium mb-1">KI-Berater</h3>
              <p className="text-gray-500 text-sm">24/7 verfügbar für deine Fragen</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
