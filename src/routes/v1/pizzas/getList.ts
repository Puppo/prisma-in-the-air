import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import {
  BadRequestDtoSchema,
  InternalServerErrorDtoSchema,
  PaginationLimit,
  PaginationLimitSchema,
  PaginationOffset,
  PaginationOffsetSchema,
  PizzasDto,
  PizzasDtoSchema,
  PizzaSortingSchema,
  PizzasQuerySorting,
} from "../../../dtos";
import { BadRequestError } from "../../../errors";
import { convertSortingQueryString } from "../../../utils";

const routes: FastifyPluginAsync = async server => {
  server.get<{
    Querystring: {
      query: string;
      sort_by?: PizzasQuerySorting;
      limit: PaginationLimit;
      offset: PaginationOffset;
    };
    Reply: PizzasDto;
  }>(
    "",
    {
      schema: {
        tags: ["Pizzas"],
        querystring: {
          query: Type.String(),
          sort_by: PizzasQuerySorting,
          limit: PaginationLimitSchema,
          offset: PaginationOffsetSchema,
        },
        response: {
          200: PizzasDtoSchema,
          400: BadRequestDtoSchema,
          500: InternalServerErrorDtoSchema,
        },
      },
    },
    async request => {
      const { query, sort_by, limit, offset } = request.query;
      const sortingConvertResult = convertSortingQueryString(
        sort_by,
        PizzaSortingSchema
      );
      if (sortingConvertResult.type === "error")
        throw new BadRequestError(sortingConvertResult.error);

      return server.pizzasRepository.search({
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
