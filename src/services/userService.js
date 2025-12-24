import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const userService = {
    // Get user profile by ID
    getUserById: async (userId) => {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { uid: docSnap.id, ...docSnap.data() };
            } else {
                // Fallback if user document doesn't exist (e.g. legacy users)
                return null;
            }
        } catch (error) {
            console.error("Error getting user profile:", error);
            throw error;
        }
    },
};
