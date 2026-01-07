import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface fileUploaderProps {
	file: File | null;
	onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ file, onFileSelect }: fileUploaderProps) => {
	const maxFileSize = 20 * 1024 * 1024; // 20 MB

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			onFileSelect?.(acceptedFiles[0] || null);
		},
		[onFileSelect]
	);

	const { getRootProps, getInputProps, open } = useDropzone({
		onDrop,
		multiple: false,
		accept: { "application/pdf": [".pdf"] },
		maxSize: maxFileSize,
		noClick: true,
		noKeyboard: true,
	});

	return (
		<div className="w-full gradient-border bg-white inset-shadow">
			<div {...getRootProps()}>
				<input {...getInputProps()} />

				<div className="space-y-4 rounded-2xl">
					{file ? (
						<div
							className="uploader-selected-file"
							onClick={(e) => e.stopPropagation()}
						>
							<img src="/images/pdf.png" alt="pdf" className="size-10" />

							<div className="flex flex-col gap-1">
								<p className="text-sm font-medium text-gray-700 break-all">
									{file?.name}
								</p>
								<p className="text-sm text-gray-500">{formatSize(file.size)}</p>
							</div>

							<button
								type="button"
								className="cursor-pointer bg-gray-200 hover:bg-gray-300/70 rounded-full p-2"
								onClick={(e) => {
									onFileSelect?.(null);
								}}
							>
								<img src="/icons/cross.svg" alt="remove" className="size-4" />
							</button>
						</div>
					) : (
						<div className="py-2 cursor-pointer text-center" onClick={open}>
							<img
								src="/icons/info.svg"
								alt="upload"
								className="mx-auto mb-2 size-10"
							/>
							<p className="text-sm text-gray-500">
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
