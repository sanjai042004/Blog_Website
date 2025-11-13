import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserProfile } from "../components/author/UserProfile";
import { authService } from "../service/authService";

export const ProfileSetting = ({ isOpen, onClose, preview, setPreview }) => {
  const { user, fetchProfile } = useAuth();
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setPreview(user.profileImage || null);
      setName(user.name || "");
      setBio(user.bio || "");
      setFile(null);
    }
  }, [isOpen, user, setPreview]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Name cannot be empty.");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (file) formData.append("profileImage", file);

      const data = await authService.updateProfile(formData);

      if (data.success) {
        await fetchProfile();
        onClose();
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-md sm:max-w-lg overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl sm:text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
          Edit Profile
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden group">
            <UserProfile
              user={user}
              src={preview}
              size="w-24 h-24 sm:w-28 sm:h-28 text-xl"
            />
            <label
              htmlFor="fileInput"
              className="absolute inset-0 bg-black/50 text-white text-xs sm:text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              Change Photo
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

        {/* Name Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black/30 text-sm sm:text-base outline-none"
          />
        </div>

        {/* Bio Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Write a few lines about yourself..."
            className="w-full rounded-lg px-4 py-2 border border-gray-300 resize-none focus:ring-2 focus:ring-black/30 text-sm sm:text-base outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="w-full sm:flex-1 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm sm:text-base cursor-pointer"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
