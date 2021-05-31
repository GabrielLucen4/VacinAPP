import React from "react";
import Context from "./Context";
import useStorage from "../../utils/useStorage";

const StoreProvider = ({ children }) => {
  // * Context para passar o token entre a aplicação

  const [token, setToken] = useStorage("token");

  return (
    <Context.Provider value={{ token, setToken }}>{children}</Context.Provider>
  );
};

export default StoreProvider;
