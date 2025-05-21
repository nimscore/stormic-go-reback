'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { InfoBlock } from './item/info-block'
// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const AccessDenied: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	return (
		<div className={cn('flex w-full h-[80%]', className)}>
			<InfoBlock
				// title={formatMessage({ id: 'notAuthLock.title' })}
				// text={formatMessage({ id: 'notAuthLock.description' })}
				title='Доступ запрещен'
				text='Вы не можете просматривать эту страницу'
				imageUrl='/assets/images/lock.png'
			/>
		</div>
	)
}
