import { clsx } from "clsx";
import { useOidcClient } from "../OidcClientAtom.js";

export const OidcUserLoginCard = () => {
	const { user } = useOidcClient();
	const formatMessage = (
		s: Record<string, unknown> & { defaultMessage: string },
	) => s.defaultMessage;
	const username = user?.profile["cognito:username"] ?? user?.profile.sub;
	return (
		<div
			className={clsx(
				"card",
				"card-sm",
				"card-border",
				"border-2",
				"border-dashed",
				"rounded-field",
				user ? "border-success/30" : "border-info/20",
				"bg-neutral",
				"sm:min-w-32",
				"sm:min-h-32",
				"md:min-w-40",
				"md:min-h-36",
			)}
		>
			<div className={clsx("card-title", "pt-4", "justify-center")}>
				{/* <Users_Icon
					height={"h-8"}
					width={"w-8"}
					stroke={user ? "stroke-accent/80" : "stroke-gray-400"}
					fill={!user ? "fill-accent-content/40" : "fill-accent-content/100"}
					className={clsx(!user ? "opacity-75" : "opacity-100")}
				/> */}
			</div>
			{user ? (
				<>
					<p
						className={clsx(
							"card-body",
							"px-6",
							"py-4",
							"text-left",
							"break-keep",
							"font-serif",
							"font-medium",
						)}
					>
						{formatMessage({
							id: "authentication.user._some.logout.button",
							description: "User island welcome",
							defaultMessage: `Welcome${username ? "," : ""} ${username ?? ""}`,
						})}
					</p>
					<div
						className={clsx(
							"card-actions",
							"join-item",
							"px-8",
							"py-4",
							"border-info/80",
							"border-double",
						)}
					>
						<a
							size={"sm"}
							color={"error"}
							href={"/;oidc/close"}
							renderAs={"a"}
							variant={"soft"}
							matchContentColor
							block
						>
							{formatMessage({
								id: "authentication.user._some.logout.button",
								description: "User island logout",
								defaultMessage: "Sign out",
							})}
						</a>
					</div>
				</>
			) : (
				<div
					className={clsx(
						"card-actions",
						"card-border",
						"join-item",
						"p-4",
						"border-info/80",
						"border-double",
						"min-w-32",
					)}
				>
					<a color={"primary"} href={"/;oidc/authorize"} renderAs={"a"} block>
						{formatMessage({
							id: "authentication.user._none.login.button",
							description: "User island greetings",
							defaultMessage: "Sign in",
						})}
					</a>
				</div>
			)}
		</div>
	);
};
