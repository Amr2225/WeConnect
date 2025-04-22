import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createPost } from "../services/postService";
import { compressImage, validateImage, createFormDataWithImages } from "../utils/imageUpload";
import { CreatePostData } from "../types";

const CreatePost = () => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const compressedFiles: File[] = [];
      const newPreviewUrls: string[] = [];

      for (const file of files) {
        validateImage(file);
        const compressedFile = await compressImage(file);
        compressedFiles.push(compressedFile);
        newPreviewUrls.push(URL.createObjectURL(compressedFile));
      }

      setImages((prev) => [...prev, ...compressedFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process images");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setLoading(true);

    try {
      const postData: CreatePostData = {
        content,
        images,
        author: {
          name: user.displayName,
          avatar: user.photoURL,
        },
      };

      const formData = createFormDataWithImages(postData, images);
      await createPost(formData);

      // Reset form
      setContent("");
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow p-4 mb-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className='w-full rounded-lg border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500'
          rows={3}
        />

        <div>
          <label className='block text-sm font-medium text-gray-700'>Add Images</label>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            className='mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100'
          />
        </div>

        {previewUrls.length > 0 && (
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {previewUrls.map((url, index) => (
              <div key={index} className='relative aspect-square'>
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className='w-full h-full object-cover rounded-lg'
                />
              </div>
            ))}
          </div>
        )}

        {error && <div className='text-red-500 text-sm'>{error}</div>}

        <button
          type='submit'
          disabled={loading || (!content && images.length === 0)}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50'
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
