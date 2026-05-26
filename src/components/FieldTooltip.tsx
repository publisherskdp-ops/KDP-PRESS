import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface FieldTooltipProps {
  text: string;
  children?: React.ReactNode;
}

export default function FieldTooltip({ text, children }: FieldTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-slate-300 hover:text-sky-500 transition-colors"
      >
        <HelpCircle size={16} />
      </button>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 animate-in fade-in duration-150">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900" />
        </div>
      )}

      {children}
    </div>
  );
}