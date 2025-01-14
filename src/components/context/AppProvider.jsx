import React, { createContext, useContext, useState } from "react";

const AppContext = createContext({});

const AppWrapper = ({ children }) => {
  const [reloadFooter, setReloadFooter] = useState(false);
  const [reloadHeader, setReloadHeader] = useState(false);
  const valueContext = {
    reloadFooter,
    setReloadFooter,
    reloadHeader,
    setReloadHeader,
  };
  return (
    <AppContext.Provider value={valueContext}>{children}</AppContext.Provider>
  );
};

export const UseApp = () => useContext(AppContext);

export default AppWrapper;
