import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthGuard } from "./components/AuthGuard";
import Header from "./components/Header";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

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
                  <AuthGuard>
                    <Home />
                  </AuthGuard>
                }
              />
              <Route
                path='/profile'
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                }
              />
              <Route
                path='/admin'
                element={
                  <AuthGuard requireAdmin>
                    <AdminDashboard />
                  </AuthGuard>
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
