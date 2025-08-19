import { createPortal } from 'react-dom';
import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
          duration={toast.duration || 6000} // Default 6 seconds, can be customized per toast
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;