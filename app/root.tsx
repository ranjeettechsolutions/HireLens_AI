import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { usePuterStore } from "./lib/puter";
import { useEffect } from "react";

export const meta: Route.MetaFunction = () => {
	return [
		{ property: "og:type", content: "website" },
		{
			property: "og:title",
			content: "HireLens — Optimize your resume in seconds.",
		},
		{
			name: "description",
			content:
				"Scan your resume, get an ATS score, and receive actionable improvement tips built for modern hiring systems.",
		},
		{
			property: "og:image",
			content:
				"https://res.cloudinary.com/drypmkfdn/image/upload/v1767975468/og-image_qix7sd.png",
		},
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{
			property: "og:image:alt",
			content:
				"HireLens resume analysis platform showing ATS score and improvement insights",
		},
		{ property: "og:url", content: "https://hirelensai.vercel.app/" },
		{
			property: "og:site_name",
			content: "HireLens",
		},

		// Optional but recommended
		{ name: "twitter:card", content: "summary_large_image" },
		{
			name: "twitter:title",
			content: "HireLens — Optimize your resume in seconds.",
		},
		{
			name: "twitter:description",
			content:
				"ATS score analysis and resume improvement tips designed for real hiring systems.",
		},
		{
			name: "twitter:image",
			content:
				"https://res.cloudinary.com/drypmkfdn/image/upload/v1767975468/og-image_qix7sd.png",
		},
	];
};

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const { init } = usePuterStore();

	useEffect(() => {
		init();
	}, [init]);

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body suppressHydrationWarning className="select-none scroll-smooth">
				<script src="https://js.puter.com/v2/"></script>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
