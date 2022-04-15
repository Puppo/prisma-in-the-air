import { Static, Type } from "@sinclair/typebox";

export const PaginationLimitSchema = Type.Integer({ min: 1, max: 100 });
export const PaginationOffsetSchema = Type.Integer({ min: 0 });

export type PaginationLimit = Static<typeof PaginationLimitSchema>;
export type PaginationOffset = Static<typeof PaginationOffsetSchema>;

export const SortingDirectionSchema = Type.Union([
  Type.Literal("asc"),
  Type.Literal("desc"),
]);

export const createSortingSchema = <T extends readonly string[]>(columns: T) =>
  Type.RegEx(new RegExp(`^(?:[${columns.join("|")}]+:(?:asc|desc),?)+$`));
