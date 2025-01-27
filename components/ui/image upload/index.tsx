import { X } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
    allowableFiles: number;
    files: File[];
    setFiles: (files: File[]) => void;
}

const ImageUpload = ({ allowableFiles, files, setFiles }: FileUploadProps) => {
    const [message, setMessage] = useState('');

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage("");
        let newFiles = Array.from(e.target.files || []);
        handleFiles(newFiles);
    };

    const handleFiles = (newFiles: File[]) => {
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        let validFiles: File[] = [];
        let invalidFiles = false;

        if (files.length + newFiles.length > allowableFiles) {
            setMessage(`Only ${allowableFiles} files are allowed`);
            return;
        }

        newFiles.forEach((file) => {
            if (validImageTypes.includes(file.type)) {
                validFiles.push(file);
            } else {
                invalidFiles = true;
            }
        });

        if (invalidFiles) {
            setMessage("Only images are accepted");
        }

        if (validFiles.length > 0) {
           // setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setMessage("");
        let newFiles = Array.from(e.dataTransfer.files);
        handleFiles(newFiles);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    };

    const removeImage = (name: string) => {
        setFiles(files.filter((file) => file.name !== name));
    };

    return (
        <div className="flex justify-center items-center px-3">
            <div className="rounded-lg shadow-xl bg-gray-50">
                <div className="m-4">
                    <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">{message}</span>
                    <div className="flex items-center justify-center w-full">
                        <label
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="flex cursor-pointer flex-col w-full h-32 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300"
                        >
                            <div className="flex flex-col items-center justify-center pt-7">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                    Drag and drop a photo, or click to select
                                </p>
                            </div>
                            <input
                                type="file"
                                onChange={handleFile}
                                className="opacity-0"
                                multiple
                                name="files[]"
                            />
                        </label>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((file, key) => (
                            <div key={key} className="overflow-hidden relative h-20 w-20">
                                <X
                                    className="w-6 h-6 text-red-500 cursor-pointer absolute top-1 right-1"
                                    onClick={() => removeImage(file.name)}
                                />
                                {/* <img
                                    className="h-full w-full rounded-md object-cover"
                                    src={URL.createObjectURL(file)}
                                /> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageUpload;
