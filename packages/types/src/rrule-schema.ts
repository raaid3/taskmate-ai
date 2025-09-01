// import { RRule } from "rrule";
import { z } from "zod";
// if (!RRule) {
//   console.log("No rrule found");
// }
export const rruleStringSchema = z.string().refine(
  (val) => {
    try {
      // RRule.fromString(val);
      if (typeof val === "string") return true;
      throw new Error("Invalid RRULE");
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  {
    message: "Invalid rrule string",
  }
);
