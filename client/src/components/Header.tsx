import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex-shrink-0'>
            <Link
              to='/'
              className='text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent'
            >
              WeConnect
            </Link>
          </div>
          <nav className='flex items-center space-x-6'>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to='/admin'
                    className='text-gray-600 hover:text-primary-600 transition-all duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-50'
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to='/profile'
                  className='text-gray-600 hover:text-primary-600 transition-all duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-50'
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className='text-gray-600 hover:text-primary-600 transition-all duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-50'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='text-gray-600 hover:text-primary-600 transition-all duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-50'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md'
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
