import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiFileText } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getLabel } from '../../utils/helpers.js'
import { CATEGORIES } from '../../utils/options';

const ExpenseTable = ({
  expenses = [],
  limit = 5,
  showEmployee = false,
  users = [],
  linkToAll = true
}) => {
  const { currentUser } = useAuth();

  const showEmployeeColumn = showEmployee && currentUser.role !== 'employee';

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text">Recent Expenses</h2>
        {linkToAll && (
          <Link to="/expenses" className="text-primary hover:underline text-sm">View All</Link>
        )}
      </div>
      {sortedExpenses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background text-text">
                {showEmployeeColumn && (
                  <th className="p-3 text-left text-sm font-medium">Employee</th>
                )}
                <th className="p-3 text-left text-sm font-medium">Category</th>
                <th className="p-3 text-left text-sm font-medium">Amount</th>
                <th className="p-3 text-left text-sm font-medium">Date</th>
                <th className="p-3 text-left text-sm font-medium">Status</th>
                <th className="p-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10 text-text">
              {sortedExpenses.slice(0, limit).map(expense => (
                <tr key={expense.id} className="hover:bg-background/50">
                  {showEmployeeColumn && (
                    <td className="p-3 text-sm">
                      {users.find(u => u.id === expense.user_id)?.username || 'Unknown'}
                    </td>
                  )}
                  <td className="p-3 text-sm">{getLabel(CATEGORIES, expense.category)}</td>
                  <td className="p-3 text-sm">${expense.amount.toFixed(2)}</td>
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
                      className="text-primary hover:underline flex items-center"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 text-text/60">
          {showEmployeeColumn ? 'No expenses found for the selected filters' : 'You haven\'t submitted any expenses yet'}
          {!showEmployeeColumn && (
            <div className="mt-2">
              <Link
                to="/expenses/create"
                className="text-primary hover:underline"
              >
                Add your first expense
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;