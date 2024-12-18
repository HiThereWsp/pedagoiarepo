import React, { useState } from 'react';
import { NavigationMenu } from './components/Layout/NavigationMenu';
import { Header } from './components/Header';
import { ChatContainer } from './components/Chat/ChatContainer';
import { AuthProvider } from './components/Auth/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SettingsPage } from './components/User/SettingsPage';
import { SuggestionsPage } from './components/Suggestions/SuggestionsPage';
import { UserPreferencesProvider } from './components/User/UserPreferencesContext';
import { useAuth } from './components/Auth/AuthContext';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { ChatProvider } from './components/Chat/ChatContext';
import { LandingPage } from './components/Landing';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('chat');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      document.body.classList.toggle('scrolled', scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="flex h-screen bg-background">
      <NavigationMenu 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
      />
      <main className="flex-1">
        <div className="h-full bg-background">
          {currentPage === 'chat' && <ChatContainer />}
          {currentPage === 'suggestions' && <SuggestionsPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Header />
      <ChatProvider>
        <UserPreferencesProvider>
          <Toaster position="top-center" />
          <AppContent />
        </UserPreferencesProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;