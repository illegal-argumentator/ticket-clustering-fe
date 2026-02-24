import { useState } from "react";
import { useChat } from "../context/ChatContext";

export default function ChatInput() {
    const [input, setInput] = useState("");
    const { sendMessage, appReady } = useChat();

    const handleSend = () => {
        if (!input.trim() || !appReady) return;
        sendMessage(input);
        setInput("");
    };

    return (
        <div className="chat-input">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={appReady ? "Input your ticket..." : "Loading... Please wait"}
                disabled={!appReady}
            />
            <button onClick={handleSend} disabled={!appReady}>
                {appReady ? "Find" : "Loading..."}
            </button>
        </div>
    );
}