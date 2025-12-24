import { db } from "../firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    where
} from "firebase/firestore";

const COLLECTION_NAME = "posts";

export const postService = {
    // Get all posts
    getAllPosts: async () => {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error("Error getting posts:", error);
            throw error;
        }
    },

    // Get posts by User ID
    getPostsByUserId: async (userId) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Sort client-side
            return posts.sort((a, b) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            });
        } catch (error) {
            console.error("Error getting user posts:", error);
            throw error;
        }
    },

    // Get single post by ID
    getPostById: async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error("Post not found");
            }
        } catch (error) {
            console.error("Error getting post:", error);
            throw error;
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...postData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                likes: [], // Initialize likes array
                commentsCount: 0
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    },

    // Update a post
    updatePost: async (id, postData) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...postData,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    },

    // Delete a post
    deletePost: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    },

    // Toggle Like
    toggleLike: async (postId, userId) => {
        try {
            const postRef = doc(db, COLLECTION_NAME, postId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const postData = postSnap.data();
                const likes = postData.likes || [];

                if (likes.includes(userId)) {
                    await updateDoc(postRef, {
                        likes: arrayRemove(userId)
                    });
                    return false; // Liked status: false (removed)
                } else {
                    await updateDoc(postRef, {
                        likes: arrayUnion(userId)
                    });
                    return true; // Liked status: true (added)
                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            throw error;
        }
    }
};
