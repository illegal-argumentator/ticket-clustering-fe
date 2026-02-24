import { useState } from "react";

interface Answer {
    content: string;
}

interface MessageProps {
    sender: "user" | "bot";
    text?: string;
    answers?: Answer[];
    isAI?: boolean;
}

export default function Message({ sender, text, answers, isAI }: MessageProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (copyText: string) => {
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            console.error("Copy failed", e);
        }
    };

    const formatAnswerContent = (content?: string) => {
        if (!content) return { title: "", description: "" };

        const titleMatch = content.match(/Title:\s*(.*?)\s*(Description:|$)/);
        const descMatch = content.match(/Description:\s*(.*)/);

        return {
            title: titleMatch ? titleMatch[1].trim() : "",
            description: descMatch ? descMatch[1].trim() : "",
        };
    };

    // підготовка AI-контенту
    let aiContent = { title: "", description: "" };
    if (answers && answers.length > 0) {
        aiContent = formatAnswerContent(answers[0].content);
    }

    // текст для копіювання
    const copyText = text || (answers && answers.length > 0 ? answers[0].content : "");

    return (
        <div className={`message ${sender}`}>
            <div className="message-bubble">
                {isAI && copyText && (
                    <div className="message-text ai-text">
                        <div className="ai-header">
                            <span className="ai-badge">AI Generated</span>
                            <button className="copy-btn" onClick={() => handleCopy(copyText)}>
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        {aiContent.title && <div className="ai-title">📝 {aiContent.title}</div>}
                        {aiContent.description && <div className="ai-description">{aiContent.description}</div>}
                    </div>
                )}

                {!isAI && text && !answers && <div className="message-text">{text}</div>}

                {!isAI && answers && (
                    <div className="bot-results">
                        <div className="bot-title">Here’s what I found for you:</div>
                        <div className="ticket-list">
                            {answers.map((ans, idx) => (
                                <div key={idx} className="ticket-card">
                                    <div className="ticket-header">Matching Ticket #{idx + 1}</div>
                                    <div className="ticket-content">{ans.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}