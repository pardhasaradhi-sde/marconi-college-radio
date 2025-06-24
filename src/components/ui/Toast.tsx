import { FC } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-body transition-all
        ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}
      onClick={onClose}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button className="ml-4 text-white/70 hover:text-white" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};
