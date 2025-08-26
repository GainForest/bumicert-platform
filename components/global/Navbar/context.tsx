"use client";
import useMediaQuery from "@/hooks/use-media-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type NavbarContextType = {
  viewport: "mobile" | "desktop";
  openState: {
    mobile: boolean;
    desktop: boolean;
  };
  setOpenState: (value?: boolean, viewport?: "mobile" | "desktop") => void;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

export const NavbarContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewport, setViewport] = useState<"mobile" | "desktop">("desktop");
  const [openState, setOpenState] = useState<{
    mobile: boolean;
    desktop: boolean;
  }>({
    mobile: false,
    desktop: true,
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const updateOpenState = useCallback(
    (value?: boolean, _viewport?: "mobile" | "desktop") => {
      setOpenState((prev) => {
        const ret = {
          ...prev,
          [_viewport ?? viewport]: value ?? !prev[_viewport ?? viewport],
        };
        console.log(ret);
        return ret;
      });
    },
    [viewport, setOpenState]
  );

  useEffect(() => {
    setViewport(isMobile ? "mobile" : "desktop");
  }, [isMobile]);

  return (
    <NavbarContext.Provider
      value={{ viewport, openState, setOpenState: updateOpenState }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error(
      "useNavbarContext must be used within a NavbarContextProvider"
    );
  }
  return context;
};
