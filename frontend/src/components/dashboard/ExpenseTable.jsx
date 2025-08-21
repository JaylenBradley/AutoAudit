import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiFileText } from 'react-icons/fi';

const ExpenseTable = ({
  expenses = [],
  limit = 5,
  showEmployee = false,
  users = [],
  linkToAll = true
}) => {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text">Recent Expenses</h2>
        {linkToAll && (
          <Link to="/expenses" className="text-primary hover:underline text-sm">View All</Link>
        )}
      </div>

      {expenses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-background text-text/70">
                {showEmployee && (
                  <th className="p-3 text-left text-sm font-medium">Employee</th>
                )}
                <th className="p-3 text-left text-sm font-medium">Category</th>
                <th className="p-3 text-left text-sm font-medium">Amount</th>
                <th className="p-3 text-left text-sm font-medium">Date</th>
                <th className="p-3 text-left text-sm font-medium">Status</th>
                <th className="p-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {expenses.slice(0, limit).map(expense => (
                <tr key={expense.id} className="hover:bg-background/50">
                  {showEmployee && (
                    <td className="p-3 text-sm">
                      {users.find(u => u.id === expense.user_id)?.name || 'Unknown'}
                    </td>
                  )}
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
          {showEmployee ? 'No expenses found for the selected filters' : 'You haven\'t submitted any expenses yet'}
          {!showEmployee && (
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