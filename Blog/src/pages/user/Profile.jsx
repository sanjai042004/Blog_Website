import { useAuth } from "../../context/AuthContext";

export const Profile = () => {
  const { user: currentUser, loading, error } = useAuth();

  if (loading) {
    return <p className="text-center mt-20">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  if (!currentUser) {
    return <p className="text-center mt-20">No user found</p>;
  }

  // Determine image source safely
  let profileImageSrc = null;
  if (currentUser.profileImage) {
    if (currentUser.profileImage.startsWith("http")) {
      profileImageSrc = currentUser.profileImage;
    } else {
      profileImageSrc = `${import.meta.env.VITE_API_URL}/${currentUser.profileImage}`;
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {/* Avatar */}
      {profileImageSrc ? (
        <img
          src={profileImageSrc}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover mb-4"
          onError={(e) => {
            e.currentTarget.src = "";
          }}
        />
      ) : (
        <div className="w-20 h-20 rounded-full border flex items-center justify-center bg-gray-200 text-xl font-bold mb-4">
          {currentUser?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}

      {/* Details */}
      <p>
        <span className="font-bold">Name:</span> {currentUser?.name}
      </p>
      <p className="text-gray-600">Email: {currentUser?.email}</p>
    </div>
  );
};
