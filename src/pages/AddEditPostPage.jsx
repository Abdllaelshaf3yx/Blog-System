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
import { FiImage, FiSend, FiX } from "react-icons/fi";

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

  const removeImage = () => {
    setImageFile(null);
    setPostData(prev => ({ ...prev, imageUrl: "" }));
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
        toastId = toast.loading("Uploading image...");
        finalImageUrl = await uploadImageToImgBB(imageFile);
        toast.success("Image uploaded!", { id: toastId });
      }

      toastId = toast.loading("Publishing blog...");

      const dataToSave = {
        title: postData.title,
        description: postData.description,
        imageUrl: finalImageUrl,
      };

      if (isEditMode) {
        const postDocRef = doc(db, "posts", id);
        await updateDoc(postDocRef, dataToSave);
        toast.success("Blog updated successfully!", { id: toastId });
      } else {
        const newPost = {
          ...dataToSave,
          authorName: user.displayName,
          userId: user.uid,
          authorPhotoURL: user.photoURL || null,
          createdAt: Timestamp.now(),
        };
        await addDoc(collection(db, "posts"), newPost);
        toast.success("Blog published successfully!", { id: toastId });
      }

      navigate("/");
    } catch (err) {
      if (toastId) toast.dismiss(toastId);
      toast.error(`Failed to publish: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const previewImage = imageFile ? URL.createObjectURL(imageFile) : postData.imageUrl;

  return (
    <div className="min-h-screen pt-8 pb-12 px-4 bg-gray-50/30">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            {isEditMode ? "Edit Blog" : "Create New Blog"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={postData.title}
                onChange={handleChange}
                placeholder="Enter a captivating title..."
                className="input input-bordered w-full h-12 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl bg-white"
              />
            </div>

            {/* Cover Image */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Cover Image</span>
              </label>
              <div className={`
                        relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden group min-h-[200px] flex flex-col items-center justify-center
                        ${previewImage ? 'border-transparent p-0' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 p-8 cursor-pointer'}
                    `}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />

                {previewImage ? (
                  <div className="relative w-full h-64">
                    <img src={previewImage} alt="Cover" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 rounded-xl">
                      <div className="text-white font-medium flex items-center gap-2">
                        <FiImage /> Change Image
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-white/40 transition-colors z-30"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                      <FiImage className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-gray-600">Click to upload cover image</p>
                    <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Content</span>
              </label>
              <textarea
                name="description"
                value={postData.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-80 text-lg leading-relaxed focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-2xl bg-white resize-none p-4"
                placeholder="Write your blog content here..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 normal-case"
                disabled={loading || uploadingImage}
              >
                {loading || uploadingImage ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    {uploadingImage ? "Uploading..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <FiSend />
                    {isEditMode ? "Update Blog" : "Publish Blog"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEditPostPage;
