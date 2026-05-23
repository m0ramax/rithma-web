"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconBrandSpotify,
  IconBrandYoutube,
  IconBrandDeezer,
  IconRefresh,
  IconArrowRight,
  IconLoader2,
  IconExternalLink,
  IconMusic,
  IconPlugConnected,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AllPlaylistsResponse, Playlist } from "@/types/playlist.types";
import type { TransferResult } from "@/types/transfer.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── State types ──────────────────────────────────────────────────────────────

type FetchState =
  | { status: "loading" }
  | { status: "ok"; data: AllPlaylistsResponse }
  | { status: "error" }
  | { status: "unauthorized" };

type TransferPhase =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success"; result: TransferResult }
  | { phase: "error"; message: string };

interface DialogData {
  open: boolean;
  playlist: Playlist | null;
  sourcePlatform: Platform;
}

// ─── Platform config ──────────────────────────────────────────────────────────

type Platform = "spotify" | "youtube" | "deezer" | "apple";

const PLATFORM_LABELS: Record<Platform, string> = {
  spotify: "Spotify",
  youtube: "YouTube",
  deezer: "Deezer",
  apple: "Apple Music",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  spotify: "#1DB954",
  youtube: "#FF4040",
  deezer: "#EF5466",
  apple: "#FC3C44",
};

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  spotify: <IconBrandSpotify size={16} stroke={1.5} />,
  youtube: <IconBrandYoutube size={16} stroke={1.5} />,
  deezer:  <IconBrandDeezer  size={16} stroke={1.5} />,
  apple:   <IconMusic        size={16} stroke={1.5} />,
};

const ALL_PLATFORMS: Platform[] = ["spotify", "youtube", "deezer", "apple"];

