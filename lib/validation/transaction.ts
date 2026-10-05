import { z } from "zod"

export const transactionSchema = z.object({
  amount: z.number().int().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum([
    "UTILITIES",
    "COMMITTEES",
    "GROCERIES",
    "TRANSPORT",
    "RENT",
    "OTHER",
  ]),
  note: z.string().optional(),
  date: z.string().refine(
    (value) => !Number.isNaN(Date.parse(value)),
    {
      message: "Invalid date",
    }
  ),
})

export const transactionUpdateSchema = transactionSchema.partial()