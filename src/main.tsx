import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Font dipaket bersama aplikasi agar tetap tampil saat offline
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-700.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
