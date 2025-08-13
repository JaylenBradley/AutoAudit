// src/components/Header.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/images/AutoAudit_logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-secondary shadow-md">
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
          <Link to="/expenses" className="text-text hover:text-primary transition-colors">Expenses</Link>
          <Link to="/policies" className="text-text hover:text-primary transition-colors">Policies</Link>
          <Link to="/dashboard" className="text-text hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/login" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">Login</Link>
          <ThemeToggle />
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-secondary px-4 py-2 flex flex-col gap-2">
          <Link to="/" className="text-text hover:text-primary py-2 transition-colors">Home</Link>
          <Link to="/expenses" className="text-text hover:text-primary py-2 transition-colors">Expenses</Link>
          <Link to="/policies" className="text-text hover:text-primary py-2 transition-colors">Policies</Link>
          <Link to="/dashboard" className="text-text hover:text-primary py-2 transition-colors">Dashboard</Link>
          <Link to="/login" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">Login</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;