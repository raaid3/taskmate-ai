import * as pkg from "rrule";
const { RRule } = pkg;
import { z } from "zod";

export const rruleStringSchema = z.string().refine(
  (val) => {
    try {
      RRule.fromString(val);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Invalid rrule string",
  }
);
