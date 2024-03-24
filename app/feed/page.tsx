import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "../debug";
import { currentURL } from "../utils";
import { Button } from "frames.js/next";
import { Quest } from "prisma"
import { Ads } from "@prisma/client";

export type AdsState = {
  active: string;
  total_button_presses: number;
  step: number;
  selectedQuest: number;
  page?: string | "initial" | "result";
  ads?: Partial<Ads>[]
};

export const initialState = {
  active: "1",
  total_button_presses: 0,
  step: 0,
  selectedQuest: 0,
  page: "initial",
  ads: []
};

export const reducer: FrameReducer<AdsState> = (state, action) => {
  //   const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    total_button_presses: state.total_button_presses + 1,
    step: 0,
    selectedQuest: 0,
    page: "initial",
    active: action.postBody?.untrustedData.buttonIndex
      ? String(action.postBody?.untrustedData.buttonIndex)
      : "1",
    ads: []
  };
};

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/feed");
  const previousFrame = getPreviousFrame<AdsState>(searchParams);
  console.log("previousFrame", previousFrame);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }
  console.log("frameMessage is:", frameMessage);

  const [state, dispatch] = useFramesReducer<AdsState>(
    reducer,
    initialState,
    previousFrame
  );

  // Here: do a server side side effect either sync or async (using await), such as minting an NFT if you want.
  // example: load the users credentials & check they have an NFT

  console.log("info: state is:", state);

  // then, when done, return next frame
  return (
    <div className="p-4">
      frames.js starter kit. The Template Frame is on this page, it&apos;s in
      the html meta tags (inspect source).{" "}
      <Link href={createDebugUrl(url)} className="underline">
        Debug
      </Link>{" "}
      or see{" "}
      <Link href="/examples" className="underline">
        other examples
      </Link>
      <FrameContainer
        // postUrl="/lfg/frames"
        postUrl="/ads/frames"

        pathname="/ads"
        state={state}
        previousFrame={previousFrame}
      >
        {/* <FrameImage src="https://framesjs.org/og.png" /> */}
        <FrameImage aspectRatio="1.91:1">
          <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col">
            <div tw="flex flex-row">
              {frameMessage?.inputText ? frameMessage.inputText : "Explorer Feed"}
            </div>
            {frameMessage && (
              <div tw="flex flex-col">
                <div tw="flex">
                  Requester is @{frameMessage.requesterUserData?.username}{" "}
                </div>
                <div tw="flex">
                  Requester follows caster:{" "}
                  {frameMessage.requesterFollowsCaster ? "true" : "false"}
                </div>
                <div tw="flex">
                  Caster follows requester:{" "}
                  {frameMessage.casterFollowsRequester ? "true" : "false"}
                </div>
                <div tw="flex">
                  Requester liked cast:{" "}
                  {frameMessage.likedCast ? "true" : "false"}
                </div>
                <div tw="flex">
                  Requester recasted cast:{" "}
                  {frameMessage.recastedCast ? "true" : "false"}
                </div>
              </div>
            )}
          </div>
        </FrameImage>
        <FrameInput text="put some text here" />
        <FrameButton>
          View whatever
        </FrameButton>
        <FrameButton action="link" target={`https://wuwfi.xyz`}>
          WUW Fi External
        </FrameButton>

      </FrameContainer>
    </div>
  );
}
