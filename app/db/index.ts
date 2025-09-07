import { PrismaClient } from "@prisma/client";

const prismaClientSingletion = ()=>{
    return new PrismaClient();
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingletion>
}

const prisma = globalThis.prisma ?? prismaClientSingletion();

export default prisma;


if(process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;