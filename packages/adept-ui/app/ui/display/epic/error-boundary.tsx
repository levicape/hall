import { useParams } from "@tanstack/react-router";

type ErrorResponse = {
	status: number;
	data: string;
};

type StatusHandler = (info: {
	error: ErrorResponse;
	params: Record<string, string | undefined>;
}) => JSX.Element | null;

export function getErrorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}
	console.error("Unable to get error message for error", error);
	return "Unknown Error";
}

export function GeneralErrorBoundary({
	defaultStatusHandler = ({ error }) => (
		<p>
			{error.status} {error.data}
		</p>
	),
	statusHandlers,
	unexpectedErrorHandler = (error) => <p>{getErrorMessage(error)}</p>,
}: {
	defaultStatusHandler?: StatusHandler;
	statusHandlers?: Record<number, StatusHandler>;
	unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
	const error = { status: 500, data: "Internal Server Error" };
	const params = useParams({
		from: "/",
	});

	// if (typeof document !== "undefined") {
	// 	console.error(error);
	// }

	return (
		<div className="container flex items-center justify-center p-20 text-h2">
			{error
				? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
						error,
						params,
					})
				: unexpectedErrorHandler(error)}
		</div>
	);
}
