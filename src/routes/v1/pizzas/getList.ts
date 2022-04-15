import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
  BadRequestDtoSchema,
  InternalServerErrorDtoSchema,
  PaginationLimitSchema,
  PaginationOffsetSchema,
  PizzasDtoSchema,
  PizzaSortingSchema,
  PizzasQuerySorting,
} from "../../../dtos";
import { convertSortingQueryString } from "../../../utils";

const routes: FastifyPluginAsyncTypebox = async server => {
  server.get(
    "",
    {
      schema: {
        tags: ["Pizzas"],
        querystring: Type.Object({
          query: Type.Optional(Type.String()),
          sort_by: PizzasQuerySorting,
          limit: PaginationLimitSchema,
          offset: PaginationOffsetSchema,
        }),
        response: {
          200: PizzasDtoSchema,
          400: BadRequestDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async (request, replay) => {
      const { query, sort_by, limit, offset } = request.query;
      const sortingConvertResult = convertSortingQueryString(
        sort_by,
        PizzaSortingSchema
      );
      if (sortingConvertResult.type === "error")
        return replay.badRequest(sortingConvertResult.error);

      return server.pizzas.search({
        query,
        sorting: sortingConvertResult.sorting,
        pagination: {
          limit,
          offset,
        },
      });
    }
  );
};

export default routes;
