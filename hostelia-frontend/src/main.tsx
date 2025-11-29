import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './state/AuthContext';
import { HostelsProvider } from './state/HostelsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HostelsProvider>
          <App />
        </HostelsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
