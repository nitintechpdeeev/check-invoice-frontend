import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <h1 className="logo">Check Invoice System</h1>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/capture" className="nav-button" onClick={() => setIsOpen(false)}>Capture</Link>
        <Link to="/checks" className="nav-button" onClick={() => setIsOpen(false)}>Checks</Link>
        <Link to="/invoices" className="nav-button" onClick={() => setIsOpen(false)}>Invoices</Link>
        <Link to="/companies" className="nav-button" onClick={() => setIsOpen(false)}>Companies</Link>
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
