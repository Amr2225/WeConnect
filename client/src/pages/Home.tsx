import { useCallback, useEffect, useRef, useState } from "react";

// Services & Context & utils
import { useAuth } from "../contexts/useAuth";
import { getPosts, createPost, likePost } from "../services/postService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
import { CreatePostData } from "../types";

// Components
import Avatar from "../components/Avatar";

const Home = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Get Posts
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  // Add Post
  const { mutate: addPost } = useMutation({
    mutationFn: (newPost: CreatePostData) => createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPost("");
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    },
  });

  // Like Post
  const { mutate: likePostMutation, isPending: isLikingPost } = useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Failed to like post:", error);
    },
  });

  // Submit Post
  const handleSubmitPost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPost.trim() || !user) return;

    const postData: CreatePostData = {
      content: newPost,
      author: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };

    addPost(postData);
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (inputRef.current === document.activeElement) {
        if (event.ctrlKey && event.key === "Enter") {
          handleSubmitPost();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newPost]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  if (isLoading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  if (isError || !posts) {
    return (
      <div className='flex items-center justify-center min-h-screen font-semibold text-red-800'>
        Something went wrong, please try again
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Create Post */}
      <div className='card mb-6'>
        <form onSubmit={handleSubmitPost}>
          <div className='flex items-start space-x-4'>
            <Avatar name={user?.name || "Anonymous"} className='w-10 h-10' />
            <div className='flex-1'>
              <textarea
                ref={inputRef}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className='input resize-none'
                rows={3}
              />
              <div className='mt-3 flex justify-end'>
                <button type='submit' className='btn btn-primary' disabled={!newPost.trim()}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className='space-y-6'>
        {posts.map((post) => (
          <article key={post._id} className='card'>
            <div className='flex items-center space-x-3 mb-4'>
              <Avatar name={post.author.name} className='w-10 h-10' />
              <div>
                <h3 className='font-semibold capitalize'>{post.author.name}</h3>
                <time className='text-sm text-gray-500'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>
            <p className='text-gray-700'>{post.content}</p>
            <div className='mt-4 flex items-center space-x-4 pt-4 border-t'>
              <button
                title={post.likes.map((like) => like.name).join("\n")}
                onClick={() => likePostMutation(post._id)}
                disabled={isLikingPost}
                className={`btn btn-secondary flex items-center space-x-2 ${
                  post.likes.some((like) => like._id === user?._id)
                    ? "text-blue-500 border-blue-500"
                    : ""
                } ${isLikingPost ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <svg
                  className={`h-5 w-5 ${
                    post.likes?.some((likedPosts) => likedPosts._id === user?._id || "")
                      ? "fill-current"
                      : "stroke-current"
                  }`}
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M14 10h3v11h-3v-11zm-8 11h3v-11h-3v11zm11-19.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5v3.5h3v-3.5z'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span>{post.likes.length || 0} Likes</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Home;
