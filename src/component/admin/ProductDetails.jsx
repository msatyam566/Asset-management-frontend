import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../sideBar/Layout";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; // Heroicons
import ErrorCard from "../cards/ErrorCard";

const ProductDetails = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [userToDelete, setUserToDelete] = useState(null); // User to delete

  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/products",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response) setProducts(response.data.productDetails);
        setFilteredProducts(response.data.productDetails);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status >= 400 && status <= 500) {
            setErrorMessage(error.response.data.message);
          }
        }
      }
    };
    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId); // Store the userId to delete
    setShowModal(true); // Show the confirmation modal
  };

  // Handle delete
  const handleDelete = async (userToDelete) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/product/${userToDelete}`,{
        headers: {
          Authorization: `${token}`, // Add the token to the headers
        },
      });

      setProducts(products.filter((product) => product.id !== userToDelete));
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== userToDelete)
      );
      setShowModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  return (
    <Layout role="admin">
      <ErrorCard
        message={errorMessage}
        onClose={() => setErrorMessage("")}
        position="top-right"
      />
      <div className="container mx-auto p-4">
        {/* Search and Add Button */}
        <div className="flex flex-row justify-between items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded w-full md:w-1/3"
          />
        </div>

        {/* Responsive User Display */}
        <div className="block md:hidden">
          {/* Mobile view: Card-based design */}
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-md p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    {product.productName}
                  </h3>
                  <p className="text-gray-500">{product.quantity}</p>
                  <p className="text-sm text-gray-400">
                    {" "}
                    {product.description}
                  </p>
                  <p className="text-sm text-gray-400"> {product.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-green-500 hover:text-green-700 transition"
                    onClick={() =>
                      console.log("Edit button clicked for product", product.id)
                    }
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => confirmDelete(product.id)}

                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-4">No products found.</p>
          )}
        </div>

        <div className="hidden md:block">
          {/* Desktop view: Table-based design */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {product.productName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center gap-4">
                      <button
                        className="text-green-500 hover:text-green-700 transition"
                        onClick={() =>
                          console.log(
                            "Edit button clicked for product",
                            product.id
                          )
                        }
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => confirmDelete(product.id)}
                        >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-4">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
        {/* Delete Confirmation Modal */}
        {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this product?
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
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetails;
