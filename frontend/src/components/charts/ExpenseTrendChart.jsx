import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseTrendChart = ({ data, height = '100%' }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Line type="monotone" dataKey="amount" name="Expenses" stroke="#8884d8" strokeWidth={2} dot />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseTrendChart;