import { envsubst } from "@levicape/spork/server/EnvSubst";
import clsx from "clsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

export default jsxRenderer(
	({ children }) => {
		return (
			<html
				className={clsx("overflow-x-hidden", "overscroll-contain")}
				lang="en"
			>
				{/* <!-- Root --> */}
				<head>
					{/* <!-- Head --> */}
					<title>{"ApplicationHead.title.default"}</title>
					<meta name="description" content={"ApplicationHead.description[0]"} />
					<meta charSet="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<link rel="icon" href={"/favicon.ico"} type="image/png" />
					{import.meta.env.PROD ? (
						<meta http-equiv="Content-Security-Policy" content="" />
					) : undefined}
					{import.meta.env.PROD ? (
						<script type="module" src="/_window/oidc.js" />
					) : (
						<script
							type={"text/javascript"}
							// biome-ignore lint/security/noDangerouslySetInnerHtml:
							dangerouslySetInnerHTML={{
								__html: envsubst(
									`window["--oidc-debug"] = true; window["~oidc"] = ${JSON.stringify(
										{
											OAUTH_PUBLIC_OIDC_AUTHORITY:
												"$OAUTH_PUBLIC_OIDC_AUTHORITY",
											OAUTH_PUBLIC_OIDC_CLIENT_ID:
												"$OAUTH_PUBLIC_OIDC_CLIENT_ID",
											OAUTH_PUBLIC_OIDC_SCOPE: "$OAUTH_PUBLIC_OIDC_SCOPE",
											OAUTH_PUBLIC_OIDC_RESPONSE_TYPE:
												"$OAUTH_PUBLIC_OIDC_RESPONSE_TYPE",
											OAUTH_PUBLIC_OIDC_REDIRECT_URI:
												"$OAUTH_PUBLIC_OIDC_REDIRECT_URI",
											OAUTH_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI:
												"$OAUTH_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI",
											OAUTH_PUBLIC_OIDC_SILENT_REDIRECT_URI:
												"$OAUTH_PUBLIC_OIDC_SILENT_REDIRECT_URI",
										},
									)};`,
								),
							}}
						/>
					)}
					<script type="module" src="/_window/data-csr.js" />
					<Script src="/app/client.ts" async />
					<Link href="/app/style.css" rel="stylesheet" />
				</head>
				{/* <!-- Body --> */}
				{children}
				<object
					aria-hidden
					suppressHydrationWarning
					typeof="renderer"
					data-meta-base-url={import.meta.env.BASE_URL}
					data-rendered={new Date().toISOString()}
				/>
			</html>
		);
	},
	{ stream: true },
);
