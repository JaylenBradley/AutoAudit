import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompanyById } from '../hooks/useCompanyQueries';
import { useUserExpenses, useUserFlaggedExpenses } from '../hooks/useExpenseQueries';
import { useUsers } from '../hooks/useUserQueries';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { useToast } from '../context/ToastContext';
import AdminDashboard from '../components/AdminDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';
import Spinner from '../components/Spinner';
import { FiUsers, FiPlus, FiLogIn } from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useScrollToTop();

  const isAdmin = currentUser?.role === 'admin';
  const hasCompany = !!currentUser?.company_id;

  // Fetch company data if user has a company
  const {
    data: companyData,
    isLoading: companyLoading,
    error: companyError
  } = useCompanyById(currentUser?.company_id, {
    enabled: hasCompany,
    onError: (error) => {
      toast.error(`Failed to load company data: ${error.message}`);
    }
  });

  // Fetch user expenses
  const {
    data: userExpenses = [],
    isLoading: expensesLoading,
    error: expensesError
  } = useUserExpenses(currentUser?.id, {
    enabled: !!currentUser?.id,
    onError: (error) => {
      toast.error(`Failed to load expenses: ${error.message}`);
    }
  });

  // Fetch flagged expenses
  const {
    data: flaggedExpenses = [],
    isLoading: flaggedExpensesLoading,
    error: flaggedExpensesError
  } = useUserFlaggedExpenses(currentUser?.id, {
    enabled: !!currentUser?.id,
    onError: (error) => {
      toast.error(`Failed to load flagged expenses: ${error.message}`);
    }
  });

  // Fetch company users if admin
  const {
    data: companyUsers = [],
    isLoading: usersLoading,
    error: usersError
  } = useUsers({
    enabled: hasCompany && isAdmin,
    onError: (error) => {
      toast.error(`Failed to load company users: ${error.message}`);
    }
  });

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Error handling
  useEffect(() => {
    if (companyError) {
      toast.error("Failed to load company data");
    }
    if (expensesError) {
      toast.error("Failed to load expenses");
    }
    if (flaggedExpensesError) {
      toast.error("Failed to load flagged expenses");
    }
    if (usersError && isAdmin) {
      toast.error("Failed to load company users");
    }
  }, [companyError, expensesError, flaggedExpensesError, usersError, isAdmin, toast]);

  // Display no company screen if user doesn't have a company
  if (!hasCompany) {
    return (
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
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiLogIn className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-text mb-3">Join a Company</h2>
              <p className="text-text/70 mb-6">
                Connect to an existing company to track and manage your expenses
              </p>
              <Link
                to="/profile"
                className="block w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                Select Company
              </Link>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiPlus className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-text mb-3">Register New Company</h2>
              <p className="text-text/70 mb-6">
                Create a new company profile and become its administrator
              </p>
              <Link
                to="/register-company"
                className="block w-full bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                Create Company
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (companyLoading || expensesLoading || flaggedExpensesLoading || (isAdmin && usersLoading)) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Dashboard</h1>
          {companyData && (
            <p className="text-text/60 mt-1">
              {companyData.name} - {isAdmin ? 'Administrator' : 'Employee'} View
            </p>
          )}
        </div>

        {isAdmin && (
          <Link
            to={`/company/${companyData?.id}`}
            className="mt-4 md:mt-0 flex items-center text-primary hover:underline"
          >
            <FiUsers className="mr-1" /> Manage Company
          </Link>
        )}
      </div>

      {isAdmin ? (
        <AdminDashboard
          companyData={companyData}
          companyUsers={companyUsers}
          companyExpenses={userExpenses}
          onRefresh={handleRefresh}
        />
      ) : (
        <EmployeeDashboard
          expenses={userExpenses}
          flaggedExpenses={flaggedExpenses}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default Dashboard;