import * as z from "zod";

export const paymentSchema = z.object({
  bankName: z.string().min(1, "Название банка обязательно"),
  bankAccountNumber: z
    .string()
    .min(1, "Номер счета обязателен")
    .regex(/^\d+$/, "Номер счета должен состоять только из цифр"),
  taxIdentificationNumber: z
    .string()
    .min(10, "ИНН должен содержать минимум 10 цифр")
    .max(12, "ИНН не должен превышать 12 цифр")
    .regex(/^\d+$/, "ИНН должен состоять только из цифр"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
