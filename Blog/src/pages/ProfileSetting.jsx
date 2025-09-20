import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../service/api";
import { Avatar } from "../components/ui/Avatar";

export const ProfileSetting = ({ isOpen, onClose }) => {
  const { user, fetchProfile } = useAuth();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setPreview(user.profileImage || null);
      setFile(null);
      setName(user.name || "");
      setBio(user.bio || "");
    }
  }, [isOpen, user]);

 
  useEffect(() => {
    return () => {
      if (preview?.startsWith("")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

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

      if (data.success) {
        await fetchProfile(); // ✅ Always fetch fresh profile from server
        onClose();
      }
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
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-8 w-[500px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>

        <h2 className="text-center text-2xl font-semibold mb-6">Edit Profile</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-28 h-28 rounded-full overflow-hidden group">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar user={user} size="w-28 h-28 text-xl" />
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
            rows={4}
            placeholder="Tell something about yourself..."
            className="mt-1 w-full border-none bg-gray-100 rounded-lg px-3 py-2 text-gray-800 outline-none resize-none"
          />
        </div>

        {/* Buttons */}
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
