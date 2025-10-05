import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddEditPostPage from "./pages/AddEditPostPage";
import LoginRegisterPage from "./pages/LoginRegisterPage";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/add-post" element={<AddEditPostPage />} />
          <Route path="/edit-post/:id" element={<AddEditPostPage />} />
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
