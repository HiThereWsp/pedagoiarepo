import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TermsOfServiceProps {
  onAccept: (accepted: boolean, newsletter: boolean) => void;
  accepted: boolean;
  newsletter: boolean;
}

export function TermsOfService({ onAccept, accepted, newsletter }: TermsOfServiceProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-border/50 shadow-premium max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Conditions d'utilisation de la version beta
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronDown className={cn(
            "w-5 h-5 transition-transform duration-200",
            isExpanded ? "rotate-180" : ""
          )} />
        </button>
      </div>
      
      <ScrollArea className={cn(
        "rounded-md border mb-6 transition-all duration-200 overflow-hidden",
        isExpanded ? "h-[400px]" : "h-[200px]"
      )}>
        <div className="prose prose-sm">
          <div className="p-4">
          <h3>1. Version Beta Gratuite</h3>
          
          <h4>1.1 Période d'accès gratuit</h4>
          <ul>
            <li>Cette version beta de Pedagoia est actuellement gratuite</li>
            <li>La période beta durera jusqu'au lancement officiel de l'application</li>
            <li>Vous serez informé(e) au minimum 30 jours avant tout changement concernant la tarification</li>
          </ul>

          <h4>1.2 Avantages beta-testeurs</h4>
          <ul>
            <li>Accès à toutes les fonctionnalités pendant la période beta</li>
            <li>Influence sur le développement des futures fonctionnalités</li>
            <li>Possibilité de participer aux sessions de feedback</li>
            <li>Support prioritaire</li>
          </ul>

          <h3>2. Collecte et Protection des Données</h3>

          <h4>2.1 Données collectées</h4>
          <p>Nous collectons de manière anonyme :</p>
          <ul>
            <li>Statistiques d'utilisation des fonctionnalités</li>
            <li>Performances de l'application</li>
            <li>Erreurs rencontrées</li>
            <li>Parcours utilisateur dans l'application</li>
            <li>Feedback et suggestions d'amélioration</li>
          </ul>

          <h4>2.2 Finalités de la collecte</h4>
          <p>Ces données sont utilisées exclusivement pour :</p>
          <ul>
            <li>Améliorer l'expérience utilisateur</li>
            <li>Optimiser les performances</li>
            <li>Identifier et corriger les bugs</li>
            <li>Développer de nouvelles fonctionnalités pertinentes</li>
          </ul>

          <h4>2.3 Protection des données</h4>
          <ul>
            <li>Toutes les données sont anonymisées avant analyse</li>
            <li>Aucune donnée personnelle n'est partagée avec des tiers</li>
            <li>Les données sont hébergées en Europe sur des serveurs sécurisés</li>
            <li>Conformité totale avec le RGPD</li>
          </ul>

          <h3>3. Vos Droits RGPD</h3>
          <p>En tant qu'utilisateur, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition au traitement</li>
            <li>Droit de retrait du consentement</li>
          </ul>

          <p>Pour exercer ces droits, contactez-nous à : dpo@pedagoia.com</p>

          <h3>4. Sécurité et Confidentialité</h3>

          <h4>4.1 Protection des données pédagogiques</h4>
          <ul>
            <li>Chiffrement des données sensibles</li>
            <li>Aucun accès aux contenus pédagogiques par notre équipe sans autorisation</li>
            <li>Sauvegarde régulière et sécurisée</li>
          </ul>

          <h4>4.2 Confidentialité</h4>
          <ul>
            <li>Respect strict du secret professionnel</li>
            <li>Protection des données des élèves</li>
            <li>Non-divulgation des pratiques pédagogiques</li>
          </ul>

          <h3>5. Engagement de Transparence</h3>
          <p>Nous nous engageons à :</p>
          <ul>
            <li>Vous informer de tout changement majeur</li>
            <li>Communiquer clairement sur l'évolution du produit</li>
            <li>Maintenir un dialogue ouvert avec la communauté</li>
            <li>Être transparent sur l'utilisation des données</li>
          </ul>

          <h3>6. Résiliation</h3>
          <p>Vous pouvez à tout moment :</p>
          <ul>
            <li>Désactiver votre compte</li>
            <li>Demander la suppression de vos données</li>
            <li>Quitter le programme beta</li>
            <li>Exporter vos données</li>
          </ul>
          </div>
        </div>
      </ScrollArea>

      <div className="space-y-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={accepted}
            onCheckedChange={(checked) => onAccept(checked as boolean, newsletter)}
            className="data-[state=checked]:bg-[#FF9633] data-[state=checked]:border-[#FF9633]"
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground">
            J'accepte les conditions d'utilisation et la politique de confidentialité
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="newsletter" 
            checked={newsletter}
            onCheckedChange={(checked) => onAccept(accepted, checked as boolean)}
            className="data-[state=checked]:bg-[#FF9633] data-[state=checked]:border-[#FF9633]"
          />
          <Label htmlFor="newsletter" className="text-sm text-muted-foreground">
            Je souhaite recevoir les actualités et améliorations d'Élia
          </Label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Dernière mise à jour : Décembre 2024
      </p>
    </div>
  );
}