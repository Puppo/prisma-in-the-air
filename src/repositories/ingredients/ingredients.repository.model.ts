import { IngredientDto, IngredientId } from "../../dtos";
import { Pagination, Sorting } from "../../models";

export interface IIngredientsRepository {
  search(opts: {
    query?: string;
    sorting?: Sorting<IngredientDto>;
    pagination?: Pagination;
  }): Promise<IngredientDto[]>;
  add(name: string): Promise<IngredientDto>;
  getById(id: IngredientId): Promise<IngredientDto | null>;
}
