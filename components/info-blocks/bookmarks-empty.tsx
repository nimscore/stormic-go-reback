'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { InfoBlock } from './item/info-block'
// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const BookmarksEmpty: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	return (
		<div className={cn('flex w-full h-[80%]', className)}>
			<InfoBlock
				// title={formatMessage({ id: 'bookmarksEmpty.title' })}
				// text={formatMessage({ id: 'bookmarksEmpty.description' })}
				title='Упс. Пусто'
				text='Для начала добавьте понравившееся посты в закладки'
				imageUrl='/assets/images/empty-box.png'
			/>
		</div>
	)
}
