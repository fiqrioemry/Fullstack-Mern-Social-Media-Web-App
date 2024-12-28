import { useEffect, useRef, useState } from "react";

const useHandleSearch = () => {
  const searchRef = useRef(null);
  const buttonRef = useRef(null);
  const [openSearch, setOpenSearch] = useState(false);

  const handleSearch = () => {
    setOpenSearch((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (
      openSearch &&
      searchRef.current &&
      !buttonRef.current.contains(event.target) &&
      !searchRef.current.contains(event.target)
    ) {
      setOpenSearch(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && openSearch) setOpenSearch(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openSearch]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return {
    buttonRef,
    searchRef,
    openSearch,
    handleSearch,
    handleClickOutside,
  };
};

export default useHandleSearch;
