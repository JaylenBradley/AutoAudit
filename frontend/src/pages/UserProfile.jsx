import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUpdateUser } from '../hooks/useUserQueries';
import { useCompanies } from '../hooks/useCompanyQueries';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { Link } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const UserProfile = () => {
  const { currentUser, updateUserData } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState(currentUser?.company_id || '');
  const [selectedRole, setSelectedRole] = useState(currentUser?.role || 'employee');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const toast = useToast();
  useScrollToTop();

  // Use React Query for data fetching
  const {
    data: companies = [],
    isLoading: companiesLoading,
    error: companiesError
  } = useCompanies();

  const {
    mutate: updateUserMutation,
    isLoading: updateLoading,
    error: updateError
  } = useUpdateUser({
    onSuccess: (data) => {
      updateUserData();
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUserMutation({
      id: currentUser.id,
      userData: {
        company_id: selectedCompany === '' ? null : parseInt(selectedCompany),
        role: selectedRole
      }
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (companiesError) {
      toast.error("Failed to load companies");
    }
  }, [companiesError, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">User Profile</h1>

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative" ref={dropdownRef}>
            <label className="block text-text font-medium mb-2">Select Company</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a company..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full p-2 border border-primary/20 rounded bg-transparent text-text pl-10"
              />
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50" />
            </div>

            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-secondary border border-primary/20 rounded shadow-lg max-h-60 overflow-y-auto">
                {companiesLoading ? (
                  <div className="p-3 flex justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : filteredCompanies.length > 0 ? (
                  filteredCompanies.map(company => (
                    <div
                      key={company.id}
                      className={`p-2 cursor-pointer hover:bg-primary/10 ${selectedCompany === company.id ? 'bg-primary/20' : ''}`}
                      onClick={() => {
                        setSelectedCompany(company.id);
                        setSearchTerm(company.name);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-text">{company.name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-text/60">No companies found</div>
                )}
              </div>
            )}

            <div className="mt-2">
              <Link
                to="/register-company"
                className="text-primary text-sm hover:text-primary/80 transition-colors"
              >
                Registering a new company? Click here
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-text font-medium mb-2">User Role (for testing)</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2 border border-primary/20 rounded bg-transparent text-text"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-sm text-text/60 mt-1">
              This is for testing purposes. In a production environment, role changes would require admin approval.
            </p>
          </div>

          <button
            type="submit"
            disabled={updateLoading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {updateLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;