import autoLoad from "@fastify/autoload";
import fp from "fastify-plugin";
import { join } from "path";

const app = fp(async server => {
  server.register(import("@fastify/sensible"));

  server.register(import("@fastify/cors"));
  server.register(import("@fastify/swagger"), {
    swagger: {
      info: {
        title: "Pizza API",
        description: "A simple Pizza API",
        version: "1.0.0",
      },
    },
  });

  server.register(import("@fastify/swagger-ui"), {
    prefix: "/api/documentation",
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
});

export default app;
