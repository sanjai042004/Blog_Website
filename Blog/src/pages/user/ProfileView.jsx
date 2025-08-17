import { useOutletContext, useNavigate } from "react-router-dom";

export const ProfileView = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md text-center">
      <img
        src={user.image || ""}
        alt={user.name}
        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
      />
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      <p className="text-gray-600 mt-2">{user.bio}</p>

      <button
        onClick={() => navigate("/edit-profile")}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
        Edit Profile
      </button>
    </div>
  );
};
