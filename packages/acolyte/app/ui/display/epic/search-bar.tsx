import { useSearch } from "@tanstack/react-router";
import { useId } from "react";
import { useDebounce, useIsPending } from "~/middleware/http.js";
import { Input } from "./elements/input.js";
// import { Label } from './elements/label'
import { StatusButton } from "./elements/status-button.js";

export function SearchBar({
	status,
	autoFocus = false,
	autoSubmit = false,
}: {
	status: "idle" | "pending" | "success" | "error";
	autoFocus?: boolean;
	autoSubmit?: boolean;
}) {
	const id = useId();
	const searchParams = useSearch({
		strict: false,
	}) as { search?: string };
	const isSubmitting = useIsPending({
		formMethod: "GET",
		formAction: "/users",
	});

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		form.requestSubmit(form);
	}, 400);

	return (
		<form
			method="GET"
			action="/users"
			className="flex flex-wrap items-center justify-center gap-2"
			onChange={(e) => autoSubmit && handleFormChange(e.currentTarget)}
		>
			<div className="flex-1">
				{/* <Label htmlFor={id} className="sr-only">
					Search
				</Label> */}
				<Input
					type="search"
					name="search"
					id={id}
					defaultValue={searchParams?.search ?? ""}
					placeholder="Search"
					className="w-full"
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={autoFocus}
				/>
			</div>
			<div>
				<StatusButton
					type="submit"
					status={isSubmitting ? "pending" : status}
					className="flex w-full items-center justify-center"
				>
					<span className="sr-only">Search</span>
				</StatusButton>
			</div>
		</form>
	);
}
