import { FastifyPluginAsync } from "fastify";
import {
  InternalServerErrorDtoSchema,
  PizzaDto,
  PizzaDtoSchema,
  PizzaInsertDto,
  PizzaInsertDtoSchema,
} from "../../../dtos";

const routes: FastifyPluginAsync = async server => {
  server.post<{
    Body: PizzaInsertDto;
    Reply: PizzaDto;
  }>(
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
    async request => {
      const { name, ingredients } = request.body;
      return server.pizzasRepository.add(name, ingredients);
    }
  );
};

export default routes;
