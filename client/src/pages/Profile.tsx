import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { updateProfile, UpdateProfileData } from "../services/authService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation({ name, email });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Edit Profile</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1 p-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500'
          />
        </div>

        <button
          type='submit'
          disabled={isPending}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white btn bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50'
        >
          {isPending ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
