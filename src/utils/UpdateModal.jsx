import  { useState, useEffect } from 'react';

const UpdateModal = ({ showupdateModal, setShowupdateModal, onUpdate, data, title }) => {
  const [formData, setFormData] = useState({});


  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);  // Call the passed API update function
      setShowupdateModal(false);        // Close the modal after update
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    showupdateModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-lg p-6 w-1/3">
          <h3 className="text-lg font-semibold mb-4">{title || "Update Information"}</h3>
          <form onSubmit={handleSubmit}>
            {/* Render dynamic fields based on the passed data */}
            {Object.keys(formData).map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowupdateModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateModal;
