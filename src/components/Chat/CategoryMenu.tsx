import React, { useState } from 'react';
import { ChevronDown, Wand2 } from 'lucide-react';

interface Category {
  title: string;
  items: string[];
}

const categories: Category[] = [
  {
    title: "Actions rapides pour ma classe",
    items: [
      "Créer un exercice",
      "Générer une séquence",
      "Rechercher dans le programme scolaire officiel",
      "Créer une progression ",
      "Adapter un exercice",
      "Planifier une séance",
      "Créer un plan de différenciation"
    ]
  }
];

interface CategoryMenuProps {
  onSelectPrompt: (text: string) => void;
}

// Ensure unique keys by combining category title and item
const getItemKey = (categoryTitle: string, item: string) => `${categoryTitle}-${item}`;

export function CategoryMenu({ onSelectPrompt }: CategoryMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#E8F5F0] rounded-lg overflow-hidden transition-all duration-300 ease-in-out mb-20 sm:mb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-[#2D9474] text-white hover:bg-[#236D57] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Wand2 className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Actions rapides</h3>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'max-h-[300px] sm:max-h-[400px] opacity-100 overflow-y-auto' 
          : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((category) => (
            category.items.map((item) => (
              <button
                key={getItemKey(category.title, item)}
                onClick={() => onSelectPrompt(item)}
                className="w-full text-left p-3 text-sm text-gray-800 bg-white hover:bg-[#F0F9F6] hover:text-[#2D9474] transition-all duration-200 border border-[#A7D7C5] rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#2D9474]/20"
              >
                {item}
              </button>
            ))
          ))}
        </div>
      </div>
    </div>
  );
}