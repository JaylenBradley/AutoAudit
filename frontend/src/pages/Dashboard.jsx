import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserExpenses, getUserFlaggedExpenses } from '../services/expenseServices';
import { getCompanyById, getCompanyUsers, getCompanyExpenses } from '../services/companyServices';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companyExpenses, setCompanyExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [flaggedExpenses, setFlaggedExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Function to load data from cache
  const loadFromCache = () => {
    try {
      const cachedData = localStorage.getItem(`expenses_cache_${currentUser.id}`);
      if (cachedData) {
        const {
          timestamp,
          expenses: cachedExpenses,
          flaggedExpenses: cachedFlagged,
          companyData: cachedCompanyData,
          companyUsers: cachedCompanyUsers,
          companyExpenses: cachedCompanyExpenses
        } = JSON.parse(cachedData);

        // Check if cache is still valid (30 minutes)
        const now = new Date().getTime();
        if (now - timestamp < 30 * 60 * 1000) {
          setExpenses(cachedExpenses);
          setFlaggedExpenses(cachedFlagged);
          if (cachedCompanyData) setCompanyData(cachedCompanyData);
          if (cachedCompanyUsers) setCompanyUsers(cachedCompanyUsers);
          if (cachedCompanyExpenses) setCompanyExpenses(cachedCompanyExpenses);
          setLastFetched(timestamp);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Error loading from cache:", err);
      return false;
    }
  };

  // Function to save data to cache
  const saveToCache = (data) => {
    try {
      const timestamp = new Date().getTime();
      const cacheData = {
        timestamp,
        expenses: data.expenses || expenses,
        flaggedExpenses: data.flaggedExpenses || flaggedExpenses,
        companyData: data.companyData || companyData,
        companyUsers: data.companyUsers || companyUsers,
        companyExpenses: data.companyExpenses || companyExpenses
      };

      localStorage.setItem(`expenses_cache_${currentUser.id}`, JSON.stringify(cacheData));
      setLastFetched(timestamp);
    } catch (err) {
      console.error("Error saving to cache:", err);
    }
  };

  // Function to fetch fresh data
  const fetchFreshData = async (forceFetch = false) => {
    try {
      setIsLoading(true);

      // If not forcing fetch, try to load from cache first
      if (!forceFetch && loadFromCache()) {
        setIsLoading(false);
        return;
      }

      const userExpenses = await getUserExpenses(currentUser.id);
      const flagged = await getUserFlaggedExpenses(currentUser.id);

      let fetchedData = {
        expenses: userExpenses,
        flaggedExpenses: flagged
      };

      setExpenses(userExpenses);
      setFlaggedExpenses(flagged);

      if (currentUser.company_id && (currentUser.role === 'admin' || currentUser.role === 'manager')) {
        const company = await getCompanyById(currentUser.company_id);
        const users = await getCompanyUsers(currentUser.company_id);
        const allCompanyExpenses = await getCompanyExpenses(currentUser.company_id);

        setCompanyData(company);
        setCompanyUsers(users);
        setCompanyExpenses(allCompanyExpenses);

        fetchedData = {
          ...fetchedData,
          companyData: company,
          companyUsers: users,
          companyExpenses: allCompanyExpenses
        };
      }

      // Save the newly fetched data to cache
      saveToCache(fetchedData);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (currentUser) {
      fetchFreshData();
    }
  }, [currentUser]);

  // Function to manually refresh data (for use after adding expenses)
  const refreshData = () => {
    fetchFreshData(true); // Force fetch fresh data
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          {lastFetched && (
            <p className="text-sm text-text/60">
              Last updated: {new Date(lastFetched).toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={refreshData}
          className="text-sm bg-primary/10 text-primary px-3 py-1 rounded hover:bg-primary/20"
        >
          Refresh Data
        </button>
      </div>

      {isAdminOrManager && currentUser?.company_id ? (
        <AdminDashboard
          companyData={companyData}
          companyUsers={companyUsers}
          companyExpenses={companyExpenses}
        />
      ) : (
        <EmployeeDashboard
          expenses={expenses}
          flaggedExpenses={flaggedExpenses}
        />
      )}
    </div>
  );
};

export default Dashboard;