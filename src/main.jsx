import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Checks from "./components/Checks";
import Invoices from "./components/Invoices";
import Companies from "./components/Companies";
import Capture from "./components/Capture";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Capture />} />
          <Route path="checks" element={<Checks />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="companies" element={<Companies />} />
          <Route path="capture" element={<Capture />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
