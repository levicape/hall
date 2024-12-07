import { useLocation, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useSpinDelay } from "spin-delay";
import { cn } from "~/middleware/misc.js";

function EpicProgress() {
	const transition = useRouterState();
	const busy = transition.isLoading || transition.isTransitioning;
	const delayedPending = useSpinDelay(busy, {
		delay: 600,
		minDuration: 400,
	});
	const ref = useRef<HTMLDivElement>(null);
	const [animationComplete, setAnimationComplete] = useState(true);

	useEffect(() => {
		if (!ref.current) return;
		if (delayedPending) setAnimationComplete(false);

		const animationPromises = ref.current
			.getAnimations()
			.map(({ finished }) => finished);

		void Promise.allSettled(animationPromises).then(() => {
			if (!delayedPending) setAnimationComplete(true);
		});
	}, [delayedPending]);

	return (
		<div
			role="progressbar"
			aria-hidden={delayedPending ? undefined : true}
			aria-valuetext={delayedPending ? "Loading" : undefined}
			aria-valuenow={delayedPending ? 100 : undefined}
			aria-valuemin={0}
			aria-valuemax={100}
			className="fixed inset-x-0 left-0 top-0 z-50 h-[0.20rem] animate-pulse"
			tabIndex={0}
		>
			<div
				ref={ref}
				className={cn(
					"h-full w-0 bg-foreground duration-500 ease-in-out",
					!transition.isLoading &&
						(animationComplete
							? "transition-none"
							: "w-full opacity-0 transition-all"),
					delayedPending && transition.isTransitioning && "w-5/12",
					delayedPending && transition.isLoading && "w-8/12",
				)}
			/>
			{delayedPending && (
				<div className="absolute flex items-center justify-center">
					<div className="relative flex items-center justify-center w-10 h-10 bg-background rounded-full">
						<div className="absolute w-8 h-8 border-2 border-foreground rounded-full" />
					</div>
				</div>
			)}
		</div>
	);
}

export { EpicProgress };
