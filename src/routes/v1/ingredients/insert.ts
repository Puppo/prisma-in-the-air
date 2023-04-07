import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  IngredientDtoSchema,
  IngredientInsertDtoSchema,
  InternalServerErrorDtoSchema,
} from "../../../dtos";

const routes: FastifyPluginAsyncTypebox = async server => {
  server.post(
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
    async (request, replay) => {
      try {
        const { name } = request.body;
        const ingredient = await server.ingredients.add(name);
        return { id: ingredient.id, name: ingredient.name };
      } catch (e) {
        const message = "Error on insert ingredient";
        server.log.error(e, message);
        return replay.internalServerError(message);
      }
    }
  );
};

export default routes;
