'use client';
import { ReactNode } from "react";

interface CustomModalProps {
    content: ReactNode,
    title: string
    closeFunction?: () => void
}

const CustomModal = ({ content, title, closeFunction }: CustomModalProps) => {
    return (
        <div className="w-full h-screen bg-transparent backdrop-blur z-40 top-0 left-0 right-0 bottom-0 absolute grid place-items-center">
            <div className="max-h:[80%] w-fit sm:min-w-[425px] bg-gray-50 shadow-md rounded-lg p-3 pt-12 relative">
                <h1 className="w-full text-center bg-primary absolute top-0  left-0 right-0  p-1 rounded-t-lg text-white">{title}</h1>
                <button onClick={closeFunction} className="text-lg text-white absolute top-0 right-4">x</button>
                {content}
            </div>
        </div>
    )
}

export default CustomModal