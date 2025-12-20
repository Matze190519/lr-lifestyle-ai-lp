import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  LiveAvatarSession, 
  SessionState, 
  SessionEvent,
  AgentEventsEnum
} from '@heygen/liveavatar-web-sdk';
import { X, Mic, MicOff, Send, Phone, PhoneOff, Volume2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// API Configuration
const API_KEY = '75556a09-d9f7-11f0-a99e-066a7fa2e369';
const AVATAR_ID = '6fe2c441-ea7c-41cc-96b1-9347e953bd6c';
const CONTEXT_ID = '2e3b2daf-222f-4cd4-ab02-ff3397b5f52f';
const VOICE_ID = '1c1f2d85-d15f-431b-9e22-f6626ce44199';

interface LiveAvatarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveAvatarPopup({ isOpen, onClose }: LiveAvatarPopupProps) {
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
          // Try to play - may need user interaction on mobile
          videoRef.current.play().catch(() => {});
        }
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        setIsAvatarTalking(true);
      });
      
      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        setIsAvatarTalking(false);
      });

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
      console.error('Message send failed');
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
    if (!isOpen && sessionRef.current) {
      handleStop();
    }
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Popup - Responsive: larger on desktop, compact on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed z-[101] bg-[#0a0a0a] rounded-2xl border border-[#C9A86C]/30 shadow-[0_0_60px_rgba(201,168,108,0.15)] overflow-hidden flex flex-col"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              // Responsive width: 600px on desktop, 95vw on mobile
              width: 'min(95vw, 600px)',
              maxHeight: '90vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A86C]/20 bg-[#0d0d0d] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C9A86C]/30 bg-[#1a1a1a]">
                  <img 
                    src="/images/mathias.png" 
                    alt="Mathias" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Mathias – Live Avatar</h3>
                  <p className="text-[#C9A86C]/60 text-xs">
                    {isStreamReady ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                      </span>
                    ) : isLoading ? 'Verbinde...' : 'Offline'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Video Area - Using aspect-video like official HeyGen demo */}
            {/* This container prevents iOS fullscreen takeover */}
            <div 
              className="relative w-full aspect-video overflow-hidden flex-shrink-0"
              style={{ 
                backgroundColor: '#000',
                maxHeight: '50vh', // Limit height on mobile
              }}
            >
              {/* Video element - EXACTLY like HeyGen official demo */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                // @ts-ignore - webkit-playsinline for older iOS
                webkit-playsinline="true"
                muted={false}
                className="w-full h-full object-contain"
                style={{ 
                  backgroundColor: '#000',
                }}
              />
              
              {/* Not connected overlay */}
              {!isStreamReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-12 h-12 border-2 border-[#C9A86C] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-[#C9A86C] text-sm">Verbinde...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center px-6">
                      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="w-7 h-7 text-red-400" />
                      </div>
                      <p className="text-red-400 text-sm mb-3">{error}</p>
                      <button
                        onClick={handleStart}
                        className="bg-[#C9A86C] hover:bg-[#E8D5A3] text-black font-semibold py-2 px-4 rounded-lg text-sm"
                      >
                        Erneut versuchen
                      </button>
                    </div>
                  ) : (
                    <div className="text-center px-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A86C]/20 to-[#C9A86C]/5 border-2 border-[#C9A86C]/30 flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-7 h-7 text-[#C9A86C]/50" />
                      </div>
                      <p className="text-white text-base mb-1">Bereit für dein Gespräch</p>
                      <p className="text-gray-400 text-xs mb-4">Klicke um ein Live-Gespräch zu starten</p>
                      <button
                        onClick={handleStart}
                        className="bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 mx-auto shadow-lg shadow-green-900/30"
                      >
                        <Phone className="w-4 h-4" />
                        Gespräch starten
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Status badges when connected */}
              {isStreamReady && (
                <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
                  {isAvatarTalking && (
                    <div className="flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-full">
                      <Volume2 className="w-3 h-3 text-[#C9A86C] animate-pulse" />
                      <span className="text-[#C9A86C] text-xs">Spricht</span>
                    </div>
                  )}
                  {voiceChatActive && (
                    <div className="flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-full ml-auto">
                      <Mic className="w-3 h-3 text-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs">Mikrofon aktiv</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls - Always visible when connected */}
            {isStreamReady && (
              <div className="p-4 bg-[#0d0d0d] border-t border-[#C9A86C]/10 flex-shrink-0 space-y-3">
                {/* Text input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Schreibe eine Nachricht..."
                    className="flex-1 bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-[#333] focus:border-[#C9A86C]/50 focus:outline-none text-sm placeholder-gray-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-[#C9A86C] hover:bg-[#E8D5A3] disabled:bg-[#333] text-black disabled:text-gray-500 font-semibold px-4 py-3 rounded-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleVoiceChat}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      voiceChatActive 
                        ? 'bg-green-600 text-white' 
                        : 'bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#C9A86C]/30'
                    }`}
                  >
                    {voiceChatActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {voiceChatActive ? 'Mikrofon aus' : 'Mikrofon an'}
                  </button>
                  
                  <button
                    onClick={handleInterrupt}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#C9A86C]/30 text-sm"
                  >
                    Stopp
                  </button>
                  
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 text-sm"
                  >
                    <PhoneOff className="w-4 h-4" />
                    Beenden
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
