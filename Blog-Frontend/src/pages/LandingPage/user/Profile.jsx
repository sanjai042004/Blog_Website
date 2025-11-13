import { useState } from "react";
import { ProfileSetting } from "../../ProfileSetting";
import { UserProfile } from "../../../components/author/UserProfile";
import { useAuth } from "../../../hooks/useAuth";

export const Profile = () => {
  const { user, loading, error } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  if (loading) return <p className="text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-20">No user found</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto px-4 py-6">
      {/* Profile Section */}
      <aside className="order-1 md:order-2 md:col-span-3 border-gray-200 text-center md:sticky md:top-0 flex flex-col items-center">
        <UserProfile user={user} size="w-30 h-30 text-2xl mx-auto" />
        <p className="mt-3 font-semibold text-lg">{user.name}</p>
        {user.bio && (
          <p className="mt-1 text-sm text-gray-600 max-w-xs mx-auto">
            {user.bio}
          </p>
        )}
        <button
          onClick={() => setIsOpen(true)}
          className="text-green-600 hover:underline mt-2 text-sm sm:text-base cursor-pointer"
        >
          Edit profile
        </button>
      </aside>

      {/* Main Content */}
      <main className="order-2 md:order-1 md:col-span-9 text-center md:text-left mt-4 md:mt-8">
        <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold">
          {user.name}
        </h1>
        <p className="mt-4 text-gray-700 text-sm sm:text-base">
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
