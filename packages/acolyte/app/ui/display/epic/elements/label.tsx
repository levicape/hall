import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/middleware/misc.js";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<VariantProps<typeof labelVariants>>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ ...props }, ref) => (
		<div className={cn(labelVariants() /*, className */)} {...props} />
	),
);

export { Label };
