"use client";

import { useEffect, useRef } from "react";

// Each node gets independent sine-wave drift parameters
const ANIMATED_NODES = [
  // Satellite nodes — more drift
  { id: "sat-s1", ampX: 5,   ampY: 4,   freqX: 0.12, freqY: 0.09, phaseX: 0.0, phaseY: 1.2 },
  { id: "sat-s2", ampX: 4,   ampY: 6,   freqX: 0.09, freqY: 0.14, phaseX: 2.0, phaseY: 0.5 },
  { id: "sat-s3", ampX: 6,   ampY: 3,   freqX: 0.15, freqY: 0.11, phaseX: 1.0, phaseY: 2.0 },
  { id: "sat-s4", ampX: 3,   ampY: 5,   freqX: 0.13, freqY: 0.10, phaseX: 3.0, phaseY: 0.8 },
  { id: "sat-y1", ampX: 5,   ampY: 4,   freqX: 0.10, freqY: 0.13, phaseX: 0.5, phaseY: 1.5 },
  { id: "sat-y2", ampX: 4,   ampY: 6,   freqX: 0.14, freqY: 0.09, phaseX: 1.8, phaseY: 0.3 },
  { id: "sat-y3", ampX: 6,   ampY: 3,   freqX: 0.08, freqY: 0.15, phaseX: 0.8, phaseY: 2.5 },
  { id: "sat-y4", ampX: 3,   ampY: 4,   freqX: 0.11, freqY: 0.12, phaseX: 2.5, phaseY: 1.0 },
  { id: "sat-a1", ampX: 4,   ampY: 5,   freqX: 0.10, freqY: 0.13, phaseX: 1.2, phaseY: 2.2 },
  { id: "sat-a2", ampX: 5,   ampY: 4,   freqX: 0.13, freqY: 0.10, phaseX: 0.3, phaseY: 1.8 },
  { id: "sat-a3", ampX: 4,   ampY: 3,   freqX: 0.11, freqY: 0.15, phaseX: 2.1, phaseY: 0.7 },
  { id: "sat-d1", ampX: 4,   ampY: 5,   freqX: 0.12, freqY: 0.10, phaseX: 1.5, phaseY: 0.4 },
  { id: "sat-d2", ampX: 5,   ampY: 4,   freqX: 0.10, freqY: 0.13, phaseX: 0.7, phaseY: 2.8 },
  { id: "sat-d3", ampX: 3,   ampY: 5,   freqX: 0.15, freqY: 0.11, phaseX: 3.2, phaseY: 1.3 },
  // Platform nodes — subtle drift
  { id: "plat-sp", ampX: 2.5, ampY: 2.5, freqX: 0.07, freqY: 0.08, phaseX: 0.0, phaseY: 0.5 },
  { id: "plat-yt", ampX: 2.5, ampY: 2.5, freqX: 0.08, freqY: 0.07, phaseX: 1.0, phaseY: 1.2 },
  { id: "plat-ap", ampX: 2.0, ampY: 2.0, freqX: 0.09, freqY: 0.10, phaseX: 2.0, phaseY: 0.8 },
  { id: "plat-dz", ampX: 2.0, ampY: 2.0, freqX: 0.10, freqY: 0.09, phaseX: 1.5, phaseY: 2.0 },
] as const;

