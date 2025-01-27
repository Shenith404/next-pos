import { z } from "zod";

export const stockSchema = z.object({
  count: z.number(),
});
