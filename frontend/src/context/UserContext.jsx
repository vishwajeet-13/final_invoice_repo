// UserContext.js
import { useState, createContext, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { isLoggedIn: false };
  });

  useEffect(() => {
  }, [user]);

  const login = (userData) => {
    const newUserState = {
      isLoggedIn: true,
      id: userData.id,
      username: userData.username,
      c_name: userData.c_name,
      address: userData.address,
      contact: userData.contact,
      access: userData.access, // JWT
      refresh: userData.refresh, // JWT
    };

    localStorage.setItem("user", JSON.stringify(newUserState));
    setUser(newUserState);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser({ isLoggedIn: false });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
