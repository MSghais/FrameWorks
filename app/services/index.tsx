import { Prisma } from "@prisma/client";

import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

interface IAddUserFinishQuest {
  userFid: string;
  address?: string;
  name?: string;
}
export const getUserByFidDb = async ({
  userFid,
  address,
  name,
}: IAddUserFinishQuest) => {
  try {
    const userFind = await client?.user?.findFirst({
      where: {
        fid: userFid,
      },
    });

    return userFind;
  } catch (e) {
    console.log("error add user", e);
  }
};

export const addUser = async ({
  userFid,
  address,
  name,
}: IAddUserFinishQuest) => {
  try {
    const userAdd = await client?.user?.create({
      data: {
        fid: userFid,
        address: address,
        name: name,
      },
    });
    return userAdd;
  } catch (e) {
    console.log("add user error", e);
  }
};
interface IUserValidQuest {
  userFid: string;
  questId: string;
}
export const userValidQuest = async ({ userFid, questId }: IUserValidQuest) => {
  try {
    const userValidatedQuest = await client?.userQuestFinish?.create({
      data: {
        fid: userFid,
        questId: questId,
      },
    });

    return userValidatedQuest;
  } catch (e) {
    console.log("error userValidQuest", e);
  }
};
