import { FastifyPluginAsync } from "fastify";
import { PizzasRepository } from "./pizzas.repository";
import { IPizzasRepository } from "./pizzas.repository.model";

declare module "fastify" {
  interface FastifyInstance {
    pizzasRepository: IPizzasRepository;
  }
}

const pizzasRepositoryPlugin: FastifyPluginAsync = async server => {
  const pizzasRepository = new PizzasRepository(server.dbContext);
  server.decorate("pizzasRepository", pizzasRepository);
};

export default pizzasRepositoryPlugin;

export * from "./pizzas.repository.model";
