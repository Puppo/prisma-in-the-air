import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
  BadRequestDtoSchema,
  IngredientsDtoSchema,
  IngredientSortingSchema,
  IngredientsQuerySorting,
  InternalServerErrorDtoSchema,
  PaginationLimitSchema,
  PaginationOffsetSchema,
} from "../../../dtos";
import { convertSortingQueryString } from "../../../utils";

const routes: FastifyPluginAsyncTypebox = async server => {
  server.get(
    "",
    {
      schema: {
        tags: ["Ingredients"],
        querystring: Type.Object({
          query: Type.Optional(Type.String()),
          sort_by: IngredientsQuerySorting,
          limit: PaginationLimitSchema,
          offset: PaginationOffsetSchema,
        }),
        response: {
          200: IngredientsDtoSchema,
          400: BadRequestDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async (request, replay) => {
      const { query, sort_by, limit, offset } = request.query;
      const sortingConvertResult = convertSortingQueryString(
        sort_by,
        IngredientSortingSchema
      );
      if (sortingConvertResult.type === "error")
        return replay.badRequest(sortingConvertResult.error);

      const ingredients = await server.ingredients.search({
        query,
        sorting: sortingConvertResult.sorting,
        pagination: {
          limit,
          offset,
        },
      });
      return ingredients.map(({ id, name }) => ({ id, name }));
    }
  );
};

export default routes;
