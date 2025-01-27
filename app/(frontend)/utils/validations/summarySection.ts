import { z } from "zod";

export const summarySectionSchema = z.object({
    customerName: z.string(),
    phoneNumber: z.string(),
    discount: z.number().min(0).max(100),
    discountPrice: z.number(),
    holdReason: z.string(),
    cashGiven: z.number(),

});
