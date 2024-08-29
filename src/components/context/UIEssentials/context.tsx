import { createContext } from "react";

export interface DropdownProps {
    id: string;
    x: number;
    y: number;
    width?: number;
    items: {
        value: string;
        label: string;
    }[];
    onClick?: (index: number) => void;
    onDismiss?: () => void;
}

interface UIEssentialsContextProps {
    openDropdown: (props: DropdownProps, selectedValue: string) => void;
    moveDropdown: (id: string, x: number, y: number, width?: number) => void;
    closeDropdown: (id: string) => void;
}

export const UIEssentialsContext = createContext<UIEssentialsContextProps | null>(null);