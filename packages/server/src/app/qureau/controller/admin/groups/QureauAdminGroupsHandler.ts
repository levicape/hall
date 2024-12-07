// import { qureauGroupService } from "$qureau/service/QureauGroup";
// import { SecurityRoles } from "$server/security/model/Security";
// import type { ElysiaHttpAuthenticatedHandler } from "src/app/ElysiaHttpAuthentication";

// export const QureauAdminGroupsHandler: ElysiaHttpAuthenticatedHandler = async ({
// 	principal,
// 	body,
// }) => {
// 	if (principal.role !== SecurityRoles.ADMIN) {
// 		throw new Error("Unauthorized");
// 	}

// 	const { action, groupId, userId } = body;

// 	switch (action) {
// 		case "create":
// 			return await qureauGroupService.createGroup(body);
// 		case "assign":
// 			return await qureauGroupService.assignUserToGroup(groupId, userId);
// 		case "remove":
// 			return await qureauGroupService.removeUserFromGroup(groupId, userId);
// 		case "delete":
// 			return await qureauGroupService.deleteGroup(groupId);
// 		default:
// 			throw new Error("Invalid action");
// 	}
// };
