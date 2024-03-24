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
import {
  getCastByHash,
  getChannelByName,
  getUserByFid,
} from "../../services/pinata";
const client = new PrismaClient();
enum RequirementQuest {
  FOLLOW = "FOLLOW",
  FOLLOWER = "FOLLOWER",
  CAST = "CAST",
  RECAST = "RECAST",
}

const adsInit: Partial<Ads>[] = [
  {
    fid: "371795",
    // ownerId
    amount: 10,
    totalAmount: 100,
    type: TypeAds?.USER,
  },
  {
    fid: "1",
    castId: "0x9733fce86e174d1b2d8ba614c7cc0e2ba5372a97",
    channelName: "gm",
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
  {
    fid: "268652",
    // ownerId
    amount: 10,
    totalAmount: 100,
    type: TypeAds?.USER,
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
  const adsDb = await client?.ads.findMany();

  const ads: Partial<Ads>[] = [...adsInit, ...adsDb];
  let searchParams = ctx?.searchParams;
  let href = ctx?.url?.href;
  // let origin = ctx?.url?.origin;

  let message = ctx?.message;
  const active = searchParams?.active;
  console.log("active", active);
  const previousFrame = getPreviousFrame<AdsState>(searchParams);

  console.log("previousFrame", previousFrame);
  let origin = previousFrame?.headers?.url;
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/users";
  let fid = ctx?.message?.requesterFid ?? 50;
  console.log("a fid", fid);
  const quest = ads[page];

  // TODO get data based on ads
  let data: undefined | any;

  if (quest?.type == TypeAds?.USER) {
    data = await getUserByFid(quest?.fid ?? (1 as number));
  } else if (quest?.type == TypeAds?.CAST) {
    data = await getCastByHash(quest?.castId as string);
  } else if (quest?.type == TypeAds?.CHANNEL) {
    data = await getChannelByName(quest?.channelName as string);
    console.log("data  channel",data)
  }

  return {
    // image: ads[page]!.src,
    image: (
      <div
        style={{ display: "flex", flexDirection: "column" }}
        tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
      >
        {quest?.type && <p>{quest?.type}</p>}

        {quest?.fid && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            Fid: {quest?.fid}
          </div>
        )}

        {data && quest?.type == TypeAds?.USER && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{data?.display_name}</p>

              {data?.pfp_url && (
                <img src={data?.pfp_url} width={200} height={200}></img>
              )}
              <p>{data?.bio}</p>

              <p>{data?.custody_address}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>Follower: {data?.follower_count}</p>
              <p>Following: {data?.following_count}</p>
            </div>
          </div>
        )}
        {data && quest?.type == TypeAds?.CAST && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{data?.author?.display_name}</p>
              <p>{data?.author?.bio}</p>

              <p>{data?.custody_address}</p>
              {data?.author?.pfp_url && (
                <img src={data?.author?.pfp_url} width={150} height={150}></img>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{data?.content}</p>
            </div>
          </div>
        )}

        {data && quest?.type == TypeAds?.CHANNEL && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{new Date(data?.created_at / 1000).toDateString()}</p>
              <p>{data?.display_name}</p>
              <p>{data?.description}</p>
            </div>
            <p>Lead fid: {data?.lead_fid}</p>
            <p>Url: {data?.url}</p>

            {data?.image_url && (
              <img src={data?.image_url} width={200} height={200}></img>
            )}
          </div>
        )}

        {/* {data && quest?.type && TypeAds?.CAST && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{data?.bio}</p>

              <p>{data?.custody_address}</p>
              <p>{data?.display_name}</p>
              <p>{data?.follower_count}</p>
              <p>{data?.following_count}</p>
            </div>
          </div>
        )} */}

        {quest?.castId && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            CastId: {quest?.castId}
          </div>
        )}

        {quest?.questId && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            Quest: {quest?.questId}
          </div>
        )}
      </div>
    ),

    imageOptions: {
      aspectRatio: "1:1",
    },

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
        Boost
      </Button>,
      <Button action="post" target={`${origin}/`}>
        Home
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
