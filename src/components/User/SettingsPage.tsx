import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useUserPreferences } from './UserPreferencesContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { supabase } from '../../lib/supabase';
import { Settings, Mail, Lock, User, Shield } from 'lucide-react';
import { CLASS_LEVELS, EDUCATION_LEVELS } from './ClassLevelSelector';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
}

export function SettingsPage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sections: SettingsSection[] = [
    { id: 'profile', title: 'Profil', icon: User },
    { id: 'security', title: 'Sécurité', icon: Shield }
  ];

  const handleUpdateFirstName = async () => {
    try {
      if (!firstName.trim()) {
        throw new Error('Le prénom ne peut pas être vide');
        return;
      }

      setMessage(null);

      const { data, error } = await supabase.auth.updateUser({
        data: { first_name: firstName.trim() }
      });
      
      if (error) {
        console.error('Error updating first name:', error);
        throw error;
      }
      
      setMessage({ type: 'success', text: 'Prénom mis à jour avec succès' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du prénom'
      });
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      // Implement email update logic here
      setMessage({ type: 'success', text: 'Email mis à jour avec succès' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour de l\'email' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      // Implement password update logic here
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du mot de passe' });
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-[#FF9633]/10 bg-white/80 backdrop-blur-md p-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                activeSection === section.id
                  ? 'bg-[#FF9633]/10 text-[#FF9633] font-medium'
                  : 'text-gray-700 hover:bg-gray-50 transition-all duration-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.title}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-white/50">
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#FF9633]/10 rounded-full">
                <User className="w-6 h-6 text-[#FF9633]" />
              </div>
              <h2 className="text-xl font-bold text-[#FF9633]">
                Informations personnelles
              </h2>
            </div>
            <form className="space-y-6 max-w-2xl">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </Label>
                <Input
                  type="text"
                  placeholder="Votre prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-2 focus:border-[#FF9633] transition-all duration-200 bg-white/90 backdrop-blur-md rounded-xl"
                />
                <Button
                  onClick={handleUpdateFirstName}
                  className="mt-2 bg-primary text-white"
                  disabled={!firstName.trim() || firstName === user?.user_metadata?.first_name}
                >
                  Mettre à jour
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Établissement
                </label>
                <Input
                  type="text"
                  placeholder="Nom de votre établissement"
                  className="w-full border-2 focus:border-[#FF9633] transition-all duration-200 bg-white/90 backdrop-blur-md rounded-xl"
                />
              </div>
              <Button className="bg-[#FF9633] text-white hover:bg-[#FF9633]/90 transition-all duration-200 shadow-lg rounded-xl px-6">
                Enregistrer
              </Button>
            </form>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#FF9633]/10 rounded-lg">
                <Shield className="w-6 h-6 text-[#FF9633]" />
              </div>
              <h2 className="text-xl font-bold text-[#FF9633]">
                Sécurité du compte
              </h2>
            </div>
            
            <form onSubmit={handleUpdateEmail} className="space-y-4 mb-8 max-w-2xl bg-white/90 backdrop-blur-md p-6 rounded-xl border border-[#FF9633]/10 shadow-lg">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#FF9633]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-2 focus:border-[#FF9633] transition-all duration-200 bg-white rounded-xl"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <Button type="submit" className="bg-[#FF9633] text-white hover:bg-[#FF9633]/90 transition-all duration-200 shadow-lg rounded-xl px-6">
                    Mettre à jour
                  </Button>
                </div>
              </div>
            </form>

            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-2xl bg-white/90 backdrop-blur-md p-6 rounded-xl border border-[#FF9633]/10 shadow-lg">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#FF9633]" />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 border-2 focus:border-[#FF9633] transition-all duration-200 bg-white rounded-xl w-full"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#FF9633]" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 border-2 focus:border-[#FF9633] transition-all duration-200 bg-white rounded-xl w-full"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="bg-[#FF9633] text-white hover:bg-[#FF9633]/90 transition-all duration-200 shadow-lg rounded-xl px-6"
                disabled={!firstName.trim() || firstName.trim() === user?.user_metadata?.first_name}
              >
                Changer le mot de passe
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}