import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { IDbContext } from "../../context";
import { IngredientDto, IngredientId } from "../../dtos";
import { Pagination, Sorting } from "../../models";

const add: (context: IDbContext) => FastifyInstance["ingredients"]["add"] =
  ctx => name => {
    return ctx.prisma.ingredient.create({
      data: {
        name: name,
      },
    });
  };

const getById: (
  context: IDbContext
) => FastifyInstance["ingredients"]["getById"] = ctx => async id => {
  const ingredient = await ctx.prisma.ingredient.findUnique({
    where: {
      id: id,
    },
  });
  if (!ingredient) return null;
  return {
    id: ingredient.id,
    name: ingredient.name,
  };
};

const search: (
  context: IDbContext
) => FastifyInstance["ingredients"]["search"] =
  ctx =>
  async ({ query, sorting, pagination }) => {
    return ctx.prisma.ingredient.findMany({
      skip: pagination?.offset,
      take: pagination?.limit,
      orderBy: sorting?.map(([key, direction]) => ({ [key]: direction })),
      where: query
        ? {
            name: {
              contains: query,
              mode: "insensitive", // Postgres and MongoDB by default depends of the collation
            },
          }
        : undefined,
    });
  };

declare module "fastify" {
  interface FastifyInstance {
    ingredients: {
      add: (name: string) => Promise<IngredientDto>;
      getById: (id: IngredientId) => Promise<IngredientDto | null>;
      search: (opts: {
        query?: string;
        sorting?: Sorting<IngredientDto>;
        pagination?: Pagination;
      }) => Promise<IngredientDto[]>;
    };
  }
}

const ingredientsPlugin = fp(async server => {
  const ingredients: FastifyInstance["ingredients"] = {
    add: add(server.dbContext),
    getById: getById(server.dbContext),
    search: search(server.dbContext),
  };
  server.decorate("ingredients", ingredients);
});

export default ingredientsPlugin;
