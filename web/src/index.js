import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';

import { AppProvider } from './context/AppContext';
import { SidebarProvider } from './context/SidebarContext';
import { UserProvider } from './context/UserContext'; // <-- add this import

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProvider>
      <SidebarProvider>
        <UserProvider>  {/* <-- wrap App with UserProvider */}
          <App />
        </UserProvider>
      </SidebarProvider>
    </AppProvider>
  </React.StrictMode>
);
