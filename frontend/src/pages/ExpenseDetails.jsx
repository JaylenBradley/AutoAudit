import { useParams, useNavigate } from 'react-router-dom';
import { useExpenseById, useDeleteExpense } from '../hooks/useExpenseQueries';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import Spinner from '../components/Spinner';

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: expense, isLoading, error } = useExpenseById(id);
  const { mutate: deleteExpense, isLoading: deleting } = useDeleteExpense({
    onSuccess: () => navigate('/expenses')
  });
  useScrollToTop();

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <div className="text-red-500">Failed to load expense.</div>;
  if (!expense) return <div>Expense not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text mb-4">Expense Details</h1>
      <div className="bg-secondary p-6 rounded-lg shadow-sm space-y-2">
        <div><strong>Merchant:</strong> {expense.merchant}</div>
        <div><strong>Amount:</strong> ${expense.amount.toFixed(2)}</div>
        <div><strong>Category:</strong> {expense.category}</div>
        <div><strong>Description:</strong> {expense.description}</div>
        <div><strong>Date:</strong> {expense.created_at}</div>
        <div>
          <strong>Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${expense.flagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {expense.flagged ? 'Flagged' : 'Approved'}
          </span>
        </div>
        <button
          onClick={() => deleteExpense(id)}
          disabled={deleting}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          {deleting ? 'Deleting...' : 'Delete Expense'}
        </button>
      </div>
    </div>
  );
};

export default ExpenseDetails;