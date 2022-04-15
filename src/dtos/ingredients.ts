import { Static, Type } from "@sinclair/typebox";
import { createSortingSchema, SortingDirectionSchema } from "./common";

export const IngredientIdSchema = Type.Number();

export type IngredientId = Static<typeof IngredientIdSchema>;

export const IngredientDtoSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export type IngredientDto = Static<typeof IngredientDtoSchema>;

export const IngredientsQuerySorting = Type.Optional(
  createSortingSchema<IngredientDto>(["id", "name"])
);
export type IngredientsQuerySorting = Static<typeof IngredientsQuerySorting>;
export const IngredientSortingSchema = Type.Array(
  Type.Tuple([Type.KeyOf(IngredientDtoSchema), SortingDirectionSchema])
);

export const IngredientsDtoSchema = Type.Array(IngredientDtoSchema);

export type IngredientsDto = Static<typeof IngredientsDtoSchema>;

export const IngredientInsertDtoSchema = Type.Object({
  name: Type.String(),
});

export type IngredientInsertDto = Static<typeof IngredientInsertDtoSchema>;
