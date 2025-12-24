import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { postService } from "../services/postService";
import PostCard from "../components/PostCard";
import { FiUser, FiCalendar, FiMapPin } from "react-icons/fi";

function PublicProfilePage() {
    const { userId } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user data and posts in parallel
                const [userData, userPosts] = await Promise.all([
                    userService.getUserById(userId),
                    postService.getPostsByUserId(userId)
                ]);

                if (!userData) {
                    setError("User not found");
                } else {
                    setProfileUser(userData);
                    setPosts(userPosts);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] pt-16">
                <span className="loading loading-dots loading-lg text-gray-300"></span>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "User not found"}</h2>
                <p className="text-gray-500">The user you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-8 pb-16 bg-base-100">
            {/* Header / Profile Card */}
            <div className="bg-white border-b border-gray-100 mb-12">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto">
                        {/* Avatar */}
                        <div className="avatar">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-white shadow-xl">
                                <img
                                    src={profileUser.photoURL || `https://ui-avatars.com/api/?name=${profileUser.name || profileUser.displayName}`}
                                    alt={profileUser.name}
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left mt-2 md:mt-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {profileUser.displayName || profileUser.name || "Anonymous User"}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-400 text-sm font-medium uppercase tracking-wide">
                                <div className="flex items-center gap-2">
                                    <FiUser className="w-4 h-4" />
                                    <span>Author</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4" />
                                    <span>Joined {new Date().getFullYear()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card (Optional) */}
                        <div className="bg-gray-50 rounded-2xl p-6 min-w-[200px] border border-gray-100 shadow-sm">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-primary mb-1">{posts.length}</span>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Published Posts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span>📚</span> Published Stories
                    </h3>
                </div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} onDelete={() => { }} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-4xl mx-auto">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-lg font-bold text-gray-700">No posts yet</h3>
                        <p className="text-gray-500">This user hasn't published any stories.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PublicProfilePage;
