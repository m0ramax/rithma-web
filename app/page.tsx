import Link from "next/link";
import { PlatformViz } from "@/components/platform-viz";

const MARQUEE_ITEMS = [
  "Spotify",
  "YouTube Music",
  "Apple Music",
  "Deezer",
  "Transferencia entre plataformas",
  "Estadísticas cross-platform",
  "Playlists unificadas",
  "Sin cambiar de app",
  "Spotify Wrapped para todos",
  "Tu música, tu forma",
];

export default function Home() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-start md:items-center px-6 py-8 md:py-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-[3fr_3fr] gap-6 md:gap-12 lg:gap-16 items-center">

          {/* Left: Text block */}
          <div className="flex flex-col gap-7">
            <span
              className="font-mono text-xs tracking-[0.22em] uppercase text-[#E8A020] animate-fade-up"
              style={{ animationDelay: "0ms" }}
            >
              Music Hub — Beta
            </span>

            <h1
              className="font-display font-extrabold tracking-tighter leading-[0.92] text-[#F2F0EA] animate-fade-up"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.2rem)", animationDelay: "80ms" }}
            >
              Tu música.<br />
              Todas las<br />
              plataformas.<br />
              <span className="text-[#E8A020]">Un solo lugar.</span>
            </h1>

            <p
              className="text-[#8A8A9E] text-base leading-relaxed max-w-[46ch] animate-fade-up"
              style={{ animationDelay: "160ms" }}
            >
              Rithma unifica tus playlists de Spotify, YouTube Music, Apple Music
              y Deezer. Transfiere, compara y analiza desde una sola interfaz.
            </p>

            <div
              className="flex items-center gap-3 flex-wrap animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8A020] text-[#0C0C0F] text-sm font-semibold rounded-md transition-all hover:bg-[#d49218] active:scale-[0.98]"
              >
                Conectar plataformas
              </Link>
              <Link
                href="/playlists"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#252532] text-[#8A8A9E] text-sm rounded-md transition-all hover:border-[#3A3A4E] hover:text-[#F2F0EA]"
              >
                Ver playlists →
              </Link>
            </div>

            {/* Stats strip */}
            <div
              className="flex items-center gap-8 pt-4 border-t border-[#252532] animate-fade-up"
              style={{ animationDelay: "320ms" }}
            >
              {[
                { value: "4", label: "plataformas" },
                { value: "50+", label: "playlists / cuenta" },
                { value: "∞", label: "transferencias" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-xl font-medium text-[#E8A020]">
                    {value}
                  </span>
                  <span className="text-xs text-[#52525E]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Platform convergence visualization */}
          <div className="flex items-center justify-center w-full max-w-[320px] mx-auto md:max-w-none md:mx-0">
            <PlatformViz />
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="border-t border-[#252532] py-3 overflow-hidden bg-[#0C0C0F]">
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center mx-5 text-[11px] font-mono text-[#52525E] uppercase tracking-wider"
            >
              {item}
              <span className="ml-5 text-[#E8A020] opacity-40">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
