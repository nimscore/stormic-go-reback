import { useBookmarksStore } from '@/stores/bookmarks-store'
import { Bookmark } from 'lucide-react'
import React, { useEffect } from 'react'

interface BookmarksButtonProps {
	postId: string
}

export const BookmarkButton: React.FC<BookmarksButtonProps> = ({ postId }) => {
	const bookmarksCount = useBookmarksStore(
		state => state.bookmarksCount[postId] || 0
	)
	const isAdded = useBookmarksStore(state => state.isAdded[postId] || false)
	const toggleBookmark = useBookmarksStore(state => state.toggleBookmark)
	const initialize = useBookmarksStore(state => state.initialize)

	useEffect(() => {
		initialize(postId)
	}, [postId, initialize])

	const handleLike = async () => {
		await toggleBookmark(postId)
	}

	return (
		<button
			onClick={handleLike}
			className='like-button focus:outline-none  mr-4'
		>
			<div className='flex group items-center cursor-pointer'>
				{isAdded ? (
					<>
						<Bookmark className='bg-theme-hover/20 text-theme rounded-xl mr-1 w-7 h-7 p-1' />
						<span className='text-theme font-bold'>{bookmarksCount}</span>
					</>
				) : (
					<>
						<Bookmark className='group-hover:bg-theme-hover/20 group-hover:text-theme rounded-xl mr-1 w-7 h-7 p-1' />
						<span className='group-hover:text-theme font-bold'>
							{bookmarksCount}
						</span>
					</>
				)}
			</div>
		</button>
	)
}
