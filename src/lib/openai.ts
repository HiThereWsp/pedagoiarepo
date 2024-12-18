import OpenAI from 'openai';
import { config } from './config';

interface ChatContext {
  classLevel?: string;
}

let openai: OpenAI;

try {
  openai = new OpenAI({
    apiKey: config.openai.apiKey,
    dangerouslyAllowBrowser: true
  });
} catch (error) {
  console.error('Erreur d\'initialisation OpenAI:', error);
}

export async function getChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
  context?: ChatContext
) {
  try {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is not configured. Chat features are currently unavailable.');
    }

    const systemPrompt = `Tu es Élia, une assistante pédagogique experte conçue pour aider les enseignants. 
      Tu as une expertise approfondie en pédagogie, en didactique et en sciences de l'éducation. 
      Tu es capable d'aider à la préparation des cours, à la création de supports pédagogiques et à l'organisation de la classe. 
      Ton ton est professionnel mais bienveillant.
      ${context?.classLevel ? `Tu t'adresses à un enseignant de ${context.classLevel}.` : ''}`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    if (!response.choices[0]?.message?.content) {
      throw new Error('Réponse invalide de l\'API OpenAI');
    }

    return {
      role: 'assistant' as const,
      content: response.choices[0].message.content,
    };
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    
    // Vérifier si l'erreur est une erreur d'authentification
    if (error instanceof Error && error.message.includes('401')) {
      throw new Error('La clé API OpenAI est invalide ou a expiré. Veuillez vérifier vos identifiants. Si le problème persiste, contactez notre service support.');
    }
    
    // Vérifier si l'erreur est liée au quota
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error('Quota OpenAI dépassé. Veuillez réessayer plus tard ou vérifier votre abonnement. Si le problème persiste, contactez notre service support.');
    }

    if (error instanceof Error) {
      if (error.message.includes('api_key')) {
        throw new Error('Clé API OpenAI invalide ou manquante. Veuillez vérifier votre configuration. Si le problème persiste, contactez notre service support.');
      }
      if (error.message.includes('rate_limit')) {
        throw new Error('Limite de requêtes atteinte. Veuillez réessayer dans quelques instants. Si le problème persiste, contactez notre service support.');
      }
    }
  }
}
