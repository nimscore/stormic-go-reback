'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { InfoBlock } from './item/info-block'
// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const MyFeedEmpty: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	return (
		<div className={cn('flex w-full h-[80%]', className)}>
			<InfoBlock
				// title={formatMessage({ id: 'myFeedEmpty.title' })}
				// text={formatMessage({ id: 'myFeedEmpty.description' })}
				title='Упс. Пусто'
				text='Для начала подпишитесь на любимого автора или сообщество'
				imageUrl='/assets/images/empty-box.png'
			/>
		</div>
	)
}
