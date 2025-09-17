import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const getProfileImage = (img) => {
  if (!img) return null;
  return img.startsWith("http")
    ? img
    : `${import.meta.env.VITE_API_URL}/${img}`;
};

export const Profile = () => {
  const { user, loading, error } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-20">No user found</p>;

  const profileImageSrc = getProfileImage(user.profileImage);

  return (
    <div className="grid grid-cols-12 gap-12 max-w-7xl mx-auto mt-10">

      {/* Main Content */}
      <main className="col-span-12 md:col-span-7">
        <h1 className="text-3xl font-bold">{user?.name}</h1>

        {/* Tabs */}
        <div className="flex gap-6 mt-6 border-gray-200 border-b">
          <button
            className={`pb-2 ${activeTab === "home" ? "border-b-2 border-black" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          
          <button
            className={`pb-2 ${activeTab === "about" ? "border-b-2 border-black" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="col-span-5 border-l border-gray-200 hidden md:block text-center">
        {profileImageSrc ? (
          <img
            src={profileImageSrc}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto flex items-center justify-center text-gray-500">
            {user?.name?.charAt(0)}
          </div>
        )}
        <p className="mt-3 font-semibold">{user?.name}</p>
        <button className="text-green-600 hover:underline mt-2">
          Edit profile
        </button>
      </aside>
    </div>
  );
};
