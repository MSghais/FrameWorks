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
import { addUser, getUserByFidDb, userValidQuest } from "../../services";
import { Quest, TypeAds } from "@prisma/client";
import { LFGState } from "../../types";
import {
  getCastByHash,
  getChannelByName,
  getUserByFid,
} from "../../services/pinata";
enum RequirementQuest {
  FOLLOW = "FOLLOW",
  FOLLOWER = "FOLLOWER",
  CAST = "CAST",
  RECAST = "RECAST",
}

// const quests: {
//   src: string;
//   tokenUrl: string;
//   fid: number;
//   castId?: number;
//   requirements: RequirementQuest
// }[] = [

const quests: Partial<Quest>[] = [
  {
    id: "first_test_quest_gogo",
    src: "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png",
    fid: "1",
    requirements: RequirementQuest?.FOLLOW,
  },
  {
    id: "second_test_quest_gogo",
    src: "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png",
    fid: "500",
    requirements: RequirementQuest?.CAST,
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
  let searchParams = ctx?.searchParams;
  let href = ctx?.url?.href;
  let origin = ctx?.url?.origin;
  let message = ctx?.message;
  const active = searchParams?.active;
  console.log("active", active);
  const previousFrame = getPreviousFrame<LFGState>(searchParams);
  console.log("previousFrame", previousFrame);
  const total_button_presses = searchParams?.total_button_presses;
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/users";
  let fid = ctx?.message?.requesterFid ?? 50;
  console.log("a fid", fid);
  const quest = quests[page];

  // TODO get data based on ads
  let data: undefined | any;

  if (quest?.requirements == RequirementQuest?.FOLLOW) {
    data = await getUserByFid(quest?.fid ?? (1 as number));
  } else if (quest?.requirements == RequirementQuest?.CAST) {
    data = await getCastByHash(quest?.castId as string);
  } else if (quest?.requirements == RequirementQuest?.CHANNEL_JOINED) {
    data = await getChannelByName(quest?.channelName as string);
    console.log("data  channel", data);
  }

  // users.map((u) => {
  //   console.log("user", u)
  // })

  if (page && doQuest) {
    // Follow the user quest
    if (quest?.requirements == RequirementQuest.FOLLOW) {
      let url = `${baseUrl}?fid=${quest?.fid}&followers=true`;
      // let url = `${baseUrl}?fid=${fid}&followers=true`
      const usersRes = await fetch(url, options);
      const json = await usersRes.json();
      console.log("users", json);
      console.log("quest", quest);
      const users = json?.data?.users as any[];
      const isUserFollowed = users.find((u) => u?.fid == fid);
      console.log("isUserFollowed", isUserFollowed);

      // @TODO add user quest
      // Tips with meme token

      let userDb = await getUserByFidDb({ userFid: fid });
      if (!userDb) {
        userDb = await addUser({ userFid: fid });
      }
      let userValid = await userValidQuest({
        userFid: fid,
        questId: quest?.id ?? "first_test_quest_gogo",
      });
    }

    return {
      image: (
        <div
          style={{ display: "flex", flexDirection: "column" }}
          // tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            Quest: {quest?.requirements}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            Fid: {quest?.fid}
          </div>

          <img src={`${quest!.src}`} width={"250"} height={"250"}></img>
        </div>
      ),

      // imageOptions: {
      //   aspectRatio: "1:1",
      // },
      buttons: [
        <Button
          action="post"
          target={{
            query: {
              pageIndex: String(page),
              page: String(page),
              doQuest: true,
            },
          }}
        >
          Do
        </Button>,
        <Button action="post" target={`${origin}/quest`}>
          Home
        </Button>,
      ],
    };
  }

  return {
    // image: quests[page]!.src,
    image: (
      <div
        style={{ display: "flex", flexDirection: "column" }}
        // tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          Quest: {quests[page]?.requirements}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          Fid: {quests[page]?.fid}
        </div>

        <img src={`${quests[page]!.src}`} width={"250"} height={"250"}></img>
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
            pageIndex: String((page - 1) % quests.length),
          },
        }}
      >
        ←
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % quests.length),
          },
        }}
      >
        →
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % quests.length),
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
