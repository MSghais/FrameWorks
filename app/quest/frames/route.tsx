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
// import { useRouter } from "next/navigation";
enum RequirementQuest {
  FOLLOW = "FOLLOW",
  FOLLOWER = "FOLLOWER",
  CAST = "CAST",
  RECAST = "RECAST",
}

const nfts: {
  src: string;
  tokenUrl: string;
  fid: number;
  castId?: number;
  requirements: RequirementQuest
}[] = [
    {
      src: "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png",
      fid: 1,
      requirements: RequirementQuest?.FOLLOW,
      tokenUrl: getTokenUrl({
        address: "0x99de131ff1223c4f47316c0bb50e42f356dafdaa",
        chain: zora,
        tokenId: "2",
      }),
    },
    {
      src: "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png",
      fid: 500,
      requirements: RequirementQuest?.FOLLOW,
      tokenUrl: getTokenUrl({
        address: "0x99de131ff1223c4f47316c0bb50e42f356dafdaa",
        chain: zora,
        tokenId: "2",
      }),
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
  const options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` } };
  let baseUrl = 'https://api.pinata.cloud/v3/farcaster/users'
  let fid = ctx?.message?.requesterFid ?? 50
  console.log("a fid", fid);
  const quest = nfts[page]


  // users.map((u) => {
  //   console.log("user", u)
  // })

  if (page && doQuest) {

    // Follow the user quest
    if (quest?.requirements == RequirementQuest.FOLLOW) {
      // let url = `${baseUrl}?fid=${fid}`
      let url = `${baseUrl}?fid=${quest?.fid}&followers=true`
      // let url = `${baseUrl}?fid=${fid}&followers=true`
      const usersRes = await fetch(url, options)
      const json = await usersRes.json()
      console.log("users", json)
      console.log("quest", quest)
      const users = json?.data?.users as any[]
      const isUserFollowed = users.find((u) => u?.fid == fid)
      console.log("isUserFollowed", isUserFollowed)

      // @TODO add user quest 
      // Tips with meme token
    }

    return {
      image: <div
        style={{ display: "flex", flexDirection: "column" }}
      // tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
      >
        <div
          style={{ display: "flex", flexDirection: "column" }}
        >
          Fid: {quest?.fid}
        </div>
        <div
          style={{ display: "flex", flexDirection: "column" }}
        >
          Quest: {quest?.requirements}
        </div>
      </div>,

      // imageOptions: {
      //   aspectRatio: "1:1",
      // },
      buttons: [
        <Button
          action="post"
          target={{
            query: {
              pageIndex: String((page)),
              page: String((page)),
              doQuest: true,
            },
          }}
        >
          Do
        </Button>,
        <Button
          action="post"
          target={`${origin}/quest`}
        >
          Home
        </Button>,
      ],
    };
  }

  return {
    // image: nfts[page]!.src,
    image: <div
      style={{ display: "flex", flexDirection: "column" }}
    // tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col"
    >
      <div
        style={{ display: "flex", flexDirection: "column" }}
      >
        Fid: {nfts[page]?.fid}
      </div>
      <div // imageOptions: {
        //   aspectRatio: "1:1",
        // },
        style={{ display: "flex", flexDirection: "column" }}
      >
        Quest: {nfts[page]?.requirements}
      </div>
      <img src={`${nfts[page]!.src}`}></img>
    </div>,

    imageOptions: {
      aspectRatio: "1:1",
    },

    buttons: [
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page - 1) % nfts.length),
          },
        }}
      >
        ←
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % nfts.length),
          },
        }}
      >
        →
      </Button>,
      <Button
        action="post"
        target={{
          query: {
            pageIndex: String((page + 1) % nfts.length),
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
