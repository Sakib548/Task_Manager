import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";

const AuthContext = createContext();

const baseURL = "http://localhost:5001";

const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT":
    case "REGISTER_FAIL":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadUser();
  }, []);

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`${baseURL}/api/users`);
      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  // Register User
  const register = async ({ name, email, password }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post(
        `${baseURL}/api/users/register`,
        body,
        config
      );
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      });
      loadUser();
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      dispatch({
        type: "REGISTER_FAIL",
      });
    }
  };

  // Login User
  const login = async (email, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post(`${baseURL}/api/users/login`, body, config);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      });
      loadUser();
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      dispatch({
        type: "LOGIN_FAIL",
      });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
