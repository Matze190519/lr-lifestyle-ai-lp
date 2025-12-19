import { useState, useRef, useEffect, useCallback } from "react";
import { Room, RoomEvent, Track, RemoteTrack, RemoteTrackPublication, RemoteParticipant, RemoteVideoTrack, RemoteAudioTrack } from "livekit-client";

// LiveAvatar Configuration
const LIVEAVATAR_API_KEY = "75556a09-d9f7-11f0-a99e-066a7fa2e369";
const AVATAR_ID = "6fe2c441-ea7c-41cc-96b1-9347e953bd6c";
const CONTEXT_ID = "2e3b2daf-222f-4cd4-ab02-ff3397b5f52f";
const API_URL = "https://api.liveavatar.com";

// HeyGen participant ID - this is where the avatar video/audio comes from
const HEYGEN_PARTICIPANT_ID = "heygen";

export default function LiveAvatarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Bereit zum Starten");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const mediaElementRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const remoteVideoTrackRef = useRef<RemoteVideoTrack | null>(null);
  const remoteAudioTrackRef = useRef<RemoteAudioTrack | null>(null);
  const mediaStreamRef = useRef<MediaStream>(new MediaStream());

  const addDebug = (msg: string) => {
    console.log("[LiveAvatar]", msg);
    setDebugInfo(prev => [...prev.slice(-9), msg]);
  };

  // Attach both tracks to the video element when ready
  const attachMediaToElement = useCallback(() => {
    const videoElement = mediaElementRef.current;
    const videoTrack = remoteVideoTrackRef.current;
    const audioTrack = remoteAudioTrackRef.current;
    
    if (!videoElement || !videoTrack || !audioTrack) {
      addDebug("Waiting for both tracks...");
      return;
    }
    
    addDebug("Attaching both tracks to video element");
    
    // Use MediaStream approach like the official SDK
    const mediaStream = mediaStreamRef.current;
    
    // Clear existing tracks
    mediaStream.getTracks().forEach(track => mediaStream.removeTrack(track));
    
    // Add the new tracks
    mediaStream.addTrack(videoTrack.mediaStreamTrack);
    mediaStream.addTrack(audioTrack.mediaStreamTrack);
    
    // Set the stream to the video element
    videoElement.srcObject = mediaStream;
    videoElement.play().catch(e => addDebug(`Play error: ${e.message}`));
    
    setIsStreamReady(true);
    setStatus("Avatar ist bereit!");
    addDebug("Stream attached and playing!");
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
      addDebug("Both tracks ready - attaching!");
      attachMediaToElement();
    }
  }, [attachMediaToElement]);

  // Fetch session token and start LiveKit session
  const startSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo([]);
      setIsStreamReady(false);
      setStatus("Hole Session Token...");
      addDebug("Starting session...");

      // Reset track refs
      remoteVideoTrackRef.current = null;
      remoteAudioTrackRef.current = null;
      mediaStreamRef.current = new MediaStream();

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
      addDebug(`Connecting to ${livekit_url}`);

      // Step 3: Connect to LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      // Set up event handlers BEFORE connecting
      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      
      room.on(RoomEvent.Connected, () => {
        addDebug("Connected to room!");
        setIsConnected(true);
      });
      
      room.on(RoomEvent.Disconnected, () => {
        addDebug("Disconnected from room");
        setIsConnected(false);
        setIsStreamReady(false);
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
    setStatus("Bereit zum Starten");
    setDebugInfo([]);
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
          {/* Video Element - The avatar will be displayed here */}
          <video
            ref={mediaElementRef}
            autoPlay
            playsInline
            className={`w-full h-full rounded-2xl border-2 border-amber-500/30 object-cover ${isStreamReady ? 'block' : 'hidden'}`}
            style={{ backgroundColor: "black" }}
          />

          {/* Loading/Placeholder State */}
          {!isStreamReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black rounded-2xl border-2 border-amber-500/30">
              {isLoading || isConnected ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-amber-200">{status}</p>
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
          Dein Avatar "Mathias" mit deiner geklonten Stimme.
          <br />
          <span className="text-amber-400/60">Erlaube den Mikrofon-Zugriff für Voice Chat.</span>
        </p>
      </div>
    </div>
  );
}
