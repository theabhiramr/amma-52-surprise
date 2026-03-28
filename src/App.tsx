import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConnectionsPage from "./pages/connections";
import SuccessPage from "./pages/success";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectionsPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
