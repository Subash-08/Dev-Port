import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Message from "./pages/Message";
import Notification from "./pages/Notification";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import More from "./pages/More";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import this
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const Layout = () => (
 <>
 <>
  <Navbar />
  <div className="main-content">
    <Outlet />
  </div>
</>

</>

);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/message" element={<Message />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/more" element={<More />} />
        </Route>
      </Routes>

      {/* Toast Container */}
      <ToastContainer position="bottom-center" autoClose={3000} />
    </Router>
  );
};

export default App;
