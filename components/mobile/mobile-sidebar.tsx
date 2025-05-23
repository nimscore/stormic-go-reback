'use client'

import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
} from '@/components/ui/sidebar-tablet'
import React from 'react'
// import { CommunitiesForm } from '../communities/list-items/communities-form'
import {
	GetCommunityByIdQuery,
	GetHostSidebarNavigationQuery,
	GetHostSocialNavigationQuery,
} from '@/graphql/schema/graphql'
import { FeedUserMenu } from '../misc/feed-user-menu'
import { NavigationMenuForm } from '../misc/navigation-menu-form'
import { SideFooter } from '../misc/side-footer'
import { Sidebar } from '../ui/sidebar-tablet'

interface Props {
	communities: NonNullable<GetCommunityByIdQuery['community']>[]
	hostSidebarNavigation: NonNullable<
		GetHostSidebarNavigationQuery['hostSidebarNavigation']
	>['items']
	socialNavigation: NonNullable<
		GetHostSocialNavigationQuery['hostSocialNavigation']
	>
	className?: string
}

export const MobileSidebar: React.FC<Props> = ({
	communities,
	hostSidebarNavigation,
	socialNavigation,
	className,
}) => {
	return (
		<Sidebar
			variant='floating'
			side='left'
			collapsible='offcanvas'
			className={className}
		>
			<SidebarContent className='bg-background'>
				<SidebarGroup>
					<SidebarGroupContent>
						<FeedUserMenu />

						{/* <CommunitiesForm
							limit={10}
							items={communities}
							// loading={loading}
						/> */}

						<NavigationMenuForm data={hostSidebarNavigation} />

						{/* <SocialMenu hostSocialNavigation={socialNavigation} /> */}

						<SideFooter />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
