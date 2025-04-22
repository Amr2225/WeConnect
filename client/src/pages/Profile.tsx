import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/authService";
import { compressImage, validateImage, createFormDataWithImages } from "../utils/imageUpload";
import { UpdateProfileData } from "../types";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName);
      setEmail(user.email);
      setPreviewUrl(user.photoURL);
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImage(file);
      const compressedFile = await compressImage(file);
      setProfilePicture(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Edit Profile</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Profile Picture</label>
          <div className='mt-2 flex items-center space-x-4'>
            <div className='w-20 h-20 rounded-full overflow-hidden'>
              {previewUrl ? (
                <img src={previewUrl} alt='Profile' className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <span className='text-gray-500'>No image</span>
                </div>
              )}
            </div>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500'
          />
        </div>

        {error && <div className='text-red-500 text-sm'>{error}</div>}

        <button
          type='submit'
          disabled={loading}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50'
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
