// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';

import { AppProvider } from './context/AppContext';           // ✅ Add this
import { SidebarProvider } from './context/SidebarContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProvider>           {/* ✅ Wrap with AppProvider */}
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </AppProvider>
  </React.StrictMode>
);