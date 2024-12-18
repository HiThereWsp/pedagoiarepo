import React from 'react';
import { Settings } from 'lucide-react';
import { CLASS_LEVELS, EDUCATION_LEVELS } from './ClassLevelSelector';
import { useUserPreferences } from './UserPreferencesContext';

export function UserSettings() {
  const { classLevel, setClassLevel } = useUserPreferences();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <Settings className="w-4 h-4" />
        <span className="font-medium">Paramètres</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau d'enseignement
          </label>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">École Primaire</h4>
              <div className="grid grid-cols-2 gap-2">
                {EDUCATION_LEVELS.primary.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setClassLevel(level.id)}
                    className={`px-3 py-2 text-sm rounded-md border ${
                      classLevel === level.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Collège</h4>
              <div className="grid grid-cols-2 gap-2">
                {EDUCATION_LEVELS.secondary.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setClassLevel(level.id)}
                    className={`px-3 py-2 text-sm rounded-md border ${
                      classLevel === level.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Lycée</h4>
              <div className="grid grid-cols-2 gap-2">
                {EDUCATION_LEVELS.highSchool.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setClassLevel(level.id)}
                    className={`px-3 py-2 text-sm rounded-md border ${
                      classLevel === level.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}