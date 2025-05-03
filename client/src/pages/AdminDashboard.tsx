import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/adminService";

const AdminDashboard = () => {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  if (isLoading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  if (isError || !users) {
    return (
      <div className='flex items-center justify-center min-h-screen font-semibold text-red-800'>
        Something went wrong, please try again
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Posts
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {users.map((user) => (
              <tr key={user.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize'>
                  {user.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{user.email}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {user.postCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
