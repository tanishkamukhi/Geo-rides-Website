import "../styles/Navbar.css";
import { useState } from "react";
import AuthModal from "./AuthModal";

function Navbar() {
  const [authType, setAuthType] = useState(null); 
  // null | "login" | "register"

  return (
    <>
      <nav>
        <div className="logo">
    <h1>GEO RIDES</h1>
    <h3>Go Places, Go GEO</h3>
  </div>

        <div>
          <button onClick={() => setAuthType("login")}>Login</button>
          <button onClick={() => setAuthType("register")}>Register</button>
        </div>
      </nav>

      {authType && (
        <AuthModal type={authType} onClose={() => setAuthType(null)} />
      )}
    </>
  );
}

export default Navbar;