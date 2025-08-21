import { Link } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenseQueries';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import Spinner from '../components/Spinner';
import ExpenseTable from '../components/dashboard/ExpenseTable';

const Expenses = () => {
  const { data: expenses = [], isLoading, error } = useExpenses();
  useScrollToTop();

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <div className="text-red-500">Failed to load expenses.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text">All Expenses</h1>
        <Link to="/expenses/create" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
            Add Expense
        </Link>
      </div>
      <ExpenseTable expenses={expenses} limit={100} linkToAll={false} />
    </div>
  );
};

export default Expenses;