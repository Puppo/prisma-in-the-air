import { IngredientId, PizzaDto, PizzaId } from "../../dtos";
import { Pagination, Sorting } from "../../models";

export interface IPizzasRepository {
  search(opts: {
    query?: string;
    sorting?: Sorting<PizzaDto, "id" | "name">;
    pagination?: Pagination;
  }): Promise<PizzaDto[]>;
  add(name: string, ingredients: IngredientId[]): Promise<PizzaDto>;
  getById(id: PizzaId): Promise<PizzaDto | null>;
  delete(id: PizzaId): Promise<PizzaDto | null>;
}
