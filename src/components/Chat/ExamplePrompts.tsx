import React from 'react';

interface ExamplePrompt {
  text: string;
  onClick: (text: string) => void;
}

export function ExamplePrompts({ onSelectPrompt }: { onSelectPrompt: (text: string) => void }) {
  const examples: ExamplePrompt[] = [
    {
      text: "Je voudrais créer une liste de vocabulaire sur le thème des émotions pour ma classe de CE1.",
      onClick: onSelectPrompt
    },
    {
      text: "Peux-tu me créer une séquence de 5 séances sur la Révolution française pour une classe de CM2 ?",
      onClick: onSelectPrompt
    },
    {
      text: "Aide-moi à rédiger un compte-rendu pour la réunion parents-professeurs d'un élève de CE2 qui a des difficultés en lecture mais progresse bien en mathématiques.",
      onClick: onSelectPrompt
    },
    {
      text: "Génère-moi un QCM de 10 questions sur l'âge industriel pour une classe de CM2.",
      onClick: onSelectPrompt
    },
    {
      text: "Comment puis-je adapter ma séquence sur les fractions en CM1 pour trois niveaux différents ?",
      onClick: onSelectPrompt
    }
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Voici quelques exemples de ce que nous pouvons faire ensemble :
      </h3>
      <div className="space-y-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => example.onClick(example.text)}
            className="w-full text-left p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-200 text-sm text-gray-700 hover:text-blue-700"
          >
            {example.text}
          </button>
        ))}
      </div>
    </div>
  );
}