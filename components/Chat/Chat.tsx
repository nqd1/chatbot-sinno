import { Message } from "@/types";
import { FC, useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";
import { useDarkMode } from "../Contexts/DarkModeContext";

interface Props {
  messages: Message[];
  loading: boolean;
  streaming: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({ messages, loading, streaming, onSend, onReset }) => {
  const { darkMode } = useDarkMode();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth: boolean = false) => {
    messagesEndRef.current?.scrollIntoView({behavior : smooth ? "smooth" : "auto"});
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    // Always scroll to bottom when streaming or new messages arrive
    scrollToBottom(true);
  }, [messages, loading, streaming]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
        <ResetChat onReset={onReset} />
      </div>

      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto rounded-lg rounded-b-none p-5 sm:p-5 sm:border ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-[#FFF5F5] border-neutral-300"}`}
      >
        {messages.map((message, index) => (
          <div
            key={`msg-${index}-${message.timestamp || index}`}
            className="my-1 sm:my-1.5"
          >
            <ChatMessage 
              message={message} 
              isStreaming={message.isStreaming && streaming} 
              darkMode={darkMode}
            />
          </div>
        ))}

        {loading && !streaming && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="w-full max-w-[800px] mx-auto">
        <div className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-neutral-200"} rounded-b-xl shadow-lg p-4 border border-t-0`}>
          <ChatInput onSend={onSend} disabled={loading || streaming} darkMode={darkMode} />
        </div>
      </div>

      {showScrollButton && (
        <button
          onClick={() => scrollToBottom(true)}
          className="fixed bottom-24 right-6 bg-[#e24242] text-white p-3 rounded-full shadow-lg hover:opacity-80 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#e24242] focus:ring-offset-2"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
