import fastify from "fastify";
import autoLoad from "fastify-autoload";
import { join } from "path";

const schema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
  },
};

const server = fastify({
  logger: true,
});

server.register(import("fastify-env"), {
  dotenv: true,
  schema,
});
server.register(import("fastify-cors"));
server.register(import("fastify-swagger"), {
  routePrefix: "/api/documentation",
  swagger: {
    info: {
      title: "Pizza API",
      description: "A simple Pizza API",
      version: "1.0.0",
    },
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: header => header,
  exposeRoute: true,
});

server.register(autoLoad, {
  dir: join(__dirname, "errors"),
  encapsulate: false,
});

server.register(autoLoad, {
  dir: join(__dirname, "context"),
  encapsulate: false,
});

server.register(autoLoad, {
  dir: join(__dirname, "repositories"),
  encapsulate: false,
});

server.register(autoLoad, {
  dir: join(__dirname, "routes"),
  options: {
    prefix: "/api",
  },
});

server.ready(err => {
  if (err) throw err;
  server.swagger();
});

export default server;
