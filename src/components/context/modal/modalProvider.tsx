import { useContext, useState } from "react";
import { ModalContext, ModalAPI, OpenModalProps } from "./modalContext"
import Modal from "./modal";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modals, setModals] = useState<OpenModalProps[]>([]);

    const openModal = (props: OpenModalProps) => {
        // add the modal to the list of modals
        setModals((prev) => {
            return prev.concat({
                ...props,
                open: false
            });
        });
        
        setTimeout(() => {
            setModals((prev) => {
                const index = prev.findIndex((modal) => modal.id === props.id);
                if (index === -1) return prev;
                const modal = prev[index];
                modal.open = true;

                // set other modals to false
                return prev.slice(0, index).concat(modal).concat(prev.slice(index + 1));
            });
        }, 0);
    }

    const closeModal = (id: string) => {
        const index = modals.findIndex((modal) => modal.id === id);
        if (index === -1) return;
        const modal = modals[index];
        modal.open = false;
        setModals((prev) => {
            return prev.slice(0, index).concat(modal).concat(prev.slice(index + 1));
        })
        setTimeout(() => {
            setModals((prev) => {
                return prev.filter((m) => m.id !== id);
            });
        }, 300);
    }

    const value: ModalAPI = {
        openModal,
        closeModal
    }

    return <ModalContext.Provider value={value}>
        <div className={`modal-container ${modals.length > 0 ? "open" : ""}`}>
            {modals.map((modal) => {
                return <Modal 
                    modalId={modal.id}
                    key={modal.id} 
                    title={modal.title} 
                    showCloseButton={!modal.hideCloseButton}
                    style={modal.style}
                    contentStyle={modal.contentStyle}
                    show={modal.open ?? true}
                >
                    {modal.content(modal.id, () => {closeModal(modal.id)})}
                </Modal>
            })}
        </div>
        {children}
    </ModalContext.Provider>
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}