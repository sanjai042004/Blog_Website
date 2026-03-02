import { useState } from "react";
import { ProfileSetting } from "./ProfileSetting";
import { UserProfile } from "../components/author/UserProfile";
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;

  if (!user) return <p className="text-center mt-20">No user found</p>;
  return (
    <div className="relative min-h-screen px-10 py-10">
      <aside
        className="
      hidden md:flex
      fixed right-0 top-0
      h-screen w-80
      border-l border-gray-200
      bg-white
      flex-col items-center
      pt-28 px-8
    "
      >
        <UserProfile user={user} size="w-28 h-28 text-2xl" />

        <p className="mt-4 font-semibold text-lg text-center">{user.name}</p>

        {user.bio && (
          <p className="mt-2 text-sm text-gray-600 text-center">{user.bio}</p>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="text-green-600 hover:underline mt-3 text-sm cursor-pointer"
        >
          Edit profile
        </button>
      </aside>

      {/* Main Content */}
      <main className="w-full md:pr-80">
        <h1 className="text-3xl font-bold">{user.name}</h1>

        <p className="mt-4 text-gray-700">
          Welcome to your profile page. You can edit your details using the
          button.
        </p>
      </main>

      <ProfileSetting
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        preview={preview}
        setPreview={setPreview}
      />
    </div>
  );
};
