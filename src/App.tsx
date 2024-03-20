import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import NewMessage from "./pages/NewMessage";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newMessage" element={<NewMessage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
