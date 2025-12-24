import React, { useState, useEffect } from "react";
import { commentService } from "../services/commentService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FiSend, FiTrash2 } from "react-icons/fi";

function CommentsSection({ postId }) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const fetchedComments = await commentService.getCommentsByPostId(postId);
                setComments(fetchedComments);
            } catch (error) {
                console.error("Failed to load comments");
            } finally {
                setLoading(false);
            }
        };
        if (postId) fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const addedComment = await commentService.addComment(
                postId,
                user.uid,
                user.displayName,
                user.photoURL,
                newComment
            );
            setComments([addedComment, ...comments]);
            setNewComment("");
            toast.success("Comment added!");
        } catch (error) {
            console.error(error);
            toast.error(`Failed: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await commentService.deleteComment(commentId, postId);
            setComments(comments.filter(c => c.id !== commentId));
            toast.success("Comment deleted");
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl p-6 md:p-8 border border-base-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-base-content">
                Comments <span className="badge badge-primary">{comments.length}</span>
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-8 relative">
                    <div className="flex gap-4 items-start">
                        <div className="avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} alt="Profile" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <textarea
                                className="textarea textarea-bordered w-full h-24 focus:outline-none focus:border-primary bg-base-100 text-base"
                                placeholder="What are your thoughts?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={submitting}
                            ></textarea>
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    className="clean-btn gap-2"
                                    disabled={submitting || !newComment.trim()}
                                >
                                    {submitting ? <span className="loading loading-spinner"></span> : <><FiSend /> Post Comment</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="alert alert-info shadow-sm mb-8 bg-blue-50 text-blue-800 border-blue-100">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Please login to join the discussion.</span>
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : comments.length > 0 ? (
                    <div>
                        {comments.map((comment, index) => (
                            <div
                                key={comment.id || Math.random()}
                                className={`flex gap-4 group ${index !== comments.length - 1 ? 'mb-6' : ''}`}
                            >
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                        <img src={comment.userPhotoURL || `https://ui-avatars.com/api/?name=${comment.userDisplayName}`} alt={comment.userDisplayName} />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-sm text-base-content">{comment.userDisplayName}</p>
                                        <span className="text-xs text-gray-400">
                                            {comment.createdAt?.seconds
                                                ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString()
                                                : 'Just now'}
                                        </span>
                                    </div>
                                    <div className="pl-0 pt-1 relative">
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                                        {user?.uid === comment.userId && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="absolute top-0 right-0 text-gray-400 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                title="Delete comment"
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 italic py-8 bg-gray-50 rounded-xl">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}

export default CommentsSection;
