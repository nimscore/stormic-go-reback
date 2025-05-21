import { GetUserPermissionsQuery } from '@/graphql/schema/graphql'

export type Permissions = {
	communityRolesManagement: boolean
	communityUserBan: boolean
	communityUserMute: boolean
	communityDeletePost: boolean
	communityDeleteComments: boolean
	communityRemovePostFromPublication: boolean
	communityOwner: boolean
	hostOwner: boolean
	communityUserHasBanned: boolean
	communityUserHasMuted: boolean
}

export type CommunityRoleItem = NonNullable<
	NonNullable<GetUserPermissionsQuery['user']>['communitiesRoles']
>[number]

// берём только булевы поля, которые там действительно есть
export type RoleFlags = {
	communityRolesManagement: boolean
	communityUserBan: boolean
	communityUserMute: boolean
	communityDeletePost: boolean
	communityDeleteComments: boolean
	communityRemovePostFromPublication: boolean
}

// Тип для прав, зависящих только от ролей (без COMMUNITY_OWNER, HOST_OWNER и новых полей)
export type RolePermissions = Omit<
	Permissions,
	| 'communityOwner'
	| 'hostOwner'
	| 'communityUserHasBanned'
	| 'communityUserHasMuted'
>

export const mergePermissions = (
	roles: CommunityRoleItem[]
): RolePermissions => {
	const permissions: RolePermissions = {
		communityRolesManagement: false,
		communityUserBan: false,
		communityUserMute: false,
		communityDeletePost: false,
		communityDeleteComments: false,
		communityRemovePostFromPublication: false,
	}

	for (const role of roles) {
		permissions.communityRolesManagement ||= role.communityRolesManagement
		permissions.communityUserBan ||= role.communityUserBan
		permissions.communityUserMute ||= role.communityUserMute
		permissions.communityDeletePost ||= role.communityDeletePost
		permissions.communityDeleteComments ||= role.communityDeleteComments
		permissions.communityRemovePostFromPublication ||=
			role.communityRemovePostFromPublication
	}

	return permissions
}
