import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SeguroCoche from "./components/SeguroCoche";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/seguroCoche" element={<SeguroCoche />} />
      </Routes>
    </Router>
  );
};

export default App;
