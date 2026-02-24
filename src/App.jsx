import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { ChatProvider } from "./context/ChatContext";

export default function App() {
    return (
        <ChatProvider>
            <div className="app-container">
                <ChatWindow />
                <ChatInput />
            </div>
        </ChatProvider>
    );
}