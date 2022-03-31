import { useEffect } from "react";
import { History } from "history";
import { useHistory } from "react-router-dom";

const ScrollToTop = () => {
  const history = useHistory<History>();

  useEffect(() => {
    const unsubscribe = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default ScrollToTop;
