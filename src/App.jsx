import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import DetailsPage from "./components/Details";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:cityName" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
