import { FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

const EmployeeDashboard = ({ expenses, flaggedExpenses }) => {
  const expenseTotal = expenses.length > 0
    ? expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)
    : 0;

  const flaggedTotal = flaggedExpenses.length > 0
    ? flaggedExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)
    : 0;

  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-8">My Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-secondary p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FiDollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-text">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-text">${expenseTotal}</p>
          <p className="text-text/70 text-sm mt-2">{expenses.length} expense entries</p>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FiAlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-text">Flagged Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-text">${flaggedTotal}</p>
          <p className="text-text/70 text-sm mt-2">{flaggedExpenses.length} flagged entries</p>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-secondary rounded-lg shadow-sm p-6 mb-10">
        <h2 className="text-xl font-semibold text-text mb-4">Recent Expenses</h2>

        {expenses.length === 0 ? (
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
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 5).map((expense) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeDashboard;