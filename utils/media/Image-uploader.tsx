'use client'

import { createMedia, Media } from '@/utils/media/create-media'
import { Plus } from 'lucide-react'
import React, { useRef } from 'react'
import { toast } from 'sonner'

interface ImageUploaderProps {
	setCommentImage: (media: Media | undefined) => void
	setIsUploading: (isUploading: boolean) => void
	setS3Path: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
	setCommentImage,
	setIsUploading,
	setS3Path,
}) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleUpload = async (file: File) => {
		setIsUploading(true)
		try {
			const result = await createMedia(file, setS3Path)
			// result = { id, url, filename }
			setCommentImage({
				id: result.id,
				url: result.url,
				filename: result.filename,
			})
			toast.success('Изображение успешно загружено', { icon: '✅' })
		} catch (error) {
			console.error('Ошибка при загрузке через GraphQL:', error)
			toast.error('Ошибка при загрузке изображения', { icon: '❌' })
			setCommentImage(undefined)
		} finally {
			setIsUploading(false)
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			handleUpload(file)
		}
	}

	return (
		<div>
			<button
				type='button'
				className='group-hover:text-theme font-bold transition rounded-xl flex items-center justify-center'
				onClick={e => {
					e.stopPropagation()
					inputRef.current?.click()
				}}
			>
				<Plus
					className='group-hover:bg-theme-hover/20 rounded-xl w-7 h-7 p-1'
					size={36}
				/>
			</button>
			<input
				type='file'
				accept='image/*'
				ref={inputRef}
				className='hidden'
				onChange={handleFileChange}
			/>
		</div>
	)
}
