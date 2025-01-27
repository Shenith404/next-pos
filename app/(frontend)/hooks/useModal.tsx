import CustomModal from "@/components/ui/customModal";
import { ReactNode, useState } from "react";

const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const Modal = ({
        content,
        title,
    }: {
        content: ReactNode;
        title: string;
    }) =>
        isOpen ? (
            <CustomModal
                content={content}
                title={title}
                closeFunction={closeModal}
            />
        ) : null;

    return { Modal, openModal, closeModal, isOpen };
};

export default useModal;
