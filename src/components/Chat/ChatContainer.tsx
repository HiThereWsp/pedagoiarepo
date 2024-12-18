import React, { useState, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { WelcomeMessage } from './WelcomeMessage';
import { CategoryMenu } from './CategoryMenu';
import { ScrollIndicator } from './ScrollIndicator';
import { getChatCompletion } from '../../lib/openai';
import { ScrollArea } from '../ui/scroll-area';
import { useUserPreferences } from '../User/UserPreferencesContext';
import { useAuth } from '../Auth/AuthContext';
import { useChats } from './ChatContext';
import { saveWithRetry, supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useScroll, useScrollRestoration } from '../../lib/hooks/useScroll';
import GridPattern from '../ui/grid-pattern';

export function ChatContainer() {
  const { classLevel } = useUserPreferences();
  const { user } = useAuth();
  const { chats, currentChatId, setChats, addChat, deleteChat, setCurrentChat } = useChats();
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const { ref: chatContainerRef, scrollToBottom } = useScroll<HTMLDivElement>();
  
  // Enable scroll position restoration
  useScrollRestoration(chatContainerRef);

  const currentChat = React.useMemo(() => {
    return chats.find((chat) => chat.id === currentChatId) || chats[0];
  }, [chats, currentChatId]);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;

    const startTime = new Date().toISOString();

    try {
      setError(null);
      const { data, error } = await supabase
        .from('chats')
        .select('conversation_id, message')
        .eq('user_id', user.id)
        .is('completion_status', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const conversationMap = new Map();
        data.forEach(record => {
          if (record.conversation_id && !conversationMap.has(record.conversation_id)) {
            conversationMap.set(record.conversation_id, {
              id: record.conversation_id,
              title: '',
              messages: JSON.parse(record.message)
            });
          }
        });

        const loadedChats = Array.from(conversationMap.values());
        if (loadedChats.length > 0) {
          setChats(loadedChats);
          setCurrentChat(loadedChats[0].id);
          
          // Record session metrics
          await supabase.from('session_metrics').insert({
            conversation_id: loadedChats[0].id,
            user_id: user.id,
            session_start: startTime,
            total_messages: loadedChats[0].messages.length
          });
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Error loading chats:', err);
      setError('Unable to load conversations');
    }
  };

  const saveChat = async (chatId: string, messages: Array<{ role: string; content: string; id: string }>) => {
    if (!user) return;

    const operation = async () => {
      try {
        const lastMessage = messages[messages.length - 1];
        const isAssistantMessage = lastMessage.role === 'assistant';

        const { error } = await supabase.from('chats').insert({
          user_id: user.id,
          message: JSON.stringify(messages),
          conversation_id: chatId,
          message_type: lastMessage.role,
          action_type: isAssistantMessage ? 'response' : 'query',
          completion_status: isAssistantMessage
        });

        if (error) throw error;
      } catch (err) {
        console.error('Database error:', err);
        throw err;
      }
    };

    try {
      await saveWithRetry(operation);
    } catch (err) {
      setError('Failed to save conversation');
      throw err;
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollIndicator(scrollHeight - scrollTop - clientHeight > 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentChat?.messages.length > 0) {
      scrollToBottom();
    }
  }, [currentChat?.messages.length]);

  const generateTitle = async (content: string) => {
    try {
      const response = await getChatCompletion([{
        role: 'user',
        content: `Generate a short descriptive title (max 6 words) for this conversation based on this message. Reply only with the title, no punctuation or quotes: "${content}"`
      }]);
      return response?.content?.replace(/["']/g, '').trim() || 'New conversation';
    } catch (err) {
      console.error('Error generating title:', err);
      return 'New conversation';
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const chatId = currentChat.id;
    const userMessage = { role: 'user' as const, content, id: uuidv4() };
    const isNewChat = currentChat.messages.length === 0;
    
    try {
      setShowMenu(false);
      const updatedMessages = [...currentChat.messages, userMessage];
      
      let updatedTitle = currentChat.title;
      if (isNewChat) {
        setChats(prevChats => prevChats.map(chat => 
          chat.id === chatId
            ? { ...chat, title: 'Generating title...', messages: updatedMessages }
            : chat
        ));
        
        updatedTitle = await generateTitle(content);
        
        setChats(prevChats => prevChats.map(chat => 
          chat.id === chatId
            ? { ...chat, title: updatedTitle, messages: updatedMessages }
            : chat
        ));
      }

      const response = await getChatCompletion(updatedMessages, { classLevel });
      
      if (response) {
        const assistantMessage = { 
          role: 'assistant' as const, 
          content: response.content,
          id: uuidv4()
        };
        
        const finalMessages = [...updatedMessages, assistantMessage];

        setChats(prevChats => prevChats.map(chat => 
          chat.id === chatId
            ? { ...chat, messages: finalMessages, title: updatedTitle }
            : chat
        ));
        
        await saveChat(chatId, finalMessages);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error('Chat error:', err);
      
      setChats(prevChats => prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: chat.messages.slice(0, -1) }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const chatId = addChat();
    setCurrentChat(chatId);
    setShowMenu(true);
    setInputValue('');
    setError(null);
  };

  const handleMessageFeedback = (messageId: string, feedback: { helpful: boolean; comment?: string }) => {
    console.log('Message feedback:', { messageId, feedback });
  };

  const handleExampleClick = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full bg-card/90 backdrop-blur-md">
        <GridPattern
          squares={[
            [1, 1],
            [2, 2],
            [4, 3],
            [6, 2],
            [8, 4],
            [3, 7],
            [7, 5],
            [5, 6],
            [2, 8],
            [8, 8],
          ]}
          className="absolute inset-0 h-full w-full select-none [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        />
        <ScrollArea 
          ref={chatContainerRef} 
          className="flex-1 p-2 sm:p-4 md:p-6 pb-20 sm:pb-6 max-w-5xl mx-auto w-full mt-14 md:mt-0"
        >
          <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
            {currentChat.messages.length === 0 && <WelcomeMessage />}
            {currentChat.messages.length === 0 && showMenu && (
              <CategoryMenu onSelectPrompt={handleExampleClick} />
            )}
            {currentChat.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onFeedback={message.role === 'assistant' ? handleMessageFeedback : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 p-4 text-sm text-gray-500">
                <span className="italic">Je prépare une réponse précise</span>
                <span className="flex space-x-1">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              </div>
            )}
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 shadow-sm">
                <div className="font-medium mb-1">An error occurred</div>
                {error}
              </div>
            )}
          </div>
        </ScrollArea>
        <ScrollIndicator 
          onClick={scrollToBottom}
          visible={showScrollIndicator}
        />
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
          value={inputValue}
          onChange={setInputValue}
          isFirstMessage={currentChat.messages.length === 0}
        />
      </div>
    </div>
  );
}