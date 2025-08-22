import { FiCalendar } from 'react-icons/fi';

const CalendarInput = ({ value, onClick, placeholder = "Select date" }) => (
  <button
    type="button"
    onClick={onClick}
    className="
    w-full p-2 rounded-lg border border-primary/30 flex
    items-center justify-between focus:outline-none cursor-pointer"
  >
    <span className={value ? "text-text" : "text-text/60"}>{value || placeholder}</span>
    <FiCalendar className="ml-2 text-primary" />
  </button>
);

export default CalendarInput;