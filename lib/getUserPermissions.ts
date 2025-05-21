import {
	GetUserPermissionsDocument,
	GetUserPermissionsQueryVariables,
} from '@/graphql/queries/generated/GetUserPermissions.generated'
import { GetUserPermissionsQuery } from '@/graphql/schema/graphql'
import { apolloClient } from './apollo-client'
import { mergePermissions, Permissions } from './permissions'

export async function getUserPermissions(
	userId: string,
	communityId: string
): Promise<Permissions | null> {
	const apollo = apolloClient()

	try {
		// Получаем пользователя с ролями
		const { data: userPermissionsResult, errors: userPermissionsErrors } =
			await apollo.query<
				GetUserPermissionsQuery,
				GetUserPermissionsQueryVariables
			>({
				query: GetUserPermissionsDocument,
				fetchPolicy: 'network-only',
				errorPolicy: 'all',
				variables: { userId: userId, communityId: communityId },
			})

		if (!userPermissionsResult.user) {
			console.log(`User with ID ${userId} not found`)
			return null
		}

		if (!userPermissionsResult.community) {
			console.log(`Community with ID ${communityId} not found`)
			return null
		}

		// Проверяем, является ли пользователь владельцем сообщества
		const isCommunityOwner = userPermissionsResult.community.owner.id === userId

		// Проверяем, является ли пользователь владельцем хоста
		const isHostOwner = userPermissionsResult.host?.owner?.id === userId

		// Если пользователь — владелец хоста, даём все права
		if (isHostOwner) {
			const fullPermissions: Permissions = {
				communityRolesManagement: true,
				communityUserBan: true,
				communityUserMute: true,
				communityDeletePost: true,
				communityDeleteComments: true,
				communityRemovePostFromPublication: true,
				communityOwner: isCommunityOwner,
				hostOwner: true,
				communityUserHasBanned: false,
				communityUserHasMuted: false,
			}
			return fullPermissions
		}

		const isMuted = !!userPermissionsResult.communityUserMute

		const isBanned = !!userPermissionsResult.communityUserBan

		// Если пользователь заблокирован, сбрасываем все права ролей
		if (isBanned) {
			const restrictedPermissions: Permissions = {
				communityRolesManagement: false,
				communityUserBan: false,
				communityUserMute: false,
				communityDeletePost: false,
				communityDeleteComments: false,
				communityRemovePostFromPublication: false,
				communityOwner: isCommunityOwner,
				hostOwner: isHostOwner,
				communityUserHasBanned: true,
				communityUserHasMuted: isMuted,
			}
			return restrictedPermissions
		}

		// Проверяем роли пользователя
		if (!userPermissionsResult.user.communitiesRoles) {
			return {
				...mergePermissions([]),
				communityOwner: isCommunityOwner,
				hostOwner: isHostOwner,
				communityUserHasBanned: isBanned,
				communityUserHasMuted: isMuted,
			}
		}

		const rolesArray = userPermissionsResult.user.communitiesRoles

		if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
			return {
				...mergePermissions([]),
				communityOwner: isCommunityOwner,
				hostOwner: isHostOwner,
				communityUserHasBanned: isBanned,
				communityUserHasMuted: isMuted,
			}
		}

		// Фильтруем роли по сообществу
		const userRolesInCommunity = rolesArray.filter(role => {
			const community = role.community.id
			return community === communityId
		})

		// Объединяем права ролей
		const rolePermissions = mergePermissions(userRolesInCommunity)

		// Формируем полный объект разрешений
		const finalPermissions: Permissions = {
			...rolePermissions,
			communityOwner: isCommunityOwner,
			hostOwner: isHostOwner,
			communityUserHasBanned: isBanned,
			communityUserHasMuted: isMuted,
		}

		return finalPermissions
	} catch (error) {
		throw error
	}
}
