import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
	{ title: "HireLens - Resume Analysis" },
	{
		name: "description",
		content:
			"Detailed analysis of your resume with AI-powered insights tailored to your job description.",
	},
];

const resume = () => {
	const { auth, isLoading, fs, kv } = usePuterStore();
	const { id } = useParams();
	const [resumeUrl, setResumeUrl] = useState<string | null>("");
	const [imageUrl, setImageUrl] = useState<string | null>("");
	const [feedback, setFeedback] = useState<Feedback | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (!auth.isAuthenticated && !isLoading)
			navigate("/auth?next=/resume/" + id);
	}, [auth.isAuthenticated, isLoading]);

	useEffect(() => {
		const loadResumeData = async () => {
			if (!id) return;
			try {
				const resumeData = await kv.get(`resume:${id}`);
				if (!resumeData) return;
				const { resumePath, imagePath, feedback } = JSON.parse(resumeData);

				const resumeBlob = await fs.read(resumePath);
				if (!resumeBlob) return;
				const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
				setResumeUrl(URL.createObjectURL(pdfBlob));

				const imageBlob = await fs.read(imagePath);
				if (!imageBlob) return;
				const imgBlob = new Blob([imageBlob], { type: "image/png" });
				setImageUrl(URL.createObjectURL(imgBlob));

				setFeedback(feedback);
			} catch (error) {
				console.error("Error fetching resume data:", error);
			}
		};

		loadResumeData();
	}, [id]);

	return (
		<main className="pt-0!">
			<Navbar />
			<div className="flex flex-row w-full max-lg:flex-col-reverse">
				<section className="sticky top-0 h-screen sm:pt-16 px-4 flex flex-col items-center justify-center w-1/2 max-lg:w-full bg-[url('/images/bg-small.svg')] bg-cover">
					{imageUrl && resumeUrl && (
						<div className="animate-in fade-in delay-1000 gradient-border xl:h-[90%]">
							<a href={resumeUrl} target="_blank" rel="noopener noreferrer">
								<img
									src={imageUrl}
									alt="Resume Preview"
									className="size-full object-contain rounded-2xl"
									title="Resume Preview"
								/>
							</a>
						</div>
					)}
				</section>

				<section className="feedback-section pt-20">
					<h2 className="text-4xl font-bold text-black!">Resume Review</h2>
					{feedback ? (
						<div className="flex flex-col gap-8 animate-in fade-in duration-1000">
							<Summary feedback={feedback} />
							<ATS
								score={feedback.ATS.score || 0}
								suggestions={feedback.ATS.tips || []}
							/>
							<Details feedback={feedback} />
						</div>
					) : (
						<img
							src="/images/resume-scan-2.gif"
							alt="loading feedback..."
							className="w-full"
						/>
					)}
				</section>
			</div>
		</main>
	);
};

export default resume;
