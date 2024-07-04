import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useReducer } from "react";
import authReducer from "../reducers/authReducer";
import setAuthToken from "../utils/setAuthToken";

const AuthContext = createContext();

const baseURL = "http://localhost:5001";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: "AUTH_ERROR" });
    }
  }, []);

  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      try {
        const decoded = jwtDecode(localStorage.token);
        const res = await axios.get(`${baseURL}/api/users/${decoded.user.id}`);
        dispatch({
          type: "USER_LOADED",
          payload: res.data,
        });
      } catch (err) {
        dispatch({ type: "AUTH_ERROR" });
      }
    } else {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
