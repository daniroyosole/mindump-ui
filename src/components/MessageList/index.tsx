import type { Message } from "api/openai";
import TypingAnimation from "../TypingAnimation";
import { useEffect, useRef, useState } from "react";

export default function MessageList({ messages, isLoading }: { messages: Message[]; isLoading?: boolean }) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [completedTyping, setCompletedTyping] = useState<Set<number>>(new Set());
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });      
    }
  }, [messages]);

  return (
    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.filter(m => m.role !== 'system').map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${
              msg.role === "user"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            <div className={`text-xs font-medium mb-1 ${
              msg.role === "user" ? "text-blue-100" : "text-gray-500"
            }`}>
              {msg.role === "user" ? "You" : "Assistant"}
            </div>
            <div className="leading-relaxed">
              {msg.role === "user" ? (
                msg.content
              ) : (
                <TypingAnimation
                  text={msg.content}
                  speed={i > 2 && i === messages.length - 2 ? 20 : 0}
                  onComplete={() => setCompletedTyping(prev => new Set(prev).add(messages.indexOf(msg)))}
                />
              )}
            </div>
          </div>
        </div>
              ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-4 py-3 rounded-2xl shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200">
              <div className="text-xs font-medium mb-1 text-gray-500">
                Assistant
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
  