import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import NewMessage from "./pages/NewMessage";
import ChatViewPage from "./pages/ChatView";
import LiveChatPage from "./pages/LiveChat";
import SetupLiveChat from "./pages/SetupLiveChat";
import WorkflowMemberships from "./pages/WorkflowMemberships";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newMessage" element={<NewMessage />} />
        <Route path="/chat" element={<ChatViewPage />} />
        <Route path="/liveChat" element={<LiveChatPage />} />
        <Route path="/setupLiveChat" element={<SetupLiveChat />} />

        <Route path="/workflow-memberships" element={<WorkflowMemberships />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
