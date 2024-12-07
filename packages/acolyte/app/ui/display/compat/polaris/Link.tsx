// TODO: Progressive Cloudscape
// import { useDelegatedAnchors } from "remix-utils/use-delegated-anchors";
// import CsLink from "@cloudscape-design/components/link";

const CsLink = (props: {
	children: React.ReactNode;
	[key: string]: unknown;
}) => {
	return <a {...props} />;
}

export const Link = (props: {
	children: React.ReactNode;
	[key: string]: unknown;
}) => {
	// const { onClick } = useDelegatedAnchors();
	return <CsLink>{props.children}</CsLink>;
};
