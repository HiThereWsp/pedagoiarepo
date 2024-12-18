import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export type Message = {
  id: string;
  content: string;
  role: 'assistant' | 'user';
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  addChat: (chat?: Chat) => string;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, message: NewMessage) => void;
  setCurrentChat: (id: string) => void;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

type NewMessage = {
  content: string;
  role: 'assistant' | 'user';
};

// Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Initialize with a default chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      const newChat = {
        id: uuidv4(),
        title: 'Nouvelle conversation',
        messages: [],
      };
      setChats([newChat]);
      setCurrentChatId(newChat.id);
    } else if (!currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  const addChat = useCallback((chat?: Chat) => {
    const newChat = chat || {
      id: uuidv4(),
      title: 'Nouvelle conversation',
      messages: [],
    };
    setChats(prev => {
      if (prev.some(c => c.id === newChat.id)) {
        return prev;
      }
      return [newChat, ...prev];
    });
    return newChat.id;
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats(prev => {
      const filteredChats = prev.filter(chat => chat.id !== id);
      
      // If we're deleting the current chat or no chats remain
      if (filteredChats.length === 0) {
        const newChat = {
          id: uuidv4(),
          title: 'Nouvelle conversation',
          messages: [],
        };
        setCurrentChatId(newChat.id);
        return [newChat];
      }
      
      if (currentChatId === id) {
        setCurrentChatId(filteredChats[0].id);
      }
      
      return filteredChats;
    });
  }, [currentChatId]);

  const addMessage = useCallback((chatId: string, message: NewMessage) => {
    const messageWithId = { ...message, id: uuidv4() };
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, messageWithId] }
        : chat
    ));
  }, []);

  const setCurrentChat = useCallback((id: string) => {
    setCurrentChatId(id);
  }, []);

  return (
    <ChatContext.Provider value={{
      chats,
      currentChatId,
      addChat,
      deleteChat,
      addMessage,
      setCurrentChat,
      setChats,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChats must be used within a ChatProvider');
  }
  return context;
}
