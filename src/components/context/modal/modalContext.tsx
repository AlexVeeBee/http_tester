import React, { createContext } from "react";

export interface OpenModalProps {
    id: string;
    title?: string;
    style?: React.CSSProperties;
    hideCloseButton?: boolean;
    contentStyle?: React.CSSProperties;
    content: (id: string, forceClose: () => void ) => React.ReactNode | React.ReactNode;
    /**
     * Whether the modal should be open or not
     * 
     * This will be set to true when opening the modal
     *
     * @default true
     */
    open?: boolean;
}

export type ModalAPI = {
    openModal: (props: OpenModalProps) => void;
    closeModal: (id: string) => void;
}

export const ModalContext = createContext<ModalAPI | null>(null);