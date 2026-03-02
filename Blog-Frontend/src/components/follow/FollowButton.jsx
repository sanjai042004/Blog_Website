export const FollowButton = ({
  isFollowing = false,
  onToggle,
  size = "sm",
  loading = false,
}) => {
  if (typeof onToggle !== "function") return null;

  const sizeClasses =
    size === "lg"
      ? "px-4 py-2 text-sm"
      : "px-3 py-1 text-xs";

  const baseClasses =
    "rounded-full border transition font-medium disabled:opacity-60 disabled:cursor-not-allowed";

  const variantClasses = isFollowing
    ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
    : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";

  return (
    <button
      disabled={loading}
      onClick={(e) => {
        e.stopPropagation();
        if (!loading) onToggle();
      }}
      className={`${baseClasses} ${sizeClasses} ${variantClasses}`}
    >
      {loading
        ? "Please wait..."
        : isFollowing
        ? "Following"
        : "Follow"}
    </button>
  );
};