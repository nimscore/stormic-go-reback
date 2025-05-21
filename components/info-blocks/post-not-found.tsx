'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { InfoBlock } from './item/info-block'
// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const PostNotFound: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	return (
		<div className={cn('flex w-full h-[80%]', className)}>
			<InfoBlock
				// title={formatMessage({ id: 'postNotFound.title' })}
				// text={formatMessage({ id: 'postNotFound.description' })}
				title='Публикация не найдена'
				text='Прилетело НЛО и ее больше никто не видел...'
				imageUrl='/assets/images/empty-box.png'
			/>
		</div>
	)
}
