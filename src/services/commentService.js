import { db } from "../firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    updateDoc,
    increment
} from "firebase/firestore";

const COLLECTION_NAME = "comments";

export const commentService = {
    // Get comments for a post
    getCommentsByPostId: async (postId) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("postId", "==", postId)
            );
            const querySnapshot = await getDocs(q);
            const comments = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Client-side sorting to bypass Firestore Index requirement
            return comments.sort((a, b) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            });
        } catch (error) {
            console.error("Error getting comments:", error);
            throw error;
        }
    },

    // Add a comment
    addComment: async (postId, userId, userDisplayName, userPhotoURL, content) => {
        try {
            // Ensure no undefined values are passed to Firestore
            const safePhotoURL = userPhotoURL || null;
            const safeDisplayName = userDisplayName || "Anonymous";

            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                postId,
                userId,
                userDisplayName: safeDisplayName,
                userPhotoURL: safePhotoURL,
                content,
                createdAt: serverTimestamp(),
            });

            // Increment comment count on post (optional but good for performance)
            try {
                const postRef = doc(db, "posts", postId);
                await updateDoc(postRef, {
                    commentsCount: increment(1)
                });
            } catch (updateError) {
                console.warn("Failed to update post comment count:", updateError);
                // Don't fail the whole operation if just the count update fails
            }

            return { id: docRef.id, postId, userId, userDisplayName: safeDisplayName, userPhotoURL: safePhotoURL, content, createdAt: new Date() }; // Optimistic return
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    },

    // Delete a comment
    deleteComment: async (commentId, postId) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, commentId));
            // Decrement comment count on post
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                commentsCount: increment(-1)
            });
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
};
