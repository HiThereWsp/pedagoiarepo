import React from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MessageFeedback } from './MessageFeedback';

interface ChatMessageProps {
  message: {
    content: string;
    role: 'assistant' | 'user';
    id: string;
  };
  onFeedback?: (messageId: string, feedback: { helpful: boolean; comment?: string }) => void;
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-2 md:gap-4 p-3 md:p-6 ${
      isAssistant 
        ? 'bg-secondary/50 border border-border ml-1 sm:ml-2 mr-auto flex' 
        : 'bg-primary/10 border border-primary/20 mr-1 sm:mr-2 ml-auto'
    } rounded-lg sm:rounded-xl max-w-[94%] sm:max-w-[92%] backdrop-blur-sm shadow-premium hover:shadow-premium-lg transition-all duration-200`}>
      {isAssistant && <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAssistant 
          ? 'bg-secondary text-secondary-foreground ring-1 ring-border' 
          : 'bg-primary text-primary-foreground ring-1 ring-primary/30'
      }`}>
        <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>}
      <div className={`flex-1 min-w-0 overflow-hidden ${!isAssistant && 'text-right'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className={`prose prose-sm md:prose-lg max-w-none w-full overflow-x-auto ${
            isAssistant ? 'text-left' : 'text-right'
          }`}>
            <ReactMarkdown className="mb-4"
              components={{
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-4">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 rounded p-4 overflow-x-auto my-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        {isAssistant && onFeedback && (
          <div className="mt-4 border-t border-[#2D9474]/10 pt-4">
            <div className="flex items-center justify-end gap-2">
              <MessageFeedback
                messageId={message.id}
                onSubmitFeedback={(feedback) => {
                  onFeedback(message.id, feedback);
                }}
              />
              <button
                onClick={handleCopy}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                title={copied ? "Copié !" : "Copier le message"}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}