import posthog from 'posthog-js';
import { toast } from './toast';

export const POSTHOG_CONFIG = {
  apiKey: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || '',
  apiHost: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  options: {
    persistence: 'localStorage',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: false,
    enable_recording_console: true,
    mask_all_text: false,
    mask_all_element_attributes: false,
  }
} as const;

type EventName = 
  | 'user_login'
  | 'user_signup'
  | 'chat_message_sent'
  | 'chat_message_received'
  | 'feature_used'
  | 'error_occurred';

interface PostHogEvent {
  name: EventName;
  properties?: Record<string, any>;
}

class PostHogService {
  private static instance: PostHogService;
  private initialized: boolean = false;

  private constructor() {
    // Private constructor to enforce singleton
  }
  
  public getClient(): typeof posthog {
    if (!this.initialized) {
      console.warn('PostHog not initialized');
      this.init();
    }
    return posthog;
  }

  public static getInstance(): PostHogService {
    if (!PostHogService.instance) {
      PostHogService.instance = new PostHogService();
    }
    return PostHogService.instance;
  }

  public init(): void {
    if (this.initialized) {
      console.warn('PostHog already initialized');
      return;
    }

    if (!POSTHOG_CONFIG.apiKey) {
      console.warn('PostHog API key not configured');
      return;
    }

    try {
      posthog.init(POSTHOG_CONFIG.apiKey, {
        api_host: POSTHOG_CONFIG.apiHost,
        ...POSTHOG_CONFIG.options,
        loaded: (posthog) => {
          if (import.meta.env.DEV) {
            posthog.debug();
          }
          this.initialized = true;
          console.log('PostHog initialized successfully');
        }
      });
    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
      // Silently fail analytics to not impact user experience
    }
  }

  public captureEvent({ name, properties = {} }: PostHogEvent): void {
    if (!this.initialized) {
      console.warn('PostHog not initialized. Event not captured:', name);
      return;
    }

    try {
      posthog.capture(name, {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to capture event ${name}:`, error);
    }
  }

  public identify(userId: string, properties?: Record<string, any>): void {
    if (!this.initialized) {
      console.warn('PostHog not initialized. User not identified:', userId);
      return;
    }

    try {
      posthog.identify(userId, properties);
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  public reset(): void {
    if (!this.initialized) return;
    posthog.reset();
  }
}

export const analytics = PostHogService.getInstance();

export function initPostHog(): void {
  analytics.init();
}