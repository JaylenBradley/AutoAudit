import { useCreateExpense } from '../hooks/useExpenseQueries';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from "../hooks/useScrollToTop.js";

const CATEGORIES = [
  "general",
  "travel",
  "food",
  "lodging",
  "transportation",
  "supplies",
  "other"
];

const AddExpense = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { mutate: createExpense, isLoading } = useCreateExpense({
    onSuccess: () => {
      toast.success('Expense added!');
      navigate('/expenses');
    },
    onError: (err) => toast.error(err.message)
  });
  useScrollToTop();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    createExpense({
      user_id: currentUser.id,
      company_id: currentUser.company_id,
      merchant: form.merchant.value,
      amount: parseFloat(form.amount.value),
      category: form.category.value || undefined,
      description: form.description.value,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-secondary rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="merchant" placeholder="Merchant" required className="w-full mb-3 p-2 rounded-lg border border-primary/30"/>
        <input name="amount" type="number" placeholder="Amount" required className="w-full mb-3 p-2 rounded-lg border border-primary/30"/>
        <select name="category" className="w-full mb-3 p-2 cursor-pointer">
          <option value="">Select Category (optional)</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
        <div className="text-xs text-text/60 mb-2">
          If not provided, AI will categorize your expense automatically.
        </div>
        <textarea name="description" placeholder="Description" className="w-full mb-3 p-2 rounded-lg border border-primary/30"/>
        <button type="submit" disabled={isLoading} className="bg-primary text-text px-4 py-2 hover:bg-primary/80 rounded-lg border border-primary/30 transition-colors cursor-pointer">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;