import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta() {
	return [
		{ title: "HireLens AI" },
		{ name: "description", content: "Where resumes meet reality" },
	];
}

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
		<main className="bg-[url('/images/bg-small.svg')] bg-cover object-cover">
			<Navbar />

			<section className="main-section">
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
					<div className="flex flex-col items-center justify-center">
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

				<div className="pt-4 mt-20 flex sm:justify-between items-center text-center gap-4 flex-col md:flex-row container">
					<a
						href="https://hirelensai.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="HireLens ATS"
						className="text-gradient hover:gradient-hover"
					>
						© {new Date().getFullYear()} HireLens | Designed for Modern Hiring
						Systems.
					</a>

					<a
						href="https://ranjeettechsolutions.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Developed by RanjeetTechSolutions™"
						className="text-gradient hover:gradient-hover"
					>
						Developed by RanjeetTechSolutions™.
					</a>
				</div>
			</section>
		</main>
	);
}
