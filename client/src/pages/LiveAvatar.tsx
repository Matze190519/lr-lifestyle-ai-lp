import { useState, useRef, useEffect, useCallback } from "react";
import { Room, RoomEvent, Track, RemoteTrack, RemoteTrackPublication, RemoteParticipant, RemoteVideoTrack, RemoteAudioTrack, DataPacket_Kind } from "livekit-client";

// LiveAvatar Configuration
const LIVEAVATAR_API_KEY = "75556a09-d9f7-11f0-a99e-066a7fa2e369";
const AVATAR_ID = "6fe2c441-ea7c-41cc-96b1-9347e953bd6c";
const CONTEXT_ID = "2e3b2daf-222f-4cd4-ab02-ff3397b5f52f";
const API_URL = "https://api.liveavatar.com";

// LiveKit Topics from official SDK
const LIVEKIT_COMMAND_CHANNEL_TOPIC = "agent-control";
const LIVEKIT_SERVER_RESPONSE_CHANNEL_TOPIC = "agent-response";

// HeyGen participant ID - this is where the avatar video/audio comes from
const HEYGEN_PARTICIPANT_ID = "heygen";

// Command Event Types from official SDK
const CommandEvents = {
  AVATAR_INTERRUPT: "avatar.interrupt",
  AVATAR_SPEAK_TEXT: "avatar.speak_text",
  AVATAR_SPEAK_RESPONSE: "avatar.speak_response",
  AVATAR_START_LISTENING: "avatar.start_listening",
  AVATAR_STOP_LISTENING: "avatar.stop_listening",
};

