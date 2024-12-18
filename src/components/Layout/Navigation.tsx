import React from 'react';
import { MessageSquare, Lightbulb, Settings } from 'lucide-react';
import { Button } from '../ui/button';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className={`flex items-center gap-2 ${currentPage === 'chat' ? 'text-blue-600' : 'text-gray-600'}`}
        onClick={() => onNavigate('chat')}
      >
        <MessageSquare className="w-4 h-4" />
        Assistant
      </Button>
      <Button
        variant="ghost"
        className={`flex items-center gap-2 ${currentPage === 'suggestions' ? 'text-blue-600' : 'text-gray-600'}`}
        onClick={() => onNavigate('suggestions')}
      >
        <Lightbulb className="w-4 h-4" />
        Suggestions
      </Button>
      <Button
        variant="ghost"
        className={`flex items-center gap-2 ${currentPage === 'settings' ? 'text-blue-600' : 'text-gray-600'}`}
        onClick={() => onNavigate('settings')}
      >
        <Settings className="w-4 h-4" />
        Paramètres
      </Button>
    </div>
  );
}