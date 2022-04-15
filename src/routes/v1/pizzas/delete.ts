import { FastifyPluginAsync } from "fastify";
import {
  InternalServerErrorDtoSchema,
  NotFoundDtoSchema,
  PizzaDto,
  PizzaDtoSchema,
  PizzaId,
  PizzaIdSchema,
} from "../../../dtos";
import { NotFoundError } from "../../../errors";

const routes: FastifyPluginAsync = async server => {
  server.delete<{
    Params: {
      id: PizzaId;
    };
    Reply: PizzaDto;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Pizzas"],
        params: {
          id: PizzaIdSchema,
        },
        response: {
          200: PizzaDtoSchema,
          404: NotFoundDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async request => {
      const ingredient = await server.pizzasRepository.delete(
        request.params.id
      );
      if (!ingredient)
        throw new NotFoundError(`Pizza with id ${request.params.id} not found`);
      return ingredient;
    }
  );
};

export default routes;
