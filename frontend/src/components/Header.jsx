import { Link } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/images/AutoAudit_logo.png';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import { app } from '../services/firebase';
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";

const auth = getAuth(app);

const Header = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
    toast.success("You've been logged out.");
    setShowLogoutConfirm(false);
  };

  return (
    <header className="bg-background shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AutoAudit Logo" className="h-10 w-auto" />
          <span className="text-2xl font-semibold text-text">AutoAudit</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-text"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-text hover:text-primary transition-colors">Home</Link>

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-text hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/profile" className="text-text hover:text-primary transition-colors">Profile</Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogoutClick}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
              Login
            </Link>
          )}

          <ThemeToggle />
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-secondary px-4 py-2 flex flex-col gap-2">
          <Link to="/" className="text-text hover:text-primary py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-text hover:text-primary py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" className="text-text hover:text-primary py-2 transition-colors" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          )}

          <div className="py-2">
            <ThemeToggle />
          </div>
        </nav>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-secondary p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-medium text-text mb-4">Confirm Logout</h3>
            <p className="text-text/70 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 border border-primary/20 rounded text-text hover:bg-primary/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;