export function PlatformViz() {
  const svgRef = useRef<SVGSVGElement>(null);
  const fi = "var(--font-instrument, sans-serif)";
  const fm = "var(--font-mono, monospace)";

  useEffect(() => {
    const startTime = performance.now();
    let rafId: number;

    function animate() {
      const t = (performance.now() - startTime) / 1000;
      const svg = svgRef.current;
      if (!svg) return;

      for (const node of ANIMATED_NODES) {
        const el = svg.querySelector<SVGGElement>(`#${node.id}`);
        if (!el) continue;
        const dx = node.ampX * Math.sin(node.freqX * t * Math.PI * 2 + node.phaseX);
        const dy = node.ampY * Math.sin(node.freqY * t * Math.PI * 2 + node.phaseY);
        el.setAttribute("transform", `translate(${dx.toFixed(2)},${dy.toFixed(2)})`);
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 310"
      className="w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="hub-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="node-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Satellite edges ── */}
      <line x1="22"  y1="42"  x2="78"  y2="80"  stroke="#1DB954" strokeWidth="0.7" opacity="0.18" />
      <line x1="32"  y1="122" x2="78"  y2="80"  stroke="#1DB954" strokeWidth="0.7" opacity="0.18" />
      <line x1="112" y1="26"  x2="78"  y2="80"  stroke="#1DB954" strokeWidth="0.7" opacity="0.18" />
      <line x1="145" y1="42"  x2="78"  y2="80"  stroke="#1DB954" strokeWidth="0.7" opacity="0.12" />

      <line x1="298" y1="42"  x2="242" y2="80"  stroke="#FF4040" strokeWidth="0.7" opacity="0.18" />
      <line x1="290" y1="122" x2="242" y2="80"  stroke="#FF4040" strokeWidth="0.7" opacity="0.18" />
      <line x1="208" y1="26"  x2="242" y2="80"  stroke="#FF4040" strokeWidth="0.7" opacity="0.18" />
      <line x1="178" y1="42"  x2="242" y2="80"  stroke="#FF4040" strokeWidth="0.7" opacity="0.12" />

      <line x1="22"  y1="198" x2="78"  y2="228" stroke="#FC3C44" strokeWidth="0.7" opacity="0.10" />
      <line x1="28"  y1="268" x2="78"  y2="228" stroke="#FC3C44" strokeWidth="0.7" opacity="0.10" />
      <line x1="112" y1="278" x2="78"  y2="228" stroke="#FC3C44" strokeWidth="0.7" opacity="0.10" />

      <line x1="298" y1="198" x2="242" y2="228" stroke="#EF5466" strokeWidth="0.7" opacity="0.10" />
      <line x1="294" y1="268" x2="242" y2="228" stroke="#EF5466" strokeWidth="0.7" opacity="0.10" />
      <line x1="212" y1="278" x2="242" y2="228" stroke="#EF5466" strokeWidth="0.7" opacity="0.10" />

      {/* ── Main edges (platform → hub) ── */}
      <line x1="78"  y1="80"  x2="160" y2="155" stroke="#1DB954" strokeWidth="1"   opacity="0.38" />
      <line x1="242" y1="80"  x2="160" y2="155" stroke="#FF4040" strokeWidth="1"   opacity="0.38" />
      <line x1="78"  y1="228" x2="160" y2="155" stroke="#FC3C44" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.20" />
      <line x1="242" y1="228" x2="160" y2="155" stroke="#EF5466" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.20" />

      {/* ── Traveling signal dots ── */}
      <circle r="2" fill="#1DB954">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M 78 80 L 160 155" />
      </circle>
      <circle r="2" fill="#FF4040">
        <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.7s" path="M 242 80 L 160 155" />
      </circle>
      <circle r="1.5" fill="#FC3C44" opacity="0.5">
        <animateMotion dur="3.8s" repeatCount="indefinite" begin="1.4s" path="M 78 228 L 160 155" />
      </circle>
      <circle r="1.5" fill="#EF5466" opacity="0.5">
        <animateMotion dur="4.4s" repeatCount="indefinite" begin="2s" path="M 242 228 L 160 155" />
      </circle>

      {/* ── Satellite nodes (animated via JS transform) ── */}

      <g id="sat-s1">
        <circle cx="22"  cy="42"  r="2.5" fill="#1DB954" opacity="0.4" filter="url(#node-glow)" />
        <text x="28"  y="46"  fontSize="8" fill="#1DB954" opacity="0.45" style={{ fontFamily: fi }}>Playlists</text>
      </g>
      <g id="sat-s2">
        <circle cx="32"  cy="122" r="2.5" fill="#1DB954" opacity="0.4" filter="url(#node-glow)" />
        <text x="38"  y="126" fontSize="8" fill="#1DB954" opacity="0.45" style={{ fontFamily: fi }}>Liked Songs</text>
      </g>
      <g id="sat-s3">
        <circle cx="112" cy="26"  r="2.5" fill="#1DB954" opacity="0.4" filter="url(#node-glow)" />
        <text x="118" y="30"  fontSize="8" fill="#1DB954" opacity="0.45" style={{ fontFamily: fi }}>Podcasts</text>
      </g>
      <g id="sat-s4">
        <circle cx="145" cy="42"  r="2"   fill="#1DB954" opacity="0.30" />
      </g>

      <g id="sat-y1">
        <circle cx="298" cy="42"  r="2.5" fill="#FF4040" opacity="0.4" filter="url(#node-glow)" />
        <text x="293" y="38"  fontSize="8" fill="#FF4040" opacity="0.45" textAnchor="end" style={{ fontFamily: fi }}>Playlists</text>
      </g>
      <g id="sat-y2">
        <circle cx="290" cy="122" r="2.5" fill="#FF4040" opacity="0.4" filter="url(#node-glow)" />
        <text x="285" y="126" fontSize="8" fill="#FF4040" opacity="0.45" textAnchor="end" style={{ fontFamily: fi }}>Historial</text>
      </g>
      <g id="sat-y3">
        <circle cx="208" cy="26"  r="2.5" fill="#FF4040" opacity="0.4" filter="url(#node-glow)" />
        <text x="203" y="22"  fontSize="8" fill="#FF4040" opacity="0.45" textAnchor="end" style={{ fontFamily: fi }}>Subs</text>
      </g>
      <g id="sat-y4">
        <circle cx="178" cy="42"  r="2"   fill="#FF4040" opacity="0.30" />
      </g>

      <g id="sat-a1">
        <circle cx="22"  cy="198" r="2.5" fill="#FC3C44" opacity="0.25" />
        <text x="28"  y="202" fontSize="8" fill="#FC3C44" opacity="0.28" style={{ fontFamily: fi }}>Biblioteca</text>
      </g>
      <g id="sat-a2">
        <circle cx="28"  cy="268" r="2.5" fill="#FC3C44" opacity="0.25" />
        <text x="34"  y="272" fontSize="8" fill="#FC3C44" opacity="0.28" style={{ fontFamily: fi }}>Radio</text>
      </g>
      <g id="sat-a3">
        <circle cx="112" cy="278" r="2"   fill="#FC3C44" opacity="0.20" />
      </g>

      <g id="sat-d1">
        <circle cx="298" cy="198" r="2.5" fill="#EF5466" opacity="0.25" />
        <text x="293" y="194" fontSize="8" fill="#EF5466" opacity="0.28" textAnchor="end" style={{ fontFamily: fi }}>Favoritos</text>
      </g>
      <g id="sat-d2">
        <circle cx="294" cy="268" r="2.5" fill="#EF5466" opacity="0.25" />
        <text x="289" y="272" fontSize="8" fill="#EF5466" opacity="0.28" textAnchor="end" style={{ fontFamily: fi }}>Mixes</text>
      </g>
      <g id="sat-d3">
        <circle cx="212" cy="278" r="2"   fill="#EF5466" opacity="0.20" />
      </g>

      {/* ── Platform nodes (animated via JS transform) ── */}

      <g id="plat-sp">
        <circle cx="78"  cy="80"  r="5.5" fill="#1DB954" filter="url(#node-glow)" />
        <text x="86"  y="84"  fontSize="10" fill="#1DB954" fontWeight="500" style={{ fontFamily: fi }}>Spotify</text>
      </g>

      <g id="plat-yt">
        <circle cx="242" cy="80"  r="5.5" fill="#FF4040" filter="url(#node-glow)" />
        <text x="234" y="76"  fontSize="10" fill="#FF4040" fontWeight="500" textAnchor="end" style={{ fontFamily: fi }}>YouTube</text>
      </g>

      <g id="plat-ap">
        <circle cx="78"  cy="228" r="4"   fill="#FC3C44" opacity="0.4" />
        <text x="86"  y="224" fontSize="10" fill="#FC3C44" fontWeight="500" opacity="0.4" style={{ fontFamily: fi }}>Apple Music</text>
        <text x="86"  y="235" fontSize="7.5" fill="#FC3C44" opacity="0.3" style={{ fontFamily: fm, letterSpacing: "1px" }}>pronto</text>
      </g>

      <g id="plat-dz">
        <circle cx="242" cy="228" r="4"   fill="#EF5466" opacity="0.4" />
        <text x="234" y="224" fontSize="10" fill="#EF5466" fontWeight="500" opacity="0.4" textAnchor="end" style={{ fontFamily: fi }}>Deezer</text>
        <text x="234" y="235" fontSize="7.5" fill="#EF5466" opacity="0.3" textAnchor="end" style={{ fontFamily: fm, letterSpacing: "1px" }}>pronto</text>
      </g>

      {/* ── Hub: Rithma (fixed anchor) ── */}
      <circle cx="160" cy="155" r="18" fill="#E8A020" opacity="0.08" filter="url(#hub-glow)" />
      <circle cx="160" cy="155" r="13" fill="none" stroke="#E8A020" strokeWidth="1" opacity="0.3">
        <animate attributeName="r"       values="13;17;13" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
        <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </circle>

      {/* Animated equalizer bars — centered at (160, 155) */}
      <rect x="151.25" y="152"  width="2.5" height="6"  rx="1.25" fill="#E8A020">
        <animate attributeName="height" values="6;11;4;9;6"       dur="1.5s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
        <animate attributeName="y"      values="152;149.5;153;150.5;152" dur="1.5s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
      </rect>
      <rect x="155"    y="150.5" width="2.5" height="9"  rx="1.25" fill="#E8A020">
        <animate attributeName="height" values="9;4;12;6;9"       dur="1.2s"  begin="0.2s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
        <animate attributeName="y"      values="150.5;153;149;152;150.5" dur="1.2s"  begin="0.2s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
      </rect>
      <rect x="158.75" y="149.5" width="2.5" height="11" rx="1.25" fill="#E8A020">
        <animate attributeName="height" values="11;5;9;4;11"      dur="1.8s"  begin="0.05s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
        <animate attributeName="y"      values="149.5;152.5;150.5;153;149.5" dur="1.8s"  begin="0.05s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
      </rect>
      <rect x="162.5"  y="151"  width="2.5" height="8"  rx="1.25" fill="#E8A020">
        <animate attributeName="height" values="8;12;5;10;8"      dur="1.35s" begin="0.4s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
        <animate attributeName="y"      values="151;149;152.5;150;151" dur="1.35s" begin="0.4s"  repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
      </rect>
      <rect x="166.25" y="150.5" width="2.5" height="9"  rx="1.25" fill="#E8A020">
        <animate attributeName="height" values="9;4;11;7;9"       dur="1.6s"  begin="0.15s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
        <animate attributeName="y"      values="150.5;153;149.5;151.5;150.5" dur="1.6s"  begin="0.15s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />
      </rect>
    </svg>
  );
}
