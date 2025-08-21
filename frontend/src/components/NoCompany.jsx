import { Link } from 'react-router-dom';
import { FiLogIn, FiPlus } from 'react-icons/fi';

const NoCompany = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="max-w-2xl mx-auto bg-secondary p-8 rounded-lg shadow-sm text-center">
      <h1 className="text-3xl font-bold text-text mb-6">Welcome to AutoAudit</h1>
      <div className="bg-primary/10 p-6 rounded-lg mb-8">
        <p className="text-lg text-text mb-4">
          You're not currently associated with any company. To get started,
          you can either join an existing company or register a new one.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col h-full">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FiLogIn className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-text mb-3">Join a Company</h2>
          <p className="text-text/70 mb-6">
            Connect to an existing company to track and manage your expenses
          </p>
          <div className="mt-auto">
            <Link
              to="/profile"
              className="block w-full bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors"
            >
              Select Company
            </Link>
          </div>
        </div>
        <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col h-full">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FiPlus className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-text mb-3">Register New Company</h2>
          <p className="text-text/70 mb-6">
            Create a new company profile and become its administrator
          </p>
          <div className="mt-auto">
            <Link
              to="/register-company"
              className="block w-full bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors"
            >
              Create Company
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NoCompany;