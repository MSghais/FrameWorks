import { Prisma } from "@prisma/client";


import { PrismaClient } from '@prisma/client';
const client = new PrismaClient()

interface IAddUserFinishQuest {

    userFid:string;
    address:string;
    name:string;
}
export const addUser = async ({userFid, address, name,}:IAddUserFinishQuest)=> {

    const userAdd = await client?.user?.create({
        data:{
            fid:userFid,
            address:address,
            name:name,
        }
    })

}
interface IUserValidQuest {

    userFid:string;
    questId:string
}
export const userValidQuest = async ({userFid,questId}:IUserValidQuest)=> {

    const userAdd = await client?.userQuestFinish?.create({
        data:{
            fid:userFid,
            questId:questId,
        }
    })

}