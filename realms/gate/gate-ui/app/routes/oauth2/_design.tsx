import { clsx } from "clsx";
import { type FC, Fragment, type PropsWithChildren } from "hono/jsx";
import { Button } from "../../ui/daisy/action/Button";
import { Alert } from "../../ui/daisy/feedback/Alert";
import { Loading } from "../../ui/daisy/feedback/Loading";

export const Loader = () => (
	<div
		className={clsx(
			"h-40",
			"min-w-1/2",
			"flex",
			"flex-col",
			"items-center",
			"justify-center",
		)}
	>
		<Loading className={"bg-clip-content"} size={"xl"} />
	</div>
);

export const ErrorFallback: FC<
	PropsWithChildren<{ error?: unknown; revalidate?: () => void }>
> = ({ children, error, revalidate }) => {
	return (
		<div
			role={"alert"}
			aria-live={"assertive"}
			aria-atomic={"true"}
			aria-relevant={"all"}
			className={clsx("card", "-mx-28", "-my-24")}
		>
			<div className={clsx("card-title")}>
				<Alert color={"error"} variant={"outline"}>
					{children ?? "An error occurred"}
				</Alert>
			</div>
			<div className="card-body">
				{error ? (
					<div>
						{typeof error === "string" ? (
							<pre>{error}</pre>
						) : (
							<code>JSON.stringify(serializeError(error), null, 2)</code>
						)}
					</div>
				) : (
					<Fragment />
				)}
				{revalidate !== undefined ? (
					<Button
						color={"info"}
						variant={"ghost"}
						onClick={() => {
							revalidate();
						}}
					>
						Retry
					</Button>
				) : (
					<Fragment />
				)}
			</div>
		</div>
	);
};
