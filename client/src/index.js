import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n/i18n';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('[PWA] Service Worker registered successfully');
  },
  onUpdate: (registration) => {
    console.log('[PWA] New version available');
    // Dispatch custom event for update notification
    window.dispatchEvent(new CustomEvent('swUpdate', { detail: registration }));
  },
  onSync: () => {
    console.log('[PWA] Data synced');
  },
  onOffline: () => {
    console.log('[PWA] App is offline');
  }
});
