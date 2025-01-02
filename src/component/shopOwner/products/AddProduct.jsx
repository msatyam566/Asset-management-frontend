import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../cards/NotificationProvider";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    description: "",
    tax: "18",
    productImages: null,
    price: "",
    totalPrice: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const token = localStorage.getItem("token");
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/inventory/category",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response) {
          console.log(response.data.data);
          setCategories(response.data.data);
        }
      } catch (error) {
        showNotification(
          error.response?.data?.message ||
            "Failed to fetch categories. Please try again.",
          "error"
        );
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Recalculate total price based on price, quantity, and GST
  useEffect(() => {
    const calculateTotalPrice = () => {
      const basePrice = parseFloat(formData.price) || 0;
      const quantity = parseInt(formData.quantity) || 0;
      const tax = parseFloat(formData.tax) || 0;

      const gstAmount = (basePrice * tax) / 100;
      const totalPrice = (basePrice + gstAmount) * quantity;
      setFormData((prev) => ({ ...prev, totalPrice: totalPrice.toFixed(2) }));
    };

    calculateTotalPrice();
  }, [formData.price, formData.quantity, formData.tax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      productData.append(key, value);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/inventory/product",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`, // Include token in headers
          },
        }
      );
      console.log("Product Added:", response.data);
      showNotification(response.data.data.message || "Product added successfully!","success");
      
      setFormData({
        productName: "",
        quantity: "",
        description: "",
        tax: "18",
        barCode: "",
        productImages: null,
        price: "",
        totalPrice: "",
        categoryId: "",
      });
    } catch (error) {
      showNotification(
        error.response?.data?.message ||
          "Failed to add products",
        "error"
      );
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-5 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
        Add Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className=" block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
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

        {/* GST Rate */}
        <div>
          <label
            htmlFor="tax"
            className="block text-sm font-medium text-gray-700"
          >
            GST Rate
          </label>
          <select
            id="tax"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="18">18%</option>
            <option value="20">20%</option>
            <option value="28">28%</option>
          </select>
        </div>

        {/* Product Images */}
        <div>
          <label
            htmlFor="productImages"
            className="block text-sm font-medium text-gray-700"
          >
            Product Images
          </label>
          <input
            type="file"
            id="productImages"
            name="productImages"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Total Price */}
        <div>
          <label
            htmlFor="totalPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Total Price
          </label>
          <input
            type="number"
            id="totalPrice"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category ID */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between gap-4 mt-3">
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
              navigate("/shop-owner/products");
            }}
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
