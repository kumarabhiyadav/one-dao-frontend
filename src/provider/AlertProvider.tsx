import { ReactNode, useState } from "react";
import { AlertConfig, AlertContext } from "../context/AlertContext";
import AlertDialog from "../pages/AlertBox";

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<AlertConfig | null>(null);
  
    const showAlert = (newConfig: AlertConfig) => {
      setConfig(newConfig);
      setIsOpen(true);
    };
  
    const hideAlert = () => {
      setIsOpen(false);
      setConfig(null);
    };
  
    return (
      <AlertContext.Provider value={{ showAlert, hideAlert }}>
        {children}
        <AlertDialog isOpen={isOpen} config={config} onClose={hideAlert} />
      </AlertContext.Provider>
    );
  };