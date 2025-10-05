import React, { createContext, useState, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const uploadImageToImgBB = async (file) => {
    const API_KEY = "c9413fe926233e963a351d86d2703b7f";
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error.message);
      }
    } catch (uploadError) {
      console.error("ImgBB Upload Error:", uploadError);
      throw uploadError;
    }
  };

  const register = async (email, password, name, profileImageFile) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const createdUser = userCredential.user;

    let photoURL = null;

    if (profileImageFile) {
      photoURL = await uploadImageToImgBB(profileImageFile);
    }

    await updateProfile(createdUser, {
      displayName: name,
      photoURL: photoURL,
    });

    await setDoc(doc(db, "users", createdUser.uid), {
      uid: createdUser.uid,
      name: name,
      email: email,
      photoURL: photoURL,
    });

    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
