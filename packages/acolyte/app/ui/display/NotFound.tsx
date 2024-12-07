// import Button from "@cloudscape-design/components/button";
// import Container from "@cloudscape-design/components/container";
// import Form from "@cloudscape-design/components/form";
// import Header from "@cloudscape-design/components/header";
// import TextContent from "@cloudscape-design/components/text-content";
import { Link } from "@tanstack/react-router";
import { serverTranslatedElement } from "~/i18n/useTranslatedElement.js";

const Button = (props: any) => {
	return <button {...props} />;
}

const Container = (props: any) => {
	return <div {...props} />;
}

const Form = (props: any) => {
	return <form {...props} />;
}

const Header = (props: any) => {
	return <header {...props} />;
}

const TextContent = (props: any) => {
	return <p {...props} />;
}

const useTranslate = serverTranslatedElement({
	"root.notfound.title": "Page Not Found",
	"root.notfound.description": "The page you are looking for does not exist.",
	"root.notfound.back": "Go back",
	"root.notfound.start": "Start Over",
});

// biome-ignore lint/suspicious/noExplicitAny:
export function NotFound({ children }: { children?: any }) {
	const t = useTranslate("");

	return (
		<Form
			header={
				<Header>
					<span className={"text-white"}>{t("root.notfound.title")}</span>
				</Header>
			}
			actions={[
				<div key={"spacer"} className={"invisible"}>
					{" "}
				</div>,
			]}
			secondaryActions={[
				<Button key={"start-over"} variant={"inline-link"}>
					<Link to="/">{t("root.notfound.start")}</Link>
				</Button>,
				<span key={"back"} className={"ml-2"}>
					<Button
						key={"back"}
						onClick={() => window.history.back()}
						variant="primary"
					>
						{t("root.notfound.back")}
					</Button>
				</span>,
			]}
		>
			<Container>
				<TextContent>
					{children || <p>{t("root.notfound.description")}</p>}
				</TextContent>
			</Container>
		</Form>
	);
}
