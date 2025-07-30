import { type ReactNode } from "react";
import { useState } from "react";

interface CollapsibleFooterProps {
  children: ReactNode;
}

export default function CollapsibleFooter({ children }: CollapsibleFooterProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <footer className="bottom-0 left-0 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-t p-2 flex justify-center items-center text-gray-600 hover:text-gray-900 transition"
        aria-label={isOpen ? "Ocultar footer" : "Mostrar footer"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>          
        )}
      </button>
      <div
        style={{
          maxHeight: isOpen ? "100vh" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        {children}
      </div>
    </footer>
  );
}
