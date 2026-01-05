import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface fileUploaderProps {
	onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: fileUploaderProps) => {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0] || null;
			onFileSelect?.(file);
		},
		[onFileSelect]
	);

	const maxFileSize = 20 * 1024 * 1024; // 20 MB

	const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
		useDropzone({
			onDrop,
			multiple: false,
			accept: { "application/pdf": [".pdf"] },
			maxSize: maxFileSize,
		});

	const file = acceptedFiles[0] || null;

	return (
		<div className="w-full gradient-border bg-white inset-shadow">
			<div {...getRootProps()}>
				<input {...getInputProps()} />

				<div className="space-y-4 cursor-pointer rounded-2xl	">
					{file ? (
						<div
							className="uploader-selected-file"
							onClick={(e) => e.stopPropagation()}
						>
							<img src="/images/pdf.png" alt="pdf" className="size-10" />
							<div className="flex items-center gap-3">
								<div className="flex flex-col sm:gap-2 gap-1">
									<p className="text-sm font-medium text-gray-700 break-all">
										{file?.name}
									</p>
									<p className="text-sm text-gray-500">
										{formatSize(file?.size || 0)}
									</p>
								</div>
							</div>
							<button
								className="cursor-pointer bg-gray-200 hover:bg-gray-300/70 rounded-full py-1 px-2 sm:py-2 "
								onClick={(e) => {
									onFileSelect?.(null);
								}}
							>
								<img
									src="/icons/cross.svg"
									alt="remove"
									className="sm:size-4 size-6"
								/>
							</button>
						</div>
					) : (
						<div className="py-2">
							<div className="mx-auto mb-2 flex justify-center items-center">
								<img
									src="/icons/info.svg"
									alt="upload"
									className="sm:size-12 size-10"
								/>
							</div>
							<p className="sm:text-base text-sm text-gray-500">
								<span className="font-semibold">Click to upload</span> or drag
								and drop
							</p>
							<p className="text-xs text-gray-400">
								PDF (max {formatSize(maxFileSize)})
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FileUploader;
