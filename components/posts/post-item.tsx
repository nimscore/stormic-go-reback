'use client'

import {
	GetCommunityByIdQuery,
	GetPostByIdQuery,
} from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import { useSession } from '@/providers/session'
import { usePostLikesStore } from '@/stores/post-likes-store'
import { createVisibilityObserver } from '@/utils/post/visibility-observer'
import { OutputData } from '@editorjs/editorjs'
import { useEffect, useRef } from 'react'
import { PostBody } from './post-body'
import { PostFooter } from './post-footer'
import { PostHeader } from './post-header'

export const PostItem: React.FC<{
	post: NonNullable<GetPostByIdQuery['post']>
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	relatedPost?: boolean
	className?: string
}> = ({ post, communities, relatedPost = false, className }) => {
	const session = useSession()
	const currentUser = session && session
	const commentsCount = usePostLikesStore(
		state => state.commentsCount[post.id] || 0
	)

	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = createVisibilityObserver()

		if (ref.current) {
			observer.observe(ref.current)
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current)
			}
		}
	}, [post.id])

	// Формируем roleIconMap как массив ролей
	const roleIconMap: ('hostOwner' | 'communityOwner')[] = []
	if (post.viewerPermissions?.hostOwner) {
		roleIconMap.push('hostOwner')
	}
	if (post.viewerPermissions?.communityOwner) {
		roleIconMap.push('communityOwner')
	}

	return (
		<div
			className={cn(
				'bg-secondary rounded-xl m-2 lg:m-0 lg:mb-2 p-4 hover:bg-primary/5',
				className
			)}
		>
			<div ref={ref} data-post-id={post.id} className='post'>
				<PostHeader
					post={post}
					communities={communities}
					roleIconMap={roleIconMap}
					currentUser={currentUser}
				/>
				<PostBody
					postTitle={post.title}
					postContent={post.content as unknown as OutputData}
					heroImage={post.heroImage?.url}
					maxLength={300}
					postUrl={`/p/${post.slug}`}
				/>
				{!relatedPost ? (
					<PostFooter
						postId={post.id}
						commentsCount={commentsCount}
						views={post.views}
						className='mt-4'
					/>
				) : null}
			</div>
		</div>
	)
}
