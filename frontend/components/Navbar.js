'use client'
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "@/styles/navbar.css"; // ✅ import the CSS file

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">Vehicle Tracker</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
