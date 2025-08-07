import { z } from "zod";
import {
  makeParseableResponseFormat,
  makeParseableTextFormat,
} from "openai/lib/parser";

import type {
  AutoParseableResponseFormat,
  AutoParseableTextFormat,
} from "openai/lib/parser";
import type { ResponseFormatJSONSchema } from "openai/resources";
import type { ResponseFormatTextJSONSchemaConfig } from "openai/resources/responses/responses";

export function zodResponseFormat<ZodInput extends z.ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<
    ResponseFormatJSONSchema.JSONSchema,
    "schema" | "strict" | "name"
  >
): AutoParseableResponseFormat<z.infer<ZodInput>> {
  return makeParseableResponseFormat(
    {
      type: "json_schema",
      json_schema: {
        ...props,
        name,
        strict: true,
        schema: z.toJSONSchema(zodObject, { target: "draft-7" }),
      },
    },
    (content) => zodObject.parse(JSON.parse(content))
  );
}

export function zodTextFormat<ZodInput extends z.ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<
    ResponseFormatTextJSONSchemaConfig,
    "schema" | "type" | "strict" | "name"
  >
): AutoParseableTextFormat<z.infer<ZodInput>> {
  return makeParseableTextFormat(
    {
      type: "json_schema",
      ...props,
      name,
      strict: true,
      schema: z.toJSONSchema(zodObject, { target: "draft-7" }),
    },
    (content) => zodObject.parse(JSON.parse(content))
  );
}
