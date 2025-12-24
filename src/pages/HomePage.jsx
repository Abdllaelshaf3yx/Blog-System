import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { FiPlus, FiArrowRight, FiZap, FiSearch } from "react-icons/fi";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();

  const filteredPosts = React.useMemo(() => posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  ), [posts, searchTerm]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsList = await postService.getAllPosts();
        setPosts(postsList);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostDeleted = (deletedPostId) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] pt-16">
        <span className="loading loading-dots loading-lg text-gray-300"></span>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

        <div className="container mx-auto px-4 pt-4 pb-16 md:pt-12 md:pb-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <FiZap className="fill-current" /> New Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
            Blogs that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">matter to you.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            A place for improved thinking and distinct voices. Read, write, and deepen your understanding.
          </p>

          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/add-post" className="btn btn-primary rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 border-none hover:scale-105 transition-transform">
                Start Writing
              </Link>
            ) : (
              <>
                <Link to="/login?mode=register" className="btn btn-primary rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 border-none hover:scale-105 transition-transform">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-ghost hover:bg-gray-50 rounded-full px-8 h-12 text-base font-normal">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 border-b border-gray-200 pb-6 gap-4">
          <div className="w-full md:w-auto text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Latest Blogs</h2>
            <p className="text-gray-500 text-sm mt-1">Discover what's trending today</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              className="input input-bordered w-full pl-10 rounded-full bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
          </div>
        </div>

        {error ? (
          <div className="alert alert-error rounded-xl max-w-lg mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📝</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">No blogs found</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                {searchTerm ? `We couldn't find any blogs matching "${searchTerm}"` : "The platform is fresh. Be the visionary who publishes the first story."}
              </p>
              <Link to={isAuthenticated ? "/add-post" : "/login"} className="btn btn-outline border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white rounded-full">
                Write a Story
              </Link>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <Link
          to="/add-post"
          className="fixed bottom-8 right-8 btn btn-primary btn-circle w-14 h-14 shadow-2xl shadow-primary/40 hover:scale-110 hover:-translate-y-1 transition-all z-40 flex items-center justify-center text-white"
        >
          <FiPlus className="w-6 h-6" />
        </Link>
      )}
    </div>
  );
}

export default HomePage;
