import React from 'react';
export function SolutionSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Pédagoia, une solution sur-mesure
          </h2>
          <div className="prose prose-lg max-w-3xl text-muted-foreground bg-white p-8 rounded-xl shadow-premium">
            <p>
              En tant qu'experts en IA, nous étudions les méthodes de travail des enseignants 
              afin d'identifier les leviers de productivité dans leurs tâches quotidiennes. 
              Notre suite d'outils IA est basée sur les programmes nationaux et est conçue 
              pour aider les enseignants à gagner plus de 10 heures par semaine tout en 
              améliorant la qualité de votre enseignement.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-8">
              Concentrez-vous sur l'essentiel : vos élèves
              <br />
              <span className="text-primary">L'IA s'occupe du reste, vous gardez le contrôle</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200">
                <div className="text-3xl font-bold text-primary mb-2">10h+</div>
                <p className="text-sm text-muted-foreground">de temps libéré chaque semaine pour l'essentiel</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200">
                <div className="text-3xl font-bold text-primary mb-2">30+</div>
                <p className="text-sm text-muted-foreground">tâches quotidiennes automatisées</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">adaptable au niveau de vos élèves</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-200">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <p className="text-sm text-muted-foreground">nouvelles ressources mensuelles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}