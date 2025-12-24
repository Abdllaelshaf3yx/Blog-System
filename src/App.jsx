import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddEditPostPage from "./pages/AddEditPostPage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/add-post" element={<AddEditPostPage />} />
          <Route path="/edit-post/:id" element={<AddEditPostPage />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:userId" element={<PublicProfilePage />} />
          <Route
            path="*"
            element={
              <h1 className="text-center text-4xl mt-10">
                404: Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
