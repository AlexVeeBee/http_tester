import { useEffect, useRef, useState } from "react";
import "./httpTester.css";
import Button, { Buttons } from "./../components/buttons";

import { fetch } from "@tauri-apps/plugin-http";
import Icon from "./../components/icon";
import { useModal } from "../components/context/modal/modalProvider";
import { getVersion } from "@tauri-apps/api/app";
import { MEditor } from "../components/MEditor";
import { Dropdown } from "../components/context/UIEssentials/ui";
import TabContainer from "../components/UI/TabContainer";

const statusResponse = (status: number) => {
    switch (status) {
        // 1xx
        case 100: return "Continue";
        case 101: return "Switching Protocols";
        case 102: return "Processing";
        case 103: return "Early Hints";
        // 2xx
        case 200: return "OK";
        case 201: return "Created";
        case 202: return "Accepted";
        case 204: return "No Content";
        case 205: return "Reset Content";
        case 206: return "Partial Content";
        case 207: return "Multi-Status";
        case 208: return "Already Reported";
        case 226: return "IM Used";
        // 3xx
        case 300: return "Multiple Choices";
        case 301: return "Moved Permanently";
        case 302: return "Found";
        case 303: return "See Other";
        case 304: return "Not Modified";
        case 305: return "Use Proxy";
        case 306: return "Switch Proxy";
        case 307: return "Temporary Redirect";
        case 308: return "Permanent Redirect";
        // 4xx
        case 400: return "Bad Request";
        case 401: return "Unauthorized";
        case 403: return "Forbidden";
        case 404: return "Not Found";
        case 405: return "Method Not Allowed";
        case 406: return "Not Acceptable";
        case 408: return "Request Timeout";
        case 409: return "Conflict";
        case 410: return "Gone";
        case 411: return "Length Required";
        case 412: return "Precondition Failed";
        case 413: return "Payload Too Large";
        case 414: return "URI Too Long";
        case 415: return "Unsupported Media Type";
        case 416: return "Range Not Satisfiable";
        case 417: return "Expectation Failed";
        case 418: return "I'm a teapot";
        case 422: return "Unprocessable Entity";
        case 425: return "Too Early";
        case 426: return "Upgrade Required";
        case 428: return "Precondition Required";
        case 429: return "Too Many Requests";
        case 431: return "Request Header Fields Too Large";
        case 451: return "Unavailable For Legal Reasons";
        // 5xx
        case 500: return "Internal Server Error";
        case 502: return "Bad Gateway";
        case 503: return "Service Unavailable";
        case 504: return "Gateway Timeout";
        case 505: return "HTTP Version Not Supported";
        case 506: return "Variant Also Negotiates";
        case 507: return "Insufficient Storage";
        case 508: return "Loop Detected";
        case 510: return "Not Extended";
        case 511: return "Network Authentication Required";
        default: return "Unknown";
    }
}


const HeaderTemplates: {
    name: string;
    headers: Header[];
}[] = [
    {
        name: "Custom",
        headers: [],
    },
    {
        name: "Default-GET",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "application/json" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
        ],
    },
    {
        name: "Default-POST",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "application/json" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
            {scriptRemoveable:true, id: "default-auth", name: "Authorization", value: "Bearer <token>" },
        ],
    },
    {
        name: "Default-PUT",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "application/json" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
            {scriptRemoveable:true, id: "default-auth", name: "Authorization", value: "Bearer <token>" },
        ],
    },
    {
        name: "Default-DELETE",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "application/json" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
            {scriptRemoveable:true, id: "default-auth", name: "Authorization", value: "Bearer <token>" },
        ],
    },
    {
        name: "Default-POST-Form",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "application/x-www-form-urlencoded" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
            {scriptRemoveable:true, id: "default-auth", name: "Authorization", value: "Bearer <token>" },
        ],
    },
    {
        name: "Default-PUT-Form",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "application/x-www-form-urlencoded" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
            {scriptRemoveable:true, id: "default-auth", name: "Authorization", value: "Bearer <token>" },
        ],
    },
    {
        name: "Default-DELETE-Form",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "application/x-www-form-urlencoded" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
            {scriptRemoveable:true, id: "default-auth", name: "Authorization", value: "Bearer <token>" },
        ],
    },
    {
        name: "Default-POST-Multipart",
        headers: [
            {scriptRemoveable:true, id: "default-content-type", name: "Content-Type", value: "multipart/form-data" },
            {scriptRemoveable:true, id: "default-accept", name: "Accept", value: "application/json" },
            {scriptRemoveable:true, id: "default-auth", name: "Authorization", value: "Bearer <token>" },
        ],
    }
]

