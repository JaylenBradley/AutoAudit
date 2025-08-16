import { Link } from 'react-router-dom';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { useAuth } from "../context/AuthContext.jsx";
import { BiCategoryAlt } from 'react-icons/bi';
import { MdOutlinePolicy } from 'react-icons/md';
import { FiUpload } from "react-icons/fi";

const Home = () => {
  const { currentUser } = useAuth();
  useScrollToTop();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Intelligent Expense Management
            </h1>
            <p className="text-lg md:text-xl text-text/80 max-w-2xl mx-auto mb-10">
              AutoAudit uses AI to streamline expense management, automatically
              flag policy violations, and save your team valuable time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link to="/dashboard" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-text text-center mb-12">Key Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BiCategoryAlt className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">AI-Powered Categorization</h3>
                <p className="text-text/80">Automatically categorize expenses using advanced AI to ensure proper classification</p>
              </div>

              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MdOutlinePolicy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">Policy Enforcement</h3>
                <p className="text-text/80">Set custom policies and automatically flag expenses that violate company guidelines</p>
              </div>

              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FiUpload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">Bulk CSV Upload</h3>
                <p className="text-text/80">Upload and process multiple expenses at once with our CSV import feature</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-text mb-6">Ready to streamline your expense management?</h2>
            <p className="text-lg text-text/80 max-w-2xl mx-auto mb-8">
              Join thousands of companies using AutoAudit to save time and ensure compliance
            </p>
            {currentUser ? (
                <Link to="/dashboard" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium">
                  Get Started
                </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;