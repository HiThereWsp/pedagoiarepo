import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Button } from '../ui/button';

import { supabase } from '../../lib/supabase';
import { useAuth } from '../Auth/AuthContext';

interface MessageFeedbackProps {
  messageId: string;
  onSubmitFeedback: (feedback: { helpful: boolean; comment?: string }) => void;
}

export function MessageFeedback({ messageId, onSubmitFeedback }: MessageFeedbackProps) {
  const { user } = useAuth();
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<'up' | 'down' | null>(null);

  const handleFeedback = async (helpful: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chats')
        .update({ 
          feedback_score: helpful ? 1 : -1 
        })
        .eq('conversation_id', messageId)
        .eq('message_type', 'assistant');

      if (error) throw error;
    } catch (err) {
      console.error('Error saving feedback:', err);
    }

    if (helpful) {
      onSubmitFeedback({ helpful: true });
      setSubmitted(true);
    } else {
      setShowComment(true);
    }
  };

  const handleSubmitComment = () => {
    onSubmitFeedback({ helpful: false, comment });
    setSubmitted(true);
    setShowComment(false);
  };

  if (submitted) {
    return (
      <div className="text-sm text-green-600 flex items-center gap-2">
        <Check className="w-4 h-4" /> 
        Merci de votre retour !
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!showComment ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleFeedback(true)}
            onMouseEnter={() => setHoveredButton('up')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`p-2 rounded-md transition-all duration-200 ${
              hoveredButton === 'up'
                ? 'bg-green-100 text-green-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Cette réponse m'a aidé"
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            onMouseEnter={() => setHoveredButton('down')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`p-2 rounded-md transition-all duration-200 ${
              hoveredButton === 'down'
                ? 'bg-red-100 text-red-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Cette réponse ne m'a pas aidé"
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Dites-nous ce qui pourrait être amélioré..."
            className="w-full p-3 text-sm border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComment(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}