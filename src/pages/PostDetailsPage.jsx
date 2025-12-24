import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { postService } from "../services/postService";
import { FiArrowLeft, FiClock, FiUser } from "react-icons/fi";
import CommentsSection from "../components/CommentsSection";

function PostDetailsPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await postService.getPostById(id);
                setPost(postData);
            } catch (error) {
                console.error("Failed to load post");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Post not found</h2>
                    <Link to="/" className="clean-btn">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-4 pb-12 bg-base-100">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
                    <FiArrowLeft className="mr-2" /> Back to Posts
                </Link>

                <article>
                    {/* Header */}
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6 font-medium uppercase tracking-wide">
                            <Link to={`/user/${post.userId}`} className="flex items-center gap-1 hover:text-primary transition-colors"><FiUser /> {post.authorName}</Link>
                            <span>•</span>
                            <span className="flex items-center gap-1"><FiClock /> {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : ''}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight text-gray-900">{post.title}</h1>
                    </header>

                    {/* Featured Image */}
                    <div className="rounded-3xl overflow-hidden shadow-sm mb-12 aspect-video bg-gray-100">
                        <img
                            src={post.imageUrl || "https://placehold.co/1200x600?text=No+Image"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate mx-auto max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{post.description}</p>
                    </div>
                </article>

                <div className="divider my-16"></div>

                <CommentsSection postId={id} />
            </div>
        </div>
    );
}

export default PostDetailsPage;
