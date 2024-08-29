import { useEffect, useRef, useState } from "react";
import { DropdownProps } from "./context";
import "./dropdown-wrapper.css";
import Icon from "../../icon";


export default function DropdownWrapper({
    dropdowns,
    selectedValue,
    closeDropdown
}: {
    dropdowns: DropdownProps[];
    selectedValue: string;
    closeDropdown: (id: string) => void;
}) {

    const [position, setPosition] = useState<"top" | "bottom">("bottom");
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollMaxHeight, setScrollMaxHeight] = useState<"none" | number>("none");
    const ref = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const virtualScrollRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (ref.current) {
    //         observerResize.observe(ref.current);
    //         checkPosition();
    //     }
    //     return () => {
    //         observerResize.disconnect();
    //     }
    // }, [ref]);
    const checkPosition = () => {
        if (ref.current && virtualScrollRef.current && scrollRef.current) {
            const rect = ref.current.getBoundingClientRect();
            const scrollRect = scrollRef.current.getBoundingClientRect();
            const virtaulscroll = virtualScrollRef.current.getBoundingClientRect();
            setScrollTop(rect.height);

            let bottomPosition = true;

            // check if the scrollRect is below the window.innerHeight
            if (virtaulscroll.bottom > window.innerHeight && rect.y > 100) {
                setPosition("top");
                setScrollMaxHeight(rect.y - 10);
                bottomPosition = false;
            }
            
            if (bottomPosition) {
                setPosition("bottom");
                setScrollMaxHeight(( window.innerHeight - rect.y - rect.height ) - 10 );
            }
            // setScrollTop
            setScrollTop(ref.current ? position === "bottom" ? ref.current.offsetHeight : -scrollRect.height : 0,);
        }
    }
    // console.log("dropdowns", dropdowns);
    // if (!ref.current) return;
    // if (!scrollRef.current) return;
    // if (!virtualScrollRef.current) return;
    // const rect = ref.current.getBoundingClientRect();
    // const scrollRect = scrollRef.current.getBoundingClientRect();
    // const virtaulscroll = virtualScrollRef.current.getBoundingClientRect();
    // setScrollTop(rect.height);

    // // check if the scrollRect is below the window.innerHeight
    // if (virtaulscroll.bottom > window.innerHeight) {
    //     setPosition("top");
    //     setScrollMaxHeight(rect.y - 10);
    // } else {
    //     setPosition("bottom");
    //     setScrollMaxHeight(( window.innerHeight - rect.y - rect.height ) - 10 );
    // }
    
    // setScrollTop(ref.current ? position === "bottom" ? ref.current.offsetHeight : -scrollRect.height : 0);

    useEffect(() => {
        if (!ref.current) return;
        // const observerResize = new ResizeObserver(() => {
        //     checkPosition();
        // });
        checkPosition();
        window.addEventListener("resize", checkPosition);
        // observerResize.observe(ref.current);
        return () => {
            // observerResize.disconnect();
            window.removeEventListener("resize", checkPosition);
        }
    }, [dropdowns, ref.current]);

    // useEffect(() => {
    //     // send a resize event to check the position of the dropdown
    //     window.dispatchEvent(new Event("resize"));
    // }, [dropdowns]);

    return dropdowns.length > 0 && <div className="dropdown-wrapper">
        <div 
            aria-hidden="true"
            role="button"
            className="dropdown-overlay" 
            onClick={() => {
            dropdowns.forEach((dropdown) => {
                closeDropdown(dropdown.id);
                dropdown.onDismiss && dropdown.onDismiss();
            });
        }}></div>
            {dropdowns.map((dropdown) => { return <div key={dropdown.id} className="dropdown" style={{ 
                top: dropdown.y,
                left: dropdown.x,
                width: dropdown.width || 200,
                // maxHeight: window.innerHeight - dropdown.y - 10
            }} ref={ref}>
                <div className="ui-dropdown open flex justify-between items-center"
                    aria-hidden="true"
                    role="button"
                    onClick={() => {
                        closeDropdown(dropdown.id);
                        dropdown.onDismiss && dropdown.onDismiss();
                    }}
                >
                    {dropdown.items.map((item, index) => {
                        if (item.value === selectedValue) {
                            return <div key={index} className="ui-dropdown-item active">{item.label}</div>
                        }
                        return null;
                    })}
                    <Icon name="chevron-up" />
                </div>
                <div className="scroll"
                    ref={scrollRef}
                    style={{
                        position: "absolute",
                        top: scrollTop,
                        // top: ref.current ? position === "bottom" ? ref.current.offsetHeight : -minHeight : 0,
                        left: 0,
                        maxHeight: scrollMaxHeight,
                        // maxHeight: position === "bottom" ? window.innerHeight - dropdown.y - 10 : dropdown.y - 10 + ref.current?.offsetHeight,	
                    }}
                >
                    {dropdown.items.map((item, index) => {
                        return <div key={index} 
                            aria-hidden="true"
                            role="button"
                            className={`item ${selectedValue === item.value ? "selected" : ""}`}
                            onClick={() => {
                                if (dropdown.onClick) {
                                    dropdown.onClick(index);
                                }
                            }}
                        >{item.label}</div>
                    })}
                </div>
                <div className="virtual-scroll" ref={virtualScrollRef}
                    style={{
                        pointerEvents: "none",
                        top: "100%",
                        position: "absolute",
                        height: 200,
                        maxHeight: 300,
                    }} 
                ></div>
            </div>
        })}
    </div>
}