import { z } from "zod";

export const productBarcodeSchema = z.object({
  pageSize: z.enum(["a4", "letter", "custom"]),
  barcodesPerPage: z.number().int().positive(),
  barcodeWidth: z.number().int().positive(),
  barcodeHeight: z.number().int().positive(),
  customWidth: z.number().optional(),
  customHeight: z.number().optional(),
  margin: z.number().int().positive(),
});
