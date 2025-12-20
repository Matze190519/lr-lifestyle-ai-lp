import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  LiveAvatarSession, 
  SessionState, 
  SessionEvent,
  AgentEventsEnum
} from '@heygen/liveavatar-web-sdk';
import { Mic, MicOff, Send, Phone, PhoneOff, Volume2, AlertCircle, ArrowLeft } from 'lucide-react';

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
        voiceChat: false,
      });
      
      sessionRef.current = session;

      session.on(SessionEvent.SESSION_STATE_CHANGED, (state: SessionState) => {
        setSessionState(state);
        if (state === SessionState.DISCONNECTED) {
          session.removeAllListeners();
          setIsStreamReady(false);
          setVoiceChatActive(false);
        }
      });

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        setIsStreamReady(true);
        setIsLoading(false);
        
        if (videoRef.current) {
          session.attach(videoRef.current);
          videoRef.current.play().catch(console.error);
        }
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => setIsAvatarTalking(true));
      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => setIsAvatarTalking(false));

      await session.start();
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(errorMsg);
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
      const errorMsg = err instanceof Error ? err.message : 'Verbindungsfehler';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
      setIsStreamReady(false);
      setSessionState(SessionState.INACTIVE);
      setVoiceChatActive(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionRef.current) return;
    try {
      await sessionRef.current.message(message);
      setMessage('');
    } catch (err) {
      console.error('Message error:', err);
    }
  };

  const handleToggleVoiceChat = async () => {
    if (!sessionRef.current) return;
    try {
      if (voiceChatActive) {
        await sessionRef.current.voiceChat.stop();
        setVoiceChatActive(false);
      } else {
        await sessionRef.current.voiceChat.start();
        setVoiceChatActive(true);
      }
    } catch (err) {
      console.error('Voice chat error:', err);
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#d4af37]/20 py-3 flex-shrink-0">
        <div className="container">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f4cf67] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </a>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-4 md:py-8">
          <div className="max-w-lg mx-auto">
            
            {/* Title */}
            <div className="text-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-[#d4af37] via-[#f4cf67] to-[#d4af37] bg-clip-text text-transparent">
                  Mathias
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Dein KI-Berater</p>
            </div>

            {/* Avatar Card */}
            <div className="bg-[#111111] rounded-xl border border-[#d4af37]/20 overflow-hidden">
              
              {/* Video - Fixed height */}
              <div 
                className="relative bg-black"
                style={{ height: '280px' }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={false}
                  className="w-full h-full object-contain"
                  style={{ backgroundColor: '#000' }}
                />
                
                {/* Overlay */}
                {!isStreamReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                    {isLoading ? (
                      <div className="text-center">
                        <div className="w-12 h-12 border-3 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-[#d4af37] text-sm">Verbinde...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center px-4">
                        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                        <p className="text-red-400 text-sm mb-2">Fehler</p>
                        <p className="text-gray-500 text-xs mb-3">{error}</p>
                        <button
                          onClick={handleStart}
                          className="bg-[#d4af37] text-black font-semibold py-2 px-4 rounded-lg text-sm"
                        >
                          Erneut versuchen
                        </button>
                      </div>
                    ) : (
                      <div className="text-center px-4">
                        <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border-2 border-[#d4af37]/30 flex items-center justify-center mx-auto mb-3">
                          <Phone className="w-7 h-7 text-[#d4af37]/50" />
                        </div>
                        <p className="text-white text-sm mb-3">Bereit für dein Gespräch</p>
                        <button
                          onClick={handleStart}
                          className="bg-[#10b981] text-white font-semibold py-2.5 px-5 rounded-lg text-sm flex items-center justify-center gap-2 mx-auto"
                        >
                          <Phone className="w-4 h-4" />
                          Gespräch starten
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Status */}
                {isStreamReady && (
                  <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none">
                    {isAvatarTalking && (
                      <div className="flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-full">
                        <Volume2 className="w-3 h-3 text-[#d4af37] animate-pulse" />
                        <span className="text-[#d4af37] text-[10px]">Spricht</span>
                      </div>
                    )}
                    {voiceChatActive && (
                      <div className="flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-full ml-auto">
                        <Mic className="w-3 h-3 text-green-400 animate-pulse" />
                        <span className="text-green-400 text-[10px]">Mikro an</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Controls */}
              {isStreamReady && (
                <div className="p-3 bg-[#0d0d0d] space-y-2">
                  {/* Text input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Nachricht..."
                      className="flex-1 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg border border-[#333] focus:border-[#d4af37]/50 focus:outline-none text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-[#10b981] disabled:bg-[#333] text-white px-3 py-2 rounded-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleVoiceChat}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${
                        voiceChatActive 
                          ? 'bg-green-600 text-white' 
                          : 'bg-[#1a1a1a] text-gray-300 border border-[#333]'
                      }`}
                    >
                      {voiceChatActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {voiceChatActive ? 'Aus' : 'Mikro'}
                    </button>
                    
                    <button
                      onClick={handleInterrupt}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-[#1a1a1a] text-gray-300 border border-[#333]"
                    >
                      Stopp
                    </button>
                    
                    <button
                      onClick={handleStop}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50"
                    >
                      <PhoneOff className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
