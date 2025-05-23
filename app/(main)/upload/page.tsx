'use client'

import { ImageUploader } from '@/utils/media/ImageUploader'
import { useState } from 'react'
import { toast } from 'sonner'

interface Media {
	id?: number
	url: string
}

export default function UploadPage() {
	const [commentImage, setCommentImage] = useState<Media | undefined>()
	const [isUploading, setIsUploading] = useState(false)

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
			<h1 className='text-2xl font-bold mb-4'>Тест загрузки изображений</h1>
			<div className='bg-white p-6 rounded-lg shadow-lg'>
				<ImageUploader
					setCommentImage={setCommentImage}
					setIsUploading={setIsUploading}
					setS3Path='community/23/post/heroImage'
				/>
				{isUploading && <p className='mt-4'>Загрузка...</p>}
				{commentImage && (
					<div className='mt-4'>
						<p>Загруженное изображение:</p>
						<p>{commentImage.id}</p>
						<img
							src={commentImage.url}
							alt='Uploaded'
							crossOrigin='anonymous'
							className='w-full h-auto object-cover rounded-lg'
							onError={e => {
								console.error('Ошибка загрузки изображения:', e)
								toast.error(
									'Не удалось отобразить изображение. Проверьте CORS или публичный доступ.',
									{ icon: '❌', duration: 5000 }
								)
							}}
							onLoad={() => {
								console.log('Изображение успешно загружено в <img>')
								toast.success('Изображение отображено', { icon: '✅' })
							}}
						/>
						<p className='text-sm text-gray-600'>{commentImage.url}</p>
					</div>
				)}
			</div>
		</div>
	)
}
