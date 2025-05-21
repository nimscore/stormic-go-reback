'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { InfoBlock } from './item/info-block'
// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const OwnerNotFound: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	return (
		<div className={cn('flex w-full h-[80%]', className)}>
			<InfoBlock
				// title={formatMessage({ id: 'postNotFound.title' })}
				// text={formatMessage({ id: 'postNotFound.description' })}
				title='Владелец отсутствует'
				text='Прилетело НЛО и его больше никто не видел...'
				imageUrl='/assets/images/empty-box.png'
			/>
		</div>
	)
}
