import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { format, subDays, subMonths, subQuarters, subYears, isAfter, parseISO } from 'date-fns';
import { FiPlus, FiUpload, FiFileText } from 'react-icons/fi';
import { usePolicies } from '../hooks/usePolicyQueries';
import { useToast } from '../context/ToastContext';
import Spinner from './Spinner';

const EmployeeDashboard = ({ expenses, flaggedExpenses, onRefresh }) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [timeRange, setTimeRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const {
    data: policies = [],
    isLoading: policiesLoading,
    error: policiesError
  } = usePolicies({
    enabled: !!currentUser?.company_id,
    onError: (error) => {
      toast.error(`Failed to load policies: ${error.message}`);
    }
  });

  // Get unique categories from expenses
  const categories = [...new Set(expenses.map(expense => expense.category))];

  // Filter expenses by date range
  useEffect(() => {
    if (!expenses.length) return;

    let cutoffDate = new Date();

    switch (timeRange) {
      case 'week':
        cutoffDate = subDays(new Date(), 7);
        break;
      case 'month':
        cutoffDate = subMonths(new Date(), 1);
        break;
      case 'quarter':
        cutoffDate = subQuarters(new Date(), 1);
        break;
      case 'year':
        cutoffDate = subYears(new Date(), 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const filtered = expenses.filter(expense => {
            const expenseDate = parseISO(expense.created_at);
            return isAfter(expenseDate, parseISO(customStartDate)) &&
                  !isAfter(expenseDate, parseISO(customEndDate));
          });
          setFilteredExpenses(filtered);
          return;
        }
        break;
      default:
        cutoffDate = subMonths(new Date(), 1);
    }

    const filtered = expenses.filter(expense =>
      isAfter(parseISO(expense.created_at), cutoffDate)
    );

    setFilteredExpenses(filtered);
  }, [expenses, timeRange, customStartDate, customEndDate]);

  // Prepare chart data
  const categoryData = categories.map(category => {
    const total = filteredExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      name: category,
      value: total
    };
  }).filter(item => item.value > 0);

  // Time series data for bar chart
  const getTimeSeriesData = () => {
    const data = [];
    const expenseMap = new Map();

    filteredExpenses.forEach(expense => {
      const date = format(parseISO(expense.created_at),
        timeRange === 'week' ? 'EEE' :
        timeRange === 'month' ? 'dd' :
        timeRange === 'quarter' ? 'MMM' : 'MMM yy'
      );

      if (!expenseMap.has(date)) {
        expenseMap.set(date, 0);
      }

      expenseMap.set(date, expenseMap.get(date) + expense.amount);
    });

    expenseMap.forEach((value, key) => {
      data.push({
        date: key,
        amount: value
      });
    });

    return data.sort((a, b) => {
      if (timeRange === 'week') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.indexOf(a.date) - days.indexOf(b.date);
      }
      return a.date.localeCompare(b.date);
    });
  };

  const timeSeriesData = getTimeSeriesData();

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (policiesError) {
    toast.error("Failed to load company policies");
  }

  return (
    <div className="space-y-8">
      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text">Expense Summary</h2>

          <div className="flex space-x-2">
            <Link
              to="/expenses/create"
              className="bg-primary text-white px-3 py-1 rounded text-sm flex items-center hover:bg-opacity-90"
            >
              <FiPlus className="mr-1" /> Add Expense
            </Link>

            <Link
              to="/expenses/upload"
              className="bg-secondary border border-primary text-primary px-3 py-1 rounded text-sm flex items-center hover:bg-primary/10"
            >
              <FiUpload className="mr-1" /> Upload CSV
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background p-4 rounded">
            <h3 className="text-sm font-medium text-text/60">Total Expenses</h3>
            <p className="text-2xl font-bold text-text">
              ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-background p-4 rounded">
            <h3 className="text-sm font-medium text-text/60">This Month</h3>
            <p className="text-2xl font-bold text-text">
              ${expenses
                .filter(e => isAfter(parseISO(e.created_at), subMonths(new Date(), 1)))
                .reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-background p-4 rounded">
            <h3 className="text-sm font-medium text-text/60">Flagged Expenses</h3>
            <p className="text-2xl font-bold text-text">
              {flaggedExpenses.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text">Expense Analytics</h2>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-primary/20 rounded bg-transparent text-text text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {timeRange === 'custom' && (
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-sm text-text/60 mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="p-2 border border-primary/20 rounded bg-transparent text-text"
              />
            </div>
            <div>
              <label className="block text-sm text-text/60 mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="p-2 border border-primary/20 rounded bg-transparent text-text"
              />
            </div>
          </div>
        )}

        {filteredExpenses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <h3 className="text-center text-sm font-medium text-text/60 mb-4">Expense Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="amount" name="Expenses" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-80">
              <h3 className="text-center text-sm font-medium text-text/60 mb-4">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-text/60">
            <p>No expense data available for the selected time period.</p>
            <Link
              to="/expenses/create"
              className="inline-block mt-2 text-primary hover:underline"
            >
              Add your first expense
            </Link>
          </div>
        )}
      </div>

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text">Company Policies</h2>
          {currentUser?.role === 'admin' && (
            <Link
              to="/policies/create"
              className="bg-primary text-white px-3 py-1 rounded text-sm flex items-center hover:bg-opacity-90"
            >
              <FiPlus className="mr-1" /> Add Policy
            </Link>
          )}
        </div>

        {policiesLoading ? (
          <div className="flex justify-center py-4">
            <Spinner size="md" />
          </div>
        ) : policies.length > 0 ? (
          <div className="divide-y divide-primary/10">
            {policies.map(policy => (
              <div key={policy.id} className="py-3">
                <h3 className="font-medium text-text">{policy.name}</h3>
                <p className="text-sm text-text/70 mt-1">{policy.description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary mr-2">
                    {policy.category}
                  </span>
                  <span className="text-xs text-text/60">
                    Limit: ${policy.amount_limit?.toFixed(2) || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-text/60">
            <p>No company policies found.</p>
            {currentUser?.role === 'admin' && (
              <Link
                to="/policies/create"
                className="inline-block mt-2 text-primary hover:underline"
              >
                Create your first policy
              </Link>
            )}
          </div>
        )}
      </div>

      {flaggedExpenses.length > 0 && (
        <div className="bg-secondary p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text">Flagged Expenses</h2>
            <Link to="/expenses/flagged" className="text-primary hover:underline text-sm">View All</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-background text-text/70">
                  <th className="p-3 text-left text-sm font-medium">Category</th>
                  <th className="p-3 text-left text-sm font-medium">Amount</th>
                  <th className="p-3 text-left text-sm font-medium">Date</th>
                  <th className="p-3 text-left text-sm font-medium">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {flaggedExpenses.slice(0, 5).map(expense => (
                  <tr key={expense.id} className="hover:bg-background/50">
                    <td className="p-3 text-sm">{expense.category}</td>
                    <td className="p-3 text-sm">${expense.amount.toFixed(2)}</td>
                    <td className="p-3 text-sm">
                      {format(parseISO(expense.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-3 text-sm text-red-600">
                      {expense.flag_reason || 'Policy violation'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text">Recent Expenses</h2>
          <Link to="/expenses" className="text-primary hover:underline text-sm">View All</Link>
        </div>

        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-background text-text/70">
                  <th className="p-3 text-left text-sm font-medium">Category</th>
                  <th className="p-3 text-left text-sm font-medium">Amount</th>
                  <th className="p-3 text-left text-sm font-medium">Date</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {expenses.slice(0, 5).map(expense => (
                  <tr key={expense.id} className="hover:bg-background/50">
                    <td className="p-3 text-sm">{expense.category}</td>
                    <td className="p-3 text-sm">${expense.amount.toFixed(2)}</td>
                    <td className="p-3 text-sm">
                      {format(parseISO(expense.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        expense.flagged 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {expense.flagged ? 'Flagged' : 'Approved'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <Link
                        to={`/expenses/${expense.id}`}
                        className="text-primary hover:underline flex items-center"
                      >
                        <FiFileText className="mr-1" /> Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-text/60">
            <p>You haven't submitted any expenses yet.</p>
            <Link
              to="/expenses/create"
              className="inline-block mt-2 text-primary hover:underline"
            >
              Add your first expense
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;