import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

const NEON = "#45d9d4"
const BG = "#0a0d13"
const CARD = "#111722"
const MUTED = "#8ba0a8"

const ecg = `<svg width="1072" height="90" viewBox="0 0 1072 90" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 46 H300 l14 -12 12 12 22 0 9 -38 12 64 12 -44 9 18 H720 l14 -12 12 12 H1072" stroke="${NEON}" stroke-opacity="0.55" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

export interface OgOptions {
  kicker: string
  title: string
  subtitle: string
  footer: string
}

/** Shared neon OG card renderer for the site and per-component pages. */
export function renderOg({ kicker, title, subtitle, footer }: OgOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: BG,
          padding: 72,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* top neon rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: NEON,
            opacity: 0.9,
          }}
        />
        {/* soft glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: NEON,
            opacity: 0.1,
          }}
        />

        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 18,
              height: 18,
              borderRadius: 18,
              background: NEON,
            }}
          />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            <span style={{ color: "#eef4f4" }}>med</span>
            <span style={{ color: NEON }}>cn</span>
          </div>
        </div>

        {/* kicker */}
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 24,
            letterSpacing: 4,
            fontWeight: 600,
            color: NEON,
          }}
        >
          {kicker.toUpperCase()}
        </div>

        {/* title */}
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 68,
            fontWeight: 800,
            color: "#f3f8f8",
            lineHeight: 1.12,
            maxWidth: 980,
          }}
        >
          {title}
        </div>

        {/* subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 29,
            color: MUTED,
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        {/* ecg accent */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={1072}
          height={90}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(ecg)}`}
          alt=""
        />

        {/* footer command */}
        <div
          style={{
            display: "flex",
            marginTop: 20,
            alignItems: "center",
            gap: 12,
            background: CARD,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "16px 22px",
            fontSize: 24,
            fontFamily: "monospace",
            color: MUTED,
            width: "fit-content",
          }}
        >
          <span style={{ color: NEON }}>$</span>
          {footer}
        </div>
      </div>
    ),
    OG_SIZE
  )
}
