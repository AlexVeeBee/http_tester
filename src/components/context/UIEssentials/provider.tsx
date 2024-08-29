import { useContext, useState } from "react"
import { DropdownProps, UIEssentialsContext } from "./context";
import DropdownWrapper from "./dropdown-wrapper";

export const UIEssentialsProvider = ({ children }: { children: React.ReactNode }) => {
    const [dropdowns, setDropdowns] = useState<DropdownProps[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>("");


    const openDropdown = (props: DropdownProps, selectedValue: string) => {
        setSelectedValue(selectedValue);
        setDropdowns((prev) => {

            // replace the dropdown if it already exists
            const index = prev.findIndex((dropdown) => dropdown.id === props.id);
            if (index !== -1) {
                prev[index] = {
                    ...props
                }
                return prev;
            }

            return prev.concat({
                ...props,
            });
        });
    }
    const moveDropdown = (id: string, x: number, y: number, width?: number) => {
        setDropdowns((prev) => {
            return prev.map((dropdown) => {
                if (dropdown.id === id) {
                    return {
                        ...dropdown,
                        x,
                        y,
                        width: width || 200
                    }
                }
                return dropdown;
            });
        });
    }
    const closeDropdown = (id: string) => {
        setSelectedValue("");
        setDropdowns((prev) => {
            return prev.filter((dropdown) => dropdown.id !== id);
        });
    }

    const value = {
        openDropdown,
        moveDropdown,
        closeDropdown
    }

    if (typeof window === "undefined") return <UIEssentialsContext.Provider value={value}>{children}</UIEssentialsContext.Provider>

    return <UIEssentialsContext.Provider value={value}>
        <DropdownWrapper dropdowns={dropdowns} closeDropdown={closeDropdown} selectedValue={selectedValue} />
        {children}
    </UIEssentialsContext.Provider>
}

export const UseUIEssentials = () => {
    const context = useContext(UIEssentialsContext);
    if (!context) {
        throw new Error("UseUIEssentials must be used within a UIEssentialsProvider");
    }
    return context;
}