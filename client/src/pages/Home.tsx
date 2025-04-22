import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getPosts, createPost, likePost } from "../services/postService";
import { Post, CreatePostData } from "../types";
import { decryptContent, encryptContent } from "../utils/crypto";
import Avatar from "../components/Avatar";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(
        response.map((post) => ({
          ...post,
          content: decryptContent(post.content),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    try {
      const encryptedContent = encryptContent(newPost);
      const postData: CreatePostData = {
        content: encryptedContent,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };

      const response = await createPost(postData);
      // Decrypt the new post content before adding to state
      const decryptedPost = {
        ...response,
        content: decryptContent(response.content),
      };
      setPosts([decryptedPost, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      // Handle not logged in state
      console.error("Please log in to like posts");
      return;
    }

    if (likingPosts.has(postId)) {
      return; // Prevent multiple clicks while processing
    }

    try {
      setLikingPosts((prev) => new Set([...prev, postId]));
      const response = await likePost(postId);
      // Decrypt the updated post content
      const decryptedPost = {
        ...response,
        content: decryptContent(response.content),
      };
      setPosts(posts.map((post) => (post.id === postId ? decryptedPost : post)));
    } catch (error) {
      console.error("Failed to like post:", error);
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
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
          <article key={post.id} className='card'>
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
                onClick={() => handleLike(post.id)}
                disabled={likingPosts.has(post.id)}
                className={`btn btn-secondary flex items-center space-x-2 ${
                  post.likes?.includes(user?.id || "") ? "text-blue-500 border-blue-500" : ""
                } ${likingPosts.has(post.id) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <svg
                  className={`h-5 w-5 ${
                    post.likes?.includes(user?.id || "") ? "fill-current" : "stroke-current"
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
                <span>{post.likeCount || 0} Likes</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Home;
