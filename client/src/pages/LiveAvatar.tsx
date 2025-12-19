import { useState, useRef, useEffect, useCallback } from "react";
import { Room, RoomEvent, Track, RemoteTrack, RemoteTrackPublication, RemoteParticipant } from "livekit-client";

// LiveAvatar Configuration
const LIVEAVATAR_API_KEY = "75556a09-d9f7-11f0-a99e-066a7fa2e369";
const AVATAR_ID = "6fe2c441-ea7c-41cc-96b1-9347e953bd6c";
const VOICE_ID = "1c1f2d85-d15f-431b-9e22-f6626ce44199";
const CONTEXT_ID = "2e3b2daf-222f-4cd4-ab02-ff3397b5f52f";
const API_URL = "https://api.liveavatar.com";

export default function LiveAvatarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Bereit zum Starten");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<Room | null>(null);

  const addDebug = (msg: string) => {
    console.log("[LiveAvatar]", msg);
    setDebugInfo(prev => [...prev.slice(-9), msg]);
  };

  // Handle incoming video track
  const handleTrackSubscribed = useCallback((
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) => {
    addDebug(`Track subscribed: ${track.kind} from ${participant.identity}`);
    
    if (track.kind === Track.Kind.Video) {
      addDebug("Video track received - attaching to container");
      const videoContainer = videoContainerRef.current;
      if (videoContainer) {
        // Clear previous content
        videoContainer.innerHTML = '';
        
        // Attach video directly to container
        const videoElement = track.attach();
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        videoElement.style.borderRadius = '1rem';
        videoContainer.appendChild(videoElement);
        
        setHasVideo(true);
        setStatus("Avatar Video empfangen!");
        addDebug("Video element attached successfully");
      }
    }
    
    if (track.kind === Track.Kind.Audio) {
      addDebug("Audio track received - attaching");
      // Attach audio directly - LiveKit handles this
      const audioElement = track.attach();
      document.body.appendChild(audioElement);
      addDebug("Audio element attached");
    }
  }, []);

  // Handle track unsubscribed
  const handleTrackUnsubscribed = useCallback((
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) => {
    addDebug(`Track unsubscribed: ${track.kind}`);
    track.detach();
  }, []);

  // Fetch session token and start LiveKit session
  const startSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo([]);
      setStatus("Hole Session Token...");
      addDebug("Starting session...");

      // Step 1: Get session token
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
            voice_id: VOICE_ID,
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
      addDebug(`Token response: ${JSON.stringify(tokenData.data?.session_id || 'no session_id')}`);
      
      const sessionToken = tokenData.data?.session_token;
      
      if (!sessionToken) {
        throw new Error("Kein Session Token erhalten");
      }

      setStatus("Starte Session...");
      addDebug("Got session token, starting session...");

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
      addDebug(`LiveKit URL: ${startData.data?.livekit_url}`);
      
      const { livekit_url, livekit_client_token } = startData.data;

      if (!livekit_url || !livekit_client_token) {
        throw new Error("Keine LiveKit Credentials erhalten");
      }

      setStatus("Verbinde mit LiveKit...");
      addDebug("Connecting to LiveKit room...");

      // Step 3: Connect to LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: { width: 1280, height: 720 },
        },
      });

      roomRef.current = room;

      // Set up event handlers
      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      
      room.on(RoomEvent.Connected, () => {
        addDebug("Connected to room!");
      });
      
      room.on(RoomEvent.Disconnected, () => {
        addDebug("Disconnected from room");
        setIsConnected(false);
        setHasVideo(false);
        setStatus("Verbindung getrennt");
      });

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        addDebug(`Participant connected: ${participant.identity}`);
      });

      room.on(RoomEvent.TrackPublished, (publication, participant) => {
        addDebug(`Track published: ${publication.kind} by ${participant.identity}`);
      });

      // Connect to room
      await room.connect(livekit_url, livekit_client_token);
      addDebug(`Room state: ${room.state}, participants: ${room.remoteParticipants.size}`);
      
      setIsConnected(true);
      setStatus("Verbunden - Warte auf Avatar Video...");

      // Check existing participants and their tracks
      room.remoteParticipants.forEach((participant) => {
        addDebug(`Existing participant: ${participant.identity}`);
        participant.trackPublications.forEach((publication) => {
          addDebug(`Existing track: ${publication.kind}, subscribed: ${publication.isSubscribed}`);
          if (publication.track) {
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
        setStatus("Mikrofon aktiviert - Sprich mit dem Avatar!");
        addDebug("Microphone enabled");
      } catch (micError) {
        console.warn("Mikrofon konnte nicht aktiviert werden:", micError);
        setStatus("Avatar verbunden (ohne Mikrofon)");
        addDebug(`Mic error: ${micError}`);
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
    setIsConnected(false);
    setHasVideo(false);
    setStatus("Bereit zum Starten");
    setDebugInfo([]);
    
    // Clear video container
    if (videoContainerRef.current) {
      videoContainerRef.current.innerHTML = '';
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background - Black */}
      <div className="absolute inset-0 bg-black" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
          LiveAvatar Demo
        </h1>

        {/* Status */}
        <p className="text-center text-amber-200/80 mb-6">{status}</p>

        {/* Avatar Container */}
        <div className="relative mx-auto" style={{ maxWidth: "640px", aspectRatio: "16/9" }}>
          {/* Video Container - LiveKit will attach video here */}
          <div
            ref={videoContainerRef}
            className="w-full h-full rounded-2xl border-2 border-amber-500/30 overflow-hidden"
            style={{
              backgroundColor: "black",
              minHeight: "360px",
            }}
          />

          {/* Loading/Placeholder State */}
          {!hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-amber-200">{status}</p>
                </div>
              ) : isConnected ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-amber-200">Warte auf Avatar Video...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <p className="text-amber-200 text-center">
                    Klicke auf "Start", um den Avatar zu starten
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <div className="mt-4 p-3 bg-gray-900/80 border border-gray-700 rounded-lg text-xs font-mono text-gray-400 max-h-40 overflow-y-auto">
            {debugInfo.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex justify-center gap-4">
          {!isConnected ? (
            <button
              type="button"
              onClick={startSession}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl 
                       hover:from-amber-300 hover:to-amber-500 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-amber-500/30"
            >
              {isLoading ? "Verbinde..." : "Avatar starten"}
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl 
                       hover:bg-red-500 transition-all duration-300"
            >
              Beenden
            </button>
          )}
        </div>

        {/* Info */}
        <p className="mt-8 text-center text-gray-400 text-sm">
          Dein Avatar mit deiner geklonten Stimme (jedermannhandy).
          <br />
          <span className="text-amber-400/60">Erlaube den Mikrofon-Zugriff für Voice Chat.</span>
        </p>
      </div>
    </div>
  );
}
