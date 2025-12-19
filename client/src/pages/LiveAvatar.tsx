import { useState, useRef, useEffect, useCallback } from "react";

// LiveAvatar Configuration
const LIVEAVATAR_API_KEY = "75556a09-d9f7-11f0-a99e-066a7fa2e369";
const AVATAR_ID = "6fe2c441-ea7c-41cc-96b1-9347e953bd6c";
const API_URL = "https://api.liveavatar.com";

// Chroma Key Settings
const CHROMA_KEY_CONFIG = {
  minHue: 60,
  maxHue: 180,
  minSaturation: 0.10,
  threshold: 1.0,
};

export default function LiveAvatarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Fetch session token from LiveAvatar API
  const getSessionToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/v1/sessions/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": LIVEAVATAR_API_KEY,
        },
        body: JSON.stringify({
          mode: "FULL",
          avatar_id: AVATAR_ID,
          avatar_persona: {
            voice_id: "1c1f2d85-d15f-431b-9e22-f6626ce44199", // jedermannhandy - deine geklonte Stimme
            context_id: "2e3b2daf-222f-4cd4-ab02-ff3397b5f52f",
            language: "de",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      const token = data.data?.session_token;
      if (!token) {
        throw new Error("Kein Session Token in der Antwort");
      }
      setSessionToken(token);
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(`Fehler beim Verbinden: ${errorMessage}`);
      console.error("Session token error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // RGB to HSL conversion for chroma key
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s, l };
  };

  // Apply chroma key effect
  const applyChromaKey = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Match canvas size to video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const { minHue, maxHue, minSaturation, threshold } = CHROMA_KEY_CONFIG;

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const { h, s } = rgbToHsl(r, g, b);

      // Check if pixel is green (chroma key color)
      const isGreen = h >= minHue && h <= maxHue && s >= minSaturation;
      const greenDominance = g / Math.max(r, b, 1);

      if (isGreen && greenDominance >= threshold) {
        // Make pixel transparent
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(applyChromaKey);
  }, []);

  // Start chroma key processing
  const startChromaKey = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    applyChromaKey();
  }, [applyChromaKey]);

  // Stop chroma key processing
  const stopChromaKey = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Initialize LiveAvatar session
  const startSession = async () => {
    const token = await getSessionToken();
    if (!token) return;

    try {
      // Dynamic import of LiveAvatar SDK
      const { LiveAvatarSession } = await import("@heygen/liveavatar-web-sdk");
      
      const session = new LiveAvatarSession(token, {
        voiceChat: true, // Voice chat enabled for real usage
        apiUrl: API_URL,
      });

      // Attach video element
      if (videoRef.current) {
        session.attach(videoRef.current);
      }

      // Start session
      await session.start();
      setIsConnected(true);
      startChromaKey();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(`Session-Fehler: ${errorMessage}`);
      console.error("Session error:", err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopChromaKey();
    };
  }, [stopChromaKey]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background - Black */}
      <div className="absolute inset-0 bg-black" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
          LiveAvatar Demo
        </h1>

        {/* Avatar Container */}
        <div className="relative mx-auto" style={{ maxWidth: "640px", aspectRatio: "16/9" }}>
          {/* Hidden video element (source for chroma key) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={false}
            className="hidden"
            onPlay={startChromaKey}
          />

          {/* Canvas with chroma key applied (visible) */}
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-2xl"
            style={{
              backgroundColor: "black",
            }}
          />

          {/* Loading/Placeholder State */}
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-amber-200">Verbinde mit Avatar...</p>
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

        {/* Controls */}
        <div className="mt-8 flex justify-center gap-4">
          {!isConnected ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startSession();
              }}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl 
                       hover:from-amber-300 hover:to-amber-500 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-amber-500/30 relative z-50"
            >
              {isLoading ? "Verbinde..." : "Avatar starten"}
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-700 text-white font-medium rounded-xl 
                         hover:bg-gray-600 transition-all duration-300"
              >
                Neu starten
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <p className="mt-8 text-center text-gray-400 text-sm">
          Dieser Avatar verwendet Green Screen Technologie mit Chroma Key Entfernung.
        </p>
      </div>
    </div>
  );
}
