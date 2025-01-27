import { useRootContextUser } from "../../routes/-root.user.js";

// biome-ignore lint/suspicious/noExplicitAny:
function isUser(user: any): user is any {
	//SerializeFrom<typeof rootLoader>['user'] {
	return user && typeof user === "object" && typeof user.id === "string";
}

export function useOptionalUser() {
	const data = useRootContextUser();
	if (!data || !isUser(data.user)) {
		return undefined;
	}
	return data.user;
}

export function useUser() {
	const maybeUser = useOptionalUser();
	if (!maybeUser) {
		throw new Error(
			"No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
		);
	}
	return maybeUser;
}

type Action = "create" | "read" | "update" | "delete";
type Entity = "user" | "note";
type Access = "own" | "any" | "own,any" | "any,own";
export type PermissionString =
	| `${Action}:${Entity}`
	| `${Action}:${Entity}:${Access}`;

export function parsePermissionString(permissionString: PermissionString) {
	const [action, entity, access] = permissionString.split(":") as [
		Action,
		Entity,
		Access | undefined,
	];
	return {
		action,
		entity,
		access: access ? (access.split(",") as Array<Access>) : undefined,
	};
}

export function userHasPermission(
	user: // biome-ignore lint/complexity/noBannedTypes:
		| Pick<ReturnType<typeof useUser> & { roles?: {}[] }, "roles">
		| null
		| undefined,
	permission: PermissionString,
) {
	if (!user) return false;
	const { action, entity, access } = parsePermissionString(permission);

	const roles = user.roles;
	if (!roles) return false;

	// biome-ignore lint/suspicious/noExplicitAny:
	return (roles as { permissions: any[] }[]).some(
		// biome-ignore lint/suspicious/noExplicitAny:
		(role: { permissions: any[] }) =>
			role.permissions.some(
				(permission) =>
					permission.entity === entity &&
					permission.action === action &&
					(!access || access.includes(permission.access)),
			),
	);
}

export function userHasRole(
	user: Pick<
		ReturnType<typeof useUser> & { roles?: { name: string }[] },
		"roles"
	> | null,
	role: string,
) {
	if (!user) return false;
	const roles = user.roles;
	if (!roles) return false;

	return (roles as { name: string }[]).some((r) => r.name === role);
}
