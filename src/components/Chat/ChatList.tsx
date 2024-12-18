import React from 'react';
import { MessageSquarePlus, MessageSquare, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ChatListProps {
  chats: Array<{
    id: string;
    title: string;
    messages: Array<{ role: 'assistant' | 'user'; content: string }>;
  }>;
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export function ChatList({ chats, currentChatId, onChatSelect, onNewChat, onDeleteChat, isOpen = true }: ChatListProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [hoveredChatId, setHoveredChatId] = React.useState<string | null>(null);

  return (
    <div className={cn(
      "relative h-full transition-all duration-300",
      collapsed ? "w-0" : "w-80 bg-white/80 backdrop-blur-md"
    )}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-10",
          collapsed ? "left-3" : "-right-3"
        )}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>
      
      <div className={cn("p-4 h-full", collapsed && "hidden")}>
        {collapsed ? (
          <div className="flex flex-col items-center space-y-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewChat}
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary/90 text-white shadow-premium hover:shadow-premium-lg"
              title="Nouvelle conversation"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </Button>
            
            {chats.map((chat) => chat.messages.length > 0 && (
              <Button
                key={chat.id}
                variant="ghost"
                size="icon"
                onClick={() => onChatSelect(chat.id)}
                title={chat.title}
                className={`w-10 h-10 rounded-lg ${
                  chat.id === currentChatId
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            ))}
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-primary to-primary/90 rounded-xl py-3 shadow-premium hover:shadow-premium-lg transition-all duration-200"
              title="Nouvelle conversation"
            >
              <MessageSquarePlus className="w-6 h-6" />
              <span>Nouvelle conversation</span>
            </Button>
            
            <div className="mt-6 space-y-2">
              <h3 className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Conversations récentes
              </h3>
              <div className="space-y-1 pr-2">
                {chats.map((chat) => chat.messages.length > 0 && (
                  <div
                    key={chat.id}
                    onMouseEnter={() => setHoveredChatId(chat.id)}
                    onMouseLeave={() => setHoveredChatId(null)}
                    className={`w-full justify-start gap-2 ${
                      chat.id === currentChatId
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-gray-50'
                    } group relative flex items-center p-2 rounded-lg cursor-pointer`}
                    onClick={() => onChatSelect(chat.id)}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{chat.title || 'Nouvelle conversation'}</span>
                    {hoveredChatId === chat.id && onDeleteChat && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 p-1 rounded-md cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}