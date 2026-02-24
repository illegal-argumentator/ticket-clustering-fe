import { useChat } from "../context/ChatContext";
import Message from "./Message";
import { useEffect, useRef } from "react";

export default function ChatWindow(){
    const { messages, isTyping, appReady } = useChat();
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [messages, isTyping]);

    return (
        <div className="chat-window" ref={chatRef}>
            {messages.map((msg, idx) => (
                <Message
                    key={idx}
                    sender={msg.sender}
                    text={msg.text}
                    answers={msg.answers}
                    isAI={msg.isAI}
                />
            ))}

            {!appReady && (
                <div className="loading-overlay">
                    <div className="spinner">⏳ Loading...</div>
                </div>
            )}

            {isTyping && (
                <div className="message bot">
                    <span className="typing">…</span>
                </div>
            )}
        </div>
    );
}