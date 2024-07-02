import { useContext, useState } from "react";
import { TaskContext } from "../../context/TaskContext";

const Dashboard = () => {
  const { tasks, addTask, deleteTask } = useContext(TaskContext);
  const [task, setTask] = useState("");

  const onChange = (e) => setTask(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    addTask({ title: task });
    setTask("");
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl mb-4">Dashboard</h2>
      <form onSubmit={onSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Add Task"
          value={task}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded mt-2"
        >
          Add Task
        </button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            className="bg-gray-100 p-2 rounded mb-2 flex justify-between items-center"
          >
            {task.name}
            <button
              onClick={() => deleteTask(task._id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
