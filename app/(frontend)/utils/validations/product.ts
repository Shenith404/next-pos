import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Please add a title"),
  price: z.number().min(0, "Please add a price"),
  discount: z
    .number()
    .min(0, "Please add a discount")
    .max(100, "Discount should be less than 100"),
  costPrice: z.number().min(0, "Please add a cost price"),
  category: z.string().min(1, "Please add a category"),
});
