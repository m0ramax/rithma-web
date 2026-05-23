import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0C0C0F",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Equalizer bars — 4px wide, gap 2px, heights: 10/16/22/16/10 */}
        {[10, 16, 22, 16, 10].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              background: "#E8A020",
              borderRadius: 2,
              marginLeft: i === 0 ? 0 : 2,
            }}
          />
        ))}
      </div>
    ),
    { ...size }
  );
}
