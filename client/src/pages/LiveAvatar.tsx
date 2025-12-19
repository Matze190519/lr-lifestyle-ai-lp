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
const VOICE_ID = '1c1f2d85-d15f-431b-9e22-f6626ce44199';

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

  const initializeSession = useCallback(async (token: string) => {
    try {
      const session = new LiveAvatarSession(token, {
        voiceChat: true,
      });
      
      sessionRef.current = session;

      session.on(SessionEvent.SESSION_STATE_CHANGED, (state: SessionState) => {
        setSessionState(state);
        if (state === SessionState.DISCONNECTED) {
          session.removeAllListeners();
          session.voiceChat.removeAllListeners();
          setIsStreamReady(false);
          setVoiceChatActive(false);
        }
      });

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        setIsStreamReady(true);
        setIsLoading(false);
        if (videoRef.current) {
          session.attach(videoRef.current);
        }
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => setIsAvatarTalking(true));
      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => setIsAvatarTalking(false));

      session.voiceChat.on(VoiceChatEvent.STATE_CHANGED, (state: VoiceChatState) => {
        setVoiceChatActive(state === VoiceChatState.ACTIVE);
      });

      await session.start();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setIsLoading(false);
    }
  }, []);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getSessionToken();
      await initializeSession(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verbindungsfehler');
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
      setIsStreamReady(false);
      setSessionState(SessionState.INACTIVE);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionRef.current) return;
    try {
      await sessionRef.current.message(message);
      setMessage('');
    } catch (err) {
      console.error('Nachricht konnte nicht gesendet werden');
    }
  };

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

  const handleInterrupt = () => {
    if (sessionRef.current) {
      sessionRef.current.interrupt();
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header - matching landing page style */}
      <div className="border-b border-[#d4af37]/20 py-4">
        <div className="container">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4cf67] transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zur Startseite
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Title Section - matching landing page typography */}
          <div className="text-center mb-10">
            <p className="text-[#d4af37]/60 text-sm tracking-widest uppercase mb-3">
              Dein persönlicher KI-Berater
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f4cf67] to-[#d4af37] bg-clip-text text-transparent">
                Sprich mit Mathias
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Stelle deine Fragen zu LR Health & Beauty – live und persönlich.
            </p>
          </div>

          {/* Avatar Container - Card style matching landing page */}
          <div className="bg-[#111111] rounded-2xl border border-[#d4af37]/20 overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.05)]">
            
            {/* Video Area */}
            <div className="relative bg-black" style={{ minHeight: isStreamReady ? 'auto' : '200px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full object-contain ${isStreamReady ? 'aspect-video' : 'hidden'}`}
                style={{ backgroundColor: '#000' }}
              />
              
              {/* Overlay when not connected */}
              {!isStreamReady && (
                <div className="flex items-center justify-center bg-[#0a0a0a] py-8">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="text-[#d4af37] text-lg">Verbinde mit Mathias...</p>
                      <p className="text-gray-500 text-sm mt-2">Bitte warten</p>
                    </div>
                  ) : (
                    <div className="text-center px-6">
                      {/* Avatar placeholder */}
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border-2 border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 md:w-16 md:h-16 text-[#d4af37]/50" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Bereit für dein Gespräch</h2>
                      <p className="text-gray-400 text-sm md:text-base mb-6 max-w-md mx-auto">
                        Klicke auf den Button um ein Live-Gespräch mit Mathias zu starten.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Status indicators */}
              {isStreamReady && (
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  {isAvatarTalking && (
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#d4af37]/30">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></div>
                      <span className="text-[#d4af37] text-sm font-medium">Mathias spricht</span>
                    </div>
                  )}
                  {voiceChatActive && (
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#10b981]/30 ml-auto">
                      <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                      <span className="text-[#10b981] text-sm font-medium">Mikrofon aktiv</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Start Button - outside video area for mobile visibility */}
            {!isStreamReady && !isLoading && (
              <div className="p-6 border-t border-[#d4af37]/10 bg-[#0d0d0d]">
                <button
                  onClick={handleStart}
                  className="w-full inline-flex items-center justify-center gap-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-[#10b981]/30 text-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Gespräch starten
                </button>
              </div>
            )}

            {/* Controls - only when connected */}
            {isStreamReady && (
              <div className="p-6 border-t border-[#d4af37]/10 bg-[#0d0d0d]">
                
                {/* Text Input */}
                <div className="flex gap-3 mb-5">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Schreibe eine Nachricht an Mathias..."
                    className="flex-1 bg-[#1a1a1a] text-white px-5 py-3.5 rounded-lg border border-[#333] focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 placeholder-gray-500 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-[#10b981] hover:bg-[#059669] disabled:bg-[#333] disabled:text-gray-500 text-white font-semibold px-6 py-3.5 rounded-lg transition-all disabled:cursor-not-allowed"
                  >
                    Senden
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={handleToggleVoiceChat}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                      voiceChatActive 
                        ? 'bg-[#10b981] text-white' 
                        : 'bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#d4af37]/30'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93V7h2v1c0 2.76 2.24 5 5 5s5-2.24 5-5V7h2v1c0 4.08-3.06 7.44-7 7.93V19h3v2H9v-2h3v-3.07z"/>
                    </svg>
                    {voiceChatActive ? 'Mikrofon aus' : 'Mikrofon an'}
                  </button>
                  
                  <button
                    onClick={handleInterrupt}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#d4af37]/30 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                    Stopp
                  </button>
                  
                  <button
                    onClick={handleStop}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-[#1a1a1a] text-red-400 border border-red-900/30 hover:bg-red-900/20 transition-all"
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
            <div className="mt-6 bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg text-center">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="ml-4 underline hover:no-underline"
              >
                Schließen
              </button>
            </div>
          )}

          {/* Info Cards - matching landing page card style */}
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <div className="bg-[#111111] border border-[#d4af37]/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Text-Chat</h3>
              </div>
              <p className="text-gray-500 text-sm">Schreibe deine Fragen direkt an Mathias.</p>
            </div>
            
            <div className="bg-[#111111] border border-[#d4af37]/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Sprach-Chat</h3>
              </div>
              <p className="text-gray-500 text-sm">Aktiviere das Mikrofon und sprich direkt.</p>
            </div>
            
            <div className="bg-[#111111] border border-[#d4af37]/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold">24/7 verfügbar</h3>
              </div>
              <p className="text-gray-500 text-sm">Mathias ist rund um die Uhr für dich da.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
