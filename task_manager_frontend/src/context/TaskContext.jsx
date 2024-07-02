import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

const TaskContext = createContext();

const baseURL = "http://localhost:5001";

const taskReducer = (state, action) => {
  switch (action.type) {
    case "GET_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    default:
      return state;
  }
};

const TaskProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const initialState = {
    tasks: [],
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Get Tasks
  const getTasks = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/tasks`, config);
      dispatch({
        type: "GET_TASKS",
        payload: res.data,
      });
    } catch (err) {
      console.error(
        "Error fetching tasks:",
        err.response ? err.response.data : err.message
      );
    }
  };

  // Add Task
  const addTask = async (taskData) => {
    try {
      const res = await axios.post(`${baseURL}/api/tasks`, taskData, config);
      dispatch({
        type: "ADD_TASK",
        payload: res.data,
      });
    } catch (err) {
      console.error(
        "Error creating task:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <TaskContext.Provider value={{ ...state, getTasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
