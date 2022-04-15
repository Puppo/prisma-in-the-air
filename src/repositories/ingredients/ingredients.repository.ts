import { IDbContext } from "../../context";
import { IngredientDto, IngredientId } from "../../dtos";
import { Pagination, Sorting } from "../../models";
import { IIngredientsRepository } from "./ingredients.repository.model";

export class IngredientsRepository implements IIngredientsRepository {
  constructor(private readonly dbContext: IDbContext) {}

  search(opts: {
    query?: string;
    sorting?: Sorting<IngredientDto>;
    pagination?: Pagination;
  }): Promise<IngredientDto[]> {
    return this.dbContext.prisma.ingredient.findMany({
      skip: opts.pagination?.offset,
      take: opts.pagination?.limit,
      orderBy: opts.sorting?.map(([key, direction]) => ({ [key]: direction })),
      where: opts.query
        ? {
            name: {
              contains: opts.query,
              mode: "insensitive", // Postgres and MongoDB by default depends of the collation
            },
          }
        : undefined,
    });
  }

  add(name: string): Promise<IngredientDto> {
    return this.dbContext.prisma.ingredient.create({
      data: {
        name: name,
      },
    });
  }

  async getById(id: IngredientId): Promise<IngredientDto | null> {
    const ingredient = await this.dbContext.prisma.ingredient.findUnique({
      where: {
        id: id,
      },
    });
    if (!ingredient) return null;
    return {
      id: ingredient.id,
      name: ingredient.name,
    };
  }
}
