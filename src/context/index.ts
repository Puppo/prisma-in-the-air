import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export interface IDbContext {
  prisma: PrismaClient;
}

declare module "fastify" {
  interface FastifyInstance {
    dbContext: IDbContext;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async server => {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
  await prisma.$connect();

  server.decorate("dbContext", { prisma });

  server.addHook("onClose", async s => {
    await s.dbContext.prisma.$disconnect();
  });
});

export default prismaPlugin;
