'use client'

import {
	GetCommunityByIdQuery,
	GetPostByIdQuery,
} from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { PostItem } from './post-item'

interface Props {
	posts: NonNullable<GetPostByIdQuery['post']>[]
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	limit?: number
	loading?: boolean
	relatedPost?: boolean
	className?: string
}

export const PostForm: React.FC<Props> = ({
	posts,
	communities,
	limit,
	loading,
	relatedPost,
	className,
}) => {
	if (loading) {
		return (
			<div className={className}>
				{[...Array(limit)].map((_, index) => (
					<Skeleton key={index} className='h-6 mb-4 rounded-[8px]' />
				))}
			</div>
		)
	}

	return (
		<div className={cn('', className)}>
			{posts.map(post => (
				<PostItem
					key={post.id}
					post={post}
					communities={communities}
					relatedPost={relatedPost}
				/>
			))}
		</div>
	)
}
