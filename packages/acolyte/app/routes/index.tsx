import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMount } from "ahooks";
import { useCallback, useState } from "react";
import { INTERACTION_SPIN } from "~/ui/debug/Delay.js";

export const Route = createFileRoute("/")({
	component: Index,
});

const useTranslate = (
	(input: Record<string, string>) =>
	<Return,>(
		skeleton?: Return,
		serverRender: Return | string | undefined = "",
	) => {
		const [element, setElement] = useState<Return | string | undefined>(
			serverRender,
		);
		const [d, sd] = useState<Record<string, string>>({});
		const navigate = useNavigate();
		const t = useCallback(
			(key: string) => {
				return (d[key] as Return) ?? element ?? key;
			},
			[d, element],
		);

		useMount(() => {
			setElement(skeleton);

			setTimeout(
				() => {
					sd({
						...input,
					});
					navigate({ to: "/login" });
				},
				Math.ceil(Math.random() * INTERACTION_SPIN),
			);
		});

		return t;
	}
)({
	"1": "QureauBun",
	"2": "Check out the ",
	"3": "Getting Started Guide",
	"4": "for more information.",
});

export default function Index() {
	const t = useTranslate(<span />);

	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-2 xl:gap-24">
				<div className="flex max-w-md flex-col items-center text-center xl:order-2 xl:items-start xl:text-left">
					<span className="animate-slide-top [animation-fill-mode:backwards] xl:animate-slide-left xl:[animation-delay:0.5s] xl:[animation-fill-mode:backwards]">
						<svg
							role="img"
							aria-label="Tarrasqr"
							className="size-20 text-foreground xl:-mt-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 65 65"
						>
							<path
								fill="currentColor"
								d="M39.445 25.555 37 17.163 65 0 47.821 28l-8.376-2.445Zm-13.89 0L28 17.163 0 0l17.179 28 8.376-2.445Zm13.89 13.89L37 47.837 65 65 47.821 37l-8.376 2.445Zm-13.89 0L28 47.837 0 65l17.179-28 8.376 2.445Z"
							/>
						</svg>
					</span>
					<h1
						data-heading
						className="mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]"
					>
						{t("1")}
					</h1>
					<div
						data-paragraph
						className="mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-delay:0.8s] [animation-fill-mode:backwards] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-delay:1s] xl:[animation-fill-mode:backwards]"
					>
						{t("2")}
						<a
							className="underline hover:no-underline"
							href="https://github.com/epicweb-dev/epic-stack/blob/main/docs/getting-started.md"
						>
							{t("3")}
						</a>{" "}
						{t("4")}
					</div>
				</div>
				<ul className="mt-16 flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-4 xl:mt-0 xl:grid xl:grid-flow-col xl:grid-cols-5 xl:grid-rows-6">
					{/* <TooltipProvider>
						{logos.map((logo, i) => (
							<li
								key={logo.href}
								className={cn(
									columnClasses[logo.column],
									rowClasses[logo.row],
									'animate-roll-reveal [animation-fill-mode:backwards]',
								)}
								style={{ animationDelay: `${i * 0.07}s` }}
							>
								<Tooltip>
									<TooltipTrigger asChild>
										<a
											href={logo.href}
											className="grid size-20 place-items-center rounded-2xl bg-violet-600/10 p-4 transition hover:-rotate-6 hover:bg-violet-600/15 dark:bg-violet-200 dark:hover:bg-violet-100 sm:size-24"
										>
											<img src={logo.src} alt="" />
										</a>
									</TooltipTrigger>
									<TooltipContent>{logo.alt}</TooltipContent>
								</Tooltip>
							</li>
						))}
					</TooltipProvider> */}
				</ul>
			</div>
		</main>
	);
}
