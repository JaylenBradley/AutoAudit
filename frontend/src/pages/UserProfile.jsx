import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/userServices';
import { getCompanies } from '../services/companyServices';
import { useScrollToTop } from "../hooks/useScrollToTop.js";

const UserProfile = () => {
  const { currentUser, updateUserData } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(currentUser?.company_id || '');
  const [selectedRole, setSelectedRole] = useState(currentUser?.role || 'employee');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useScrollToTop();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setMessage({ text: 'Failed to load companies', type: 'error' });
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUserData = await updateUser(currentUser.id, {
        company_id: selectedCompany === '' ? null : parseInt(selectedCompany),
        role: selectedRole
      });

      // Update the user data in AuthContext
      updateUserData(updatedUserData);

      setMessage({
        text: 'Profile updated successfully. Changes will be reflected when you next visit the dashboard.',
        type: 'success'
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">User Profile</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-text font-medium mb-2">Select Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full p-2 border border-primary/20 rounded bg-transparent text-text"
            >
              <option value="">No Company (Personal Account)</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
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
            disabled={isLoading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;