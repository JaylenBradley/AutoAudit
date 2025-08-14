import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {getUserByFirebaseId, getUserById} from '../services/userServices';
import { getUserExpenses, getUserFlaggedExpenses } from '../services/expenseServices';
import { getCompanyById, getCompanyUsers, getCompanyExpenses } from '../services/companyServices';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiAlertTriangle, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companyExpenses, setCompanyExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [flaggedExpenses, setFlaggedExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const user = await getUserById(currentUser.id);
        setUserData(user);

        const userExpenses = await getUserExpenses(user.id);
        setExpenses(userExpenses);

        const flagged = await getUserFlaggedExpenses(user.id);
        setFlaggedExpenses(flagged);

        if (user.company_id && (user.role === 'admin' || user.role === 'manager')) {
          const company = await getCompanyById(user.company_id);
          setCompanyData(company);

          const users = await getCompanyUsers(user.company_id);
          setCompanyUsers(users);

          const allCompanyExpenses = await getCompanyExpenses(user.company_id);
          setCompanyExpenses(allCompanyExpenses);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  const isAdminOrManager = userData?.role === 'admin' || userData?.role === 'manager';

  const companyExpenseTotal = companyExpenses.length > 0
    ? companyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)
    : 0;

  const companyFlaggedExpenses = companyExpenses.filter(exp => exp.is_flagged);
  const companyFlaggedTotal = companyFlaggedExpenses.length > 0
    ? companyFlaggedExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)
    : 0;

  // Calculate monthly trend (placeholder logic - this should be replaced with actual logic)
  const calculateMonthlyTrend = () => {
    // Placeholder calculation - in a real app, you would compare current month vs previous month
    return "+12%";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">
        {isAdminOrManager && companyData ? `${companyData.name} Dashboard` : 'My Dashboard'}
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-secondary p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FiDollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-text">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-text">
            ${isAdminOrManager && companyExpenses.length > 0
              ? companyExpenseTotal
              : expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
          </p>
          <p className="text-text/70 text-sm mt-2">
            {isAdminOrManager && companyExpenses.length > 0
              ? `${companyExpenses.length} company expense entries`
              : `${expenses.length} expense entries`}
          </p>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FiAlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-text">Flagged Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-text">
            ${isAdminOrManager && companyFlaggedExpenses.length > 0
              ? companyFlaggedTotal
              : flaggedExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
          </p>
          <p className="text-text/70 text-sm mt-2">
            {isAdminOrManager && companyFlaggedExpenses.length > 0
              ? `${companyFlaggedExpenses.length} company flagged entries`
              : `${flaggedExpenses.length} flagged entries`}
          </p>
        </div>

        {isAdminOrManager && (
          <>
            <div className="bg-secondary p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiUsers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-text">Team Members</h3>
              </div>
              <p className="text-2xl font-bold text-text">
                {companyUsers.length}
              </p>
              <p className="text-text/70 text-sm mt-2">
                Active employees
              </p>
            </div>

            <div className="bg-secondary p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiTrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-text">Monthly Trend</h3>
              </div>
              <p className="text-2xl font-bold text-text">
                {calculateMonthlyTrend()}
              </p>
              <p className="text-text/70 text-sm mt-2">
                Compared to last month
              </p>
            </div>
          </>
        )}
      </div>

      {/* Recent Expenses */}
      <div className="bg-secondary rounded-lg shadow-sm p-6 mb-10">
        <h2 className="text-xl font-semibold text-text mb-4">
          {isAdminOrManager && companyExpenses.length > 0 ? 'Recent Company Expenses' : 'Recent Expenses'}
        </h2>

        {(isAdminOrManager ? companyExpenses : expenses).length === 0 ? (
          <p className="text-text/70">No expenses found. Start by adding some expenses.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-text">
              <thead className="text-left">
                <tr className="border-b border-primary/10">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  {isAdminOrManager && <th className="pb-3">Employee</th>}
                </tr>
              </thead>
              <tbody>
                {(isAdminOrManager && companyExpenses.length > 0 ? companyExpenses : expenses).slice(0, 5).map((expense) => (
                  <tr key={expense.id} className="border-b border-primary/5">
                    <td className="py-3">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="py-3">{expense.description}</td>
                    <td className="py-3">{expense.category}</td>
                    <td className="py-3">${parseFloat(expense.amount).toFixed(2)}</td>
                    <td className="py-3">
                      {expense.is_flagged ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          Flagged
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Approved
                        </span>
                      )}
                    </td>
                    {isAdminOrManager && (
                      <td className="py-3">{expense.user_name || "Unknown"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin-only sections */}
      {isAdminOrManager && (
        <div className="bg-secondary rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Company Policies</h2>
          <p className="text-text/70 mb-4">
            Manage expense policies to automatically flag non-compliant submissions.
          </p>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
            onClick={() => navigate('/policies')}
          >
            Manage Policies
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;