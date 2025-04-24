// import { useState } from "react";
// import { useAuth } from "../contexts/useAuth";
// import { likePost, deletePost } from "../services/postService";
// import { Post as PostType } from "../types";
// import Avatar from "./Avatar";

// interface PostProps {
//   post: PostType;
//   onDelete?: (postId: string) => void;
// }

// const Post = ({ post, onDelete }: PostProps) => {
//   const { user } = useAuth();
//   const [isLiking, setIsLiking] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleLike = async () => {
//     if (!user) return;
//     setIsLiking(true);
//     try {
//       await likePost(post.id);
//     } catch (error) {
//       console.error("Failed to like post:", error);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!user || user.id !== post.author.id) return;
//     setIsDeleting(true);
//     try {
//       await deletePost(post.id);
//       onDelete?.(post.id);
//     } catch (error) {
//       console.error("Failed to delete post:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <div className='bg-white rounded-lg shadow p-4 mb-4'>
//       <div className='flex items-center mb-4'>
//         <Avatar name={post.author.name} className='w-10 h-10 mr-3' />
//         <div>
//           <h3 className='font-semibold'>{post.author.name}</h3>
//           <p className='text-sm text-gray-500'>{new Date(post.createdAt).toLocaleDateString()}</p>
//         </div>
//       </div>

//       <p className='mb-4'>{post.content}</p>

//       {post.images && post.images.length > 0 && (
//         <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
//           {post.images.map((image, index) => (
//             <img
//               key={index}
//               src={image}
//               alt={`Post image ${index + 1}`}
//               className='w-full h-48 object-cover rounded-lg'
//             />
//           ))}
//         </div>
//       )}

//       <div className='flex items-center justify-between'>
//         <button
//           onClick={handleLike}
//           disabled={isLiking}
//           className={`flex items-center space-x-1 ${
//             post.likes.includes(user?.id || "") ? "text-violet-600" : "text-gray-500"
//           }`}
//         >
//           <span>{post.likeCount}</span>
//           <svg
//             className='w-5 h-5'
//             fill='currentColor'
//             viewBox='0 0 20 20'
//             xmlns='http://www.w3.org/2000/svg'
//           >
//             <path
//               fillRule='evenodd'
//               d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
//               clipRule='evenodd'
//             />
//           </svg>
//         </button>

//         {user?.id === post.author.id && (
//           <button
//             onClick={handleDelete}
//             disabled={isDeleting}
//             className='text-red-500 hover:text-red-700'
//           >
//             {isDeleting ? "Deleting..." : "Delete"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Post;
