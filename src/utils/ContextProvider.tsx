import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PackageContextProps {
    packageIDValue: number;
    setPackageData: (data: number) => void;
}

const PackageContext = createContext<PackageContextProps | undefined>(undefined);

interface PackageProviderProps {
  children: ReactNode;
}

export const PackageProvider: React.FC<PackageProviderProps> = ({ children }) => {
  const [packageIDValue, setPackageIdValue] = useState<number>(0);


  const setPackageData = (data: number) => {
    setPackageIdValue(data);
  };

  return (
    <PackageContext.Provider value={{ packageIDValue, setPackageData}}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackageContext = (): PackageContextProps => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackageContext must be used within PackageProvider');
  }
  return context;
};