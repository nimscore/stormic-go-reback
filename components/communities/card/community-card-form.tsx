'use client'

import { cn } from '@/lib/utils'
import React from 'react'
// import { useIntl } from 'react-intl'
import { GetCommunityByIdQuery } from '@/graphql/schema/graphql'
import { Skeleton } from '../../ui/skeleton'
import { CommunityCardItem } from './community-card-item'

interface Props {
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	loading?: boolean
	className?: string
}

export const CommunitiesCardForm: React.FC<Props> = ({
	communities,
	className,
	loading,
}) => {
	// const { formatMessage } = useIntl()

	if (loading) {
		return (
			<>
				<Skeleton className='w-96 h-6 mb-4 rounded-[8px]' />
				<Skeleton className='w-96 h-6 mb-4 rounded-[8px]' />
				<Skeleton className='w-96 h-6 mb-4 rounded-[8px]' />
				<Skeleton className='w-96 h-6 mb-4 rounded-[8px]' />
				<Skeleton className='w-96 h-6 mb-4 rounded-[8px]' />
			</>
		)
	}

	return (
		<div className={cn('', className)}>
			<div className='mx-2 lg:mx-0 grid grid-cols-1 lg:grid-cols-2 gap-2'>
				{communities.map((community, index) => (
					<CommunityCardItem
						key={index}
						communityId={community.id}
						logo={community.logo?.url || '/assets/host/logo.png'}
						title={community.title}
						description={community.description}
						communityUrl={`/c/${community.slug}`}
					/>
				))}
			</div>
		</div>
	)
}
