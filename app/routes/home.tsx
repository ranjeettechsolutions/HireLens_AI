import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export const meta = () => {
	return [
		{ title: "HireLens AI" },
		{ property: "og:type", content: "website" },
		{
			property: "og:title",
			content: "HireLens AI",
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

export default function Home() {
	const { auth, kv } = usePuterStore();
	const navigate = useNavigate();
	const [resumes, setResumes] = useState<Resume[]>([]);
	const [loadingResumes, setLoadingResumes] = useState<boolean>(false);

	useEffect(() => {
		if (!auth.isAuthenticated) navigate("/auth?next=/");
	}, [auth.isAuthenticated]);

	useEffect(() => {
		const loadResumes = async () => {
			setLoadingResumes(true);

			const storedResumes = (await kv.list("resume:*", true)) as KVItem[];

			const parsedResumes = storedResumes?.map(
				(resume) => JSON.parse(resume.value) as Resume
			);

			setResumes(parsedResumes || []);
			setLoadingResumes(false);
		};
		loadResumes();
	}, []);

	return (
		<main className="min-h-screen flex flex-col bg-[url('/images/bg-small.svg')] bg-cover">
			<Navbar />

			<section className="main-section flex-1 justify-center">
				<div className="page-heading py-16">
					<h1>Smart feedback for Modern Hiring Systems</h1>

					{!loadingResumes && resumes?.length === 0 ? (
						<h2 className="mt-4 text-gray-600">
							Upload your resume and instantly see how well it performs in
							Applicant Tracking Systems.
						</h2>
					) : (
						<h2>Review your submissions and check AI-powered feedback.</h2>
					)}
				</div>
				{loadingResumes && (
					<div className="flex items-center justify-center">
						<img
							src="/images/resume-scan-2.gif"
							alt="Scanning resumes"
							className="w-50"
						/>
					</div>
				)}

				{!loadingResumes && resumes.length > 0 && (
					<div className="resumes-section">
						{resumes.map((resume) => (
							<ResumeCard key={resume.id} resume={resume} />
						))}
					</div>
				)}

				{!loadingResumes && resumes?.length === 0 && (
					<div className="flex flex-col items-center justify-center mt-10 gap-4">
						<Link
							to="/upload"
							className="primary-button w-fit text-xl font-semibold"
						>
							Upload Resume
						</Link>
					</div>
				)}

				<div className="py-5 px-3 mt-20 mx-auto flex sm:justify-between items-center text-center gap-4 flex-col md:flex-row container">
					<a
						href="https://hirelensai.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="HireLens ATS"
						className="text-gradient hover:gradient-hover"
					>
						© {new Date().getFullYear()} HireLens | Designed for Modern Hiring
						Systems
					</a>

					<a
						href="https://ranjeettechsolutions.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Developed by RanjeetTechSolutions™"
						className="text-gradient hover:gradient-hover"
					>
						Developed by RanjeetTechSolutions™
					</a>
				</div>
			</section>
		</main>
	);
}
