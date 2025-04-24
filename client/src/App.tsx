import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/useAuth";
import { lazy, Suspense } from "react";

import Header from "./components/Header";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/login' />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <main>
          <Suspense
            fallback={
              <div className='flex items-center justify-center min-h-screen'>Loading...</div>
            }
          >
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route
                path='*'
                element={
                  <h1 className='text-center text-4xl mt-12 text-neutral-800'>
                    404 | Page Not Found
                  </h1>
                }
              />
              <Route
                path='/'
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path='/profile'
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
