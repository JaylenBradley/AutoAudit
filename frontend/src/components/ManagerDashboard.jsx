import { useExpenseDashboard } from '../hooks/useExpenseDashboard';
import ExpenseAnalytics from './dashboard/ExpenseAnalytics';
import ExpenseTable from './dashboard/ExpenseTable';
import CompanyPolicies from './dashboard/CompanyPolicies';

const ManagerDashboard = ({
  currentUser,
  companyData = [],
  companyExpenses = [],
  companyUsers = [],
  policies = [],
  policiesLoading = false,
  policiesError = null
}) => {
  const dashboard = useExpenseDashboard(companyExpenses, companyUsers);

  return (
    <div className="space-y-8">
      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text">Company Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background p-4 rounded">
            <h3 className="text-sm font-medium text-text/60">Total Employees</h3>
            <p className="text-2xl font-bold text-text">{companyUsers.length}</p>
          </div>
          <div className="bg-background p-4 rounded">
            <h3 className="text-sm font-medium text-text/60">Total Expenses</h3>
            <p className="text-2xl font-bold text-text">
              ${dashboard.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-background p-4 rounded">
            <h3 className="text-sm font-medium text-text/60">Flagged Expenses</h3>
            <p className="text-2xl font-bold text-text">
              {dashboard.filteredExpenses.filter(expense => expense.flagged).length}
            </p>
          </div>
        </div>
      </div>

      <ExpenseAnalytics
        timeRange={dashboard.timeRange}
        setTimeRange={dashboard.setTimeRange}
        customStartDate={dashboard.customStartDate}
        setCustomStartDate={dashboard.setCustomStartDate}
        customEndDate={dashboard.customEndDate}
        setCustomEndDate={dashboard.setCustomEndDate}
        timeSeriesData={dashboard.timeSeriesData}
        categoryData={dashboard.categoryData}
        showFilters={dashboard.showFilters}
        setShowFilters={dashboard.setShowFilters}
        companyUsers={companyUsers}
        categories={dashboard.categories}
        selectedUsers={dashboard.selectedUsers}
        toggleUserSelection={dashboard.toggleUserSelection}
        selectedCategories={dashboard.selectedCategories}
        toggleCategorySelection={dashboard.toggleCategorySelection}
        clearFilters={dashboard.clearFilters}
      />

      <ExpenseTable
        expenses={dashboard.filteredExpenses}
        limit={5}
        showEmployee={true}
        users={companyUsers}
        linkToAll={true}
      />

      <CompanyPolicies
        policies={policies}
        isLoading={policiesLoading}
        error={policiesError}
        canAddPolicy={false}
        addPolicyLink="/policies/create"
        emptyMessage="No company policies found"
        currentUser={currentUser}
      />
    </div>
  );
};

export default ManagerDashboard;