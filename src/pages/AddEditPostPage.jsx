import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";

function AddEditPostPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        setLoading(true);
        const postDocRef = doc(db, "posts", id);
        const postSnap = await getDoc(postDocRef);
        if (postSnap.exists()) {
          setPostData(postSnap.data());
        } else {
          toast.error("Post not found!");
          navigate("/");
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImageToImgBB = async (file) => {
    setUploadingImage(true);
    const API_KEY = "c9413fe926233e963a351d86d2703b7f";
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error.message);
      }
    } catch (uploadError) {
      throw uploadError;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.title || !postData.description) {
      toast.error("Please fill out title and description.");
      return;
    }
    if (!isEditMode && !imageFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    setLoading(true);
    let toastId;

    try {
      let finalImageUrl = postData.imageUrl;
      if (imageFile) {
        toastId = toast.loading("Uploading image, please wait...");
        finalImageUrl = await uploadImageToImgBB(imageFile);
        toast.success("Image uploaded!", { id: toastId });
      }

      toastId = toast.loading("Saving your post...");

      const dataToSave = {
        title: postData.title,
        description: postData.description,
        imageUrl: finalImageUrl,
      };

      if (isEditMode) {
        const postDocRef = doc(db, "posts", id);
        await updateDoc(postDocRef, dataToSave);
        toast.success("Post updated successfully!", { id: toastId });
      } else {
        const newPost = {
          ...dataToSave,
          authorName: user.displayName,
          userId: user.uid,
          authorPhotoURL: user.photoURL || null,
          createdAt: Timestamp.now(),
        };
        await addDoc(collection(db, "posts"), newPost);
        toast.success("Post created successfully!", { id: toastId });
      }

      navigate("/");
    } catch (err) {
      if (toastId) toast.dismiss(toastId);
      toast.error(`Failed to save post: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        {isEditMode ? "Edit Your Post" : "Create a New Post"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={postData.title}
            onChange={handleChange}
            placeholder="Post Title"
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="image" className="label">
            <span className="label-text">Image</span>
          </label>
          {isEditMode && postData.imageUrl && (
            <img
              src={postData.imageUrl}
              alt="Current post"
              className="w-full h-auto rounded-lg mb-4 max-h-60 object-contain"
            />
          )}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          <div className="label">
            <span className="label-text-alt">
              {isEditMode
                ? "Choose a new file to replace the current image."
                : ""}
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={postData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full h-32"
            placeholder="Write your post content here..."
          ></textarea>
        </div>
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || uploadingImage}
          >
            {loading || uploadingImage ? (
              <span className="loading loading-spinner"></span>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditPostPage;
