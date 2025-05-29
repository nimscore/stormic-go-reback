'use client'

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
	UserResponse,
} from '@/graphql/schema/graphql'
import { formatDateTime } from '@/lib/format-date-time'
import { cn } from '@/lib/utils'
import { useMutation } from '@apollo/client'
import { Crown, GripHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import UserFollowButton from '../buttons/user-follow-button'
import { ActionTooltip } from '../misc/action-tooltip'
import { PostEditModal } from '../modals/post-edit'
import { ProfileAvatar } from '../profiles/community-profile/profile-avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export interface Props {
	post: NonNullable<GetPostByIdQuery['post']>
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	roleIconMap?: ('hostOwner' | 'communityOwner')[]
	currentUser?: UserResponse
	className?: string
}

const roleIconMapConfig = {
	hostOwner: {
		icon: <Crown className='h-4 w-4 text-rose-500 ml-2' />,
		label: 'Владелец платформы',
	},
	communityOwner: {
		icon: <Crown className='h-4 w-4 text-indigo-500 ml-2' />,
		label: 'Владелец сообщества',
	},
}

export const PostHeader: React.FC<Props> = ({
	post,
	communities,
	roleIconMap,
	currentUser,
	className,
}) => {
	const [openEditModal, setOpenEditModal] = React.useState(false)
	const router = useRouter()

	const [updatePost, { loading: mutating, error: mutateError }] = useMutation<
		UpdatePostMutation,
		UpdatePostMutationVariables
	>(UpdatePostDocument)

	const handleRemoveFromPublication = async () => {
		try {
			await updatePost({
				variables: {
					input: {
						id: post.id,
						status: PostStatus.Draft,
					},
				},
				// обновим кэш, чтобы статус в UI сразу поменялся
				refetchQueries: [
					{
						query: GetPostByIdDocument,
						variables: { id: post.id },
					},
				],
				awaitRefetchQueries: true,
			})
		} catch (e) {
			console.error('Ошибка снятия с публикации:', e)
		}
	}

	const handleDeletePost = async () => {
		try {
			await updatePost({
				variables: {
					input: {
						id: post.id,
						status: PostStatus.Deleted,
					},
				},
				// обновим кэш, чтобы статус в UI сразу поменялся
				refetchQueries: [
					{
						query: GetPostByIdDocument,
						variables: { id: post.id },
					},
				],
				awaitRefetchQueries: true,
			})
		} catch (e) {
			console.error('Ошибка удаления поста:', e)
		}
	}

	return (
		<div className={cn('flex justify-between w-full', className)}>
			<div className='flex items-center'>
				<Link className='' href={`/u/${post.author.slug}` || '#'}>
					<ProfileAvatar
						avatarImage={post.author.avatar?.url || '/assets/host/logo.png'}
					/>
				</Link>
				<div className='ml-2'>
					<div className='flex items-center'>
						<Link
							className='text-foreground hover:text-foreground font-bold'
							href={`/u/${post.author.slug}` || '#'}
						>
							{post.author.name}
						</Link>
						{roleIconMap &&
							roleIconMap.length > 0 &&
							roleIconMap.map(role => (
								<ActionTooltip key={role} label={roleIconMapConfig[role].label}>
									{roleIconMapConfig[role].icon}
								</ActionTooltip>
							))}
					</div>
					<Link
						className='block truncate max-w-[16ch] lg:max-w-[34ch] overflow-hidden text-sm text-foreground hover:text-foreground'
						href={post.community ? `/c/${post.community.slug}` : '#'}
					>
						{post.community.title}
					</Link>
				</div>
			</div>
			<div className='flex items-center justify-end'>
				<div className='flex flex-col'>
					{currentUser && currentUser.id !== post.author.id && (
						<UserFollowButton userId={post.author.id} />
					)}
					<span className='w-full text-sm cursor-default text-center'>
						{formatDateTime(post.publishedAt ? post.publishedAt : '#')}
					</span>
				</div>

				{currentUser && (
					<PostEditModal
						open={openEditModal}
						onClose={() => setOpenEditModal(false)}
						communities={communities}
						currentUser={currentUser}
						post={post}
					/>
				)}
				{currentUser && (
					<DropdownMenu key={openEditModal ? 'open' : 'closed'}>
						<DropdownMenuTrigger asChild>
							<div className='group'>
								<p className='flex p-1 items-center group-hover:text-theme font-bold'>
									<GripHorizontal className='group-hover:bg-theme-hover/20 rounded-xl cursor-pointer ml-2 w-7 h-7 p-1' />
								</p>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='bg-secondary text-foreground text-base'
						>
							{post.viewerPermissions?.hostOwner ||
							post.viewerPermissions?.communityOwner ||
							(currentUser != null && currentUser.id === post.author.id) ||
							post.viewerPermissions?.communityRemovePostFromPublication ||
							post.viewerPermissions?.communityDeletePost ? (
								<>
									{(post.viewerPermissions?.hostOwner ||
										post.viewerPermissions?.communityOwner ||
										(currentUser != null &&
											currentUser.id === post.author.id)) && (
										<DropdownMenuItem
											className='cursor-pointer'
											onClick={() => setOpenEditModal(true)}
										>
											Редактировать
										</DropdownMenuItem>
									)}
									{(post.viewerPermissions?.hostOwner ||
										post.viewerPermissions?.communityOwner ||
										post.viewerPermissions
											?.communityRemovePostFromPublication) && (
										<DropdownMenuItem
											className='cursor-pointer'
											onClick={handleRemoveFromPublication}
										>
											Снять с публикации
										</DropdownMenuItem>
									)}
									{(post.viewerPermissions?.hostOwner ||
										post.viewerPermissions?.communityOwner ||
										post.viewerPermissions?.communityDeletePost) && (
										<DropdownMenuItem
											className='cursor-pointer'
											onClick={handleDeletePost}
										>
											Удалить
										</DropdownMenuItem>
									)}
								</>
							) : (
								<DropdownMenuItem className='cursor-default'>
									Нет доступных действий
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	)
}
