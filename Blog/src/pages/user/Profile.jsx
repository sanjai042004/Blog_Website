import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { ProfileSetting } from "../ProfileSetting";
import { Avatar } from "../../components/ui/Avatar";



export const Profile = () => {
  const { user, loading, error } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-20">No user found</p>;

  return (
    <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto mt-10 px-4">
      {/* Sidebar (Profile) */}
      <aside className="col-span-12 md:col-span-5 md:order-2 order-1 border-b md:border-b-0 md:border-l border-gray-200 pb-6 md:pb-0 text-center">
        <Avatar user={user} size="w-24 h-24 text-2xl mx-auto" />
        <p className="mt-3 font-semibold">{user?.name}</p>
        {user?.bio && <p className="mt-1 text-sm text-gray-600">{user.bio}</p>}

        <button
          className="text-green-600 cursor-pointer hover:underline mt-2"
          onClick={() => setIsOpen(true)}
        >
          Edit profile
        </button>
      </aside>

      {/* Main Content */}
      <main className="col-span-12 md:col-span-7 md:order-1 order-2">
        <h1 className="text-3xl font-bold">{user?.name}</h1>

        {/* Tabs */}
        <div className="flex gap-6 mt-6 border-gray-200 border-b">
          <button
            className={`pb-2 ${
              activeTab === "home" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`pb-2 ${
              activeTab === "about" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>
      </main>

      
      <ProfileSetting isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

