
const ErrorCard = ({ message, onClose }) => {
  if (!message) return null; // Don't render if there's no message

  return (
    <div
      className="fixed top-4 right-4 z-50 max-w-sm p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <span className="font-semibold">Error</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-xl font-bold text-red-700 hover:text-red-500 focus:outline-none"
        >
          &times;
        </button>
      </div>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
};

export default ErrorCard;
