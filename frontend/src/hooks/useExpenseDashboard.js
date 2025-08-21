import { useState, useEffect } from 'react';
import { format, subDays, subMonths, subQuarters, subYears, isAfter, parseISO } from 'date-fns';

export function useExpenseDashboard(expenses = [], users = []) {
  const [timeRange, setTimeRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set((expenses || []).map(exp => exp.category))];

  useEffect(() => {
    if (!expenses) return;
    let cutoffDate = new Date();

    switch (timeRange) {
      case 'week': cutoffDate = subDays(new Date(), 7); break;
      case 'month': cutoffDate = subMonths(new Date(), 1); break;
      case 'quarter': cutoffDate = subQuarters(new Date(), 1); break;
      case 'year': cutoffDate = subYears(new Date(), 1); break;
      case 'custom':
        if (customStartDate && customEndDate) {
          setFilteredExpenses(
            expenses.filter(exp => {
              const d = parseISO(exp.created_at);
              return isAfter(d, parseISO(customStartDate)) && !isAfter(d, parseISO(customEndDate));
            })
          );
          return;
        }
        break;
      default: cutoffDate = subMonths(new Date(), 1);
    }

    let filtered = expenses.filter(exp => isAfter(parseISO(exp.created_at), cutoffDate));
    if (selectedUsers.length > 0) filtered = filtered.filter(exp => selectedUsers.includes(exp.user_id));
    if (selectedCategories.length > 0) filtered = filtered.filter(exp => selectedCategories.includes(exp.category));
    setFilteredExpenses(filtered);
  }, [expenses, timeRange, customStartDate, customEndDate, selectedUsers, selectedCategories]);

  const categoryData = categories.map(category => ({
    name: category,
    value: filteredExpenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(item => item.value > 0);

  const getTimeSeriesData = () => {
    const data = [];
    const expenseMap = new Map();
    filteredExpenses.forEach(exp => {
      const date = format(parseISO(exp.created_at),
        timeRange === 'week' ? 'EEE' :
        timeRange === 'month' ? 'dd' :
        timeRange === 'quarter' ? 'MMM' : 'MMM yy'
      );
      expenseMap.set(date, (expenseMap.get(date) || 0) + exp.amount);
    });
    expenseMap.forEach((value, key) => data.push({ date: key, amount: value }));
    return data.sort((a, b) => timeRange === 'week'
      ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(a.date) - ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(b.date)
      : a.date.localeCompare(b.date));
  };

  return {
    timeRange, setTimeRange,
    customStartDate, setCustomStartDate,
    customEndDate, setCustomEndDate,
    filteredExpenses,
    categoryData,
    timeSeriesData: getTimeSeriesData(),
    categories,
    selectedUsers, setSelectedUsers,
    selectedCategories, setSelectedCategories,
    showFilters, setShowFilters,
    toggleUserSelection: userId => setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]),
    toggleCategorySelection: cat => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]),
    clearFilters: () => { setSelectedUsers([]); setSelectedCategories([]); }
  };
}