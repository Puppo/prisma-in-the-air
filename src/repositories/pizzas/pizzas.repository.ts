import { Ingredient, Pizza } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { IDbContext } from "../../context";
import { IngredientId, PizzaDto, PizzaId } from "../../dtos";
import { Pagination, Sorting } from "../../models";
import { IPizzasRepository } from "./pizzas.repository.model";

export class PizzasRepository implements IPizzasRepository {
  constructor(private readonly dbContext: IDbContext) {}

  async search(opts: {
    query?: string;
    sorting?: Sorting<PizzaDto, "id" | "name">;
    pagination?: Pagination;
  }): Promise<PizzaDto[]> {
    const selectResult = await this.dbContext.prisma.pizza.findMany({
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
    return selectResult.map(pizza => this.mapPizza(pizza));
  }

  async add(name: string, ingredients: IngredientId[]): Promise<PizzaDto> {
    const insertResult = await this.dbContext.prisma.pizza.create({
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
    return this.mapPizza(insertResult);
  }

  async getById(id: PizzaId): Promise<PizzaDto | null> {
    const pizza = await this.dbContext.prisma.pizza.findUnique({
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
    return this.mapPizza(pizza);
  }

  delete(id: PizzaId): Promise<PizzaDto | null> {
    return this.dbContext.prisma.$transaction(async prisma => {
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
        return this.mapPizza({
          ...pizza,
          pizzaIngredients,
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
          // Not Found
          return null;
        }
        throw e;
      }
    });
  }

  private mapPizza(
    pizza: Pizza & { pizzaIngredients: { ingredient: Ingredient }[] }
  ): PizzaDto {
    return {
      id: pizza.id,
      name: pizza.name,
      ingredients: pizza.pizzaIngredients.map(({ ingredient }) => ({
        id: ingredient.id,
        name: ingredient.name,
      })),
    };
  }
}
