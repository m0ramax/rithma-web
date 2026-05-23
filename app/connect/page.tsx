"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  IconBrandSpotify,
  IconBrandYoutube,
  IconBrandDeezer,
  IconCheck,
  IconX,
  IconLoader2,
  IconMusic,
} from "@tabler/icons-react";
import type {
  SpotifyStatus,
  YoutubeStatus,
  DeezerStatus,
  AppleStatus,
} from "@/types/platform.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "spotify" | "youtube" | "deezer" | "apple";

interface PlatformsState {
  spotify: SpotifyStatus;
  youtube: YoutubeStatus;
  deezer: DeezerStatus;
  apple: AppleStatus;
}

const DEFAULT_STATE: PlatformsState = {
  spotify: { connected: false, displayName: null },
  youtube: { connected: false, channelTitle: null } as YoutubeStatus,
  deezer:  { connected: false, displayName: null },
  apple:   { connected: false, displayName: null },
};

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  spotify: {
    label: "Spotify",
    color: "#1DB954",
    Icon: IconBrandSpotify,
    description: "Accede a tus playlists de Spotify",
  },
  youtube: {
    label: "YouTube Music",
    color: "#FF4040",
    Icon: IconBrandYoutube,
    description: "Accede a tus playlists de YouTube",
  },
  deezer: {
    label: "Deezer",
    color: "#EF5466",
    Icon: IconBrandDeezer,
    description: "Accede a tus playlists de Deezer",
  },
  apple: {
    label: "Apple Music",
    color: "#FC3C44",
    Icon: IconMusic,
    description: "Accede a tu biblioteca de Apple Music",
  },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConnectPage() {
  const [status, setStatus] = useState<PlatformsState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState<Platform | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sp = searchParams.get("spotify");
    const yt = searchParams.get("youtube");
    const dz = searchParams.get("deezer");
    if (sp === "success") setSuccessBanner("spotify");
    else if (yt === "success") setSuccessBanner("youtube");
    else if (dz === "success") setSuccessBanner("deezer");
    if (sp || yt || dz) router.replace("/connect", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!successBanner) return;
    const t = setTimeout(() => setSuccessBanner(null), 5000);
    return () => clearTimeout(t);
  }, [successBanner]);

  useEffect(() => {
    async function fetchStatuses() {
      try {
        const [spotifyRes, youtubeRes, deezerRes, appleRes] = await Promise.all([
          fetch(`${API_URL}/auth/spotify/status`),
          fetch(`${API_URL}/auth/youtube/status`),
          fetch(`${API_URL}/auth/deezer/status`),
          fetch(`${API_URL}/auth/apple/status`),
        ]);
        const [spotify, youtube, deezer, apple] = await Promise.all([
          spotifyRes.json() as Promise<SpotifyStatus>,
          youtubeRes.json() as Promise<YoutubeStatus>,
          deezerRes.json() as Promise<DeezerStatus>,
          appleRes.json() as Promise<AppleStatus>,
        ]);
        setStatus({ spotify, youtube, deezer, apple });
      } catch {
        // API no disponible — mantener estado por defecto
      } finally {
        setLoading(false);
      }
    }
    fetchStatuses();
  }, []);

  const connectApple = useCallback(async () => {
    setAppleLoading(true);
    try {
      // 1. Obtener Developer Token del backend
      const res = await fetch(`${API_URL}/auth/apple/developer-token`);
      const { developerToken } = await res.json() as { developerToken: string };

      // 2. Cargar MusicKit.js y obtener Music User Token
      const musicUserToken = await loadMusicKit(developerToken);
      if (!musicUserToken) return;

      // 3. Enviar Music User Token al backend
      const connectRes = await fetch(`${API_URL}/auth/apple/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ musicUserToken }),
      });

      if (connectRes.ok) {
        setStatus((s) => ({ ...s, apple: { connected: true, displayName: null } }));
        setSuccessBanner("apple");
      }
    } catch (err) {
      console.error("Error al conectar Apple Music:", err);
    } finally {
      setAppleLoading(false);
    }
  }, []);

  function getSubtitle(platform: Platform): string {
    switch (platform) {
      case "spotify":
        return status.spotify.connected
          ? (status.spotify.displayName ?? "Conectado")
          : PLATFORM_CONFIG.spotify.description;
      case "youtube":
        return status.youtube.connected
          ? ((status.youtube as YoutubeStatus).channelTitle ?? "Conectado")
          : PLATFORM_CONFIG.youtube.description;
      case "deezer":
        return status.deezer.connected
          ? (status.deezer.displayName ?? "Conectado")
          : PLATFORM_CONFIG.deezer.description;
      case "apple":
        return status.apple.connected
          ? (status.apple.displayName ?? "Conectado")
          : PLATFORM_CONFIG.apple.description;
    }
  }

  return (
    <div className="min-h-[calc(100dvh-57px)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success banner */}
        {successBanner && (
          <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-[#252532] bg-[#1A1A24] animate-fade-in">
            <div className="flex items-center gap-3">
              <span
                className="size-2 rounded-full animate-pulse-dot"
                style={{ backgroundColor: PLATFORM_CONFIG[successBanner].color }}
              />
              <span className="text-sm text-[#F2F0EA]">
                <span className="font-medium" style={{ color: PLATFORM_CONFIG[successBanner].color }}>
                  {PLATFORM_CONFIG[successBanner].label}
                </span>{" "}
                conectado correctamente.
              </span>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-[#52525E] hover:text-[#8A8A9E] transition-colors"
              aria-label="Cerrar"
            >
              <IconX size={14} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-xs tracking-[0.22em] uppercase text-[#E8A020]">
            Plataformas
          </span>
          <h1 className="font-display text-3xl font-bold text-[#F2F0EA] mt-2 mb-2">
            Conecta tus cuentas
          </h1>
          <p className="text-sm text-[#8A8A9E]">
            Vincula tus plataformas para ver y transferir tus playlists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["spotify", "youtube", "deezer", "apple"] as Platform[]).map((platform) => (
            <PlatformCard
              key={platform}
              platform={platform}
              connected={status[platform].connected}
              subtitle={loading ? "" : getSubtitle(platform)}
              connectUrl={
                platform !== "apple"
                  ? `${API_URL}/auth/${platform}`
                  : undefined
              }
              onAppleConnect={platform === "apple" ? connectApple : undefined}
              appleLoading={platform === "apple" ? appleLoading : false}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MusicKit loader ──────────────────────────────────────────────────────────

declare global {
  interface Window {
    MusicKit?: {
      configure: (config: { developerToken: string; app: { name: string; build: string } }) => void;
      getInstance: () => { authorize: () => Promise<string> };
    };
  }
}

async function loadMusicKit(developerToken: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (window.MusicKit) {
      initAndAuthorize(developerToken, resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
    script.onload = () => initAndAuthorize(developerToken, resolve);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

function initAndAuthorize(
  developerToken: string,
  resolve: (token: string | null) => void,
) {
  try {
    window.MusicKit!.configure({
      developerToken,
      app: { name: "Rithma", build: "1.0" },
    });
    window.MusicKit!.getInstance()
      .authorize()
      .then(resolve)
      .catch(() => resolve(null));
  } catch {
    resolve(null);
  }
}

// ─── PlatformCard ─────────────────────────────────────────────────────────────

interface PlatformCardProps {
  platform: Platform;
  connected: boolean;
  subtitle: string;
  connectUrl?: string;
  onAppleConnect?: () => void;
  appleLoading: boolean;
  loading: boolean;
}

function PlatformCard({
  platform,
  connected,
  subtitle,
  connectUrl,
  onAppleConnect,
  appleLoading,
  loading,
}: PlatformCardProps) {
  const { label, color, Icon } = PLATFORM_CONFIG[platform];

  return (
    <div className="relative bg-[#1A1A24] border border-[#252532] rounded-xl overflow-hidden flex flex-col gap-5 p-6 transition-colors hover:border-[#3A3A4E]">
      {/* Connected accent stripe */}
      {connected && !loading && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: color }} />
      )}

      {/* Icon row */}
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-lg bg-[#22222E]" style={{ color }}>
          <Icon size={28} stroke={1.5} />
        </div>
        {!loading && connected && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color }}>
              conectado
            </span>
            <span
              className="size-2 rounded-full animate-pulse-dot"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
      </div>

      {/* Name + subtitle */}
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-lg font-bold text-[#F2F0EA]">{label}</h2>
        <p className="text-sm text-[#8A8A9E] min-h-[1.25rem]">
          {loading ? (
            <span className="inline-block h-3 w-40 rounded shimmer" />
          ) : (
            subtitle
          )}
        </p>
      </div>

      {/* CTA */}
      {loading ? (
        <div className="h-9 rounded-md shimmer" />
      ) : connected ? (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium"
          style={{ borderColor: `${color}30`, color, backgroundColor: `${color}08` }}
        >
          <IconCheck size={14} stroke={2.5} />
          Cuenta vinculada
        </div>
      ) : platform === "apple" ? (
        <button
          onClick={onAppleConnect}
          disabled={appleLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-[#E8A020] text-[#0C0C0F] hover:bg-[#d49218] transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {appleLoading ? (
            <>
              <IconLoader2 size={14} className="animate-spin" />
              Conectando...
            </>
          ) : (
            "Conectar"
          )}
        </button>
      ) : (
        <button
          onClick={() => { window.location.href = connectUrl!; }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-[#E8A020] text-[#0C0C0F] hover:bg-[#d49218] transition-colors active:scale-[0.98]"
        >
          Conectar
        </button>
      )}
    </div>
  );
}
