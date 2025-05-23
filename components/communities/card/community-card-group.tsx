'use client'

import { GetCommunityByIdQuery } from '@/graphql/schema/graphql'
import { cn } from '@/lib/utils'
import React from 'react'
import { CommunitiesCardForm } from './community-card-form'

interface Props {
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	className?: string
}

export const CommunityCardGroup: React.FC<Props> = ({
	communities,
	className,
}) => {
	return (
		<div className={cn('', className)}>
			<CommunitiesCardForm communities={communities} />
		</div>
	)
}