interface HttpLog {
    id?: string;
    isLocalError?: boolean;
    url: string;
    method: string;
    status: number;
    response: string;
    completeLog?: Response;
}
// dev.coven.chat/api/v1
const Message = ({message}: {message: HttpLog}) => {
    return (
        <div className={`http-message-item ${responseClass(message.status)}`} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="header" style={{ width: "100%", display: "flex", flexDirection: "row", gap: "12px"}}>
                <div className="url">{message.url}</div>
                <div className="method">{message.method}</div>
                <div className="status">{message.status} {statusResponse(message.status)}</div>
            </div>
            
            <div className="response" style={{ width: "100%", height: "100%", overflow: "auto", backgroundColor: "white" }}>
                <iframe srcDoc={message.response} style={{ width: "100%", height: "100%" }}></iframe>
            </div>
        </div>
    );
}

const FullDataView = ({message}: {message: HttpLog}) => {
    return (
        <TabContainer
            tabs={[
                {
                    path: "response",
                    title: "Response",
                    content: <Message message={message} />
                },
                {
                    path: "headers",
                    title: "Headers",
                    content: <div>
                        {
                            !message.completeLog?.headers ? <p>No headers</p> : null
                        }
                        {
                            message.completeLog?.headers && <pre>{JSON.stringify(message.completeLog?.headers, null, 2)}</pre>
                        }
                    </div>
                }
            ]}
            defaultTab="response"
            onTabClick={() => {}}
        />
    );
}


const responseClass = (status: number) => {
    switch (status) {
        case 200: return "success";
        case 201: return "success";
        case 202: return "success";
        case 204: return "success";
        case 205: return "success";
        case 206: return "success";
        case 207: return "success";
        case 208: return "success";
        case 226: return "success";
        case 404: return "error";
        default: return "error";
    }
}

interface Header {
    id?: string;
    enabled?: boolean;
    removeable?: boolean;
    scriptRemoveable?: boolean;
    name: string;
    nameEditable?: boolean;
    value: string;
    valueEditable?: boolean;
}

