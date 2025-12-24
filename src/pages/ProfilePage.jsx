import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiSave } from "react-icons/fi";

function ProfilePage() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.updateUserProfile(displayName, user.photoURL);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-8 pb-12 px-4 bg-base-100">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-base-200">
                    <div className="flex flex-col items-center">
                        <div className="avatar mb-6">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-sm">
                                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${displayName}`} alt="Profile" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-1 text-gray-800">{user?.displayName}</h2>
                        <p className="text-gray-500 text-sm mb-8">{user?.email}</p>

                        <form onSubmit={handleUpdateProfile} className="w-full space-y-5">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Display Name</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                    <FiUser className="absolute left-3 top-3.5 text-gray-400 z-10 pointer-events-none" />
                                </div>
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Email</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        value={user?.email}
                                        disabled
                                    />
                                    <FiMail className="absolute left-3 top-3.5 text-gray-400 z-10 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-6 gap-2 rounded-full shadow-lg shadow-primary/20 normal-case text-lg font-medium"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : <><FiSave /> Save Changes</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
