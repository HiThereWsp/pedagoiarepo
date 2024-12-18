import React, { useState } from 'react';
import { Bot, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!validateEmail(email)) {
      setIsEmailValid(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, status: 'pending' }]);

      if (error) throw error;
      
      setSubmitted(true);
      // Here you would typically trigger your email service to send the auth link
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-20">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl animate-fade-in">
              <Bot className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent leading-tight animate-fade-in">
            L'IA au service des enseignants
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 px-4 animate-fade-in delay-150">
            Gagnez du temps sur vos tâches quotidiennes et concentrez-vous sur l'essentiel : vos élèves
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 px-4 animate-fade-in delay-300">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailValid(true);
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 focus:border-primary focus:ring-primary transition-all duration-200 ${
                    !isEmailValid ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? 'Inscription...' : 'Rejoindre la liste'}
                </button>
              </div>
              {!isEmailValid && (
                <p className="text-red-500 text-sm">Veuillez entrer une adresse email valide</p>
              )}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <p className="text-sm text-gray-500">
                Soyez parmi les premiers à tester notre assistant pédagogique IA
              </p>
            </form>
          ) : (
            <div className="bg-green-50 p-6 rounded-xl max-w-md mx-auto m-4 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Merci de votre inscription !
              </h3>
              <p className="text-green-600">
                Vous recevrez bientôt un email avec votre accès à la version beta.
              </p>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mt-12 sm:mt-20 px-4">
          <div className="bg-white p-6 rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200 transform hover:scale-105">
            <div className="p-2 bg-blue-50 rounded-lg w-fit mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gagnez du temps</h3>
            <p className="text-gray-600">
              Plus de 6 heures économisées chaque semaine sur vos tâches administratives
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200 transform hover:scale-105">
            <div className="p-2 bg-purple-50 rounded-lg w-fit mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personnalisation</h3>
            <p className="text-gray-600">
              Des ressources adaptées au niveau de chaque élève
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200 transform hover:scale-105 sm:col-span-2 md:col-span-1">
            <div className="p-2 bg-green-50 rounded-lg w-fit mb-4">
              <Bot className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Assistant IA</h3>
            <p className="text-gray-600">
              Un compagnon pédagogique disponible 24/7 pour vous accompagner
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-20 text-center px-4">
          <p className="text-sm text-gray-500">
            Version beta gratuite - Places limitées
          </p>
        </div>
      </div>
    </div>
  );
}