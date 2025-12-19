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
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
  
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
        console.log('Session state:', state);
        setSessionState(state);
        if (state === SessionState.DISCONNECTED) {
          session.removeAllListeners();
          session.voiceChat.removeAllListeners();
          setIsStreamReady(false);
          setVoiceChatActive(false);
        }
      });

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        console.log('Stream ready!');
        setIsStreamReady(true);
        setIsLoading(false);
        if (videoRef.current) {
          session.attach(videoRef.current);
          // Try to play video - might need user interaction on mobile
          videoRef.current.play().catch(() => {
            console.log('Autoplay blocked, need user interaction');
            setNeedsUserInteraction(true);
          });
        }
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => setIsAvatarTalking(true));
      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => setIsAvatarTalking(false));

      session.voiceChat.on(VoiceChatEvent.STATE_CHANGED, (state: VoiceChatState) => {
        setVoiceChatActive(state === VoiceChatState.ACTIVE);
      });

      await session.start();
    } catch (err) {
      console.error('Session error:', err);
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

  const handleTapToPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.muted = false;
      setNeedsUserInteraction(false);
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
      {/* Header */}
      <div className="border-b border-[#d4af37]/20 py-3 md:py-4">
        <div className="container">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4cf67] transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4 md:py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Title - compact on mobile */}
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f4cf67] to-[#d4af37] bg-clip-text text-transparent">
                Sprich mit Mathias
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Dein persönlicher KI-Berater für LR Health & Beauty
            </p>
          </div>

          {/* Avatar Card */}
          <div className="bg-[#111111] rounded-xl md:rounded-2xl border border-[#d4af37]/20 overflow-hidden">
            
            {/* Video Area - Fixed aspect ratio */}
            <div className="relative bg-black aspect-[4/3] md:aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={needsUserInteraction}
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#000' }}
              />
              
              {/* Tap to play overlay for mobile */}
              {needsUserInteraction && isStreamReady && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer z-10"
                  onClick={handleTapToPlay}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-[#10b981] flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-lg">Tippen zum Abspielen</p>
                    <p className="text-gray-300 text-sm">Audio aktivieren</p>
                  </div>
                </div>
              )}
              
              {/* Loading/Not connected overlay */}
              {!isStreamReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-[#d4af37] text-base md:text-lg">Verbinde...</p>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10 border-2 border-[#d4af37]/40 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 md:w-12 md:h-12 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-white mb-1">Mathias</h2>
                      <p className="text-gray-400 text-sm">Bereit für dein Gespräch</p>
                    </div>
                  )}
                </div>
              )}

              {/* Status badges */}
              {isStreamReady && !needsUserInteraction && (
                <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex justify-between pointer-events-none">
                  {isAvatarTalking && (
                    <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 md:px-3 md:py-2 rounded-full">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></div>
                      <span className="text-[#d4af37] text-xs md:text-sm font-medium">Spricht</span>
                    </div>
                  )}
                  {voiceChatActive && (
                    <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 md:px-3 md:py-2 rounded-full ml-auto">
                      <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                      <span className="text-[#10b981] text-xs md:text-sm font-medium">Mikrofon</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Start Button */}
            {!isStreamReady && !isLoading && (
              <div className="p-4 md:p-6 bg-[#0d0d0d]">
                <button
                  onClick={handleStart}
                  className="w-full flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 md:py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#10b981]/20 text-base md:text-lg"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Gespräch starten
                </button>
              </div>
            )}

            {/* Controls when connected */}
            {isStreamReady && (
              <div className="p-3 md:p-4 bg-[#0d0d0d] space-y-3">
                
                {/* Text Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Nachricht schreiben..."
                    className="flex-1 bg-[#1a1a1a] text-white px-3 py-2.5 md:px-4 md:py-3 rounded-lg border border-[#333] focus:border-[#d4af37]/50 focus:outline-none text-sm md:text-base placeholder-gray-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-[#10b981] hover:bg-[#059669] disabled:bg-[#333] text-white font-semibold px-4 md:px-5 py-2.5 md:py-3 rounded-lg transition-all disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    Senden
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleToggleVoiceChat}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-all text-sm ${
                      voiceChatActive 
                        ? 'bg-[#10b981] text-white' 
                        : 'bg-[#1a1a1a] text-gray-300 border border-[#333]'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                    {voiceChatActive ? 'Mikro aus' : 'Mikro an'}
                  </button>
                  
                  <button
                    onClick={handleInterrupt}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium bg-[#1a1a1a] text-gray-300 border border-[#333] transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                    Stopp
                  </button>
                  
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium bg-red-900/30 text-red-400 border border-red-900/50 transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Ende
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-center text-sm">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="ml-3 underline"
              >
                Schließen
              </button>
            </div>
          )}

          {/* Quick Tips - only on desktop */}
          <div className="hidden md:grid grid-cols-3 gap-3 mt-6">
            <div className="bg-[#111111] border border-[#d4af37]/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <span className="text-white text-sm font-medium">Text-Chat</span>
              </div>
              <p className="text-gray-500 text-xs">Schreibe deine Fragen</p>
            </div>
            
            <div className="bg-[#111111] border border-[#d4af37]/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  </svg>
                </div>
                <span className="text-white text-sm font-medium">Sprach-Chat</span>
              </div>
              <p className="text-gray-500 text-xs">Sprich direkt mit Mathias</p>
            </div>
            
            <div className="bg-[#111111] border border-[#d4af37]/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-white text-sm font-medium">24/7</span>
              </div>
              <p className="text-gray-500 text-xs">Immer für dich da</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
