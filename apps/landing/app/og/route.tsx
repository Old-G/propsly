import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Propsly";
  const description =
    searchParams.get("description") ?? "Open-Source Proposal Platform";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 40 }}
        >
          <span style={{ fontSize: 32, fontStyle: "italic" }}>Propsly</span>
          <span style={{ fontSize: 32, color: "#34d399" }}>.</span>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: "80%",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#a1a1a1", maxWidth: "70%" }}>
          {description}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(to right, #34d399, transparent)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
