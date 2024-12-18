import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  onClick: () => void;
  visible: boolean;
}

export function ScrollIndicator({ onClick, visible }: ScrollIndicatorProps) {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-8 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 animate-bounce"
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="w-6 h-6 text-gray-600" />
    </button>
  );
}