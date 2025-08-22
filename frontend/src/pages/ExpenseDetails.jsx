import { useState, useEffect } from "react";
import {useParams, useNavigate, Link} from 'react-router-dom';
import { useExpenseById, useDeleteExpense, useUpdateExpense } from '../hooks/useExpenseQueries';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { CATEGORIES } from "../utils/options.js";
import { getLabel } from "../utils/helpers.js";
import ExpenseEditForm from "../components/ExpenseEditForm.jsx";
import Spinner from '../components/Spinner';
import {FiArrowLeft} from "react-icons/fi";

const ExpenseDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: expense, isLoading, error } = useExpenseById(id);

  const { mutate: updateExpense, isLoading: updating } = useUpdateExpense({
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['expenses']});
      queryClient.invalidateQueries({ queryKey: ['expense', id] });
      setEditMode(false);
      navigate(`/expenses/${id}`);
    },
    onError: (err) => alert(`Failed to update expense: ${err.message}`)
  });

  const { mutate: deleteExpense, isLoading: deleting } = useDeleteExpense({
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['expenses']});
      navigate('/expenses')
    },
    onError: (err) => alert(`Failed to delete expense: ${err.message}`)
  });
  useScrollToTop();

  useEffect(() => {
    if (expense) {
      setFormData({
        merchant: expense.merchant,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description
      });
    }
  }, [expense]);

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
      {editMode ? (
        <ExpenseEditForm
          formData={formData}
          onSubmit={data => updateExpense({ id, expenseData: data })}
          onCancel={() => setEditMode(false)}
          updating={updating}
        />
      ) : (
        <>
          <div className="text-text"><strong>Merchant:</strong> {expense.merchant}</div>
          <div className="text-text"><strong>Amount:</strong> ${expense.amount.toFixed(2)}</div>
          <div className="text-text"><strong>Category:</strong> {getLabel(CATEGORIES, expense.category)}</div>
          <div className="text-text"><strong>Date:{' '}</strong>
            {format(parseISO(expense.date), 'MMM dd, yyyy')}
          </div>
          <div className="text-text"><strong>Description:</strong> {expense.description}</div>
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
              onClick={() => setEditMode(true)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 mr-2 transition-colors cursor-pointer"
            >
              Edit Expense
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this expense?")) {
                  deleteExpense(id);
                }
              }}
              disabled={deleting}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
            >
              {deleting ? 'Deleting...' : 'Delete Expense'}
            </button>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default ExpenseDetails;