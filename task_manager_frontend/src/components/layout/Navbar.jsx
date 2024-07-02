import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const authLinks = (
    <>
      <span className="text-white">Welcome, {user && user.name}</span>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-2 rounded ml-2"
      >
        Logout
      </button>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/register" className="text-white px-3 py-2">
        Register
      </Link>
      <Link to="/login" className="text-white px-3 py-2">
        Login
      </Link>
    </>
  );

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl">
          Task Manager
        </Link>
        <div>{isAuthenticated ? authLinks : guestLinks}</div>
      </div>
    </nav>
  );
};

export default Navbar;
