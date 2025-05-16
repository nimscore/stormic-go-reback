'use client'

import { Plus } from 'lucide-react'
import React, { useRef } from 'react'
import { toast } from 'sonner'
import { createMedia } from './createMedia'

interface Media {
	url: string
}

interface ImageUploaderProps {
	setCommentImage: (media: Media | undefined) => void
	setIsUploading: (isUploading: boolean) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
	setCommentImage,
	setIsUploading,
}) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleUpload = async (file: File) => {
		setIsUploading(true)
		const formData = new FormData()
		formData.append('file', file)
		try {
			const result = await createMedia(formData)
			setCommentImage({ url: result.url })
			toast.success('Изображение успешно загружено', { icon: '✅' })
		} catch (error) {
			toast.error('Ошибка при загрузке изображения', { icon: '❌' })
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