export default function LiveAvatarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Bereit zum Starten");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [transcription, setTranscription] = useState<string>("");
  
  const mediaElementRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const remoteVideoTrackRef = useRef<RemoteVideoTrack | null>(null);
  const remoteAudioTrackRef = useRef<RemoteAudioTrack | null>(null);

  const addDebug = (msg: string) => {
    console.log("[LiveAvatar]", msg);
    setDebugInfo(prev => [...prev.slice(-9), msg]);
  };

  // Send command event to avatar via LiveKit data channel
  const sendCommandEvent = useCallback((eventType: string, data?: object) => {
    const room = roomRef.current;
    if (!room || room.state !== "connected") {
      addDebug("Cannot send event - not connected");
      return;
    }

    const commandEvent = {
      event_type: eventType,
      ...data,
    };

    addDebug(`Sending: ${eventType}`);
    const encodedData = new TextEncoder().encode(JSON.stringify(commandEvent));
    room.localParticipant.publishData(encodedData, {
      reliable: true,
      topic: LIVEKIT_COMMAND_CHANNEL_TOPIC,
    });
  }, []);

  // Send text message to avatar (avatar will respond via LLM)
  const sendTextMessage = useCallback(() => {
    if (!textInput.trim()) return;
    
    addDebug(`Sending message: ${textInput}`);
    sendCommandEvent(CommandEvents.AVATAR_SPEAK_RESPONSE, { text: textInput });
    setTextInput("");
  }, [textInput, sendCommandEvent]);

  // Toggle listening mode
  const toggleListening = useCallback(() => {
    if (isListening) {
      sendCommandEvent(CommandEvents.AVATAR_STOP_LISTENING);
      setIsListening(false);
      setStatus("Zuhören beendet");
    } else {
      sendCommandEvent(CommandEvents.AVATAR_START_LISTENING);
      setIsListening(true);
      setStatus("Ich höre zu...");
    }
  }, [isListening, sendCommandEvent]);

  // Interrupt avatar
  const interruptAvatar = useCallback(() => {
    sendCommandEvent(CommandEvents.AVATAR_INTERRUPT);
    setIsSpeaking(false);
    setStatus("Unterbrochen");
  }, [sendCommandEvent]);

  // Attach both tracks to the video element when ready
  const attachMediaToElement = useCallback(() => {
    const videoElement = mediaElementRef.current;
    const videoTrack = remoteVideoTrackRef.current;
    const audioTrack = remoteAudioTrackRef.current;
    
    if (!videoElement || !videoTrack || !audioTrack) {
      addDebug("Waiting for both tracks...");
      return;
    }
    
    addDebug("Attaching tracks to video element");
    
    // Create MediaStream with both tracks
    const mediaStream = new MediaStream();
    mediaStream.addTrack(videoTrack.mediaStreamTrack);
    mediaStream.addTrack(audioTrack.mediaStreamTrack);
    
    // Set the stream to the video element
    videoElement.srcObject = mediaStream;
    
    // Try to play with user interaction fallback
    const playVideo = async () => {
      try {
        await videoElement.play();
        addDebug("Video playing!");
      } catch (e) {
        addDebug(`Autoplay blocked - tap to play`);
        // Add click handler for mobile
        const playOnClick = () => {
          videoElement.play();
          videoElement.removeEventListener('click', playOnClick);
        };
        videoElement.addEventListener('click', playOnClick);
      }
    };
    playVideo();
    
    setIsStreamReady(true);
    setStatus("Avatar ist bereit!");
  }, []);

  // Handle incoming tracks - only from heygen participant
  const handleTrackSubscribed = useCallback((
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) => {
    addDebug(`Track: ${track.kind} from ${participant.identity}`);
    
    // Only process tracks from the heygen participant (the avatar)
    if (participant.identity !== HEYGEN_PARTICIPANT_ID) {
      addDebug(`Ignoring track from ${participant.identity}`);
      return;
    }
    
    if (track.kind === Track.Kind.Video) {
      addDebug("Got VIDEO track from heygen");
      remoteVideoTrackRef.current = track as RemoteVideoTrack;
    }
    
    if (track.kind === Track.Kind.Audio) {
      addDebug("Got AUDIO track from heygen");
      remoteAudioTrackRef.current = track as RemoteAudioTrack;
    }
    
    // Check if we have both tracks
    if (remoteVideoTrackRef.current && remoteAudioTrackRef.current) {
      addDebug("Both tracks ready!");
      attachMediaToElement();
    }
  }, [attachMediaToElement]);

  // Handle server events from avatar
  const handleDataReceived = useCallback((
    data: Uint8Array,
    participant?: RemoteParticipant,
    kind?: DataPacket_Kind,
    topic?: string
  ) => {
    if (topic !== LIVEKIT_SERVER_RESPONSE_CHANNEL_TOPIC) {
      return;
    }

    try {
      const messageString = new TextDecoder().decode(data);
      const eventMsg = JSON.parse(messageString);
      addDebug(`Event: ${eventMsg.event_type}`);

      switch (eventMsg.event_type) {
        case "user.speak_started":
          setStatus("Du sprichst...");
          break;
        case "user.speak_ended":
          setStatus("Verarbeite...");
          break;
        case "avatar.speak_started":
          setIsSpeaking(true);
          setStatus("Avatar spricht...");
          break;
        case "avatar.speak_ended":
          setIsSpeaking(false);
          setStatus("Bereit");
          break;
        case "user.transcription_ended":
          if (eventMsg.text) {
            setTranscription(`Du: ${eventMsg.text}`);
          }
          break;
        case "avatar.transcription_ended":
          if (eventMsg.text) {
            setTranscription(`Avatar: ${eventMsg.text}`);
          }
          break;
      }
    } catch (e) {
      console.error("Failed to parse event:", e);
    }
  }, []);

  // Fetch session token and start LiveKit session
  const startSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo([]);
      setIsStreamReady(false);
      setTranscription("");
      setStatus("Hole Session Token...");
      addDebug("Starting session...");

      // Reset track refs
      remoteVideoTrackRef.current = null;
      remoteAudioTrackRef.current = null;

      // Step 1: Get session token (without voice_id to use default avatar voice)
      addDebug("Requesting session token...");
      const tokenResponse = await fetch(`${API_URL}/v1/sessions/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": LIVEAVATAR_API_KEY,
        },
        body: JSON.stringify({
          mode: "FULL",
          avatar_id: AVATAR_ID,
          avatar_persona: {
            voice_id: "1c1f2d85-d15f-431b-9e22-f6626ce44199", // jedermannhandy - geklonte Stimme
            context_id: CONTEXT_ID,
            language: "de",
          },
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.message || `Token API Error: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      const sessionToken = tokenData.data?.session_token;
      
      if (!sessionToken) {
        throw new Error("Kein Session Token erhalten");
      }

      setStatus("Starte Session...");
      addDebug("Got token, starting session...");

      // Step 2: Start session to get LiveKit credentials
      const startResponse = await fetch(`${API_URL}/v1/sessions/start`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "authorization": `Bearer ${sessionToken}`,
        },
      });

      if (!startResponse.ok) {
        const errorData = await startResponse.json();
        throw new Error(errorData.message || `Start API Error: ${startResponse.status}`);
      }

      const startData = await startResponse.json();
      const { livekit_url, livekit_client_token } = startData.data;

      if (!livekit_url || !livekit_client_token) {
        throw new Error("Keine LiveKit Credentials erhalten");
      }

      setStatus("Verbinde mit LiveKit...");
      addDebug(`Connecting to LiveKit...`);

      // Step 3: Connect to LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      // Set up event handlers BEFORE connecting
      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.on(RoomEvent.DataReceived, handleDataReceived);
      
      room.on(RoomEvent.Connected, () => {
        addDebug("Connected to room!");
        setIsConnected(true);
      });
      
      room.on(RoomEvent.Disconnected, () => {
        addDebug("Disconnected from room");
        setIsConnected(false);
        setIsStreamReady(false);
        setIsListening(false);
        setStatus("Verbindung getrennt");
      });

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        addDebug(`Participant joined: ${participant.identity}`);
      });

      // Connect to room
      await room.connect(livekit_url, livekit_client_token);
      
      setStatus("Warte auf Avatar...");
      addDebug(`Room connected, ${room.remoteParticipants.size} participants`);

      // Check for existing participants and their tracks
      room.remoteParticipants.forEach((participant) => {
        addDebug(`Existing participant: ${participant.identity}`);
        participant.trackPublications.forEach((publication) => {
          if (publication.track && publication.isSubscribed) {
            handleTrackSubscribed(
              publication.track as RemoteTrack,
              publication as RemoteTrackPublication,
              participant
            );
          }
        });
      });

      // Enable microphone for voice chat
      try {
        await room.localParticipant.setMicrophoneEnabled(true);
        addDebug("Microphone enabled");
      } catch (micError) {
        addDebug(`Mic error: ${micError}`);
        // Continue without mic - text input still works
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(`Fehler: ${errorMessage}`);
      console.error("Session error:", err);
      setStatus("Fehler beim Verbinden");
      addDebug(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop session
  const stopSession = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    
    // Clean up tracks
    remoteVideoTrackRef.current = null;
    remoteAudioTrackRef.current = null;
    
    // Clear video element
    if (mediaElementRef.current) {
      mediaElementRef.current.srcObject = null;
    }
    
    setIsConnected(false);
    setIsStreamReady(false);
    setIsListening(false);
    setIsSpeaking(false);
    setStatus("Bereit zum Starten");
    setDebugInfo([]);
    setTranscription("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4">
      {/* Background - Black */}
      <div className="absolute inset-0 bg-black" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
          LiveAvatar Demo
        </h1>

        {/* Status */}
        <p className="text-center text-amber-200/80 text-sm mb-4">{status}</p>

        {/* Avatar Container */}
        <div className="relative mx-auto mb-4" style={{ maxWidth: "480px", aspectRatio: "16/9" }}>
          {/* Video Element - The avatar will be displayed here */}
          <video
            ref={mediaElementRef}
            autoPlay
            playsInline
            muted={false}
            className={`w-full h-full rounded-xl border-2 border-amber-500/30 object-cover ${isStreamReady ? 'block' : 'hidden'}`}
            style={{ backgroundColor: "black" }}
            onClick={() => mediaElementRef.current?.play()}
          />

          {/* Loading/Placeholder State */}
          {!isStreamReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black rounded-xl border-2 border-amber-500/30">
              {isLoading || isConnected ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-amber-200 text-sm">{status}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <p className="text-amber-200 text-center text-sm">
                    Klicke auf "Start"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs px-2 py-1 rounded-full animate-pulse">
              Spricht...
            </div>
          )}
        </div>

        {/* Transcription */}
        {transcription && (
          <div className="mb-4 p-3 bg-gray-900/80 border border-amber-500/30 rounded-lg text-amber-200 text-sm">
            {transcription}
          </div>
        )}

        {/* Text Input - Only show when connected */}
        {isConnected && isStreamReady && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendTextMessage()}
                placeholder="Schreibe eine Nachricht..."
                className="flex-1 px-4 py-3 bg-gray-900 border border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={sendTextMessage}
                disabled={!textInput.trim()}
                className="px-4 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Senden
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {!isConnected ? (
            <button
              type="button"
              onClick={startSession}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl 
                       hover:from-amber-300 hover:to-amber-500 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-amber-500/30"
            >
              {isLoading ? "Verbinde..." : "Avatar starten"}
            </button>
          ) : (
            <>
              {/* Voice Chat Toggle */}
              <button
                onClick={toggleListening}
                className={`px-4 py-3 font-medium rounded-xl transition-all duration-300 ${
                  isListening 
                    ? "bg-green-500 text-white animate-pulse" 
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {isListening ? "🎤 Zuhören..." : "🎤 Sprechen"}
              </button>

              {/* Interrupt Button */}
              {isSpeaking && (
                <button
                  onClick={interruptAvatar}
                  className="px-4 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-400 transition-colors"
                >
                  ⏹ Stopp
                </button>
              )}

              {/* End Session */}
              <button
                onClick={stopSession}
                className="px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-500 transition-colors"
              >
                Beenden
              </button>
            </>
          )}
        </div>

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <div className="p-3 bg-gray-900/80 border border-gray-700 rounded-lg text-xs font-mono text-gray-400 max-h-32 overflow-y-auto">
            {debugInfo.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        {/* Info */}
        <p className="mt-4 text-center text-gray-500 text-xs">
          Avatar "Mathias" • Tippe auf das Video falls es nicht automatisch startet
        </p>
      </div>
    </div>
  );
}
