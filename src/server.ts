import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";

const PORT = Number.parseInt(process.env.PORT || "3000");

const server = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(import("./app"));

server.listen({
  port: PORT,
});
