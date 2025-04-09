import { client } from "@levicape/hall-gate-io/http/Client";
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

	return client(location.origin)
		["~"].Hall.Gate.ls.$get()
		.then((response) => {
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
			<fieldset className="fieldset">
				<label className="input" for={usernameId}>
					<span className="label">Username</span>
					<input id={usernameId} type="text" />
				</label>
				<label className="input" for={passwordId}>
					<span className="label">Password</span>
					<input id={passwordId} type="password" />
				</label>
				<button type="submit" className="btn btn-primary mt-4 btn-wide">
					Login
				</button>
			</fieldset>
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
				className={clsx(
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
					"bg-base-200/80",
					typeof window !== "undefined"
						? "shadow-accent/20"
						: "shadow-primary/50",
					typeof window !== "undefined" ? "shadow-sm" : "shadow-2xs",
					"duration-[2s]",
					"p-32",
					"transition-all",
					"will-change-[shadow]",
				)}
			>
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
											<pre>
												{JSON.stringify(serializeError(error), null, 2)}
											</pre>
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
					<Suspense fallback={Loader}>
						<LoginForm />
					</Suspense>
				</ErrorBoundary>
			</div>
		</main>
	);
}
