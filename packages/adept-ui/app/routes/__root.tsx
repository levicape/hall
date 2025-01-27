import Button from "@cloudscape-design/components/button";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	Link,
	Outlet,
	ScrollRestoration,
	createRootRoute,
	useLocation,
	useMatches,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Meta, Scripts } from "@tanstack/start";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useNonce } from "~/middleware/nonce-provider.js";
import type { Theme } from "~/middleware/user/theme.server.js";
import { Cloudscape } from "~/ui/Cloudscape.js";
import { DefaultCatchBoundary } from "~/ui/behavior/exception/DefaultCatchBoundary.js";
import { CaptureTouchEvents } from "~/ui/behavior/interaction/CaptureTouchEvents.js";
import { ClientOnly } from "~/ui/behavior/render/useHydrated.js";
import { ServiceLocatorProvider } from "~/ui/data/ServiceLocatorContext.js";
import { DebugWindowProvider } from "~/ui/debug/DebugContext.js";
import { NotFound } from "~/ui/display/NotFound.js";
import { Bleed } from "~/ui/display/compat/polaris/Bleed.js";
import { BlockStack } from "~/ui/display/compat/polaris/BlockStack.js";
import { Box } from "~/ui/display/compat/polaris/Box.js";
import { Divider } from "~/ui/display/compat/polaris/Divider.js";
import { InlineStack } from "~/ui/display/compat/polaris/InlineStack.js";
import { EpicProgress } from "~/ui/display/epic/progress-bar.js";
import { SearchBar } from "~/ui/display/epic/search-bar.js";
import { defaultMetaTags } from "~/ui/head/MetaTags.js";
import { AuthenticationProvider } from "~/ui/store/authentication/reducer.js";
import { ServiceDiscoveryProvider } from "~/ui/store/service/reducer.js";
// @ts-ignore
import tailwindCss from "~/ui/tailwind.css?url";
import { rootUserFn, useRootContextUser } from "./-root.user.js";

const CloudscapeInstance = new Cloudscape();
export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...defaultMetaTags({
				title: "Qureau Bun",
				description: ``,
			}),
			{
				name: "robots",
				content: "noindex, nofollow",
			},
		],
		links: [
			{ rel: "stylesheet", href: tailwindCss },
			...CloudscapeInstance.stylesheet(),
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			// { rel: "icon", type: "image/svg+xml", href: faviconAssetUrl },
			// { rel: "apple-touch-icon", href: appleTouchIconAssetUrl },
		],
	}),
	search: {},
	beforeLoad: async () => {
		return {
			session: await rootUserFn(),
		};
	},
	loader: async ({ context }) => {
		if (context.session) {
			const {
				session: { user },
			} = context as any;

			return {
				userId: user !== false && user?.id,
			};
		}
	},
	errorComponent: (props) => {
		const nonce = useNonce();
		return (
			<RootDocument theme={"dark"}>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
	notFoundComponent: () => <NotFound />,
	component: RootComponent,
});

export const GetRootRoute = () => Route;

function HoneypotProvider({ children }: PropsWithChildren<object>) {
	return <>{children}</>;
}

