import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  LiveAvatarSession, 
  SessionState, 
  SessionEvent,
  VoiceChatState,
  VoiceChatEvent,
  AgentEventsEnum
} from '@heygen/liveavatar-web-sdk';
import { X, Mic, MicOff, Send, Phone, PhoneOff, Square, MessageCircle, Volume2 } from 'lucide-react';
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
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [voiceChatActive, setVoiceChatActive] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  
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
        console.log('Session state changed:', state);
        setSessionState(state);
        if (state === SessionState.DISCONNECTED) {
          session.removeAllListeners();
          session.voiceChat.removeAllListeners();
          setIsStreamReady(false);
          setVoiceChatActive(false);
        }
      });

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        console.log('Stream ready');
        setIsStreamReady(true);
        setIsLoading(false);
        if (videoRef.current) {
          session.attach(videoRef.current);
        }
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => setIsAvatarTalking(true));
      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => setIsAvatarTalking(false));
      session.on(AgentEventsEnum.USER_SPEAK_STARTED, () => setIsUserTalking(true));
      session.on(AgentEventsEnum.USER_SPEAK_ENDED, () => setIsUserTalking(false));

      session.voiceChat.on(VoiceChatEvent.STATE_CHANGED, (state: VoiceChatState) => {
        console.log('Voice chat state:', state);
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
      setVoiceChatActive(false);
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
      console.error('Mikrofon-Fehler:', err);
    }
  };

  const handleInterrupt = () => {
    if (sessionRef.current) {
      sessionRef.current.interrupt();
    }
  };

  // Cleanup on unmount or close
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

  // Don't auto-start - let user click to start
  // This avoids errors when device permissions are not available

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
          
          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-2xl md:h-auto md:max-h-[85vh] bg-[#0a0a0a] rounded-2xl border border-[#C9A86C]/30 shadow-[0_0_60px_rgba(201,168,108,0.15)] z-[101] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A86C]/20 bg-[#0d0d0d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C9A86C]/30">
                  <img 
                    src="/images/mathias-avatar.png" 
                    alt="Mathias" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/lina.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Mathias – Live Avatar</h3>
                  <p className="text-[#C9A86C]/60 text-xs">
                    {isStreamReady ? 'Online' : isLoading ? 'Verbinde...' : 'Offline'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Video Area */}
            <div className="relative flex-1 min-h-[300px] md:min-h-[400px] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={false}
                className="w-full h-full object-contain"
                style={{ backgroundColor: '#000' }}
              />
              
              {/* Overlay when not connected */}
              {!isStreamReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-[#C9A86C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-[#C9A86C] text-base">Verbinde mit Mathias...</p>
                      <p className="text-gray-500 text-sm mt-1">Bitte warten</p>
                    </div>
                  ) : error ? (
                    <div className="text-center px-6">
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-400" />
                      </div>
                      <p className="text-red-400 text-base mb-2">Verbindungsfehler</p>
                      <p className="text-gray-500 text-sm mb-4">{error}</p>
                      <button
                        onClick={handleStart}
                        className="bg-[#C9A86C] hover:bg-[#E8D5A3] text-black font-semibold py-2 px-6 rounded-lg transition-colors"
                      >
                        Erneut versuchen
                      </button>
                    </div>
                  ) : (
                    <div className="text-center px-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A86C]/20 to-[#C9A86C]/5 border-2 border-[#C9A86C]/30 flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-[#C9A86C]/50" />
                      </div>
                      <p className="text-white text-base mb-2">Bereit für dein Gespräch</p>
                      <button
                        onClick={handleStart}
                        className="bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Phone className="w-5 h-5" />
                        Gespräch starten
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Status indicators */}
              {isStreamReady && (
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    {isAvatarTalking && (
                      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#C9A86C]/30">
                        <Volume2 className="w-3 h-3 text-[#C9A86C] animate-pulse" />
                        <span className="text-[#C9A86C] text-xs font-medium">Mathias spricht</span>
                      </div>
                    )}
                    {isUserTalking && (
                      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#10b981]/30">
                        <Mic className="w-3 h-3 text-[#10b981] animate-pulse" />
                        <span className="text-[#10b981] text-xs font-medium">Du sprichst</span>
                      </div>
                    )}
                  </div>
                  {voiceChatActive && (
                    <div className="flex items-center gap-2 bg-[#10b981]/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#10b981]/30">
                      <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                      <span className="text-[#10b981] text-xs font-medium">Mikrofon aktiv</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            {isStreamReady && (
              <div className="p-4 border-t border-[#C9A86C]/10 bg-[#0d0d0d]">
                {/* Text Input (toggleable) */}
                <AnimatePresence>
                  {showTextInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-3"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Schreibe eine Nachricht..."
                          className="flex-1 bg-[#1a1a1a] text-white px-4 py-2.5 rounded-lg border border-[#333] focus:border-[#C9A86C]/50 focus:outline-none text-sm placeholder-gray-500"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                          className="bg-[#C9A86C] hover:bg-[#E8D5A3] disabled:bg-[#333] disabled:text-gray-500 text-black font-semibold px-4 py-2.5 rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                  {/* Toggle Text Input */}
                  <button
                    onClick={() => setShowTextInput(!showTextInput)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      showTextInput 
                        ? 'bg-[#C9A86C] text-black' 
                        : 'bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#C9A86C]/30'
                    }`}
                    title="Text-Chat"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>

                  {/* Voice Chat Toggle */}
                  <button
                    onClick={handleToggleVoiceChat}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      voiceChatActive 
                        ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/30' 
                        : 'bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#10b981]/30'
                    }`}
                    title={voiceChatActive ? 'Mikrofon aus' : 'Mikrofon an'}
                  >
                    {voiceChatActive ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>

                  {/* Interrupt */}
                  <button
                    onClick={handleInterrupt}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1a1a1a] text-gray-300 border border-[#333] hover:border-[#C9A86C]/30 transition-all"
                    title="Unterbrechen"
                  >
                    <Square className="w-4 h-4" />
                  </button>

                  {/* End Call */}
                  <button
                    onClick={() => {
                      handleStop();
                      onClose();
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                    title="Beenden"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>

                {/* Hint */}
                <p className="text-center text-xs text-gray-500 mt-3">
                  Aktiviere das Mikrofon um mit Mathias zu sprechen
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
