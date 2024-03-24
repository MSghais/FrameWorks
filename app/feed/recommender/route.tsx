/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";
import { getFrameMessage, getTokenUrl } from "frames.js";
import {
  getPreviousFrame,
} from "frames.js/next/server";
import { Ads, PrismaClient, TypeAds } from "@prisma/client";
import { AdsState } from "../page";
import { getCastByHash, getCastByUserFid, getCastsByFollowing } from "../../services/pinata";
const client = new PrismaClient();
enum RequirementQuest {
  FOLLOW = "FOLLOW",
  FOLLOWER = "FOLLOWER",
  CAST = "CAST",
  RECAST = "RECAST",
}

const frames = createFrames({
  basePath: "/feed/recommender",
});

const handleRequest = frames(async (ctx) => {
  console.log("ctx", ctx);
  // const router = useRouter()
  const page = Number(ctx.searchParams?.pageIndex ?? 0);
  const selectedQuest = Number(ctx.searchParams?.selectedQuest ?? undefined);
  const doQuest = ctx.searchParams?.doQuest;
  let searchParams = ctx?.searchParams;
  let href = ctx?.url?.href;
  let origin = ctx?.url?.origin;
  let message = ctx?.message;
  const active = searchParams?.active;
  console.log("active", active);
  const previousFrame = getPreviousFrame<AdsState>(searchParams);
  console.log("previousFrame", previousFrame);
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/users";
  let fid = ctx?.message?.requesterFid ?? 50;
  console.log("a fid", fid);
  // let datas = await getCastByUserFid(fid);
  let datas = await getCastsByFollowing(fid);
  console.log("datas", datas);
  let data = datas?.casts[page];
  console.log("data", data);
  return {
    // image: ads[page]!.src,
    image: (
      <div
        style={{ display: "flex", flexDirection: "column" }}
        tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
      >
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

      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page - 1) % datas?.length),
          },
        }}
      >
        ←
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % datas?.length),
          },
        }}
      >
        →
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % datas?.length),
            selectedQuest: String(page),
            page: String(page),
            doQuest: true,
          },
        }}
      >
        Do
      </Button>,
      <Button action="post" target={`${origin}/`}>
        Home
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
