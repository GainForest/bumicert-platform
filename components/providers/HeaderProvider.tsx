import { createContext, useContext, useState } from "react";

type HeaderContextType = {
  leftContent: React.ReactNode;
  setLeftContent: (content: React.ReactNode) => void;
  rightContent: React.ReactNode;
  setRightContent: (content: React.ReactNode) => void;
  subHeaderContent: React.ReactNode;
  setSubHeaderContent: (content: React.ReactNode) => void;
};

const HeaderContext = createContext<HeaderContextType | null>(null);

export const HeaderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [leftContent, setLeftContent] = useState<React.ReactNode>(null);
  const [rightContent, setRightContent] = useState<React.ReactNode>(null);
  const [subHeaderContent, setSubHeaderContent] =
    useState<React.ReactNode>(null);
  return (
    <HeaderContext.Provider
      value={{
        leftContent,
        setLeftContent,
        rightContent,
        setRightContent,
        subHeaderContent,
        setSubHeaderContent,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};
