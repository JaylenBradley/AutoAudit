import { Link } from 'react-router-dom';
import { useExpenses, useUserExpenses } from '../hooks/useExpenseQueries';
import { useCompanyUsers } from '../hooks/useCompanyQueries';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { CATEGORIES } from "../utils/options.js";
import { getLabel } from "../utils/helpers.js";
import Spinner from '../components/Spinner';
import {format, parseISO} from "date-fns";

const Expenses = () => {
  const { currentUser } = useAuth();
  useScrollToTop();

  const isAdminOrManager = currentUser.role === 'admin' || currentUser.role === 'manager';

  const { data: expenses = [], isLoading, error } = isAdminOrManager
    ? useExpenses()
    : useUserExpenses(currentUser.id);

  const { data: users = [] } = useCompanyUsers(currentUser.company_id, {
    enabled: isAdminOrManager && !!currentUser.company_id
  });

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <div className="text-red-500">Failed to load expenses.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text">
          {!isAdminOrManager ? 'Your Expenses' : 'All Expenses'}
        </h1>
        <Link to="/expenses/create" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
            Add Expense
        </Link>
      </div>
      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-background text-text">
              {isAdminOrManager && (
                <th className="p-3 text-left text-sm font-medium">Employee</th>
              )}
              <th className="p-3 text-left text-sm font-medium">Merchant</th>
              <th className="p-3 text-left text-sm font-medium">Amount</th>
              <th className="p-3 text-left text-sm font-medium">Category</th>
              <th className="p-3 text-left text-sm font-medium">Date</th>
              <th className="p-3 text-left text-sm font-medium">Status</th>
              <th className="p-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10 text-text">
            {sortedExpenses.map(expense => (
              <tr key={expense.id} className="hover:bg-background/50">
               {isAdminOrManager && (
                    <td className="p-3 text-sm">
                      {users.find(u => u.id === expense.user_id)?.username || 'Unknown'}
                    </td>
               )}
                <td className="p-3 text-sm">{expense.merchant}</td>
                <td className="p-3 text-sm">${expense.amount.toFixed(2)}</td>
                <td className="p-3 text-sm">{getLabel(CATEGORIES, expense.category)}</td>
                <td className="p-3 text-sm">
                  {format(parseISO(expense.date), 'MMM dd, yyyy')}
                </td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    expense.is_flagged
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {expense.is_flagged ? 'Flagged' : 'Approved'}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <Link
                    to={`/expenses/${expense.id}`}
                    className="text-primary hover:underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && (
          <div className="text-center py-6 text-text/60">
            No expenses found
            <div className="mt-2">
              <Link
                to="/expenses/create"
                className="text-primary hover:underline"
              >
                Add your first expense
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;