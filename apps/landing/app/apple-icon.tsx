import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontStyle: "italic",
            color: "#fafafa",
            fontFamily: "Georgia, serif",
            marginRight: -4,
          }}
        >
          P
        </span>
        <span
          style={{
            fontSize: 120,
            color: "#34d399",
            fontFamily: "Georgia, serif",
            marginTop: 30,
          }}
        >
          .
        </span>
      </div>
    ),
    { ...size }
  );
}
