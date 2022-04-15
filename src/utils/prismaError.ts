import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export function isPrismaError(e: unknown): e is PrismaClientKnownRequestError {
  return (
    e instanceof Error && e.constructor.name === "PrismaClientKnownRequestError"
  );
}
