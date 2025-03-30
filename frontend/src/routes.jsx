import { Routes, Route, Router } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import Layout from "./components/Layout";
import AuthMiddleware from "./middleware/AuthMiddleware";
import PublicRoute from "./middleware/PublicRoute";
import EditProfile from "./pages/EditProfile";


export default function AppRoutes({ darkMode, toggleDarkMode }) {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/register" element={<Register />} />

      <Route
        element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      >
        <Route
          path="/dashboard"
          element={
            <AuthMiddleware>
              <Dashboard />
            </AuthMiddleware>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <AuthMiddleware>
              <PostDetail />
            </AuthMiddleware>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthMiddleware>
              <Profile />
            </AuthMiddleware>
          }
        />
        <Route
          path="/new-post"
          element={
            <AuthMiddleware>
              <NewPost />
            </AuthMiddleware>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <AuthMiddleware>
              <EditProfile />
            </AuthMiddleware>
          }
        />
      </Route>
    </Routes>
  );
}
