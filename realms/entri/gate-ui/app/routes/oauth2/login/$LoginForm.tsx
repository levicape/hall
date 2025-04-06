import { clsx } from "clsx";
import {
	ErrorBoundary,
	type FC,
	Fragment,
	Suspense,
	use,
	useCallback,
	useId,
} from "hono/jsx";
import { serializeError } from "serialize-error";
import { SUSPENSE_GUARD, SuspendPromise } from "../../../ui/ClientSuspense";
import { DesignSystem } from "../../../ui/DesignSystem";
import { Loading } from "../../../ui/daisy/feedback/Loading";

const { Fallback } = DesignSystem;

const get = SuspendPromise(async () => {
	console.log("starting");
	await new Promise((resolve) => {
		setTimeout(() => {
			console.log("done");
			resolve(true);
		}, 2000);
	});

	return fetch("/.well-known/openid-configuration").then((response) => {
		console.log("response", response);
		return response.text();
	});
});

const LoginForm: FC = () => {
	const response = use(get());
	const usernameId = useId();
	const passwordId = useId();

	return (
		<form>
			<pre>{response}</pre>
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
				Login Form
			</div>
			<div className="form-control">
				<label className="label" for={usernameId}>
					<span className="label-text">Username</span>
				</label>
				<input
					id={usernameId}
					type="text"
					placeholder="Type here"
					className="input input-bordered"
				/>
				<label className="label" for={passwordId}>
					<span className="label-text">Password</span>
				</label>
				<input
					id={passwordId}
					type="password"
					placeholder="Type here"
					className="input input-bordered"
				/>
				<button type="submit" className="btn btn-primary mt-4">
					Login
				</button>
			</div>
		</form>
	);
};

export function LoginPage() {
	const onError = useCallback((error: Error | unknown) => {
		if (typeof error !== "undefined" && error !== SUSPENSE_GUARD) {
			console.error("Error in Page", error);
		}
	}, []);

	const Loader = <Loading className={"bg-clip-content"} size={"xl"} />;

	return (
		<ErrorBoundary
			onError={onError}
			fallbackRender={(error: unknown) => {
				if (error === SUSPENSE_GUARD) {
					return Loader;
				}
				return (
					<Fragment>
						<div className="alert alert-error">
							<div>
								<span>Something went wrong!</span>
								{error ? (
									<pre>{JSON.stringify(serializeError(error), null, 2)}</pre>
								) : (
									<Fragment />
								)}
							</div>
						</div>
						<Fallback />
					</Fragment>
				);
			}}
		>
			<div className={clsx("col-span-6", "md:col-span-4", "md:col-start-2")}>
				<div
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
						<Suspense fallback={Loader}>
							<LoginForm />
						</Suspense>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}
