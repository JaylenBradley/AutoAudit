import { useAuth } from '../../context/AuthContext';
import { useExpenseDashboard } from '../../hooks/useExpenseDashboard';
import ExpenseTrendChart from '../charts/ExpenseTrendChart';
import ExpenseCategoryChart from '../charts/ExpenseCategoryChart';
import { FiFilter, FiX } from 'react-icons/fi';

const ExpenseAnalytics = ({
  expenses = [],
  companyUsers = [],
  showFilters = false,
  setShowFilters = () => {},
}) => {
  const { currentUser } = useAuth();
  const dashboard = useExpenseDashboard(expenses, companyUsers);

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text">Expense Analytics</h2>
        <div className="flex space-x-2">
          <select
            value={dashboard.timeRange}
            onChange={(e) => dashboard.setTimeRange(e.target.value)}
            className="p-2 border border-primary/20 rounded bg-transparent text-text text-sm cursor-pointer"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          {companyUsers.length > 0 && currentUser.role !== 'employee' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-primary/20 rounded bg-transparent text-text flex items-center"
            >
              <FiFilter className="mr-1" /> Filters
            </button>
          )}
        </div>
      </div>

      {dashboard.timeRange === 'custom' && (
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm text-text/60 mb-1">Start Date</label>
            <input
              type="date"
              value={dashboard.customStartDate}
              onChange={(e) => dashboard.setCustomStartDate(e.target.value)}
              className="p-2 border border-primary/20 rounded bg-transparent text-text"
            />
          </div>
          <div>
            <label className="block text-sm text-text/60 mb-1">End Date</label>
            <input
              type="date"
              value={dashboard.customEndDate}
              onChange={(e) => dashboard.setCustomEndDate(e.target.value)}
              className="p-2 border border-primary/20 rounded bg-transparent text-text"
            />
          </div>
        </div>
      )}

      {showFilters && companyUsers.length > 0 && currentUser.role !== 'employee' && (
        <div className="mb-6 p-4 border border-primary/20 rounded bg-background">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium text-text">Filters</h3>
            <button onClick={dashboard.clearFilters} className="text-sm text-primary flex items-center">
              <FiX className="mr-1" /> Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-text/60 mb-2">Users</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {companyUsers.map(user => (
                  <div key={user.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={dashboard.selectedUsers.includes(user.id)}
                      onChange={() => dashboard.toggleUserSelection(user.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`user-${user.id}`} className="text-sm text-text">
                      {user.name || user.email}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text/60 mb-2">Categories</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {dashboard.categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={dashboard.selectedCategories.includes(category)}
                      onChange={() => dashboard.toggleCategorySelection(category)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category}`} className="text-sm text-text">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <h3 className="text-center text-sm font-medium text-text/60 mb-4">Expense Trend</h3>
          <ExpenseTrendChart
              data={dashboard.timeSeriesData}
              timeRange={dashboard.timeRange}
              height="90%"
          />
        </div>
        <div className="h-80">
          <h3 className="text-center text-sm font-medium text-text/60 mb-4">Expenses by Category</h3>
          <ExpenseCategoryChart data={dashboard.categoryData} height="90%" />
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;