import {
  FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import {
  IngredientDtoSchema,
  IngredientIdSchema,
  InternalServerErrorDtoSchema,
  NotFoundDtoSchema,
} from "../../../dtos";

const routes: FastifyPluginAsyncTypebox = async server => {
  server.get(
    "/:id",
    {
      schema: {
        tags: ["Ingredients"],
        params: Type.Object({
          id: IngredientIdSchema,
        }),
        response: {
          200: IngredientDtoSchema,
          404: NotFoundDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async (request, reply) => {
      const ingredient = await server.ingredients.getById(request.params.id);
      if (!ingredient)
        return reply.notFound(
          `Ingredient with id ${request.params.id} not found`
        );
      return ingredient;
    }
  );
};

export default routes;
