import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  InternalServerErrorDtoSchema,
  PizzaDtoSchema,
  PizzaInsertDtoSchema,
} from "../../../dtos";

const routes: FastifyPluginAsyncTypebox = async server => {
  server.post(
    "",
    {
      schema: {
        tags: ["Pizzas"],
        body: PizzaInsertDtoSchema,
        response: {
          201: PizzaDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async (request, replay) => {
      try {
        const { name, ingredients } = request.body;
        return await server.pizzas.add(name, ingredients);
      } catch (e) {
        const message = `Error on insert pizza`;
        server.log.error(e, message);
        return replay.internalServerError(message);
      }
    }
  );
};

export default routes;
