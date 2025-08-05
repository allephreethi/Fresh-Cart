import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);

  const toggleSidebar = (value) => {
    if (typeof value === 'boolean') {
      setIsManuallyToggled(value);
    } else {
      setIsManuallyToggled((prev) => !prev);
    }
  };

  const setHover = (value) => setIsHovered(value);

  const isExpanded = isHovered || isManuallyToggled;

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar, setHover }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
