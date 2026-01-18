import { useLayoutEffect, useRef, useState } from "react";
const useIsMounted = () => {
  const isFirstRender = useRef(true);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(isFirstRender.current);
    isFirstRender.current = false;
  }, []);

  return mounted;
};

export default useIsMounted;
