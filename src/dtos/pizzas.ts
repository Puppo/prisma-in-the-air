import { Static, Type } from "@sinclair/typebox";
import { createSortingSchema, SortingDirectionSchema } from "./common";
import { IngredientIdSchema, IngredientsDtoSchema } from "./ingredients";

export const PizzaIdSchema = Type.Number();
export type PizzaId = Static<typeof PizzaIdSchema>;

export const PizzaDtoSchema = Type.Object({
  id: PizzaIdSchema,
  name: Type.String(),
  ingredients: IngredientsDtoSchema,
});
export type PizzaDto = Static<typeof PizzaDtoSchema>;

export const PizzasQuerySorting = Type.Optional(
  createSortingSchema<PizzaDto>(["id", "name"])
);
export type PizzasQuerySorting = Static<typeof PizzasQuerySorting>;
export const PizzaSortingSchema = Type.Array(
  Type.Tuple([
    Type.KeyOf(Type.Pick(PizzaDtoSchema, ["id", "name"])),
    SortingDirectionSchema,
  ])
);

export const PizzasDtoSchema = Type.Array(PizzaDtoSchema);
export type PizzasDto = Static<typeof PizzasDtoSchema>;

export const PizzaInsertDtoSchema = Type.Object({
  name: Type.String(),
  ingredients: Type.Array(IngredientIdSchema),
});
export type PizzaInsertDto = Static<typeof PizzaInsertDtoSchema>;
