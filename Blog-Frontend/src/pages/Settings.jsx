import { useState } from "react";
import { Button, InputField } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { api } from "../service/api";

export const Settings = () => {
  const { user, updateProfile, logout } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    email: user?.email || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile(form);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // Deactivate account
  const handleDeactivate = async () => {
    if (
      !confirm(
        "Are you sure you want to deactivate your account?\nYou can reactivate it later by logging in."
      )
    )
      return;

    try {
      setSaving(true);
      const { data } = await api.put("/auth/deactivate", {}, { withCredentials: true });
      if (data.success) {
        alert("Your account has been deactivated.");
        logout();
        window.location.href = "/login";
      } else {
        alert(data.message || "Failed to deactivate account.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server error while deactivating.");
    } finally {
      setSaving(false);
    }
  };

  // Delete account permanently
  const handleDelete = async () => {
    const confirmText = prompt(
      "⚠️ This action is PERMANENT.\nType DELETE to confirm account deletion."
    );
    if (confirmText !== "DELETE") return alert("Account deletion cancelled.");

    try {
      setSaving(true);
      const { data } = await api.delete("/auth/delete", { withCredentials: true });
      if (data.success) {
        alert("Your account has been permanently deleted.");
        logout();
        window.location.href = "/";
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-3xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center">
          ⚙️ Account Settings
        </h1>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Update your name and bio to personalize your profile.
            </p>

            <div className="space-y-4">
              <InputField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <InputField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                textarea
              />
            </div>
          </section>

          {/* Account Info */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Account Details
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Your email is linked to your account and cannot be changed.
            </p>
            <InputField label="Email" name="email" value={form.email} readOnly />
          </section>

          {/* Save Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-black hover:bg-gray-900 text-white font-medium rounded-xl py-3 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            {message && (
              <p
                className={`mt-4 text-center text-sm ${
                  message.includes("")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>

        {/* Danger Zone */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-red-500 mb-6 text-center sm:text-left">
            Deactivating hides your profile. Deleting permanently removes all data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleDeactivate}
              disabled={saving}
              className="flex-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 py-2.5 rounded-xl"
            >
              Deactivate Account
            </Button>

            <Button
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 bg-red-200 text-red-700 hover:bg-red-300 py-2.5 rounded-xl"
            >
              Delete Account Permanently
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
