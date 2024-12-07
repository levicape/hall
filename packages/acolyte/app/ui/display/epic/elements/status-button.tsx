import * as React from "react";
import { useSpinDelay } from "spin-delay";
import { cn } from "~/middleware/misc.js";
import { Button, type ButtonProps } from "./button.js";
// import {
// 	Tooltip,
// 	TooltipContent,
// 	TooltipProvider,
// 	TooltipTrigger,
// } from './tooltip'

export const StatusButton = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		status: "pending" | "success" | "error" | "idle";
		message?: string | null;
		spinDelay?: Parameters<typeof useSpinDelay>[1];
	}
>(({ message, status, className, children, spinDelay, ...props }, ref) => {
	const delayedPending = useSpinDelay(status === "pending", {
		delay: 400,
		minDuration: 300,
		...spinDelay,
	});
	const companion = {
		pending: delayedPending ? (
			<output className="inline-flex h-6 w-6 items-center justify-center">
				<div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-primary rounded-full" />
			</output>
		) : null,
		success: (
			<output className="inline-flex h-6 w-6 items-center justify-center">
				<span className="h-4 w-4 bg-success rounded-full">Success</span>
			</output>
		),
		error: (
			<output className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
				<span className="h-4 w-4 bg-white rounded-full">Error</span>
			</output>
		),
		idle: null,
	}[status];

	return (
		<Button
			ref={ref}
			className={cn("flex justify-center gap-4", className)}
			{...props}
		>
			<div>{children}</div>
			{message ? (
				<span>
					{companion} + {message}
				</span>
			) : (
				// <TooltipProvider>
				// 	<Tooltip>
				// 		<TooltipTrigger>{companion}</TooltipTrigger>
				// 		<TooltipContent>{message}</TooltipContent>
				// 	</Tooltip>
				// </TooltipProvider>
				companion
			)}
		</Button>
	);
});
StatusButton.displayName = "Button";
