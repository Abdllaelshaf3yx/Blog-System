import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function PostCard({ post, onDelete }) {
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const deleteToast = toast.loading("Deleting post...");
    try {
      const postDocRef = doc(db, "posts", post.id);
      await deleteDoc(postDocRef);
      onDelete(post.id);
      toast.success("Post deleted successfully!", { id: deleteToast });
    } catch (error) {
      toast.error("Failed to delete the post.", { id: deleteToast });
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      >
        <div className="card card-side bg-base-100 shadow-lg border flex-row">
          <figure className="w-48 h-48 flex-shrink-0">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="card-body p-6 flex flex-col justify-between">
            <div>
              <h2 className="card-title text-2xl font-bold">{post.title}</h2>
              <p className="mt-2 text-gray-600 line-clamp-2">
                {post.description}
              </p>
              <hr className="my-3" />
              <div className="flex items-center gap-2 text-gray-500">
                {post.authorPhotoURL ? (
                  <img
                    src={post.authorPhotoURL}
                    alt={post.authorName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span>{post.authorName}</span>
              </div>
            </div>
            {isAuthenticated && user.uid === post.userId && (
              <div className="card-actions justify-end">
                <Link
                  to={`/edit-post/${post.id}`}
                  className="btn btn-sm btn-outline btn-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <dialog open={isModalOpen} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
}

export default PostCard;
