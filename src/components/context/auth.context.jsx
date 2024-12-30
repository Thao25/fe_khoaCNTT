import { createContext, useState } from "react";
export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    role: "",
    fullName: "",
    profileImage: "",
    gender: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
    studentClass: "",
    description: "",
  },
  apploading: true,
  hasRole: (role) => false,
});
export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: "",
      role: "",
      fullName: "",
      profileImage: "",
      gender: "",
      address: "",
      phoneNumber: "",
      dateOfBirth: "",
      studentClass: "",
      description: "",
    },
    apploading: true,
  });
  const [apploading, setAppLoading] = useState(true);
  const hasRole = (roles) => {
    return roles.includes(auth.user.role);
  };
  return (
    <AuthContext.Provider
      value={{ auth, setAuth, apploading, setAppLoading, hasRole }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
