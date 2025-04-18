import { clsx } from "clsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { AppBody } from "../../ui/AppBody.js";
import { Oauth2Query } from "./$Oauth2Query.js";

export default jsxRenderer(
	({ children, Layout }) => {
		return (
			<Layout>
				<AppBody header={false}>
					<main
						className={clsx(
							"grid",
							"grid-flow-dense",
							"auto-rows-auto",
							"grid-cols-6",
							"p-10",
						)}
					>
						<div
							data-ssg
							className={clsx(
								"isolate",
								"relative",
								"col-span-6",
								"md:col-span-4",
								"md:col-start-2",
								"m-1",
								"rounded-field",
								"border-t-2",
								"border-b-2",
								"border-l-2",
								"border-r-2",
								"border-neutral-content/10",
								"border-dotted",
								"bg-primary-500/10",
								"shadow-accent/20",
								"shadow-sm",
								"data-csr:bg-base-200/80",
								"data-csr:shadow-primary/50",
								"data-csr:shadow-2xs",
								"duration-[2s]",
								"p-30",
								"transition-all",
								"will-change-[shadow]",
							)}
						>
							{children}
						</div>
					</main>
				</AppBody>
				<Oauth2Query />
			</Layout>
		);
	},
	{ stream: true },
);
