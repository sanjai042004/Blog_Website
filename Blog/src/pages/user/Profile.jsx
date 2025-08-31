import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const Profile = () => {
  const { user, refreshAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeProfile = async () => {
      if (!user) {
        try {
          await refreshAccessToken();
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load profile");
        }
      }
      setLoading(false);
    };

    initializeProfile();
  }, [user, refreshAccessToken]);

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-20">No user data found</p>;

  const avatarContent = user.profileImage ? (
    <img
      src={user.profileImage}
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover border border-gray-300"
    />
  ) : (
    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-500 text-white text-3xl font-bold">
      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="flex items-center gap-6">
        {avatarContent}

        <div>
          <p className="text-lg font-semibold">Name: {user.name || "N/A"}</p>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};
