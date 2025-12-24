import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postService } from "../services/postService";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2, FiHeart, FiMessageSquare, FiClock } from "react-icons/fi";


// React.memo to prevent unnecessary re-renders
const PostCard = React.memo(({ post, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Local state for likes
  const [likes, setLikes] = useState(post.likes || []);
  const isLiked = isAuthenticated && user?.uid && likes.includes(user.uid);

  const handleDelete = async () => {
    setIsDeleting(true);
    const deleteToast = toast.loading("Deleting post...");
    try {
      await postService.deletePost(post.id);
      onDelete(post.id);
      toast.success("Post deleted successfully!", { id: deleteToast });
    } catch (error) {
      toast.error("Failed to delete the post.", { id: deleteToast });
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const onLikeClick = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please login to like");

    const userId = user.uid;
    const previousLikes = [...likes];

    // Optimistic Update
    if (isLiked) {
      setLikes(likes.filter(id => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }

    try {
      await postService.toggleLike(post.id, userId);
    } catch (err) {
      setLikes(previousLikes); // Revert
      toast.error("Something went wrong");
    }
  }

  return (
    <>
      <div className="clean-card h-full flex flex-col group relative bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        {/* Actions Overlay (Admin) */}
        {isAuthenticated && user?.uid === post.userId && (
          <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
            <Link
              to={`/edit-post/${post.id}`}
              className="btn btn-xs btn-ghost btn-circle text-info"
              title="Edit"
            >
              <FiEdit2 />
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-xs btn-ghost btn-circle text-error"
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        )}

        {/* Image */}
        <Link to={`/post/${post.id}`} className="block overflow-hidden relative aspect-video bg-gray-100">
          <img
            src={post.imageUrl || "https://placehold.co/800x600?text=No+Image"}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
            <span>{post.category || "Article"}</span>
            <div className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              <span>{post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>

          <Link to={`/post/${post.id}`} className="group-hover:text-primary transition-colors">
            <h2 className="text-xl font-bold mb-2 leading-tight line-clamp-2 text-gray-900">{post.title}</h2>
          </Link>

          <p className="text-gray-500 line-clamp-3 mb-6 text-sm flex-1 leading-relaxed">
            {post.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            <Link to={`/user/${post.userId}`} className="flex items-center gap-2 group/author hover:opacity-80 transition-opacity">
              <div className="avatar">
                <div className="w-8 rounded-full ring-1 ring-gray-100">
                  <img
                    src={post.authorPhotoURL || `https://ui-avatars.com/api/?name=${post.authorName}`}
                    alt={post.authorName}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover/author:text-primary transition-colors">{post.authorName}</span>
            </Link>

            <div className="flex gap-4 text-gray-400">
              <button
                onClick={onLikeClick}
                className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
              >
                <FiHeart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">{likes.length || 0}</span>
              </button>
              <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                <FiMessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">{post.commentsCount || 0}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="modal-box rounded-2xl shadow-2xl p-6 bg-white max-w-sm w-full">
            <h3 className="font-bold text-xl text-gray-800 mb-2">Delete Story?</h3>
            <p className="text-gray-500 mb-6">
              This action cannot be undone. Are you sure you want to remove this post?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-ghost text-gray-500 hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <span className="loading loading-spinner"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default PostCard;
