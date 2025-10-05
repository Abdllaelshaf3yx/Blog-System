import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // استيراد

function LoginRegisterPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const loadingToast = toast.loading("Processing...");

    try {
      if (isLoginView) {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
      } else {
        await register(
          formData.email,
          formData.password,
          formData.name,
          imageFile
        ); // Pass the image file
        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (err) {
      // ... (error handling logic as before)
      toast.error(err.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl">
            {isLoginView ? "Login" : "Create Account"}
          </h2>

          {!isLoginView && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="input input-bordered"
                  required
                  onChange={handleChange}
                />
              </div>
              {/* حقل رفع الصورة */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Profile Picture (Optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>
            </>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              className="input input-bordered"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              className="input input-bordered"
              required
              minLength="6"
              onChange={handleChange}
            />
          </div>

          <p className="text-sm text-center mt-2">
            {isLoginView
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              type="button"
              className="link link-primary ml-1"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? "Register" : "Login"}
            </button>
          </p>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Processing..." : isLoginView ? "Login" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginRegisterPage;
