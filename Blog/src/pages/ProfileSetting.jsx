import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../service/api";

export const ProfileSetting = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();

  // Basic fields
  const [preview, setPreview] = useState(user?.profileImage || null);
  const [file, setFile] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreview(user?.profileImage || null);
      setFile(null);
      setName(user?.name || "");
      setBio(user?.bio || "");
      
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Profile image change
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  // Save profile
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (file) formData.append("profileImage", file);

      const { data } = await api.put("/auth/profile", formData, {
        withCredentials: true,
      });

      if (data.success) setUser(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-8 w-[500px] relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl">
          ✖
        </button>

        <h2 className="text-center text-2xl font-semibold mb-6">Edit Profile</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-28 h-28 rounded-full overflow-hidden group">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                {user?.name?.charAt(0)}
              </div>
            )}
            <label
              htmlFor="fileInput"
              className="absolute inset-0 bg-black/50 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              Update Photo
            </label>
          </div>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name */}
        <div className="mt-6">
          <label className="block py-1 text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg px-3 py-2 bg-gray-100 outline-none"
          />
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block py-1 text-sm font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

         
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
