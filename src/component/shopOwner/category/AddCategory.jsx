import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../cards/NotificationProvider";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  let token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/inventory/category/",
        formData, // The formData object is the body
        {
          headers: {
            Authorization: `${token}`, // Pass token in Authorization header
          },
        }
      );

      if (response.data) {
        showNotification(
          response.data.message || "Catgory added successfully!",
          "success"
        );
        setFormData({
            categoryName: "",
            description: "",
        });
   
      }
    } catch (error) {
      showNotification(
        error.response.data || "Failed to add category.",
        "error"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-5 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
        Add Category
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-between gap-4 mt-3">
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
              navigate("/shop-owner/category");
            }}
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
