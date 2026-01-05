import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const upload = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [statusText, setStatusText] = useState("");
	const [file, setFile] = useState<File | null>(null);

	const { auth, isLoading, fs, ai, kv } = usePuterStore();
	const navigate = useNavigate();

	const handleAnalyze = async ({
		companyName,
		jobTitle,
		jobDescription,
		file,
	}: {
		companyName: string;
		jobTitle: string;
		jobDescription: string;
		file: File;
	}) => {
		setIsProcessing(true);
		setStatusText("Uploading your resume...");

		const uploadedFile = await fs.upload([file]);
		if (!uploadedFile) {
			setIsProcessing(false);
			setStatusText("Failed to upload file. Please try again.");
			return;
		}

		setStatusText("Converting to image...");
		const imageFile = await convertPdfToImage(file);
		if (!imageFile.file) {
			setIsProcessing(false);
			setStatusText("Failed to convert PDF to image. Please try again.");
			return;
		}

		setStatusText("Uploading the image...");
		const uploadedImage = await fs.upload([imageFile.file]);
		if (!uploadedImage) {
			setIsProcessing(false);
			setStatusText("Failed to upload image. Please try again.");
			return;
		}

		setStatusText("Preparing analysis...");
		const uuid = generateUUID();
		const analysisData = {
			id: uuid,
			resumePath: uploadedFile.path,
			imagePath: uploadedImage.path,
			companyName,
			jobTitle,
			jobDescription,
			feedback: "",
		};

		await kv.set(`resume:${uuid}`, JSON.stringify(analysisData));

		setStatusText("Analyzing your resume...");

		const feedback = await ai.feedback(
			uploadedFile.path,
			prepareInstructions({
				jobTitle,
				jobDescription,
			})
		);
		if (!feedback) {
			setIsProcessing(false);
			setStatusText("Failed to analyze resume. Please try again.");
			return;
		}

		const feedbackContent = feedback.message.content;

		const feedbackText =
			typeof feedbackContent === "string"
				? feedbackContent
				: feedbackContent[0].text;

		analysisData.feedback = JSON.parse(feedbackText);
		await kv.set(`resume:${uuid}`, JSON.stringify(analysisData));
		setStatusText("Analysis complete! Redirecting to results...");
		setIsProcessing(false);

		navigate(`/resume/${uuid}`);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Handle submit function executed!!");

		const form = e.currentTarget;
		const formData = new FormData(form);
		console.log(formData);

		const companyName = formData.get("company-name") as string;
		const jobTitle = formData.get("job-title") as string;
		const jobDescription = formData.get("job-description") as string;

		if (!file) return;
		console.log("Form data -", companyName, jobTitle, jobDescription, file);

		// handleAnalyze({ companyName, jobTitle, jobDescription, file });
	};

	const handleFileSelect = (file: File | null) => {
		setFile(file);
	};

	return (
		<main className="bg-[url('/images/bg-small.svg')] bg-cover object-cover relative">
			<Navbar />

			<section className="main-section">
				<div className="page-heading py-16">
					<h1>Get your resume ATS-Ready in Minutes</h1>

					{isProcessing ? (
						<>
							<h2>{statusText}</h2>
							<img src="/images/resume-scan.gif" className="size-96" />
						</>
					) : (
						<h2>Drop your resume for an ATS score and improvement tips</h2>
					)}

					{!isProcessing && (
						<form
							id="upload-form"
							onSubmit={handleSubmit}
							className="flex flex-col mt-8"
						>
							{/* Company Name */}
							<div className="form-div">
								<label htmlFor="company-name">Company Name</label>
								<input
									type="text"
									id="company-name"
									name="company-name"
									placeholder="e.g. Google, Amazon, Infosys"
									required
								/>
							</div>
							{/* Job Title */}
							<div className="form-div">
								<label htmlFor="job-title">Job Title</label>
								<input
									type="text"
									id="job-title"
									name="job-title"
									placeholder="e.g. Frontend Developer, Software Engineer"
									required
								/>
							</div>
							{/* Job Description */}
							<div className="form-div">
								<label htmlFor="job-description">Job Description</label>
								<textarea
									id="job-description"
									name="job-description"
									placeholder="Paste the job description from the company's job posting here."
									rows={5}
									required
								></textarea>
							</div>

							<div className="form-div">
								<label htmlFor="uploader">Upload Resume (PDF only)</label>
								<FileUploader onFileSelect={handleFileSelect} />
							</div>

							<button
								type="submit"
								className="primary-button font-semibold mt-4 sm:mt-6"
							>
								Analyze Resume
							</button>
						</form>
					)}
				</div>
			</section>
		</main>
	);
};

export default upload;
