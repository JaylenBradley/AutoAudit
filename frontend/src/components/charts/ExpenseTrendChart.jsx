// ExpenseTrendChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const ExpenseTrendChart = ({ data, timeRange, height = '100%' }) => {
  const formatDate = (date) => {
    if (timeRange === 'year') return date;
    if (timeRange === 'quarter') return format(parseISO(date), 'MMM yyyy');
    return format(parseISO(date), 'MMM dd yyyy');
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis />
        <Tooltip
          formatter={(value) => `$${value.toFixed(2)}`}
          labelFormatter={formatDate}
        />
        <Legend />
        <Line type="monotone" dataKey="amount" name="Expenses" stroke="#8884d8" strokeWidth={2} dot />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseTrendChart;