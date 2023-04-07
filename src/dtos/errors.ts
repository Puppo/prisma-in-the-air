import { Static, Type } from "@sinclair/typebox";

export const InternalServerErrorDtoSchema = Type.Object({
  statusCode: Type.Literal(500),
  error: Type.Literal("Internal Server Error"),
  message: Type.Optional(Type.String()),
});

export type InternalServerErrorDto = Static<
  typeof InternalServerErrorDtoSchema
>;

export const NotFoundDtoSchema = Type.Object({
  statusCode: Type.Literal(404),
  error: Type.Literal("Not Found"),
  message: Type.String(),
});

export type NotFoundDto = Static<typeof NotFoundDtoSchema>;

export const BadRequestDtoSchema = Type.Object({
  statusCode: Type.Literal(400),
  error: Type.Literal("Bad Request"),
  message: Type.String(),
});

export type BadRequestDto = Static<typeof BadRequestDtoSchema>;
