import { useAuth } from "../../context/AuthContext";

const getProfileImage = (img) => {
  if (!img) return null;
  return img.startsWith("http")
    ? img
    : `${import.meta.env.VITE_API_URL}/${img}`;
};

export const Profile = () => {
  const { user, loading, error } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-20">No user found</p>;

  const profileImageSrc = getProfileImage(user.profileImage);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {profileImageSrc ? (
        <img
          src={profileImageSrc}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover mb-4"
          onError={(e) => (e.currentTarget.src = "")}
        />
      ) : (
        <div className="w-20 h-20 rounded-full border flex items-center justify-center bg-gray-200 text-xl font-bold mb-4">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      )}

      <p><span className="font-bold">Name:</span> {user?.name}</p>
      <p className="text-gray-600">Email: {user?.email}</p>
    </div>
  );
};
