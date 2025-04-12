import clsx from "clsx";
import type { CSSProperties } from "hono/jsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { ApplicationHead } from "../variant/ApplicationHead.js";
import { LoginQuery } from "./oauth2/login/$LoginQuery.js";

const foafStyle: CSSProperties = {
	display: "none",
	pointerEvents: "none",
	touchAction: "none",
	position: "fixed",
	visibility: "hidden",
	width: 0,
	height: 0,
	top: 0,
	left: 0,
	zIndex: -1,
};

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
					<title>{ApplicationHead.title.default}</title>
					<meta
						name="description"
						content={ApplicationHead.description[0] ?? ""}
					/>
					<meta charSet="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<link rel="icon" href={"/favicon.ico"} type="image/png" />
					<Script src="/app/client.ts" async />
					<Link href="/app/style.css" rel="stylesheet" />
				</head>
				{/* <!-- Body --> */}
				{children}
				<LoginQuery />
				<object
					suppressHydrationWarning
					typeof="foaf:Document"
					style={foafStyle}
					aria-hidden
					data-meta-base-url={import.meta.env.BASE_URL}
					data-rendered={new Date().toISOString()}
				/>
			</html>
		);
	},
	{ stream: true },
);
