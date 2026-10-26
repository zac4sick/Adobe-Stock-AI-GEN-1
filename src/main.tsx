// Ensure window.fetch has a setter so browser extensions and preview harnesses can assign to it
try {
  let _fetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get: () => _fetch,
    set: (fn) => {
      _fetch = fn;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // Ignore
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