function RootComponent() {
	const matches = useMatches();
	const isOnSearchPage = matches.find((m) => m.id === "routes/users+/index");
	const searchBar = isOnSearchPage ? null : <SearchBar status="idle" />;
	const location = useLocation();

	const {
		user,
		honeyProps,
		requestInfo: {
			userPrefs: { theme },
		},
	} = useRootContextUser();

	return (
		<RootDocument theme={theme}>
			<HoneypotProvider {...honeyProps}>
				<>
					<AuthenticationProvider>
						<ServiceDiscoveryProvider>
							<ServiceLocatorProvider>
								<DebugWindowProvider>
									<ContentLayout
										maxContentWidth={1000}
										defaultPadding
										header={
											<>
												<div className="p-2 flex gap-2 text-lg">
													<Link
														to="/"
														activeProps={{
															className: "font-bold",
														}}
														activeOptions={{ exact: true }}
													>
														Home
													</Link>
													<Link
														to="/"
														activeProps={{
															className: "font-bold",
														}}
													>
														Pio
													</Link>
													<div className="ml-auto">
														{user ? (
															<>
																<span className="mr-2">{user.email}</span>
																<Link
																	search={{ fromInvalidRoute: 0 }}
																	to="/logout"
																>
																	Logout
																</Link>
															</>
														) : (
															<Link to="/login">Login</Link>
														)}
													</div>
												</div>
												<hr />

												<SpaceBetween size="m">
													<Header variant={"awsui-h1-sticky"}>
														<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
															<div className="ml-auto hidden max-w-sm flex-1 sm:block">
																{searchBar}
															</div>
															<div className="flex items-center gap-10">
																{user ? (
																	// <UserDropdown />
																	<div>
																		<Button>
																			<Link href={`/users/${user.username}`}>
																				<img
																					className="h-8 w-8 rounded-full object-cover"
																					alt={user.fullName ?? user.username}
																					// src={getUserImgSrc(user.image?.id)}
																				/>
																				<span className="text-body-sm font-bold">
																					{user.fullName ?? user.username}
																				</span>
																			</Link>
																		</Button>
																		<Button>
																			<Link
																				href={`/users/${user.username}/notes`}
																			>
																				Notes
																			</Link>
																		</Button>
																		<Button>
																			<Link
																				search={{ fromInvalidRoute: 0 }}
																				to="/logout"
																			>
																				<button type="submit">Logout</button>
																			</Link>
																		</Button>
																	</div>
																) : (
																	// hide if current url is login
																	location.pathname !== "/login" && (
																		<Button>
																			<Link href="/login">Login</Link>
																		</Button>
																	)
																)}
															</div>
															<div className="block w-full sm:hidden">
																{searchBar}
															</div>
														</nav>
													</Header>
													{/* 
														<Alert statusIconAriaLabel="Info" type={"info"}>
															<span style={{ color: colorTextAccent }}>
																qureau:{" "}
																<strong>
																	{/* TODO: }
																	{/* {qureauProtocolVersionEnumToJSON(
																				QureauProtocolVersionEnum.QUREAU_P_LATEST,
																			)} }
																</strong>
															</span>
														</Alert> 
*/}
												</SpaceBetween>
											</>
										}
									>
										<div className={"h-screen"}>
											<main
												style={{
													minHeight: "20dvh",
													padding: "0.5em",
												}}
											>
												<Outlet />
											</main>
											<Bleed marginBlock={"1200"}>
												<Box minHeight={"0.25rem"} />
												<Divider
													borderColor={"border-magic"}
													borderWidth={"100"}
												/>
												<Box minHeight={"0.35rem"} />
												<InlineStack gap={"400"} align={"space-around"}>
													<Box background={"bg-surface-transparent"}>
														{/* <ThemeSwitch
																			userPreference={data.requestInfo.userPrefs.theme}
																		/> */}
													</Box>
													<Box background={"bg-surface-transparent"}>
														<Link href="/resources">Resources</Link>
													</Box>
													<Box background={"bg-surface-transparent"}>
														<BlockStack gap={"400"}>
															<Link href="/about">About</Link>
															<BlockStack gap={"100"}>
																<div
																	suppressHydrationWarning
																	className={clsx("h-1")}
																/>
															</BlockStack>
														</BlockStack>
													</Box>
												</InlineStack>
												<Box minHeight={"0.75rem"} />
											</Bleed>
											{ClientOnly({
												children: () => {
													return (
														<>
															<span className="fixed bottom-5 right-7">
																{/* <AuthenticationForm />
																				<ServiceDiscoveryForm /> */}
															</span>
														</>
													);
												},
											})}
										</div>
									</ContentLayout>
								</DebugWindowProvider>
							</ServiceLocatorProvider>
						</ServiceDiscoveryProvider>
					</AuthenticationProvider>
					<ReactQueryDevtools buttonPosition="top-right" />
				</>
			</HoneypotProvider>
		</RootDocument>
	);
}

function RootDocument({
	children,
	theme,
}: PropsWithChildren<{ theme: Theme }>) {
	const nonce = useNonce();
	return (
		<html lang="en" className={`${theme} h-full overflow-x-hidden`}>
			<head>
				{/* <ClientHintCheck nonce={nonce} /> */}
				<Meta />
			</head>
			<body className={"bg-background text-foreground"}>
				<CaptureTouchEvents>
					<CloudscapeInstance.Provider>{children}</CloudscapeInstance.Provider>
				</CaptureTouchEvents>
				{/* <EpicToaster
					closeButton
					position="top-center"
					theme={theme ?? undefined}
				/> */}
				<EpicProgress />
				<ScrollRestoration />
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}

// function UserDropdown() {
// 	const user = useUser()
// 	const submit = useSubmit()
// 	const formRef = useRef<HTMLFormElement>(null)
// 	return (
// 		<DropdownMenu>
// 			<DropdownMenuTrigger asChild>
// 				<Button asChild variant="secondary">
// 					<Link
// 						to={`/users/${user.username}`}
// 						// this is for progressive enhancement
// 						onClick={(e) => e.preventDefault()}
// 						className="flex items-center gap-2"
// 					>
// 						<img
// 							className="h-8 w-8 rounded-full object-cover"
// 							alt={user.name ?? user.username}
// 							src={getUserImgSrc(user.image?.id)}
// 						/>
// 						<span className="text-body-sm font-bold">
// 							{user.name ?? user.username}
// 						</span>
// 					</Link>
// 				</Button>
// 			</DropdownMenuTrigger>
// 			<DropdownMenuPortal>
// 				<DropdownMenuContent sideOffset={8} align="start">
// 					<DropdownMenuItem asChild>
// 						<Link prefetch="intent" to={`/users/${user.username}`}>
// 							<Icon className="text-body-md" name="avatar">
// 								Profile
// 							</Icon>
// 						</Link>
// 					</DropdownMenuItem>
// 					<DropdownMenuItem asChild>
// 						<Link prefetch="intent" to={`/users/${user.username}/notes`}>
// 							<Icon className="text-body-md" name="pencil-2">
// 								Notes
// 							</Icon>
// 						</Link>
// 					</DropdownMenuItem>
// 					<DropdownMenuItem
// 						asChild
// 						// this prevents the menu from closing before the form submission is completed
// 						onSelect={(event) => {
// 							event.preventDefault()
// 							submit(formRef.current)
// 						}}
// 					>
// 						<Form action="/logout" method="POST" ref={formRef}>
// 							<Icon className="text-body-md" name="exit">
// 								<button type="submit">Logout</button>
// 							</Icon>
// 						</Form>
// 					</DropdownMenuItem>
// 				</DropdownMenuContent>
// 			</DropdownMenuPortal>
// 		</DropdownMenu>
// 	)
// }

/*
	
}

*/
