import { FastifyPluginAsync } from "fastify";
import { IngredientsRepository } from "./ingredients.repository";
import { IIngredientsRepository } from "./ingredients.repository.model";

declare module "fastify" {
  interface FastifyInstance {
    ingredientsRepository: IIngredientsRepository;
  }
}

const ingredientsRepositoriesPlugin: FastifyPluginAsync = async server => {
  const ingredientsRepository = new IngredientsRepository(server.dbContext);
  server.decorate("ingredientsRepository", ingredientsRepository);
};

export default ingredientsRepositoriesPlugin;

export * from "./ingredients.repository.model";
