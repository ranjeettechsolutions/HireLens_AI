import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
	{ title: "HireLens | Auth" },
	{ name: "description", content: "Log into your account" },
];

const auth = () => {
	const { isLoading, auth } = usePuterStore();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if(!auth.isAuthenticated) return;

		const params = new URLSearchParams(location.search);
		const nextPath = params.get("next") || "/";

		navigate(nextPath, { replace: true });
	}, [auth.isAuthenticated, location.search, navigate]);

	return (
		<main className="bg-[url('/images/bg-small.svg')] bg-cover object-cover min-h-screen flex items-center justify-center">
			<div className="gradient-border shadow-lg">
				<section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
					<div className="flex flex-col items-center gap-2 text-center">
						<h1>Welcome</h1>
						<h2>Log Into Your Account to Continue Your Job Journey</h2>
					</div>

					<div className="flex justify-center items-center">
						{isLoading ? (
							<button className="auth-button animate-pulse" disabled={isLoading}>
								<p>Signing you in</p>
							</button>
						) : (
							<>
								{auth.isAuthenticated ? (
									<button className="auth-button" onClick={auth.signOut} disabled={isLoading}>
										<p>Log Out</p>
									</button>
								) : (
									<button className="auth-button" onClick={auth.signIn} disabled={isLoading}>
										<p>Log In</p>
									</button>
								)}
							</>
						)}
					</div>
				</section>
			</div>
		</main>
	);
};

export default auth;
