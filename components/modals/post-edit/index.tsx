'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import {
	UpdatePostDocument,
	UpdatePostMutationVariables,
} from '@/graphql/mutations/generated/UpdatePost.generated'
import { GetPostByIdDocument } from '@/graphql/queries/generated/GetPostById.generated'
import {
	GetCommunityByIdQuery,
	GetPostByIdQuery,
	PostStatus,
	UpdatePostMutation,
	User,
} from '@/graphql/schema/graphql'
import { useCurrentTime } from '@/hooks/use-current-time'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMutation } from '@apollo/client'
import { OutputData } from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormInput } from '../../form'
import { MetaSidebar } from '../../posts/edit/meta-sidebar'
import { SidebarProvider, SidebarTrigger } from '../../ui/sidebar'
import { formTitleSchema, TFormTitleValues } from './schemas'

interface Props {
	post: NonNullable<GetPostByIdQuery['post']>
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	currentUser: User
	open: boolean
	onClose: () => void
}

const Editor = dynamic(() => import('../../editorjs/Editor'), { ssr: false })

export const PostEditModal: React.FC<Props> = ({
	post,
	communities,
	currentUser,
	open,
	onClose,
}) => {
	const router = useRouter()

	const isMobile = useIsMobile()

	const form = useForm<TFormTitleValues>({
		resolver: zodResolver(formTitleSchema),
		defaultValues: { title: post?.title || '' },
	})

	const [content, setContent] = useState<OutputData | null>(
		post?.content ? (post.content as unknown as OutputData) : null
	)
	const [selectedCommunityId, setSelectedCommunityId] = useState<string>(
		post?.community.id || ''
	)
	const [heroImage, setHeroImage] = useState<string>(post?.heroImage?.url || '')
	const [seotitle, setSeoTitle] = useState<string>(post?.meta?.title || '')
	const [seodescription, setSeoDescription] = useState<string>(
		post?.meta?.description || ''
	)

	const [updatePost, { loading: mutating, error: mutateError }] = useMutation<
		UpdatePostMutation,
		UpdatePostMutationVariables
	>(UpdatePostDocument)

	const handleChange = useCallback((newContent: OutputData) => {
		setContent(newContent)
	}, [])

	const currentTime = useCurrentTime()

	const handlePublish = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!content) return

		try {
			await updatePost({
				variables: {
					input: {
						id: post.id,
						title: form.getValues().title,
						content: content as any,
						status: PostStatus.Published,
						publishedAt: post.publishedAt || currentTime,
						heroImageID: heroImage || null,
						// meta: {
						// 	title: seotitle,
						// 	description: seodescription,
						// },
						communityID: selectedCommunityId,
					},
				},
				refetchQueries: [
					{
						query: GetPostByIdDocument,
						variables: { id: post.id },
					},
				],
				awaitRefetchQueries: true,
			})

			toast.success('Пост опубликован ✅')
			onClose()
			router.refresh()
		} catch (error) {
			console.error(error)
			toast.error('Ошибка при публикации ❌')
		}
	}

	const handleSaveDraft = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!content) return

		try {
			await updatePost({
				variables: {
					input: {
						id: post.id,
						title: form.getValues().title,
						content: content as any,
						status: PostStatus.Draft,
						heroImageID: heroImage || null,
						// meta: {
						// 	title: seotitle,
						// 	description: seodescription,
						// },
						communityID: selectedCommunityId,
					},
				},
				refetchQueries: [
					{
						query: GetPostByIdDocument,
						variables: { id: post.id },
					},
				],
				awaitRefetchQueries: true,
			})

			toast.success('Черновик сохранён ✅')
			onClose()
			router.refresh()
		} catch (error) {
			console.error(error)
			toast.error('Ошибка при сохранении черновика ❌')
		}
	}

	const handleToggleDelete = async () => {
		try {
			await updatePost({
				variables: {
					input: {
						id: post.id,
						status: isPostDeleted ? PostStatus.Draft : PostStatus.Deleted,
					},
				},
				refetchQueries: [
					{
						query: GetPostByIdDocument,
						variables: { id: post.id },
					},
				],
				awaitRefetchQueries: true,
			})

			toast.success(isPostDeleted ? 'Пост восстановлен ✅' : 'Пост удалён ❌')
			onClose()
			router.refresh()
		} catch (error) {
			console.error('Ошибка при удалении/восстановлении поста:', error)
			toast.error('Произошла ошибка ❌')
		}
	}

	const isExistingPostPublished = post?.status === 'published'
	const isPostDeleted = post?.status === 'deleted'

	const authorAvatar = currentUser.avatar?.url || '/logo.png'

	if (!isMobile) {
		return (
			<Dialog open={open} onOpenChange={onClose}>
				<DialogContent className='bg-secondary p-4 w-full max-w-[100vw] h-[100vh] flex flex-col m-0 rounded-none'>
					<DialogHeader className='hidden'>
						<DialogTitle />
					</DialogHeader>
					<SidebarProvider>
						<div className='flex h-full w-full'>
							<MetaSidebar
								authorName={currentUser.name}
								authorAvatar={authorAvatar}
								communities={communities}
								selectedCommunityId={selectedCommunityId}
								setSelectedCommunityId={setSelectedCommunityId}
								heroImage={heroImage}
								setHeroImage={setHeroImage}
								seotitle={seotitle}
								setSeoTitle={setSeoTitle}
								seodescription={seodescription}
								setSeoDescription={setSeoDescription}
								className='w-64 flex-shrink-0'
							/>
							<div className='flex-1 flex flex-col items-center p-4'>
								<div className='w-full max-w-3xl flex flex-col h-full'>
									<SidebarTrigger className='mb-4' />
									<div className='flex-1 overflow-y-auto space-y-1'>
										<FormProvider {...form}>
											<form>
												<FormInput
													name='title'
													placeholder='Заголовок'
													className='bg-transparent text-lg border-none focus:ring-0 placeholder-gray-500'
													required
												/>
											</form>
										</FormProvider>
										<div className='flex-1'>
											<Editor
												data={content}
												onChange={handleChange}
												holder='editorjs'
												className='w-full h-full'
											/>
										</div>
									</div>
									<div className='my-4 lg:flex justify-start gap-2'>
										{!isPostDeleted && (
											<>
												<Button
													variant='secondary'
													type='submit'
													onClick={handlePublish}
													className='w-full h-12 my-2 text-base font-bold rounded-xl text-background'
												>
													{post && isExistingPostPublished
														? 'Сохранить изменения'
														: 'Опубликовать'}
												</Button>
												<Button
													variant='secondary'
													type='submit'
													onClick={handleSaveDraft}
													className='w-full h-12 my-2 text-base font-bold rounded-xl bg-primary/5 hover:text-background'
												>
													{post && isExistingPostPublished
														? 'Снять с публикации'
														: 'Сохранить черновик'}
												</Button>
											</>
										)}
										{post && (
											<Button
												variant={isPostDeleted ? 'outline' : 'destructive'}
												type='submit'
												onClick={handleToggleDelete}
												className='w-full h-12 my-2 text-base font-bold rounded-xl'
											>
												{isPostDeleted ? 'Вернуть пост' : 'Удалить'}
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</SidebarProvider>
				</DialogContent>
			</Dialog>
		)
	}
	return (
		<Drawer open={open} onOpenChange={onClose}>
			<DrawerContent className='h-full bg-secondary px-4 transition-all duration-300 rounded-none whitespace-normal break-words'>
				<DrawerHeader className='hidden'>
					<DrawerTitle />
				</DrawerHeader>
				<SidebarProvider>
					<div className='flex h-full w-full'>
						<MetaSidebar
							authorName={currentUser.name}
							authorAvatar={authorAvatar}
							communities={communities}
							selectedCommunityId={selectedCommunityId}
							setSelectedCommunityId={setSelectedCommunityId}
							heroImage={heroImage}
							setHeroImage={setHeroImage}
							seotitle={seotitle}
							setSeoTitle={setSeoTitle}
							seodescription={seodescription}
							setSeoDescription={setSeoDescription}
							className='w-64 flex-shrink-0'
						/>
						<div className='flex-1 flex flex-col items-center p-4'>
							<div className='w-full flex flex-col h-full'>
								<SidebarTrigger className='mb-4' />
								<div className='flex-1 overflow-y-auto space-y-1 whitespace-normal break-words'>
									<FormProvider {...form}>
										<form>
											<FormInput
												name='title'
												placeholder='Заголовок'
												className='bg-transparent text-lg border-none focus:ring-0 placeholder-gray-500'
												required
											/>
										</form>
									</FormProvider>
									<div className='flex-1'>
										<Editor
											data={content}
											onChange={handleChange}
											holder='editorjs'
											className='w-full h-full'
										/>
									</div>
								</div>
								<div className='my-2 lg:flex justify-start gap-2'>
									{!isPostDeleted && (
										<>
											<Button
												variant='secondary'
												type='submit'
												onClick={handlePublish}
												className='w-full h-12 text-base font-bold rounded-xl text-background'
											>
												{post && isExistingPostPublished
													? 'Сохранить изменения'
													: 'Опубликовать'}
											</Button>
											<Button
												variant='secondary'
												type='submit'
												onClick={handleSaveDraft}
												className='w-full h-12 mt-1 text-base font-bold rounded-xl bg-primary/5 hover:text-background'
											>
												{post && isExistingPostPublished
													? 'Снять с публикации'
													: 'Сохранить черновик'}
											</Button>
										</>
									)}
									{post && (
										<Button
											variant={isPostDeleted ? 'outline' : 'destructive'}
											type='submit'
											onClick={handleToggleDelete}
											className='w-full h-12 mt-1 text-base font-bold rounded-xl'
										>
											{isPostDeleted ? 'Вернуть пост' : 'Удалить'}
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</SidebarProvider>
			</DrawerContent>
		</Drawer>
	)
}
