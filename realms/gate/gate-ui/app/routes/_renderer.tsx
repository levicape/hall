import clsx from "clsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { ApplicationHead } from "../variant/ApplicationHead.js";

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
					{import.meta.env.PROD ? (
						<meta http-equiv="Content-Security-Policy" content="" />
					) : undefined}
					<link rel="icon" href={"/favicon.ico"} type="image/png" />
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