// Target platform: first platform that is NOT source and HAS data
function pickTarget(source: Platform, data: AllPlaylistsResponse): Platform {
  const candidates: Platform[] = ALL_PLATFORMS.filter(
    (p) => p !== source && data[p] !== null,
  );
  return candidates[0] ?? (source === "spotify" ? "youtube" : "spotify");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlaylistsPage() {
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [dialog, setDialog] = useState<DialogData>({
    open: false,
    playlist: null,
    sourcePlatform: "spotify",
  });
  const [transfer, setTransfer] = useState<TransferPhase>({ phase: "idle" });

  const fetchPlaylists = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch(`${API_URL}/playlists?platform=all`);
      if (res.status === 401) { setState({ status: "unauthorized" }); return; }
      if (!res.ok) { setState({ status: "error" }); return; }
      const data = (await res.json()) as AllPlaylistsResponse;
      setState({ status: "ok", data });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => { fetchPlaylists(); }, [fetchPlaylists]);

  function openDialog(playlist: Playlist, sourcePlatform: Platform) {
    setTransfer({ phase: "idle" });
    setDialog({ open: true, playlist, sourcePlatform });
  }

  function closeDialog() {
    if (transfer.phase === "loading") return;
    setDialog((d) => ({ ...d, open: false }));
  }

  const targetPlatform =
    state.status === "ok"
      ? pickTarget(dialog.sourcePlatform, state.data)
      : (dialog.sourcePlatform === "spotify" ? "youtube" : "spotify");

  async function handleTransfer() {
    if (!dialog.playlist) return;
    setTransfer({ phase: "loading" });
    try {
      const res = await fetch(`${API_URL}/playlists/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePlaylistId: dialog.playlist.id,
          sourcePlatform: dialog.sourcePlatform,
          targetPlatform,
        }),
      });

      const body = await res.json() as TransferResult | { message: string };

      if (!res.ok) {
        const msg = "message" in body ? body.message : "Error inesperado";
        setTransfer({ phase: "error", message: String(msg) });
        return;
      }

      setTransfer({ phase: "success", result: body as TransferResult });
    } catch {
      setTransfer({ phase: "error", message: "Error inesperado, intenta de nuevo" });
    }
  }

  const transferring = transfer.phase === "loading";

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-[#E8A020]">
          Biblioteca
        </span>
        <h1 className="font-display text-3xl font-bold text-[#F2F0EA] mt-2">
          Tus playlists
        </h1>
      </div>

      {/* Error */}
      {state.status === "error" && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-[#8A8A9E] text-sm">
            Error al cargar las playlists. Comprueba tu conexión.
          </p>
          <Button
            onClick={fetchPlaylists}
            className="bg-[#22222E] text-[#F2F0EA] hover:bg-[#E8A020] hover:text-[#0C0C0F] border-0 text-sm"
          >
            <IconRefresh size={14} className="mr-1.5" />
            Reintentar
          </Button>
        </div>
      )}

      {/* Unauthorized */}
      {state.status === "unauthorized" && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="text-[#8A8A9E] text-sm">
            Necesitas conectar al menos una plataforma para ver tus playlists.
          </p>
          <Link
            href="/connect"
            className="text-sm text-[#E8A020] underline-offset-4 hover:underline font-mono"
          >
            Ir a Conectar →
          </Link>
        </div>
      )}

      {/* Content — 2×2 grid */}
      {(state.status === "loading" || state.status === "ok") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {ALL_PLATFORMS.map((platform) => (
            <PlatformColumn
              key={platform}
              platform={platform}
              playlists={
                state.status === "ok"
                  ? state.data[platform]
                  : undefined
              }
              loading={state.status === "loading"}
              onTransfer={(playlist) => openDialog(playlist, platform)}
            />
          ))}
        </div>
      )}

      {/* Transfer Dialog */}
      <Dialog
        open={dialog.open}
        onOpenChange={(open) => { if (!open && !transferring) closeDialog(); }}
      >
        <DialogContent
          className="bg-[#1A1A24] border-[#252532] text-[#F2F0EA] max-w-sm"
          showCloseButton={!transferring}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-[#F2F0EA] text-lg">
              Transferir playlist
            </DialogTitle>
            <DialogDescription className="text-[#8A8A9E] text-sm leading-relaxed">
              <span className="font-medium text-[#F2F0EA]">
                &ldquo;{dialog.playlist?.name}&rdquo;
              </span>{" "}
              será copiada a {PLATFORM_LABELS[targetPlatform]} con el sufijo{" "}
              <span className="font-mono text-[#E8A020] text-xs">via Rithma</span>.
            </DialogDescription>
          </DialogHeader>

          {transfer.phase === "idle" && (
            <div className="flex items-center justify-center gap-3 py-2">
              <PlatformBadge platform={dialog.sourcePlatform} />
              <IconArrowRight size={14} className="text-[#52525E]" />
              <PlatformBadge platform={targetPlatform} />
            </div>
          )}

          {transfer.phase === "loading" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <IconLoader2 size={26} className="text-[#E8A020] animate-spin" />
              <p className="text-sm text-[#8A8A9E]">Transfiriendo canciones...</p>
            </div>
          )}

          {transfer.phase === "success" && (
            <div className="flex flex-col gap-3 py-1">
              <p className="text-sm text-[#F2F0EA]">
                Se transfirieron{" "}
                <span className="font-mono text-[#E8A020] font-medium">
                  {transfer.result.matched}
                </span>{" "}
                de{" "}
                <span className="font-mono font-medium">{transfer.result.created}</span>{" "}
                canciones.
                {transfer.result.failed > 0 && (
                  <span className="text-[#8A8A9E]">
                    {" "}({transfer.result.failed} sin match)
                  </span>
                )}
              </p>
              <a
                href={transfer.result.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#E8A020] underline-offset-4 hover:underline"
              >
                Ver en {PLATFORM_LABELS[targetPlatform]}
                <IconExternalLink size={13} />
              </a>
            </div>
          )}

          {transfer.phase === "error" && (
            <p className="text-sm text-red-400 py-1">{transfer.message}</p>
          )}

          <DialogFooter className="border-t border-[#252532] -mx-6 -mb-6 px-6 py-3 bg-transparent">
            {transfer.phase === "idle" && (
              <>
                <Button
                  variant="ghost"
                  onClick={closeDialog}
                  className="text-[#8A8A9E] hover:text-[#F2F0EA] hover:bg-[#22222E]"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleTransfer}
                  className="bg-[#E8A020] text-[#0C0C0F] hover:bg-[#d49218] border-0 font-semibold"
                >
                  Confirmar
                </Button>
              </>
            )}
            {transfer.phase === "loading" && (
              <Button disabled className="bg-[#E8A020]/30 text-[#0C0C0F] border-0 w-full">
                <IconLoader2 size={14} className="mr-1.5 animate-spin" />
                Transfiriendo...
              </Button>
            )}
            {(transfer.phase === "success" || transfer.phase === "error") && (
              <Button
                onClick={closeDialog}
                className="bg-[#22222E] text-[#F2F0EA] hover:bg-[#E8A020] hover:text-[#0C0C0F] border-0"
              >
                Cerrar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: Platform }) {
  const color = PLATFORM_COLORS[platform];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#22222E] text-sm font-mono"
      style={{ color }}
    >
      {PLATFORM_ICONS[platform]}
      <span className="text-[#F2F0EA]">{PLATFORM_LABELS[platform]}</span>
    </span>
  );
}

interface PlatformColumnProps {
  platform: Platform;
  // undefined = loading | null = not connected | Playlist[] = data
  playlists: Playlist[] | null | undefined;
  loading: boolean;
  onTransfer: (playlist: Playlist) => void;
}

function PlatformColumn({ platform, playlists, loading, onTransfer }: PlatformColumnProps) {
  const color = PLATFORM_COLORS[platform];

  return (
    <div className="flex flex-col">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#252532]">
        <span style={{ color }}>{PLATFORM_ICONS[platform]}</span>
        <span
          className="font-mono text-xs tracking-[0.15em] uppercase font-medium"
          style={{ color }}
        >
          {PLATFORM_LABELS[platform]}
        </span>
        {Array.isArray(playlists) && (
          <span className="ml-auto font-mono text-xs text-[#52525E]">
            {playlists.length} playlists
          </span>
        )}
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <PlaylistSkeleton key={i} color={color} />
            ))
          : playlists === null
          ? <NotConnectedState platform={platform} color={color} />
          : playlists.length === 0
          ? <EmptyColumn platform={platform} color={color} />
          : playlists.map((playlist) => (
              <PlaylistRow
                key={playlist.id}
                playlist={playlist}
                platformColor={color}
                onTransfer={() => onTransfer(playlist)}
              />
            ))
        }
      </div>
    </div>
  );
}

function NotConnectedState({ platform, color }: { platform: Platform; color: string }) {
  return (
    <div className="flex flex-col items-start gap-2 py-6">
      <div className="flex items-center gap-2 mb-1">
        <IconPlugConnected size={14} className="text-[#52525E]" />
        <span className="text-sm text-[#52525E]">No conectado</span>
      </div>
      <Link
        href="/connect"
        className="text-xs font-mono underline-offset-4 hover:underline"
        style={{ color }}
      >
        Conectar {PLATFORM_LABELS[platform]} →
      </Link>
    </div>
  );
}

function EmptyColumn({ platform, color }: { platform: Platform; color: string }) {
  return (
    <div className="flex flex-col items-start gap-2 py-6">
      <div
        className="w-[3px] h-6 rounded-full mb-1"
        style={{ backgroundColor: `${color}30` }}
      />
      <p className="text-sm text-[#52525E]">
        No hay playlists en {PLATFORM_LABELS[platform]}.
      </p>
    </div>
  );
}

function PlaylistRow({
  playlist,
  platformColor,
  onTransfer,
}: {
  playlist: Playlist;
  platformColor: string;
  onTransfer: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-md hover:bg-[#13131A] transition-colors border-b border-[#252532] last:border-0">
      <div
        className="w-[3px] h-9 rounded-full shrink-0"
        style={{ backgroundColor: `${platformColor}60` }}
      />
      <div className="relative size-10 rounded bg-[#22222E] shrink-0 overflow-hidden">
        {playlist.imageUrl ? (
          <Image
            src={playlist.imageUrl}
            alt={playlist.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <PlaylistInitials name={playlist.name} platformColor={platformColor} />
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-sm font-medium text-[#F2F0EA] truncate">{playlist.name}</span>
        <span className="text-xs font-mono text-[#52525E]">{playlist.trackCount} tracks</span>
      </div>
      <button
        onClick={onTransfer}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-xs font-mono text-[#8A8A9E] hover:text-[#E8A020] transition-all px-2 py-1 rounded border border-transparent hover:border-[#E8A020]/25"
      >
        transferir →
      </button>
    </div>
  );
}

function PlaylistInitials({ name, platformColor }: { name: string; platformColor: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="size-full flex items-center justify-center bg-[#22222E]">
      <span className="text-xs font-semibold font-mono" style={{ color: platformColor }}>
        {initials}
      </span>
    </div>
  );
}

function PlaylistSkeleton({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#252532] last:border-0">
      <div
        className="w-[3px] h-9 rounded-full shrink-0"
        style={{ backgroundColor: `${color}25` }}
      />
      <div className="size-10 rounded shrink-0 shimmer" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-3/4 rounded shimmer" />
        <div className="h-2.5 w-1/5 rounded shimmer" />
      </div>
    </div>
  );
}
