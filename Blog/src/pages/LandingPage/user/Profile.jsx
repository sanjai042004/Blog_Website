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
    <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto px-4">
      <aside className="hidden md:block md:col-span-3 md:order-2 border-l border-gray-200 pb-6 text-center min-h-screen sticky top-0">
        <UserProfile user={user} size="w-24 h-24 text-2xl mx-auto" />
        <p className="mt-3 font-semibold">{user?.name}</p>
        {user?.bio && <p className="mt-1 text-sm text-gray-600">{user.bio}</p>}
        <button
          className="text-green-600 cursor-pointer hover:underline mt-2"
          onClick={() => setIsOpen(true)}
        >
          Edit profile
        </button>
      </aside>

      <main className="col-span-12 md:col-span-9 md:order-1 order-2">
        <h1 className="text-3xl font-bold">{user?.name}</h1>
        <p className="mt-4 text-gray-700">
          Welcome to your profile page. You can edit your details using the
          button on the right.
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
