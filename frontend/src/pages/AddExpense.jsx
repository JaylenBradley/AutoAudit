import { useCreateExpense, useUploadExpensesCSV } from '../hooks/useExpenseQueries';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { CATEGORIES } from "../utils/options.js";
import CalendarInput from "../components/CalendarInput.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddExpense = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateError, setDateError] = useState('');
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: createExpense, isLoading } = useCreateExpense({
    onSuccess: () => {
      if (currentUser.role === 'admin' || currentUser.role === 'manager') {
        queryClient.invalidateQueries({queryKey: ['expenses']});
      }
      queryClient.invalidateQueries({ queryKey: ['user', currentUser.id, 'expenses'] });
      toast.success('Expense added!');
      navigate('/expenses');
    },
    onError: (err) => toast.error(err.message)
  });

  const { mutate: bulkUpload, isLoading: bulkLoading } = useUploadExpensesCSV({
    onSuccess: (stats) => toast.success(`CSV uploaded: ${stats.successful} added, ${stats.flagged} flagged`),
    onError: (err) => toast.error(err.message)
  });

  useScrollToTop();

  const [csvFile, setCsvFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (!selectedDate) {
      setDateError('Please select a date.');
      return;
    }
    setDateError('');
    createExpense({
      user_id: currentUser.id,
      company_id: currentUser.company_id,
      merchant: form.merchant.value,
      amount: parseFloat(form.amount.value),
      category: form.category.value || undefined,
      description: form.description.value,
      date: selectedDate.toISOString().slice(0, 10)
    });
  };

  const handleCsvUpload = (e) => {
    e.preventDefault();
    if (!csvFile) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      bulkUpload({
        user_id: currentUser.id,
        company_id: currentUser.company_id,
        file_content: evt.target.result
      });
    };
    reader.readAsText(csvFile);
  };

  const canBulkUpload = currentUser.role === 'admin' || currentUser.role === 'manager';

  return (

    <div className="max-w-lg mx-auto p-6 bg-secondary rounded-lg">
      {canBulkUpload && (
        <>
          <form onSubmit={handleCsvUpload} className="space-y-2">
            <label className="block text-text font-medium mb-2" htmlFor="csv-upload">Bulk CSV Upload</label>
            <input id="csv-upload" type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} className="w-full mb-2"/>
            <button type="submit" disabled={bulkLoading || !csvFile} className="bg-primary text-text px-4 py-2 hover:bg-primary/80 rounded-lg border border-primary/30 cursor-pointer">
              {bulkLoading ? "Uploading..." : "Upload CSV"}
            </button>
          </form>
          <hr className="my-6 text-text"/>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="merchant">Merchant *</label>
          <input
            id="merchant"
            name="merchant"
            placeholder="Enter merchant name"
            required
            className="w-full p-2 rounded-lg border border-primary/30"
          />
        </div>
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="amount">Amount *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={0}
            placeholder="Enter amount"
            required
            className="w-full p-2 rounded-lg border border-primary/30"
          />
        </div>
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="date">Date *</label>
          <DatePicker
            id="date"
            selected={selectedDate}
            onChange={date => {
              setSelectedDate(date);
              setDateError('');
            }}
            dateFormat="MMM-dd-yyyy"
            customInput={<CalendarInput placeholder="Select date" />}
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date()}
            filterDate={date => {
              const year = date.getFullYear();
              return year >= 1900 && year <= 2100;
            }}
          />
          {dateError && (
            <div className="text-red-500 text-xs mt-1">{dateError}</div>
          )}
        </div>
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="w-full p-2 rounded-lg border border-primary/30 cursor-pointer"
          >
            <option value="">Select category (optional)</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-text/60 mb-2">
          If not provided, AI will categorize your expense automatically.
        </div>
        <div>
          <label className="block text-text font-medium mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter description"
            className="w-full p-2 rounded-lg border border-primary/30"
          />
        </div>
        <button type="submit" disabled={isLoading} className="bg-primary text-text px-4 py-2 hover:bg-primary/80 rounded-lg border border-primary/30 transition-colors cursor-pointer">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;