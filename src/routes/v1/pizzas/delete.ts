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
  server.delete(
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
      try {
        const ingredient = await server.pizzas.delete(request.params.id);
        if (!ingredient)
          return replay.notFound(
            `Pizza with id ${request.params.id} not found`
          );
        return ingredient;
      } catch (ex) {
        const message = `Error on delete pizza with id ${request.params.id}`;
        server.log.error(ex, message);
        replay.internalServerError(message);
      }
    }
  );
};

export default routes;
