import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

export function meta() {
	return [
		{ title: "HireLens | Upload" },
		{
			name: "description",
			content: "Upload your resume for ATS score and improvement tips",
		},
	];
}

const upload = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [statusText, setStatusText] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

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
		if (isProcessing) return; // prevents double submit

		const form = e.currentTarget;
		const formData = new FormData(form);

		const companyName = formData.get("company-name") as string;
		const jobTitle = formData.get("job-title") as string;
		const jobDescription = formData.get("job-description") as string;

		const validationErrors = validateForm({
			companyName,
			jobTitle,
			jobDescription,
			file,
		});

		setErrors(validationErrors);

		if (Object.keys(validationErrors).length > 0) return; // Stop Submission
		if (!file) return;
		handleAnalyze({ companyName, jobTitle, jobDescription, file });
	};

	const handleFileSelect = (fileProp: File | null) => {
		setFile(fileProp);
		if (fileProp) clearError("file");
	};

	const validateForm = ({
		companyName,
		jobTitle,
		jobDescription,
		file,
	}: {
		companyName: string;
		jobTitle: string;
		jobDescription: string;
		file: File | null;
	}) => {
		const newErrors: Record<string, string> = {};

		if (!companyName.trim()) {
			newErrors.companyName = "Company name is required";
		}

		if (!jobTitle.trim()) {
			newErrors.jobTitle = "Job title is required";
		}

		if (jobDescription.trim().length < 50) {
			newErrors.jobDescription =
				"Job description must be at least 50 characters";
		}

		if (!file) {
			newErrors.file = "Please upload your resume (PDF)";
		}

		return newErrors;
	};

	const clearError = (field: string) => {
		setErrors((prev) => {
			if (!prev[field]) return prev;

			const { [field]: _, ...rest } = prev;
			return rest;
		});
	};

	return (
		<main className="bg-[url('/images/bg-small.svg')] bg-cover object-cover relative">
			<Navbar />

			<section className="main-section">
				<div className="page-heading py-16">
					<h1>Get your resume ATS-Ready in Seconds</h1>

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
									onInput={(e) => {
										if ((e.target as HTMLInputElement).value.trim()) {
											clearError("companyName");
										}
									}}
								/>
								{errors.companyName && (
									<p className="text-red-500 text-sm mt-1">
										{errors.companyName}
									</p>
								)}
							</div>
							{/* Job Title */}
							<div className="form-div">
								<label htmlFor="job-title">Job Title</label>
								<input
									type="text"
									id="job-title"
									name="job-title"
									placeholder="e.g. Frontend Developer, Software Engineer"
									onInput={(e) => {
										if ((e.target as HTMLInputElement).value.trim()) {
											clearError("jobTitle");
										}
									}}
								/>
								{errors.jobTitle && (
									<p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
								)}
							</div>
							{/* Job Description */}
							<div className="form-div">
								<label htmlFor="job-description">Job Description</label>
								<textarea
									id="job-description"
									name="job-description"
									placeholder="Paste the job description from the company's job posting here."
									rows={5}
									onInput={(e) => {
										if (
											(e.target as HTMLTextAreaElement).value.trim().length >=
											50
										) {
											clearError("jobDescription");
										}
									}}
								></textarea>
								{errors.jobDescription && (
									<p className="text-red-500 text-sm mt-1">
										{errors.jobDescription}
									</p>
								)}
							</div>

							<div className="form-div">
								<label htmlFor="uploader">Upload Resume (PDF only)</label>
								<FileUploader file={file} onFileSelect={handleFileSelect} />
								{errors.file && (
									<p className="text-red-500 text-sm mt-1">{errors.file}</p>
								)}
							</div>

							<button
								type="submit"
								disabled={isProcessing}
								className="primary-button font-semibold mt-4 sm:mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
