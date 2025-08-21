const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-24 w-24',
    lg: 'h-36 w-36',
  };

  return (
    <div className={`${className} flex justify-center items-center`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Spinner;