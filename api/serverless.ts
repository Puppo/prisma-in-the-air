import fastify from "fastify";
import { IncomingMessage, ServerResponse } from "node:http";

import * as dotenv from "dotenv";
dotenv.config();

const app = fastify({
  logger: true,
});

app.register(import("../src/app"));

export default async function (req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit("request", req, res);
}
