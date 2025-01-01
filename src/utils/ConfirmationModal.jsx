
const ConfirmationModal = ({ showModal, setShowModal, onConfirm, message }) => {
  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-lg p-6 w-1/3">
          <h3 className="text-lg font-semibold mb-4">
            {message}
          </h3>
          <div className="flex justify-end gap-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                onConfirm();
                setShowModal(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmationModal;
