import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Message from "./pages/Message";
import Notification from "./pages/Notification";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import More from "./pages/More";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import this
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./actions/userActions";
import { useEffect } from "react";
import Loader from "./components/Loader";
import UserProfile from "./pages/UserProfile";
import MyPostDetails from "./pages/MyPostDetails";
import ExploreUsers from "./pages/ExploreUser";
import FriendRequests from "./components/FriendRequests";
import ViewUserPost from "./pages/ViewUserPost";

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

  const dispatch = useDispatch();
  const { loaded } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser()); // Load user on app start
  }, [dispatch]);

  if (!loaded) return <Loader />;
  return (

    <Router>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

       
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
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myProfile/post/:postId" element={<MyPostDetails />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/user/posts/:userId/:postId" element={<ViewUserPost />} />
          <Route path="/user/request-received" element={<FriendRequests />} />
          <Route path="/explore-users" element={<ExploreUsers />} />
         
          <Route path="/more" element={<More />} />
        </Route>
      </Routes>

   
      <ToastContainer position="bottom-center" autoClose={3000} />
    </Router>
  );
};

export default App;
