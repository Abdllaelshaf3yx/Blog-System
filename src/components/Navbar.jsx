import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl normal-case">
          Blog System
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 items-center">
          {isAuthenticated ? (
            <>
              <li>
                <span className="font-semibold">Hi, {user?.displayName}</span>
              </li>
              {user?.photoURL && (
                <li>
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={user.photoURL} alt="Profile" />
                    </div>
                  </div>
                </li>
              )}
              <li>
                <button onClick={logout} className="btn btn-ghost">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className="btn btn-ghost">
                Login / Register
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
