import {
  FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import {
  InternalServerErrorDtoSchema,
  NotFoundDtoSchema,
  PizzaDtoSchema,
  PizzaIdSchema,
} from "../../../dtos";

const routes: FastifyPluginAsyncTypebox = async server => {
  server.get(
    "/:id",
    {
      schema: {
        tags: ["Pizzas"],
        params: Type.Object({
          id: PizzaIdSchema,
        }),
        response: {
          200: PizzaDtoSchema,
          404: NotFoundDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async (request, replay) => {
      const ingredient = await server.pizzas.getById(request.params.id);
      if (!ingredient)
        return replay.notFound(`Pizza with id ${request.params.id} not found`);
      return ingredient;
    }
  );
};

export default routes;
