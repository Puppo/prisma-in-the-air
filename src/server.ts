import fastify from "fastify";

const PORT = Number.parseInt(process.env.PORT || "3000");

const server = fastify({
  logger: true,
});

server.register(import("./app"));

server.listen({
  port: PORT,
});
