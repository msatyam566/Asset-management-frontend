import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../cards/NotificationProvider";
import axios from "axios";
import Layout from "../../sideComponents/Layout";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; // Heroicons
import ConfirmationModal from "../../../utils/ConfirmationModal";
import Pagination from "../../../utils/Pagination";

const ProductDetailsShop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setproductToDelete] = useState(null); // User to delete
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [productsPerPage] = useState(5); // Number of users per page

  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/inventory/product",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
          showNotification(response.data.message,"success");
        }
      } catch (error) {
        console.error(error.response?.data?.data || error.message);
        showNotification(
          error.response?.data?.message ||
            "Failed to fetch products. Please try again.",
          "error"
        );
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const confirmDelete = (userId) => {
    setproductToDelete(userId); // Store the userId to delete
    setShowModal(true); // Show the confirmation modal
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/inventory/product/${productId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response) {
        setProducts(
          products.filter((product) => product.id !== productToDelete)
        );
        setFilteredProducts(
          filteredProducts.filter((product) => product.id !== productToDelete)
        );
        setShowModal(false);
        setproductToDelete(null);
        showNotification("Product deleted successfully", "success");
      }
    } catch (error) {
      showNotification(
        error.response.data.message || "Error in deleting product",
        "error"
      );
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Layout role={"shopOwner"}>

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
            <button
              className="bg-blue-500 text-white px-4 rounded shadow-md hover:bg-blue-600 transition duration-300 h-12 flex items-center"
              onClick={() => navigate("/products/add")}
            >
              Add product
            </button>
          </div>

          {/* Responsive User Display */}
          <div className="block md:hidden">
            {/* Mobile view: Card-based design */}
            {currentProducts.map((product) => (
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
                  </div>
                </div>
              </div>
            ))}
            {currentProducts.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No products found.
              </p>
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
                  {currentProducts.map((product) => (
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
                  {currentProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-gray-500 py-4"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>{" "}


        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this product?"
        />
      </Layout>
    </>
  );
};

export default ProductDetailsShop;
