import {useParams, useNavigate, Link} from 'react-router-dom';
import { useExpenseById, useDeleteExpense } from '../hooks/useExpenseQueries';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { CATEGORIES } from "../utils/options.js";
import { getLabel } from "../utils/helpers.js";
import Spinner from '../components/Spinner';
import {FiArrowLeft} from "react-icons/fi";

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: expense, isLoading, error } = useExpenseById(id);
  const { mutate: deleteExpense, isLoading: deleting } = useDeleteExpense({
    onSuccess: () => navigate('/expenses'),
    onError: (err) => alert(`Failed to delete expense: ${err.message}`)
  });
  useScrollToTop();

  const canDelete = currentUser.role === 'admin';
  const canUpdate = currentUser.role === 'admin' || currentUser.role === 'manager';

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <div className="text-red-500">Failed to load expense.</div>;
  if (!expense) return <div>Expense not found.</div>;

  if (currentUser.role === 'employee' && expense.user_id !== currentUser.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-text/60">
          You do not have permission to view this expense
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-text">Expense Details</h1>
        <Link
          to="/expenses"
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg
          hover:bg-primary/80 font-medium transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </Link>
      </div>
      <div className="bg-secondary p-6 rounded-lg shadow-sm space-y-2">
        <div className="text-text"><strong>Merchant:</strong> {expense.merchant}</div>
        <div className="text-text"><strong>Amount:</strong> ${expense.amount.toFixed(2)}</div>
        <div className="text-text"><strong>Category:</strong> {getLabel(CATEGORIES, expense.category)}</div>
        <div className="text-text"><strong>Description:</strong> {expense.description}</div>
        <div className="text-text"><strong>Date:</strong> {expense.created_at}</div>
        <div className="text-text">
          <strong>Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${expense.is_flagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {expense.is_flagged ? 'Flagged' : 'Approved'}
          </span>
        </div>
        {expense.flag_reason && (
          <div className="text-red-500 text-sm"><strong>Flag Reason:</strong> {expense.flag_reason}</div>
        )}
        {canUpdate && (
          <button
            onClick={() => navigate(`/expenses/${id}/edit`)}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 mr-2 transition-colors cursor-pointer"
          >
            Edit Expense
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => deleteExpense(id)}
            disabled={deleting}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete Expense'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpenseDetails;