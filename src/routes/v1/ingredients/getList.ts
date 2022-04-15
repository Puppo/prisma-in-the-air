import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import {
  BadRequestDtoSchema,
  IngredientsDto,
  IngredientsDtoSchema,
  IngredientSortingSchema,
  IngredientsQuerySorting,
  InternalServerErrorDtoSchema,
  PaginationLimit,
  PaginationLimitSchema,
  PaginationOffset,
  PaginationOffsetSchema,
} from "../../../dtos";
import { BadRequestError } from "../../../errors";
import { convertSortingQueryString } from "../../../utils";

const routes: FastifyPluginAsync = async server => {
  server.get<{
    Querystring: {
      query: string;
      sort_by?: IngredientsQuerySorting;
      limit: PaginationLimit;
      offset: PaginationOffset;
    };
    Reply: IngredientsDto;
  }>(
    "",
    {
      schema: {
        tags: ["Ingredients"],
        querystring: {
          query: Type.String(),
          sort_by: IngredientsQuerySorting,
          limit: PaginationLimitSchema,
          offset: PaginationOffsetSchema,
        },
        response: {
          200: IngredientsDtoSchema,
          400: BadRequestDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async request => {
      const { query, sort_by, limit, offset } = request.query;
      const sortingConvertResult = convertSortingQueryString(
        sort_by,
        IngredientSortingSchema
      );
      if (sortingConvertResult.type === "error")
        throw new BadRequestError(sortingConvertResult.error);

      const ingredients = await server.ingredientsRepository.search({
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
