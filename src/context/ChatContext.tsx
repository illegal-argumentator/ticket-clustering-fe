import {createContext, useContext, useState, ReactNode, useEffect} from "react";

interface Message {
    sender: "user" | "bot";
    text?: string;
    answers?: Answer[];
    isAI?: boolean;
}

interface ChatContextType {
    messages: Message[];
    isTyping: boolean;
    sendMessage: (text: string) => void;
    appReady: boolean;
}

interface FindTicketRequest {
    question: string;
}

interface Answer {
    content: string;
    score?: number;
}

interface FindTicketResponse {
    status?: string;
    answers?: Answer[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "bot", text: "Hello! I will help with your ticket.", isAI: false },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        checkStatus().then(() => {});
    }, []);

    const checkStatus = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URL + "/api/health");
            const data = await res.json();
            if (data.status === "running") {
                setAppReady(true);
            } else {
                setAppReady(false);
                setTimeout(checkStatus, 3000);
            }
        } catch (err) {
            console.error("Status check failed", err);
            setAppReady(false);
            setTimeout(checkStatus, 5000);
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { sender: "user", text }]);
        setIsTyping(true);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000); // 90 секунд

        try {
            const body: FindTicketRequest = { question: text };
            const res = await fetch(import.meta.env.VITE_API_URL + "/api/tickets/find", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            clearTimeout(timeout);

            let data: FindTicketResponse;

            if (!res.ok) {
                data = { status: "no_answer", answers: [] };
            } else {
                data = await res.json();
            }

            if (data.answers && data.answers.length > 0 && data.status !== "no_answer") {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text: "Here’s what I found for you:",
                        answers: data.answers,
                        isAI: false
                    }
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "bot",
                        text: "I couldn’t find any matching tickets in the database. Here is an AI-generated ticket description.",
                        answers: data.answers ?? [],
                        isAI: true
                    }
                ]);
            }

        } catch (err: any) {
            clearTimeout(timeout);

            console.error(err);

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: "I couldn’t find any matching tickets in the database. Here is an AI-generated ticket description.",
                    answers: [],
                    isAI: true
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, isTyping, sendMessage, appReady }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within ChatProvider");
    return context;
};