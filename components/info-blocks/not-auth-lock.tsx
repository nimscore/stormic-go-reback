'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { InfoBlock } from './item/info-block'
// import { useIntl } from 'react-intl'

interface Props {
	className?: string
}

export const NotAuthLock: React.FC<Props> = ({ className }) => {
	// const { formatMessage } = useIntl()
	return (
		<div className={cn('flex w-full h-[80%]', className)}>
			<InfoBlock
				// title={formatMessage({ id: 'notAuthLock.title' })}
				// text={formatMessage({ id: 'notAuthLock.description' })}
				title='Упс. Авторизуйтесь'
				text='Данную страницу могут просматривать только авторизованные пользователи'
				imageUrl='/assets/images/lock.png'
			/>
		</div>
	)
}
