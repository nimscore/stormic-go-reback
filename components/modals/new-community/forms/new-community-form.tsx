import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
// import { useIntl } from 'react-intl'
import { FormInput, FormTextarea } from '@/components/form'
import { Title } from '@/components/misc/title'
import { Button } from '@/components/ui/button'
import {
	CreateCommunityDocument,
	CreateCommunityMutationVariables,
} from '@/graphql/mutations/generated/CreateCommunity.generated'
import { CreateCommunityMutation } from '@/graphql/schema/graphql'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formCommunitySchema, TFormCommunityValues } from './schemas'

interface Props {
	userId: string
	onClose?: VoidFunction
}

export const NewCommunityForm: React.FC<Props> = ({ userId, onClose }) => {
	// const { formatMessage } = useIntl()
	const router = useRouter()
	const form = useForm<TFormCommunityValues>({
		resolver: zodResolver(formCommunitySchema),
		defaultValues: {
			title: '',
			slug: '',
			description: '',
		},
	})

	const [createCommunity] = useMutation<
		CreateCommunityMutation,
		CreateCommunityMutationVariables
	>(CreateCommunityDocument)

	const onSubmit = async (data: TFormCommunityValues) => {
		try {
			await createCommunity({
				variables: {
					input: {
						title: data.title,
						slug: data.slug,
						description: data.description,
						ownerID: userId,
					},
				},
			})
			toast.success('Сообщество успешно создано', { icon: '✅' })
			onClose?.()
			router.refresh()
		} catch (error: any) {
			const msg = error.graphQLErrors?.[0]?.message || ''
			if (msg.includes('already exists')) {
				toast.error('Указанный адрес занят', { icon: '⚠️' })
			} else {
				toast.error('Сообщество не создано', { icon: '❌' })
			}
		}
	}

	return (
		<FormProvider {...form}>
			<form
				className='flex flex-col gap-4'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className='flex justify-between items-center'>
					<div className='mr-2'>
						<Title text='Новое сообщество' size='md' className='font-bold' />
						<p className='text-gray-400'>
							Создайте свое сообщество, которое покорит всех
						</p>
					</div>
				</div>

				<FormInput
					name='title'
					label='Название сообщества'
					placeholder='Stormic'
					required
				/>

				<FormInput
					name='slug'
					label='Адрес сообщества'
					placeholder='Stormic'
					required
				/>

				<FormTextarea
					name='description'
					label='Описание сообщества'
					placeholder='код, GitHub и ты'
				/>

				<Button
					variant='accent'
					loading={form.formState.isSubmitting}
					className='flex items-center gap-2 font-bold text-background rounded-xl'
				>
					Создать
				</Button>
			</form>
		</FormProvider>
	)
}
