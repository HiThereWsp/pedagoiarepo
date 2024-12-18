import React, { useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { AuthApiError } from '@supabase/supabase-js';
import { TextRotator } from './TextRotator';
import { TermsOfService } from './TermsOfService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterAccepted, setNewsletterAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showFirstNameDialog, setShowFirstNameDialog] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { signIn, signUp, resetPassword } = useAuth();

  const handleResetPassword = useCallback(async () => {
    try {
      setResetStatus('sending');
      await resetPassword(resetEmail);
      setResetStatus('sent');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setResetStatus('idle');
    }
  }, [resetEmail, resetPassword]);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof AuthApiError) {
      switch (err.status) {
        case 400:
          return 'Email ou mot de passe incorrect';
        case 422:
          return 'Format d\'email invalide';
        default:
          return 'Une erreur est survenue lors de l\'authentification';
      }
    }
    return 'Une erreur inattendue est survenue';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      if (isSignUp) {
        if (!termsAccepted) {
          throw new Error('Vous devez accepter les conditions d\'utilisation pour créer un compte');
        }
        if (!firstName.trim()) {
          throw new Error('Le prénom est requis');
        }
        const { user } = await signUp(email, password);
        if (user) {
          await supabase.auth.updateUser({
            data: { first_name: firstName.trim() }
          });
        }
        setError('Vérifiez votre email pour confirmer votre inscription.');
      } else {
        await signIn(email, password);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue est survenue');
      }
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsAccept = (accepted: boolean, newsletter: boolean) => {
    setTermsAccepted(accepted);
    setNewsletterAccepted(newsletter);
  };

  if (showTerms) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <TermsOfService
            onAccept={handleTermsAccept}
            accepted={termsAccepted}
            newsletter={newsletterAccepted}
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setShowTerms(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Retour
            </button>
            <button
              onClick={() => {
                if (termsAccepted) {
                  setShowTerms(false);
                  handleSubmit(new Event('submit') as any);
                }
              }}
              disabled={!termsAccepted}
              className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-premium-lg border border-border/50">
          <div>
            <h2 className="text-center text-2xl font-bold text-primary drop-shadow-sm mb-8">
              {isSignUp ? 'Créer un compte' : 'Connexion à votre compte'}
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                {isSignUp && (
                  <div className="mb-4">
                    <Label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </Label>
                    <Input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full"
                      placeholder="Votre prénom"
                      required={isSignUp}
                    />
                  </div>
                )}
                <label htmlFor="email-address" className="sr-only">
                  Adresse email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9633] focus:border-[#FF9633] focus:z-10 sm:text-sm bg-white/90 mb-2`}
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9633] focus:border-[#FF9633] focus:z-10 sm:text-sm bg-white/90`}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoading}
                onClick={(e) => {
                  if (isSignUp) {
                    e.preventDefault();
                    setShowTerms(true);
                  }
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg py-2 px-4 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Chargement...' : (isSignUp ? 'S\'inscrire' : 'Se connecter')}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {isSignUp 
                  ? 'Déjà un compte ? Connectez-vous' 
                  : 'Pas de compte ? Inscrivez-vous'}
              </button>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser votre mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={resetStatus === 'sending' || resetStatus === 'sent'}
            />
            {resetStatus === 'sent' ? (
              <div className="text-sm text-primary">
                Un email de réinitialisation vous a été envoyé. Vérifiez votre boîte de réception.
              </div>
            ) : (
              <Button
                onClick={handleResetPassword}
                disabled={!resetEmail || resetStatus === 'sending'}
                className="w-full"
              >
                {resetStatus === 'sending' ? 'Envoi en cours...' : 'Envoyer le lien'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}