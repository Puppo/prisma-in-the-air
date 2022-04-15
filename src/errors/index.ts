import { FastifyPluginAsync } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { BadRequestDto, InternalServerErrorDto, NotFoundDto } from "../dtos";
import { BadRequestError, NotFoundError } from "./errors";

const errorPlugin: FastifyPluginAsync = async server => {
  server.setErrorHandler<
    Error,
    RouteGenericInterface & {
      Reply: NotFoundDto | BadRequestDto | InternalServerErrorDto;
    }
  >((error, _, res) => {
    if (error instanceof NotFoundError) {
      const errorDto: NotFoundDto = {
        statusCode: 404,
        error: "Not Found",
        message: error.message,
      };
      res.code(404).send(errorDto);
      return;
    }

    if (error instanceof BadRequestError) {
      const errorDto: BadRequestDto = {
        statusCode: 400,
        error: "Bad Request",
        message: error.message,
      };
      res.code(400).send(errorDto);
      return;
    }

    server.log.error(error);
    res.code(500).send({
      statusCode: 500,
      error: "Internal Server Error",
    });
  });
};

export * from "./errors";
export default errorPlugin;
