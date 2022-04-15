import { Static, TSchema } from "@sinclair/typebox";
import addFormats from "ajv-formats";
import Ajv from "ajv/dist/2019";

type SortItem = {
  key: string;
  direction: string;
};

export const convertSortingQueryString = <T extends TSchema>(
  value: string | undefined,
  schema: T
):
  | { type: "success"; sorting?: Static<T> }
  | { type: "error"; error: string } => {
  if (!value) return { type: "success" };
  const mapping = value.split(",").reduce((acc, item) => {
    const [key, direction] = item.split(":");
    acc.push([key, direction]);
    return acc;
  }, [] as [string, string][]);
  const ajv = addFormats(new Ajv({}), [
    "date-time",
    "time",
    "date",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uri",
    "uri-reference",
    "uuid",
    "uri-template",
    "json-pointer",
    "relative-json-pointer",
    "regex",
  ])
    .addKeyword("kind")
    .addKeyword("modifier");

  const result = ajv.validate(schema, mapping);
  if (!result)
    return {
      type: "error",
      error: ajv.errorsText(ajv.errors),
    };

  return {
    type: "success",
    sorting: mapping,
  };
};
