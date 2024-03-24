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
import { DEFAULT_DEBUGGER_HUB_URL } from "../../debug";
import { Ads, PrismaClient, TypeAds } from "@prisma/client";
import { LFGState } from "../../types";
import { AdsState } from "../page";
const client = new PrismaClient()
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
  {
    fid: "1",
    castId:"500",
    channelId: "",
    // ownerId
    amount: 10,
    totalAmount: 100,
    type: TypeAds?.CAST,

  },
  {
    fid: "1",
    channelId: "",
    // ownerId
    amount: 10,
    totalAmount: 100,
    type: TypeAds?.CHANNEL,

  },

];

const frames = createFrames({
  basePath: "/ads/frames",
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
  const previousFrame = getPreviousFrame<AdsState>(searchParams);
  console.log("previousFrame", previousFrame);
  const options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` } };
  let baseUrl = 'https://api.pinata.cloud/v3/farcaster/users'
  let fid = ctx?.message?.requesterFid ?? 50
  console.log("a fid", fid);
  const quest = ads[page]

  // TODO get data based on ads
  let data:undefined|any;

  if(quest?.type == TypeAds?.USER) {

  } else if(quest?.type == TypeAds?.CHANNEL) {

  } else if(quest?.type == TypeAds?.CAST) {

  }

  return {
    // image: ads[page]!.src,
    image: <div
      style={{ display: "flex", flexDirection: "column", }}
      tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
    >
      {quest?.type &&
        <p>{quest?.type}</p>
      }

      {quest?.fid &&
        <div
          style={{ display: "flex", flexDirection: "column" }}
        >
          Fid: {quest?.fid}
        </div>
      }

      {quest?.castId &&
        <div
          style={{ display: "flex", flexDirection: "column" }}
        >
          CastId: {quest?.castId}
        </div>
      }

      {quest?.questId &&
        <div
          style={{ display: "flex", flexDirection: "column" }}
        >
          Quest: {quest?.questId}
        </div>
      }

      {/* {ads[page]?.image &&
        <img src={`${ads[page]!.image}`}></img>

      } */}

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