export default function HttpTester() {
    const [appVer, setAppVer] = useState<string>("");
    const modal = useModal();
    const [protocol, setProtocol] = useState<"http" | "https">("http");
    const [url, setUrl] = useState<string>("localhost:80/");
    const [includeBody, setIncludeBody] = useState<boolean>(false);
    const [sendingLog, setSendingLog] = useState<HttpLog[] | null>(null);

    useEffect(() => {
        // check if the url has a protocol, if so, remove it
        if (url.startsWith("http://")) {
            setProtocol("http");
            setUrl(url.replace("http://", ""));
        } 
        if (url.startsWith("https://")) {
            setProtocol("https");
            setUrl(url.replace("https://", ""));
        }
    })

    const [method, setMethod] = useState<string>("GET");
    const [headers, setHeaders] = useState<Header[]>([
    ]);


    // <string, string>[]>([]);
    // const [headers, setHeaders] = useState<Record<string, string>>({});
    // const [headers, setHeaders] = useState<Record<string, string>[]>([]);


    const [body, setBody] = useState<string>("");

    const [logs, setLogs] = useState<HttpLog[]>([]);

    const SendRequest = async () => {
        const randomId = Math.random().toString(36).substring(7);
        setSendingLog((sendingLog) => {
            return [...(sendingLog || []), {
                id: randomId,
                url: url,
                method: method,
                status: 0,
                response: ""
            }];
        });
        try {
            const header = headers.reduce((acc, header) => {
                if (header.enabled === false) return acc;

                if (header.name !== "") {
                    acc[header.name] = header.value;
                }
                return acc;
                // if (Object.keys(header)[0] !== "") {
                //     acc[Object.keys(header)[0]] = Object.values(header)[0];
                // }
                // return acc;
            }, {} as Record<string, string>);

            const res = await fetch(`${protocol}://${url}`, {
                body: includeBody ? body : undefined,
                method: method,
                headers: header,
            });

            if (!res.ok) {
                const data = await res.text();
                setLogs((logs) => [...logs, {
                    url: url,
                    method: method,
                    status: res.status,
                    response: data,
                    completeLog: res,
                }]);
                return;
            }

            const data = await res.text();

            setLogs((logs) => [...logs, {
                url: url,
                method: method,
                status: res.status,
                response: data,
                completeLog: res,
            }]);
        } catch (e: any) {
            console.error("Error sending request", e);
            setLogs((logs) => [...logs, {
                isLocalError: true,
                url: "Local Error: " + url,
                method: method,
                status: 500,
                response: e.toString()
            }]);
        } finally {
            setSendingLog((sendingLog) => {
                return (sendingLog || []).filter((log) => log.id !== randomId);
            });
        }
    }

    const logRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (autoScroll) {
            logRef.current?.scrollTo(0, logRef.current?.scrollHeight);
        }
    }, [logs]);

    useEffect(() => {
        if (!logRef.current) return;
        const log = logRef.current;

        // go to bottom
        log.scrollTo(0, log.scrollHeight);

        log.onscroll = () => {
            if (log.scrollHeight - log.scrollTop === log.clientHeight) {
                setAutoScroll(true);
            } else {
                // check if the logs is scrollable
                // if not then set auto scroll to true
                if (log.scrollHeight <= log.clientHeight) {
                    setAutoScroll(true);
                } else {
                    setAutoScroll(false);
                }
            }
        }
        // height change
        log.onresize = () => {
            if (log.scrollHeight - log.scrollTop === log.clientHeight) {
                setAutoScroll(true);
            } else {
                // check if the logs is scrollable
                // if not then set auto scroll to true
                if (log.scrollHeight <= log.clientHeight) {
                    setAutoScroll(true);
                } else {
                    setAutoScroll(false);
                }
            }
        }

        return () => {
            log.onscroll = null;
            log.onresize = null;
        }
    }, [logRef.current]);

    const viewFullData = (message: HttpLog) => {
        modal.openModal({
            id: "http-tester-full-data",
            title: "Response",
            style: {
                width: "100%",
                height: "100%"
            },
            content: () => {
                return <FullDataView message={message} />
            }
        })
    }

    useEffect(() => {
        getVersion().then((ver) => {
            setAppVer(ver);
        })
    }, []);

    return (
        <div className="http_tester">
            <div className="emitter">
                <div className="inputs">
                    <select value={protocol} onChange={(e) => setProtocol(e.target.value as "http" | "https")}>
                        <option value="http">http</option>
                        <option value="https">https</option>
                    </select>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                        style={{ width: "100%" }}
                    />
                    <Button className="field btn-clear" onClick={() => {
                        SendRequest();                        
                    }}><Icon name="send"/></Button>
                </div>
                <div className="inputs" style={{ height:"100%", flexShrink: 1, }}>
                    <div className="style padded" style={{ height: "100%", display: "flex", flexDirection: "column", width: "100%", }}>
                        <div className="body-opts" style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                            <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                                <input id="includeBody" type="checkbox" checked={includeBody} onChange={(e) => setIncludeBody(e.target.checked)} />
                                <label htmlFor="includeBody">Include Body</label>
                            </div>
                        </div>
                        {
                            includeBody && (
                                <div
                                    style={{
                                        minWidth: "100px",
                                        minHeight: "100px",
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        width: "100%",
                                        height: "100%",
                                        paddingBottom: "12px",
                                        resize: "both",
                                        overflow: "auto",
                                        border: "1px solid #ccc",
                                    }}
                                >
                                    <MEditor
                                        width={"100%"}
                                        height={"100%"}
                                        theme="vs-dark"
                                        language="json"
                                        value={body}
                                        onChange={(value) => setBody(value || "")}
                                        options={{
                                            minimap: {
                                                enabled: false
                                            }
                                        }}
                                    />
                                </div>
                            )
                        }

                        {
                            !includeBody && (
                                <p>
                                    {
                                        method === "GET" ? "GET requests do not have a body" : "This request does not have a body"
                                    }
                                </p>
                            )
                        }
                    </div>
                </div>
                <div className="inputs inputs-headers flex column" style={{ height:"100%",
                    flexShrink: 1,
                 }}>
                    <div className="headers-header">
                        <Dropdown 
                            id="header-templates"
                            value="Custom"
                            items={[
                                ...HeaderTemplates.map((header) => ({ label: header.name, value: header.name }))
                            ]}
                            onChange={(headers) => {
                                const template = HeaderTemplates.find((header) => header.name === headers);
                                if (template) {
                                    setHeaders((headers) => {
                                        // remove the script removeable headers
                                        headers = headers.filter((header) => !header.scriptRemoveable);
                                        // add the headers to the list to the very front
                                        headers = [
                                         ...template.headers.map((header) => ({ ...header, enabled: true })),
                                         ...headers];
                                        return headers;
                                    });
                                }
                            }}
                        />
                        <Button onClick={() => {
                            setHeaders((headers) => {
                                return [...headers, { enabled: true, name: "", value: "", removeable: true, scriptRemoveable: false }];
                            });
                        }}>
                            <Icon name="add"/>
                        </Button>
                    </div>
                    {/* headers */}
                    { headers.map((header, i) => (
                        <div key={i} className="header">
                            <input type="checkbox" checked={header.enabled} onChange={(e) => {
                                setHeaders((headers) => {
                                    headers[i] = { ...header, enabled: e.target.checked };
                                    return [...headers];
                                });
                            }}
                                style={{ width: "20px" }}
                            />
                            <input type="text" value={header.name} onChange={(e) => {
                                setHeaders((headers) => {
                                    headers[i] = { ...header, name: e.target.value };
                                    return [...headers];
                                });
                            }} 
                            readOnly={!header.nameEditable}
                            />
                            <input type="text" value={header.value} onChange={(e) => {
                                setHeaders((headers) => {
                                    headers[i] = { ...header, value: e.target.value };
                                    return [...headers];
                                });
                            }}
                            readOnly={!header.valueEditable}
                            />
                            {
                                header.removeable && (
                                    <Button onClick={() => {
                                        setHeaders((headers) => {
                                            return headers.filter((_, index) => index !== i);
                                        });
                                    }}><Icon name="close"/></Button>
                                )
                            }
                        </div>
                    ))}
                </div>
                {/* <div className="inputs">
                </div> */}
                <div className="inputs">
                    <p>HTTP tester: {appVer}</p>
                </div>
            </div>
            <div className="responses">
                <div className="res-header">
                    <Buttons.LiminalButton onClick={() => {
                        setLogs([]);
                    }}>Clear Logs</Buttons.LiminalButton>
                    {
                        !autoScroll && (
                            <Buttons.LiminalButton onClick={() => {
                                setAutoScroll(true);
                            }}>Scroll to bottom</Buttons.LiminalButton>
                        )
                    }
                </div>
                <div className="responses-inner" ref={logRef}>
                    {
                        logs.map((log, i) => (
                            <div key={i} className={`http-message-item ${responseClass(log.status)}`}
                                onClick={() => { viewFullData(log) }}
                            >
                                {
                                    log.isLocalError && (
                                        <>
                                            <div className="localerror" style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                                                <Icon name="close" />
                                                <p>Local Error</p>
                                            </div>
                                        </>
                                    )
                                }
                                <div className="header">
                                    <div className="url">{log.url}</div>
                                    <div className="method">{log.method}</div>
                                    <div className="status">{log.status} {statusResponse(log.status)}</div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        logs.length === 0 && (
                            <div className="http-message-item welcome"
                                style={{ gap: "24px" }}
                            >
                                <div>
                                    <Icon name="info" style={{
                                        width: "76px",
                                        height: "76px",
                                    }} />
                                </div>
                                <div>
                                    <h1>Welcome to the HTTP tester</h1>
                                    <p>Send a request to see the response here</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        sendingLog && sendingLog.map((log) => (
                            <div key={log.id} className={`http-message-item sending`}>
                                <div className="header">
                                    <div className="url">{log.url}</div>
                                    <div className="method">{log.method}</div>
                                    <div className="status">{
                                        log.method === "GET" ? "Requesting..." : "Sending..."
                                    }</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}