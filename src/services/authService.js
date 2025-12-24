import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
} from "firebase/auth";

export const authService = {
    // Register
    register: async (email, password, displayName, photoURL) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(userCredential.user, {
                displayName,
                photoURL: photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=random`,
            });
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    // Login
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    },

    // Update Profile
    updateUserProfile: async (displayName, photoURL) => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName,
                    photoURL,
                });
                return auth.currentUser;
            }
            throw new Error("No user logged in");
        } catch (error) {
            throw error;
        }
    }
};
