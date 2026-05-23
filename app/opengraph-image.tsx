import { ImageResponse } from "next/og";

export const alt = "Rithma — Tu música, todas las plataformas. Un solo lugar.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PLATFORMS = [
  { name: "Spotify", color: "#1DB954" },
  { name: "YouTube", color: "#FF4040" },
  { name: "Apple Music", color: "#FC3C44" },
  { name: "Deezer", color: "#EF5466" },
];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0C0C0F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,160,32,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -60,
            bottom: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,185,84,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            color: "#E8A020",
            fontSize: 13,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontFamily: "monospace",
            marginBottom: 36,
          }}
        >
          Music Hub — Beta
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#F2F0EA",
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: "-3px",
            lineHeight: 0.94,
            marginBottom: 36,
          }}
        >
          Tu música.
        </div>
        <div
          style={{
            color: "#E8A020",
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: "-3px",
            lineHeight: 0.94,
            marginBottom: 48,
          }}
        >
          Un solo lugar.
        </div>

        {/* Description */}
        <div
          style={{
            color: "#52525E",
            fontSize: 20,
            lineHeight: 1.6,
            marginBottom: 60,
            maxWidth: 580,
            fontFamily: "monospace",
          }}
        >
          Unifica tus playlists de Spotify, YouTube, Apple Music y Deezer.
          Transfiere y analiza desde una sola interfaz.
        </div>

        {/* Platform pills */}
        <div style={{ display: "flex", gap: 10 }}>
          {PLATFORMS.map(({ name, color }) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "9px 20px",
                borderRadius: 8,
                background: `${color}12`,
                border: `1px solid ${color}28`,
                color,
                fontSize: 15,
                fontFamily: "monospace",
                letterSpacing: "0.04em",
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Wordmark */}
        <div
          style={{
            position: "absolute",
            right: 100,
            bottom: 76,
            color: "#1A1A24",
            fontSize: 15,
            letterSpacing: "0.18em",
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          rithma.app
        </div>
      </div>
    ),
    { ...size }
  );
}
