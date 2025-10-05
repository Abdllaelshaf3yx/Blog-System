import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"));
        const postSnapshot = await getDocs(q);
        const postsList = postSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsList);
      } catch (err) {
        setError("Failed to load posts. Please try again.");
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-error">{error}</div>;
  }

  return (
    <div className="relative min-h-screen max-w-3xl mx-auto">
      <div className="flex flex-col gap-8 mt-6">
        {posts.length > 0 ? (
          <motion.div
            className="flex flex-col gap-8 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              There are no posts to display at the moment.
            </p>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <Link
          to="/add-post"
          className="btn btn-primary btn-circle fixed bottom-10 right-10 shadow-lg"
          style={{ width: "4rem", height: "4rem" }}
        >
          <svg
            xmlns="http://www.w.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}

export default HomePage;
