/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";
import { getFrameMessage, getTokenUrl } from "frames.js";
import { zora } from "viem/chains";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { LFGState, initialState, reducer } from "../../lfg/page";
import { DEFAULT_DEBUGGER_HUB_URL } from "../../debug";
import { Ads, PrismaClient, TypeAds } from "@prisma/client";
const client = new PrismaClient()
// import { useRouter } from "next/navigation";
enum RequirementQuest {
  FOLLOW = "FOLLOW",
  FOLLOWER = "FOLLOWER",
  CAST = "CAST",
  RECAST = "RECAST",
}

const adsInit: Partial<Ads>[] = [
  {
    fid: "1",
    // ownerId
    amount: 10,
    totalAmount: 100,
    type: TypeAds?.USER,

  },


];

const frames = createFrames({
  basePath: "/quest/frames",
});

const handleRequest = frames(async (ctx) => {
  console.log("ctx", ctx);
  // const router = useRouter()
  const page = Number(ctx.searchParams?.pageIndex ?? 0);
  const selectedQuest = Number(ctx.searchParams?.selectedQuest ?? undefined);
  const doQuest = ctx.searchParams?.doQuest;
  const adsDb = await client?.ads.findMany()

  const ads: Partial<Ads>[] = [...adsInit, ...adsDb]

  let searchParams = ctx?.searchParams;
  let href = ctx?.url?.href;
  let origin = ctx?.url?.origin;
  let message = ctx?.message;
  const active = searchParams?.active;
  console.log("active", active);
  const previousFrame = getPreviousFrame<LFGState>(searchParams);
  console.log("previousFrame", previousFrame);
  const options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` } };
  let baseUrl = 'https://api.pinata.cloud/v3/farcaster/users'
  let fid = ctx?.message?.requesterFid ?? 50
  console.log("a fid", fid);
  const quest = ads[page]

  return {
    // image: ads[page]!.src,
    image: <div
      style={{ display: "flex", flexDirection: "column", }}
      tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
    >
      {ads[page]?.type &&
        <p>{ads[page]?.type}</p>
      }

      {ads[page]?.fid &&
        <div
          style={{ display: "flex", flexDirection: "column" }}
        >
          Fid: {ads[page]?.fid}
        </div>

      }


      {ads[page]?.castId &&
        <div // imageOptions: {
          //   aspectRatio: "1:1",
          // },
          style={{ display: "flex", flexDirection: "column" }}
        >
          CastId: {ads[page]?.castId}
        </div>
      }

      <div // imageOptions: {
        //   aspectRatio: "1:1",
        // },
        style={{ display: "flex", flexDirection: "column" }}
      >
        Quest: {ads[page]?.questId}
      </div>
      {/* <img src={`${ads[page]!.src}`}></img> */}
    </div>,

    // imageOptions: {
    //   aspectRatio: "1:1",
    // },

    buttons: [
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page - 1) % ads.length),
          },
        }}
      >
        ←
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % ads.length),
          },
        }}
      >
        →
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % ads.length),
            selectedQuest: String(page),
            page: String(page),
            doQuest: true,
          },
        }}
      >
        Do
      </Button>,
      <Button
        action="post"
        target={`${origin}/`}
      >
        Home
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
