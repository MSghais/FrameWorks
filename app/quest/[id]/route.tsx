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
import { LFGState } from "../../types";
// import { useRouter } from "next/navigation";

enum RequirementQuest {
  FOLLOW = "FOLLOW",
  CAST = "CAST",
  RECAST = "RECAST",
}
const nfts: {
  src: string;
  tokenUrl: string;
  fid?: number;
  castId?: number;
  requirements?: RequirementQuest;
}[] = [
  {
    src: "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png",
    fid: 1,
    tokenUrl: getTokenUrl({
      address: "0x99de131ff1223c4f47316c0bb50e42f356dafdaa",
      chain: zora,
      tokenId: "2",
    }),
  },
  {
    src: "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeiegrnialwu66u3nwzkn4gik4i2x2h4ip7y3w2dlymzlpxb5lrqbom&w=1920&q=75",
    tokenUrl: getTokenUrl({
      address: "0x060f3edd18c47f59bd23d063bbeb9aa4a8fec6df",
      chain: zora,
      tokenId: "1",
    }),
  },
  {
    src: "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeidc6e5t3qmyckqh4fr2ewrov5asmeuv4djycopvo3ro366nd3bfpu&w=1920&q=75",
    tokenUrl: getTokenUrl({
      address: "0x8f5ed2503b71e8492badd21d5aaef75d65ac0042",
      chain: zora,
      tokenId: "3",
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
  let searchParams = ctx?.searchParams;
  let href = ctx?.url?.href;
  let origin = ctx?.url?.origin;
  let message = ctx?.message;
  const active = searchParams?.active;
  console.log("active", active);
  const previousFrame = getPreviousFrame<LFGState>(searchParams);
  console.log("previousFrame", previousFrame);
  const total_button_presses = searchParams?.total_button_presses;
  // const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/users";
  let fid = ctx?.message?.requesterFid ?? 50;
  console.log("a fid", fid);
  let url = `${baseUrl}?fid=${fid}`;
  // const users = await fetch('https://api.pinata.cloud/v3/farcaster/users', options)
  const users = await fetch(url, options);
  console.log("users", users.json());

  return {
    image: nfts[page]!.src,
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
          },
        }}
      >
        Do quest
      </Button>,
      // <Button action="mint" target={nfts[page]!.tokenUrl}>
      //   Mint
      // </Button>,
      <Button action="post" target={`${origin}/lfg`}>
        Home
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
