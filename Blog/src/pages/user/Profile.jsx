import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export const Profile = () => {
 const { user, setUser } = useOutletContext();
  const [profile, setProfile] = useState(user); 
  const navigate = useNavigate();


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, image: imageUrl, imageFile: file });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(profile);
    navigate("/profile");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <label htmlFor="image-upload" className="cursor-pointer">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-2 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full px-4 py-2 bg-gray-100 rounded-md outline-none"
          
        />

        {/* Bio */}
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          className="w-full px-4 py-2 bg-gray-100 rounded-md outline-none resize-none"
          rows="4"
          
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button type="button"
            onClick={() => navigate("/profile")}
            className="px-6 py-2 border border-green-700 text-green-700 rounded-md hover:bg-green-100">
            Cancel
          </button>
          <button type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
