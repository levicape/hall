import { invariant } from "@epic-web/invariant";
import { useRootContextUser } from "~/routes/-root.user.js";

/**
 * @returns the request info from the root loader
 */
export function useRequestInfo() {
	const data = useRootContextUser();
	console.log({
		RequestInfo: {
			data,
		},
	});

	invariant(data?.requestInfo, "No requestInfo found in root loader");

	return data.requestInfo;
}
