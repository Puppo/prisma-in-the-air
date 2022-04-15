import { Ingredient, Pizza } from "@prisma/client";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { IDbContext } from "../../context";
import { IngredientId, PizzaDto, PizzaId } from "../../dtos";
import { Pagination, Sorting } from "../../models";
import { isPrismaError } from "../../utils";

declare module "fastify" {
  interface FastifyInstance {
    pizzas: {
      search(opts: {
        query?: string;
        sorting?: Sorting<PizzaDto, "id" | "name">;
        pagination?: Pagination;
      }): Promise<PizzaDto[]>;
      add(name: string, ingredients: IngredientId[]): Promise<PizzaDto>;
      getById(id: PizzaId): Promise<PizzaDto | null>;
      delete(id: PizzaId): Promise<PizzaDto | null>;
    };
  }
}

const mapPizza = (
  pizza: Pizza & { pizzaIngredients: { ingredient: Ingredient }[] }
): PizzaDto => {
  return {
    id: pizza.id,
    name: pizza.name,
    ingredients: pizza.pizzaIngredients.map(({ ingredient }) => ({
      id: ingredient.id,
      name: ingredient.name,
    })),
  };
};

const search: (context: IDbContext) => FastifyInstance["pizzas"]["search"] =
  ctx =>
  async (opts: {
    query?: string;
    sorting?: Sorting<PizzaDto, "id" | "name">;
    pagination?: Pagination;
  }) => {
    const selectResult = await ctx.prisma.pizza.findMany({
      include: {
        pizzaIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
      skip: opts.pagination?.offset,
      take: opts.pagination?.limit,
      orderBy: opts.sorting?.map(([key, direction]) => ({ [key]: direction })),
      where: opts.query
        ? {
            OR: [
              {
                name: {
                  contains: opts.query,
                  mode: "insensitive",
                },
              },
              {
                pizzaIngredients: {
                  some: {
                    ingredient: {
                      name: {
                        contains: opts.query,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            ],
          }
        : undefined,
    });
    return selectResult.map(pizza => mapPizza(pizza));
  };

const add: (context: IDbContext) => FastifyInstance["pizzas"]["add"] =
  ctx => async (name, ingredients) => {
    const insertResult = await ctx.prisma.pizza.create({
      data: {
        name: name,
        pizzaIngredients: {
          createMany: {
            data: ingredients.map(ingredientId => ({ ingredientId })),
          },
        },
      },
      include: {
        pizzaIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
    return mapPizza(insertResult);
  };

const getById: (context: IDbContext) => FastifyInstance["pizzas"]["getById"] =
  ctx => async id => {
    const pizza = await ctx.prisma.pizza.findUnique({
      where: {
        id: id,
      },
      include: {
        pizzaIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
    if (!pizza) return null;
    return mapPizza(pizza);
  };

const remove: (context: IDbContext) => FastifyInstance["pizzas"]["delete"] =
  ctx => async id => {
    return ctx.prisma.$transaction(async prisma => {
      const pizzaIngredients = await prisma.pizzaIngredient.findMany({
        where: {
          pizzaId: id,
        },
        include: {
          ingredient: true,
        },
      });
      await prisma.pizzaIngredient.deleteMany({
        where: {
          pizzaId: id,
        },
      });
      try {
        const pizza = await prisma.pizza.delete({
          where: {
            id: id,
          },
        });
        if (!pizza) return null;
        return mapPizza({
          ...pizza,
          pizzaIngredients,
        });
      } catch (e) {
        if (isPrismaError(e) && e.code === "P2025") {
          // Not Found
          return null;
        }
        throw e;
      }
    });
  };

const pizzasPlugin: FastifyPluginAsync = async server => {
  const pizzas: FastifyInstance["pizzas"] = {
    add: add(server.dbContext),
    delete: remove(server.dbContext),
    getById: getById(server.dbContext),
    search: search(server.dbContext),
  };
  server.decorate("pizzas", pizzas);
};

export default pizzasPlugin;
