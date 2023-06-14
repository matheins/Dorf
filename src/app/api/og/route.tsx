/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og"

import { ogImageSchema } from "@/lib/validations/og"

export const runtime = "edge"

const calSans = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

const logo = fetch(
  new URL("../../../../public/apple-touch-icon.png", import.meta.url)
).then((res) => res.arrayBuffer())

export async function GET(req: Request) {
  try {
    const font = await calSans
    const logoData = (await logo) as unknown as string

    const url = new URL(req.url)
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams))
    const heading =
      values.heading.length > 140
        ? `${values.heading.substring(0, 140)}...`
        : values.heading

    const fontSize = heading.length > 100 ? "70px" : "100px"

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            background: "linear-gradient(90deg, #FFFFFF 30%, #F4F5F8)",
            fontFamily: "Cal Sans",
          }}
        >
          <div tw="flex flex-col flex-1 items-center">
            <img
              alt={`${heading} | Dorf forms`}
              src={logoData}
              tw="h-12 mb-24"
            />
            <div tw="text-md uppercase font-bold tracking-tight bg-black text-white px-4 py-2 rounded-full mb-4 relative justify-center">
              {values.type}
            </div>
            <div
              tw="flex leading-[1.1] text-[80px] text-center"
              style={{
                fontSize: fontSize,
                color: "transparent",
                backgroundClip: "text",
                background:
                  "linear-gradient(to right bottom, rgb(34, 35, 38) 30%, rgba(34, 35, 38, 0.38))",
              }}
            >
              {heading}
            </div>
          </div>
          <div tw="flex items-center w-full justify-between">
            <div
              tw="flex text-xl"
              style={{ fontFamily: "Inter", fontWeight: "bold" }}
            >
              dorf.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Cal Sans",
            data: font,
            weight: 700,
            style: "normal",
          },
        ],
      }
    )
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
