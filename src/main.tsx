import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PostHogProvider } from 'posthog-js/react'
import { analytics } from './lib/posthog'
import App from './App.tsx';
import './index.css';

analytics.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={analytics.getClient()}>
      <App />
    </PostHogProvider>
  </StrictMode>
);