import "./ui.css"
import { useEffect, useRef, useState } from "react";
import { UseUIEssentials } from "./provider";
import Icon from "../../icon";

interface UIDropdownProps {
    id: string;
    value?: string;
    items: {
        value: string;
        label: string;
    }[];
    style?: React.CSSProperties;
    onChange?: (selected: string) => void;
}

export const Dropdown = ({
    id,
    items,
    value,
    style,
    onChange
}: UIDropdownProps) => {
    const [selected, setSelected] = useState(value);
    const [selectedIndex, setSelectedIndex] = useState<number>(
        items.findIndex((item) => item.value === value)
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    const essentials = UseUIEssentials();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const openDropdown = (x: number, y: number) => {
        setOpen(true);
        essentials.openDropdown({
            id,
            x,
            y,
            width: dropdownRef.current?.offsetWidth,
            items,
            onClick: (index) => {
                setSelected(items[index].value);
                setSelectedIndex(index);
                if (onChange) onChange(items[index].value);
                closeDropdown();
            },
            onDismiss: () => {
                closeDropdown();
            }
        }, items.find((item) => item.value === selected)?.value || "");
    }

    const moveDropdown = (x: number, y: number, width: number) => {
        essentials.moveDropdown(id, x, y, width);
    }
    const closeDropdown = () => {
        essentials.closeDropdown(id);
        setOpen(false);
    }
    const HandleResize = () => {
        if (!dropdownRef.current) return;
        const rect = dropdownRef.current.getBoundingClientRect();
        moveDropdown(rect.left, rect.top, dropdownRef.current.offsetWidth);
    }

    useEffect(() => {
        window.addEventListener("resize", HandleResize);
        return () => {
            window.addEventListener("resize", HandleResize);
        }
    }, []);

    return (
        <div ref={dropdownRef} className={`ui-dropdown ${open ? "open" : ""}`} style={style}
            onClick={() => {
                if (dropdownRef.current) {
                    const rect = dropdownRef.current.getBoundingClientRect();
                    openDropdown(rect.left, rect.top);
                }
            }}
            aria-hidden
        >
            {items[selectedIndex].label}
            <Icon name="chevron-down" />
        </div>
    )
}