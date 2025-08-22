import { useState, useEffect } from 'react';
import { CATEGORIES } from "../utils/options.js";
import CalendarInput from "./CalendarInput.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ExpenseEditForm = ({
  formData,
  onSubmit,
  onCancel,
  updating
}) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [selectedDate, setSelectedDate] = useState(formData?.date ? new Date(formData.date) : null);

  useEffect(() => {
    setLocalFormData(formData);
    setSelectedDate(formData?.date ? new Date(formData.date) : null);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...localFormData,
      date: selectedDate ? selectedDate.toISOString().slice(0, 10) : ''
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3">
      <div>
        <label className="block text-text font-medium mb-1">Merchant:</label>
        <input name="merchant" value={localFormData.merchant} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50"/>
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Amount:</label>
        <input name="amount" type="number" min={0} value={localFormData.amount} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50"/>
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Category:</label>
        <select name="category" value={localFormData.category} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50">
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="MMM-dd-yyyy"
          customInput={
            <CalendarInput
              value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
              placeholder="Select date"
            />
          }
          minDate={new Date(1900, 0, 1)}
          maxDate={new Date()}
          filterDate={date => {
            const year = date.getFullYear();
            return year >= 1900 && year <= 2100;
          }}
          required
        />
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Description:</label>
        <textarea
          name="description"
          value={localFormData.description}
          onChange={handleChange}
          className="w-full mb-2 p-2 rounded-lg border border-primary/50"
        />
      </div>
      <div>
        <button type="submit" disabled={updating} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 mr-2 transition-colors cursor-pointer">
          {updating ? 'Updating...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ExpenseEditForm;