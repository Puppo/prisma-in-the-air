import { FastifyPluginAsync } from "fastify";
import {
  IngredientDto,
  IngredientDtoSchema,
  IngredientInsertDto,
  IngredientInsertDtoSchema,
  InternalServerErrorDtoSchema,
} from "../../../dtos";

const routes: FastifyPluginAsync = async server => {
  server.post<{
    Body: IngredientInsertDto;
    Reply: IngredientDto;
  }>(
    "",
    {
      schema: {
        tags: ["Ingredients"],
        body: IngredientInsertDtoSchema,
        response: {
          201: IngredientDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async request => {
      const { name } = request.body;
      const ingredient = await server.ingredientsRepository.add(name);
      return { id: ingredient.id, name: ingredient.name };
    }
  );
};

export default routes;
