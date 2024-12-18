import React from 'react';
import { Logo } from './Logo';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { LoginForm } from '../Auth/LoginForm';
import { useAuth } from '../Auth/AuthContext';
import { cn } from '../../lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { user } = useAuth();
  const [showLoginForm, setShowLoginForm] = React.useState(false);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-b from-background to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm",
        className
      )}>
        <div className="container flex h-16 items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center space-x-4">
            {!user && (
              <Button
                variant="outline"
                onClick={() => setShowLoginForm(true)}
                className="bg-white hover:bg-gray-50 text-primary border-primary/20 hover:border-primary transition-all duration-200"
              >
                Connexion
              </Button>
            )}
          </nav>
        </div>
      </header>

      <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
          <DialogTitle className="sr-only">Connexion à votre compte</DialogTitle>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </>
  );
}