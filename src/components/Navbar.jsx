import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiEdit3, FiLogOut, FiUser, FiMenu, FiX, FiSearch } from "react-icons/fi";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">

          {/* 1. Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
              Blog<span className="text-gray-400 font-normal">System</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end mr-6">
            {/* Search moved to HomePage */}
          </div>

          {/* 3. Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/add-post"
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiEdit3 /> Write
                </Link>

                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar online hover:scale-105 transition-transform">
                    <div className="w-10 rounded-full ring-2 ring-gray-100 ring-offset-2 ring-offset-white hover:ring-primary transition-all">
                      <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} alt="avatar" />
                    </div>
                  </label>
                  <ul tabIndex={0} className="mt-4 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] menu menu-compact dropdown-content bg-white rounded-2xl w-60 border border-gray-100 transform origin-top-right transition-all duration-200">
                    <li className="px-4 py-3 border-b border-gray-50 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 rounded-full ring-1 ring-gray-100">
                            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} alt="avatar" />
                          </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold text-gray-900 truncate text-sm">{user?.displayName}</span>
                          <span className="text-xs text-gray-500 truncate">{user?.email}</span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link to="/profile" className="py-3 px-4 hover:bg-gray-50 rounded-xl text-gray-700 font-medium active:bg-gray-50 active:text-primary gap-3">
                        <FiUser className="w-4 h-4" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/add-post" className="py-3 px-4 hover:bg-gray-50 rounded-xl text-gray-700 font-medium active:bg-gray-50 active:text-primary gap-3">
                        <FiEdit3 className="w-4 h-4" /> Write Story
                      </Link>
                    </li>
                    <div className="h-px bg-gray-50 my-2"></div>
                    <li>
                      <button onClick={handleLogout} className="py-3 px-4 text-red-500 hover:bg-red-50 rounded-xl font-medium gap-3 hover:text-red-600">
                        <FiLogOut className="w-4 h-4" /> Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
                  Sign in
                </Link>
                <Link to="/login?mode=register" className="btn btn-primary rounded-full px-6 font-medium normal-case shadow-lg shadow-primary/25 border-none hover:bg-primary-focus">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* 4. Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg text-xl"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user?.displayName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Link to="/profile" className="btn btn-ghost justify-start gap-3 w-full font-normal" onClick={() => setIsMenuOpen(false)}>
                  <FiUser /> Profile
                </Link>
                <Link to="/add-post" className="btn btn-ghost justify-start gap-3 w-full font-normal" onClick={() => setIsMenuOpen(false)}>
                  <FiEdit3 /> Create Post
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost justify-start gap-3 w-full text-red-500 hover:bg-red-50 font-normal">
                  <FiLogOut /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="btn btn-outline w-full rounded-full" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                <Link to="/login?mode=register" className="btn btn-primary w-full rounded-full" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        )}
      </nav>
      {/* Spacer to push content down */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;
