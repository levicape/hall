import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useAuthenticationState } from "~/ui/store/authentication/reducer";

export const useRequireAuth = () => {
	const [authentication] = useAuthenticationState();
	const navigate = useNavigate();

	useEffect(() => {
		if (authentication === undefined || authentication.ready === false) {
			navigate({
				to: "/",
			});
		}
	}, [authentication, navigate]);

	return useMemo(() => {
		return {
			authentication,
		};
	}, [authentication]);
};
