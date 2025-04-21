import type { AuthorizeQueryParams } from "@levicape/hall-gate-io/app/qureau/controller/login/AuthorizeQueryParams";
import { client } from "@levicape/hall-gate-io/http/Client";
import { RegistrationRegisterCommand } from "@levicape/hall-gate-io/module/_protocols/qureau/ts/domain/registration/register/registration.register.js";
import {
	ErrorBoundary,
	type FC,
	Fragment,
	Suspense,
	use,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "hono/jsx";
import { parseQuery } from "ufo";
import { SUSPENSE_GUARD, SuspendPromise } from "../../../ui/ClientSuspense";
import { flattenObject } from "../../../ui/behavior/Object";
import { ErrorFallback, Loader } from "../_design";

const [$rpc, reset] = SuspendPromise(async () => {
	return client(location.origin);
});

const AnonymousLogin: FC<{ query: AuthorizeQueryParams }> = ({ query }) => {
	if (query.error) {
		const url = new URL(window.location.href);
		url.searchParams.delete("error");
		url.searchParams.delete("error_description");
		window.history.pushState(null, "", url.toString());
		throw query.error_description ?? query.error ?? "Unknown error";
	}

	const [promised] = $rpc();
	const $client = use(promised);
	const formRef = useRef<HTMLFormElement>(null);

	const onFormData = useCallback(({ formData }: FormDataEvent) => {
		Object.entries(
			flattenObject(
				RegistrationRegisterCommand.toJSON({
					request: {
						registration: undefined,
						user: undefined,
						eventInfo: undefined,
					},
					ext: {
						nonce: Date.now().toString(),
					},
				}) as RegistrationRegisterCommand,
			),
		).forEach(([key, value]) => {
			if (value === undefined || value === null) {
				return;
			}
			formData.set(key, String(value));
		});
	}, []);

	useEffect(() => {
		if (formRef) {
			(formRef.current as HTMLFormElement).submit();
		}
	}, [formRef]);

	const url = $client["~"].Hall.Gate.Login.Anonymous.$url().toString();
	const withoutError = { ...query };

	// biome-ignore lint/performance/noDelete:
	delete withoutError.error;
	// biome-ignore lint/performance/noDelete:
	delete withoutError.error_description;

	return (
		<Fragment>
			<form
				ref={formRef}
				action={`${url}?${new URLSearchParams({
					...withoutError,
				})}`}
				method="post"
				onFormData={onFormData}
			/>
			<Loader />
		</Fragment>
	);
};

export function AnonymousLoginPage() {
	const { location } =
		typeof window !== "undefined"
			? window
			: ({} as { location?: { search?: string } });
	const [query] = useMemo(() => {
		const { search } = location ?? {};
		const query = parseQuery(search ?? "") ?? {};
		return [query as AuthorizeQueryParams] as const;
	}, [location?.search]);

	const [_valid, setValid] = useState(Date.now());
	const revalidate = useCallback(() => {
		setValid(Date.now());
		reset?.();
	}, []);

	return (
		<ErrorBoundary
			fallbackRender={(error: unknown) => {
				if (error === SUSPENSE_GUARD) {
					return <Loader />;
				}
				return <ErrorFallback error={error} revalidate={revalidate} />;
			}}
		>
			<Suspense fallback={<Loader />}>
				<AnonymousLogin query={query} />
			</Suspense>
		</ErrorBoundary>
	);
}
