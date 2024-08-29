import * as ic from "@heroicons/react/16/solid"
import { cloneElement } from "react"

const icons = {
    "arrow-down-circle": <ic.ArrowDownCircleIcon />,
    "arrow-up-circle": <ic.ArrowUpCircleIcon />,
    "arrow-up-square": <ic.ArrowUpOnSquareIcon />,
    "arrow-up-square-stack": <ic.ArrowUpOnSquareStackIcon />,
    "chevron-down": <ic.ChevronDownIcon />,
    "chevron-up": <ic.ChevronUpIcon />,
    "add": <ic.PlusIcon />,
    "group": <ic.UserGroupIcon />,
    "key": <ic.KeyIcon />,
    "send": <ic.PaperAirplaneIcon />,
    "cog": <ic.Cog6ToothIcon />,
    "info": <ic.InformationCircleIcon />,
    "sun": <ic.SunIcon />,
    "moon": <ic.MoonIcon />,
    "hashtag": <ic.HashtagIcon />,
    "close": <ic.XMarkIcon />,
    "home": <ic.HomeIcon />,
    // "mail": EnvelopeIcon,
    // "user": UserIcon,
    // "birthday": CakeIcon,
}

export type IconTypes = keyof typeof icons

const defaultStyle = {
    width:  "20px",
    height: "20px",
    display: "block",
}

export default function Icon({ name, className, style }: { 
    name: keyof typeof icons ,
    className?: string
    style?: React.CSSProperties

}) {
    const icon = icons[name]
    if (!icon) return null
    const clone = cloneElement(icon, { className: `icon ${className}`
        , style: { ...defaultStyle, ...style || "" } })

    return clone
}