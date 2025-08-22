import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useUpdateUser } from '../hooks/useUserQueries';
import { useCompanies, useCompanyById } from '../hooks/useCompanyQueries';
import { useScrollToTop } from '../hooks/useScrollToTop';
import Spinner from '../components/Spinner';

const UserProfile = () => {
  const { currentUser, updateUserData } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    company_id: null,
    company_name: ''
  });
  const [selectedRole, setSelectedRole] = useState(currentUser?.role || 'employee');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  useScrollToTop();

  const {
    mutate: updateUser,
    isLoading: updateLoading,
    error: updateError
  } = useUpdateUser({
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
      updateUserData();

      if (data.company_id && !currentUser.company_id) {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  // Fetch all companies for search
  const {
    data: companies = [],
    isLoading: companiesLoading
  } = useCompanies({
    onError: (error) => {
      toast.error(`Failed to load companies: ${error.message}`);
    }
  });

  const { data: companyData, isLoading: companyLoading } = useCompanyById(
    currentUser?.company_id,
    { enabled: !!currentUser?.company_id }
  );

  // Initialize form data from user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        company_id: currentUser.company_id || null,
        company_name: currentUser.company_name || ''
      });
    }
  }, [currentUser]);

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanySearch = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleCompanySelect = (company) => {
    setFormData((prev) => ({
      ...prev,
      company_id: company.id,
      company_name: company.name
    }));
    setShowResults(false);
    setSearchTerm('');
  };

  const handleClearCompany = () => {
    setFormData((prev) => ({
      ...prev,
      company_id: null,
      company_name: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username: formData.username,
      company_id: formData.company_id,
      role: selectedRole
    };

    updateUser({
      id: currentUser.id,
      userData
    });
  };

  // Filter companies based on search term
  const filteredCompanies = searchTerm
    ? companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : companies;

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">Your Profile</h1>

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-text font-medium mb-2">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-primary/20 rounded bg-transparent text-text"
              placeholder="Your username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-text font-medium mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full p-3 border border-primary/20 rounded bg-transparent text-text opacity-70"
            />
            <p className="text-xs text-text/60 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="company" className="block text-text font-medium mb-2">Company</label>
            {formData.company_id ? (
              <div className="flex items-center">
                <span className="bg-primary/10 text-primary px-3 py-2 rounded flex-grow">
                  {companyLoading ? 'Loading company...' : (companyData?.name || 'No company selected')}
                </span>
                <button
                  type="button"
                  onClick={handleClearCompany}
                  className="ml-2 px-3 py-2 border border-primary/20 rounded-lg text-text hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleCompanySearch}
                  onFocus={() => setShowResults(true)}
                  className="w-full p-3 border border-primary/20 rounded bg-transparent text-text"
                  placeholder="Search for companies..."
                />
                {showResults && (
                  <div className="absolute z-10 mt-1 w-full bg-background border border-primary/20 rounded shadow-lg max-h-60 overflow-auto">
                    {companiesLoading ? (
                      <div className="p-3 text-center">Loading...</div>
                    ) : filteredCompanies.length > 0 ? (
                      filteredCompanies.map(company => (
                        <div
                          key={company.id}
                          className="p-3 text-text hover:bg-primary/10 cursor-pointer"
                          onClick={() => handleCompanySelect(company)}
                        >
                          {company.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center">No companies found</div>
                    )}
                  </div>
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
              className="w-full p-2 border border-primary/20 rounded bg-transparent text-text cursor-pointer"
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
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {updateLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;