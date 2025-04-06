import { clsx } from "clsx";

export default function Application() {
	return (
		<main
			className={clsx(
				"grid",
				"grid-flow-dense",
				"auto-rows-auto",
				"grid-cols-6",
				"p-10",
			)}
		>
			<div className={clsx("col-span-6", "md:col-span-4", "md:col-start-2")}>
				<div
					suppressHydrationWarning
					className={clsx(
						"m-1",
						"h-36",
						"rounded-field",
						"border-t-2",
						"border-b-2",
						"border-l-2",
						"border-r-2",
						"border-neutral-content/10",
						"border-dotted",
						"bg-base-200/80",
						typeof window !== "undefined"
							? "shadow-accent/20"
							: "shadow-primary/50",
						typeof window !== "undefined" ? "shadow-sm" : "shadow-2xs",
						"duration-[2s]",
						+"p-32",
						+"transition-all",
						"will-change-[shadow]",
					)}
				>
					<div
						className={clsx(
							"flex",
							"h-full",
							"items-center",
							"justify-center",
							"align-middle",
							"text-info-content",
							"font-semibold",
							"font-serif",
							"text-lg",
						)}
					>
						Hello world!
					</div>
				</div>
			</div>
		</main>
	);
}
