'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { InfoBlock } from './item/info-block'
// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const PostDeleted: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	return (
		<div className={cn('flex w-full h-[80%]', className)}>
			<InfoBlock
				// title={formatMessage({ id: 'communityNotFound.title' })}
				// text={formatMessage({ id: 'communityNotFound.description' })}
				title='Упс. Заблокировано...'
				text='Когда-то это сообщество процветало, а потом дорога приключений привела его к краху...'
				imageUrl='/assets/images/empty-box.png'
			/>
		</div>
	)
}
