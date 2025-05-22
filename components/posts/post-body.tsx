import { cn } from '@/lib/utils'
import { OutputData } from '@editorjs/editorjs'
import Link from 'next/link'
import React from 'react'
import RichText from '../editorjs/render'
import { Title } from '../misc/title'

interface Props {
	postTitle: string
	postContent: OutputData | null
	heroImage?: string | null
	postUrl: string
	className?: string
	maxLength: number
}

export const PostBody: React.FC<Props> = ({
	postTitle,
	postContent,
	heroImage,
	postUrl,
	className,
	maxLength,
}) => {
	return (
		<div className={cn('', className)}>
			<Link href={postUrl}>
				<div className='max-h-[18rem] overflow-hidden rounded-xl'>
					<Title
						text={postTitle}
						size='sm'
						className='font-extrabold my-2 text-foreground'
					/>
					<RichText
						//data={truncateEditorState(postContent, maxLength)}
						data={postContent}
						className='text-foreground text-justify'
					/>
				</div>
				{heroImage && (
					<img
						className='rounded-xl mt-4 object-cover h-80 w-full'
						src={heroImage}
						alt={postTitle}
					/>
				)}
			</Link>
		</div>
	)
}
