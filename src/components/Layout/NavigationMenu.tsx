import React from 'react';
import { Lightbulb, Settings, LogOut, User, Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../Auth/AuthContext';
import { useChats } from '../Chat/ChatContext';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area'; 
import { useEffect, useState } from 'react';

interface NavigationMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  subItems?: Array<{ id: string; label: string }>;
}

export function NavigationMenu({ 
  currentPage, 
  onNavigate, 
}: NavigationMenuProps) {
  const { user, signOut } = useAuth();
  const { chats, currentChatId, addChat, deleteChat, setCurrentChat } = useChats();
  const [isMobile, setIsMobile] = useState(false);
  const userName = user?.email?.split('@')[0] || 'User';
  const [isHovered, setIsHovered] = React.useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleNewChat = () => {
    const chatId = addChat();
    setCurrentChat(chatId);
    onNavigate('chat');
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  const menuStructure: MenuItem[] = [
    { 
      id: 'suggestions',
      label: 'Faire des suggestions',
      icon: Lightbulb
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings
    }
  ];

  const handleChatSelect = (chatId: string) => {
    setCurrentChat(chatId);
    onNavigate('chat');
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 bg-white shadow-md rounded-full md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      <nav className={cn(
        "bg-card border-r flex flex-col h-full transition-all duration-300 fixed md:relative z-40",
        isMobile
          ? isOpen ? "w-64 translate-x-0" : "-translate-x-full w-64"
          : isHovered ? "w-64" : "w-16",
        "md:translate-x-0"
      )}>
      <div 
        className="flex flex-col h-full p-2 md:p-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="mb-2 md:mb-4 mt-14 md:mt-0">
          <Button
            variant="default"
            size="sm"
            onClick={handleNewChat}
            className={cn(
              "bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 flex items-center justify-center",
              isHovered ? "w-full" : "w-10 h-10"
            )}
          >
            <Plus className="w-4 h-4" />
            <span className={cn(
              "ml-2 transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0 hidden"
            )}>
              Nouvelle conversation
            </span>
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-18rem)]">
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="group flex items-center gap-1"
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 hover:bg-secondary/50",
                      isHovered ? "w-[calc(100%-2.5rem)]" : "w-10 h-10",
                      chat.id === currentChatId && "bg-secondary text-primary",
                    )}
                    title={chat.title || 'Nouvelle conversation'}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className={cn(
                      "ml-2 transition-opacity duration-200 truncate",
                      isHovered ? "opacity-100" : "opacity-0 hidden"
                    )}>
                      {chat.title || 'Nouvelle conversation'}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className={cn(
                      "w-10 h-10 p-0 hover:bg-destructive/10 hover:text-destructive transition-opacity",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex flex-col gap-1 py-4">
          {menuStructure.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-2 hover:bg-secondary/50",
                  isHovered ? "w-full" : "w-10 h-10",
                  currentPage === item.id && "bg-secondary text-primary"
                )}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                <span className={cn(
                  "ml-2 transition-opacity duration-200",
                  isHovered ? "opacity-100" : "opacity-0 hidden"
                )}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="space-y-2 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className={cn("flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10",
              isHovered ? "w-full" : "w-10 h-10"
            )}
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
            <span className={cn(
              "ml-2 transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0 hidden"
            )}>
              Déconnexion
            </span>
          </Button>
          
          <div className={cn(
            "rounded-lg bg-muted/50 flex items-center gap-2 p-2 transition-all",
            isHovered ? "w-full" : "w-10 h-10 justify-center"
          )} title={userName}>
            <User className="w-4 h-4 flex-shrink-0" />
            <span className={cn(
              "ml-2 transition-opacity duration-200 truncate",
              isHovered ? "opacity-100" : "opacity-0 hidden"
            )}>
              {userName}
            </span>
          </div>
        </div>
      </div>
    </nav>
    {isMobile && isOpen && (
      <div 
        className="fixed inset-0 bg-black/20 z-30 md:hidden"
        onClick={() => setIsOpen(false)}
      />
    )}
    </>
  );
}