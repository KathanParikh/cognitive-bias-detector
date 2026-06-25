import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import ToolPage from "./pages/ToolPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/bias" element={<ToolPage toolId="bias" />} />
        <Route path="/rant" element={<ToolPage toolId="rant" />} />
        <Route path="/devil" element={<ToolPage toolId="devil" />} />
        <Route path="/conversation" element={<ToolPage toolId="conversation" />} />
        <Route path="/decision" element={<ToolPage toolId="decision" />} />
      </Routes>
    </BrowserRouter>
  );
}