"use client";

import { api } from "@/axios/axiosInstance";
import { MyContext } from "@/context/MyProvider";
import { auth } from "@/firebase/firebase.config";
import { updateProfile } from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import {
  LuCamera,
  LuCheck,
  LuMail,
  LuPhone,
  LuSave,
  LuTrash2,
  LuUpload,
  LuUser,
} from "react-icons/lu";
import { toast } from "react-toastify";
import SettingsCard from "./SettingsCard";

const ProfileForm = () => {
  const { newUser, setNewUser } = useContext(MyContext);
  const fileInputRef = useRef(null);

  const user = newUser?.user || {};
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedBase64, setSelectedBase64] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || user.shippingAddress?.phone || "");
      setBio(user.bio || "");
      setAvatarPreview(user.photoURL || "");
      setSelectedBase64(null);
    }
  }, [user?.name, user?.phone, user?.bio, user?.photoURL]);

  const syncUserContext = (updatedUserDoc) => {
    const nextState = {
      ...newUser,
      user: {
        ...user,
        ...updatedUserDoc,
      },
    };
    setNewUser(nextState);
    localStorage.setItem("user", JSON.stringify(nextState));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file (JPG, PNG, WEBP)");
    }

    if (file.size > 4 * 1024 * 1024) {
      return toast.error("Image size must be less than 4MB");
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      setAvatarPreview(dataUrl);
      setSelectedBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhotoNow = async () => {
    if (!selectedBase64 || !user.email) return;

    try {
      setIsUploadingPhoto(true);
      const res = await api.put(
        "/users/updateUser",
        { avatar: selectedBase64 },
        { params: { email: user.email } },
      );

      const newPhotoUrl = res.data?.user?.photoURL || avatarPreview;
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { photoURL: newPhotoUrl });
        } catch (err) {
          console.error("Firebase photoURL sync error:", err);
        }
      }

      syncUserContext(res.data?.user || { photoURL: newPhotoUrl });
      setSelectedBase64(null);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to upload profile picture",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user.email) return;
    try {
      setIsUploadingPhoto(true);
      const res = await api.put(
        "/users/updateUser",
        { removePhoto: true },
        { params: { email: user.email } },
      );

      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { photoURL: "" });
        } catch (err) {
          console.error("Firebase photoURL clear error:", err);
        }
      }

      setAvatarPreview("");
      setSelectedBase64(null);
      syncUserContext(res.data?.user || { photoURL: "" });
      toast.info("Profile picture removed");
    } catch (error) {
      toast.error("Failed to remove profile picture");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.warning("Name cannot be empty");
    }
    if (!user.email) return;

    try {
      setIsSaving(true);
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      };
      if (selectedBase64) {
        payload.avatar = selectedBase64;
      }

      const res = await api.put("/users/updateUser", payload, {
        params: { email: user.email },
      });

      const updatedUserDoc = res.data?.user || {
        ...user,
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      };

      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: updatedUserDoc.name,
            ...(updatedUserDoc.photoURL
              ? { photoURL: updatedUserDoc.photoURL }
              : {}),
          });
        } catch (err) {
          console.error("Firebase profile sync error:", err);
        }
      }

      syncUserContext(updatedUserDoc);
      setSelectedBase64(null);
      toast.success("Profile information saved!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SettingsCard
      title="Personal Information & Profile Photo"
      subtitle="Update your avatar and personal details displayed across your Oiki account."
      icon={LuUser}
    >
      <div className="space-y-6">
        {/* Profile Picture Uploader Box */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-base-200/50 border border-base-300">
          <div className="relative group">
            <div className="size-24 rounded-full overflow-hidden ring-4 ring-base-100 shadow-md bg-main/15 text-main flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold">{initials}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-xs btn-circle btn-main absolute bottom-0 right-0 shadow-md"
              title="Change Profile Picture"
            >
              <LuCamera className="size-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h4 className="font-bold text-sm">Profile Picture</h4>
              <p className="text-xs opacity-60">
                Supports JPG, PNG, or WEBP up to 4MB. Square images work best.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-xs btn-outline gap-1.5"
              >
                <LuUpload className="size-3.5" /> Choose Photo
              </button>

              {selectedBase64 && (
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={handleUploadPhotoNow}
                  className="btn btn-xs btn-success text-white gap-1.5"
                >
                  {isUploadingPhoto ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <LuCheck className="size-3.5" />
                  )}
                  Upload Selected Photo
                </button>
              )}

              {avatarPreview && !selectedBase64 && (
                <button
                  type="button"
                  disabled={isUploadingPhoto}
                  onClick={handleRemovePhoto}
                  className="btn btn-xs btn-ghost text-error gap-1"
                >
                  <LuTrash2 className="size-3.5" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="fieldset">
              <label className="label text-xs font-semibold">Full Name</label>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <LuUser className="opacity-50 size-4 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="grow text-sm"
                  required
                />
              </label>
            </div>

            <div className="fieldset">
              <label className="label text-xs font-semibold">
                Phone Number
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <LuPhone className="opacity-50 size-4 shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="grow text-sm"
                />
              </label>
            </div>
          </div>

          <div className="fieldset">
            <label className="label text-xs font-semibold">
              Email Address{" "}
              <span className="badge badge-xs badge-success badge-soft ml-1">
                Verified Account Email
              </span>
            </label>
            <label className="input input-bordered flex items-center gap-2 w-full bg-base-200/50">
              <LuMail className="opacity-50 size-4 shrink-0" />
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="grow text-sm opacity-70 cursor-not-allowed"
              />
            </label>
          </div>

          <div className="fieldset">
            <label className="label text-xs font-semibold">
              Short Bio / Delivery Preferences (Optional)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Prefer delivery calls between 10 AM - 6 PM"
              className="textarea textarea-bordered w-full text-sm"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-sm btn-main gap-1.5 px-5"
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <LuSave className="size-4" />
              )}
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </SettingsCard>
  );
};

export default ProfileForm;
