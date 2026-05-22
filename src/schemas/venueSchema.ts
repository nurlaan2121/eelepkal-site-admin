import { z } from 'zod';

export const basicInfoSchema = z.object({
    name: z.string().min(2, 'Название должно быть не менее 2 символов'),
    address: z.string().min(5, 'Адрес слишком короткий'),
    description: z.string().min(10, 'Описание должно быть информативным'),
    brandName: z.string().min(2, 'Бренд обязателен'),
    website: z.string().url('Введите корректный URL').optional().or(z.literal('')),
});

export const detailsSchema = z.object({
    shortDescription: z.string().max(100, 'Слишком длинное краткое описание'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Некорректный номер телефона'),
    email: z.string().email('Некорректная почта'),
    location: z.string().url('Введите ссылку на Google Maps или 2GIS'),
});

export const socialSchema = z.object({
    instagram: z.string().optional(),
    tags: z.array(z.string()).min(1, 'Выберите хотя бы один тег'),
});

export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type DetailsData = z.infer<typeof detailsSchema>;
export type SocialData = z.infer<typeof socialSchema>;
