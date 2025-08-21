import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePolicies } from '../hooks/usePolicyQueries';
import { useUserExpenses, useUserFlaggedExpenses, useFlaggedExpenses } from '../hooks/useExpenseQueries';
import { useCompanyById, useCompanyUsers, useCompanyExpenses } from '../hooks/useCompanyQueries';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useToast } from '../context/ToastContext';
import AdminDashboard from '../components/AdminDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';
import NoCompany from '../components/NoCompany';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  useScrollToTop();

  const {
    data: userExpenses = [],
    isLoading: expensesLoading,
  } = useUserExpenses(currentUser?.id, {
    enabled: !!currentUser?.id,
    onError: (error) => toast.error(`Failed to load expenses: ${error.message}`)
  });

  const {
    data: policies = [],
    isLoading: policiesLoading,
    error: policiesError
  } = usePolicies({
    enabled: !!currentUser?.company_id,
    onError: (error) => toast.error(`Failed to load policies: ${error.message}`)
  });

  const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const {
    data: companyData,
    isLoading: companyLoading,
  } = useCompanyById(currentUser?.company_id, {
    enabled: isAdminOrManager && !!currentUser?.company_id,
    onError: (error) => toast.error(`Failed to load company data: ${error.message}`)
  });

  const {
    data: companyUsers = [],
    isLoading: usersLoading,
  } = useCompanyUsers(currentUser?.company_id, {
    enabled: isAdminOrManager && !!currentUser?.company_id,
    onError: (error) => toast.error(`Failed to load company users: ${error.message}`)
  });

  const {
    data: companyExpenses = [],
    isLoading: companyExpensesLoading,
  } = useCompanyExpenses(currentUser?.company_id, {
    enabled: isAdminOrManager && !!currentUser?.company_id,
    onError: (error) => toast.error(`Failed to load company expenses: ${error.message}`)
  });

  const {
    data: flaggedExpenses = [],
    isLoading: flaggedLoading,
  } = useUserFlaggedExpenses(currentUser?.id, {
    enabled: !!currentUser?.id && currentUser?.role === 'employee',
    onError: (error) => toast.error(`Failed to load flagged expenses: ${error.message}`)
  });

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      setLoading(
        companyLoading ||
        usersLoading ||
        companyExpensesLoading ||
        expensesLoading ||
        flaggedLoading
      );
    } else {
      setLoading(expensesLoading || flaggedLoading);
    }
  }, [
    currentUser,
    companyLoading,
    usersLoading,
    companyExpensesLoading,
    expensesLoading,
    flaggedLoading
  ]);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!currentUser.company_id) {
    return <NoCompany />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {currentUser.role === 'admin' && (
            <AdminDashboard
              currentUser={currentUser}
              companyData={companyData}
              companyUsers={companyUsers}
              companyExpenses={companyExpenses}
              policies={policies}
              policiesLoading={policiesLoading}
              policiesError={policiesError}
            />
          )}

          {currentUser.role === 'manager' && (
            <ManagerDashboard
              currentUser={currentUser}
              companyData={companyData}
              companyUsers={companyUsers}
              companyExpenses={companyExpenses}
              policies={policies}
              policiesLoading={policiesLoading}
              policiesError={policiesError}
            />
          )}

          {currentUser.role === 'employee' && (
            <EmployeeDashboard
              currentUser={currentUser}
              expenses={userExpenses}
              flaggedExpenses={flaggedExpenses}
              policies={policies}
              policiesLoading={policiesLoading}
              policiesError={policiesError}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;