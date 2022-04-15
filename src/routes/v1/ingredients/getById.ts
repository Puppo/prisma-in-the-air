import { FastifyPluginAsync } from "fastify";
import {
  IngredientDto,
  IngredientDtoSchema,
  IngredientId,
  IngredientIdSchema,
  InternalServerErrorDtoSchema,
  NotFoundDtoSchema,
} from "../../../dtos";
import { NotFoundError } from "../../../errors";

const routes: FastifyPluginAsync = async server => {
  server.get<{
    Params: {
      id: IngredientId;
    };
    Reply: IngredientDto;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Ingredients"],
        params: {
          id: IngredientIdSchema,
        },
        response: {
          200: IngredientDtoSchema,
          404: NotFoundDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async request => {
      const ingredient = await server.ingredientsRepository.getById(
        request.params.id
      );
      if (!ingredient)
        throw new NotFoundError(
          `Ingredient with id ${request.params.id} not found`
        );
      return ingredient;
    }
  );
};

export default routes;
