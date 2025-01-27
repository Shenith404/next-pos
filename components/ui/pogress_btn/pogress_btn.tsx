
'use client'
const ProgressButton = ({
    width,
    handleClick,
    title,
    isSubmitting,
}: {
    width: string;
    title: string;
    handleClick: any;
    isSubmitting: boolean;
}) => {
    const baseStyle =
        `${width} min-w-[120px] px-1 py-[7px] rounded-md text-white transition duration-300 ease-in-out`;
    const defaultStyle = `${baseStyle} bg-primary hover:bg-primary/90`;
    const submittingStyle = `${baseStyle} bg-gray-500 cursor-not-allowed`;

    return (
        <div className={` flex items-center justify-center`}>
            <button
                disabled={isSubmitting}
                className={isSubmitting ? submittingStyle : defaultStyle}
                onClick={handleClick}
            >
                {!isSubmitting ? (
                    <div className="text-sm">{title}</div>
                ) : (
                    <div className="flex items-center justify-center">
                        <svg
                            className="w-6 h-6 animate-spin stroke-background"
                            viewBox="0 0 256 256"
                        >
                            <line
                                x1="128"
                                y1="32"
                                x2="128"
                                y2="64"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                            <line
                                x1="195.9"
                                y1="60.1"
                                x2="173.3"
                                y2="82.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                            <line
                                x1="224"
                                y1="128"
                                x2="192"
                                y2="128"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                            <line
                                x1="195.9"
                                y1="195.9"
                                x2="173.3"
                                y2="173.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                            <line
                                x1="128"
                                y1="224"
                                x2="128"
                                y2="192"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                            <line
                                x1="60.1"
                                y1="195.9"
                                x2="82.7"
                                y2="173.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                            <line
                                x1="32"
                                y1="128"
                                x2="64"
                                y2="128"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                            <line
                                x1="60.1"
                                y1="60.1"
                                x2="82.7"
                                y2="82.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="24"
                            ></line>
                        </svg>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ProgressButton;
