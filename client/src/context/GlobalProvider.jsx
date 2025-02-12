/* eslint-disable react/prop-types */
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import useHandleModal from "../hooks/useHandleModal";
import { useAuthStore } from "../store/useAuthStore";
import useHandleSearch from "../hooks/useHandleSearch";
import useHandleDarkMode from "../hooks/useHandleDarkMode";
import { useLocation, useNavigate } from "react-router-dom";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [mount, setMount] = useState(false);
  const [background, setBackground] = useState(null);
  const { user, authCheck, isAuthenticate } = useAuthStore();

  const { handleSearch, openSearch, searchRef } = useHandleSearch();
  useHandleDarkMode();
  const {
    openModal,
    setOpenModal,
    handleOpenModal,
    handleCloseModal,
    handleCloseAllModals,
  } = useHandleModal();

  useEffect(() => {
    authCheck();
    setMount(false);
  }, [authCheck]);

  return (
    <GlobalContext.Provider
      value={{
        handleSearch,
        openSearch,
        searchRef,
        navigate,
        currentPath,
        openModal,
        isAuthenticate,
        user,
        setOpenModal,
        handleOpenModal,
        handleCloseModal,
        handleCloseAllModals,
        mount,
        background,
        setBackground,
        setMount,
      }}
    >
      <Toaster />
      {isAuthenticate === null ? null : children}
    </GlobalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProvider = () => useContext(GlobalContext);
