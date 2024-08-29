import { ReactNode, useEffect, useState } from "react";
import { Buttons } from "./../buttons";
import "./TabContainer.css";

interface TabContainerProps {
    tabs: {
        path: string;
        title: string;
        content: ReactNode;
        default?: boolean;
    }[];
    tab?: string;
    defaultTab: string;
    style?: React.CSSProperties;
    className?: string;
    onTabClick: (title: string) => void;
}

export default function TabContainer({
    tabs,
    tab,
    defaultTab,
    style = {},
    className = "",
    onTabClick
}: TabContainerProps) {
    const [_tabpath, setTabpath] = useState(defaultTab);

    useEffect(() => {
        if (tab) {
            setTabpath(tab);
        }
    }, []);

    return (
        <div className={`tab-container ${className}`} style={style}>
            <div className="tabs">
                <div className="content">
                    {
                        tabs.map((t) => (
                            <Buttons.LiminalButton
                                key={t.path}
                                className={`item ${_tabpath === t.path ? "active" : ""}`}
                                onClick={() => {
                                    onTabClick(t.path);
                                    setTabpath(t.path);
                                }}
                            >
                                {t.title}
                            </Buttons.LiminalButton>
                        ))
                    }
                </div>
            </div>
            <div className="content">
                {tabs.map((t, i) => (
                    <div key={i} className={`tab ${_tabpath === t.path ? "active" : ""}`}>{t.content}</div>
                ))}
            </div>
        </div>
    );
}