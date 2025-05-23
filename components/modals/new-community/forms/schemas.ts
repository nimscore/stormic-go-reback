import { z } from 'zod'

export const userSchema = z.string()
export const titleSchema = z
	.string()
	.min(3, { message: 'Минимум 3 символа в названии' })
	.max(30, { message: 'Максимум 30 символов в названии' })
export const descriptionSchema = z
	.string()
	.max(1000, { message: 'Максимум 100 символов в описании' })

export const formCommunitySchema = z.object({
	userId: userSchema,
	title: titleSchema,
	slug: titleSchema,
	description: descriptionSchema,
})

export type TFormCommunityValues = z.infer<typeof formCommunitySchema>
