import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  isFirstMessage?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false, value, onChange, isFirstMessage = true }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSendMessage(value);
      onChange('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 p-2 sm:p-4 md:p-6 border-t border-border/50 bg-background/50 backdrop-blur-md sm:rounded-b-xl fixed sm:relative bottom-0 left-0 right-0">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isFirstMessage ? "Comment puis-je vous aider ?" : "Répondre à Élia..."}
        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-primary/30 rounded-lg sm:rounded-xl bg-white/95 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all shadow-premium hover:shadow-premium-lg hover:border-primary/40 placeholder:text-primary/60 text-foreground text-sm sm:text-base"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-3 sm:px-5 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg sm:rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-premium hover:shadow-premium-lg transform hover:scale-105 active:scale-95"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}