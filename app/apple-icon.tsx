import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

const mark = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 62 H42 l6 -24 8 46 7 -30 5 12 H112" stroke="#45d9d4" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="96" cy="28" r="8" fill="#45d9d4"/>
</svg>`

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0d13",
          borderRadius: 40,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={132}
          height={132}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(mark)}`}
          alt=""
        />
      </div>
    ),
    size
  )
}
