import { Link, Outlet } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
