import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../sideBar/Layout";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; // Heroicons
import ErrorCard from "../cards/ErrorCard";

const ProductDetailsStaff = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/inventory/product/staff",
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

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = products.filter(

      (product) =>
        product.productName
      .toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/product/${productId}`,
        {
          
            headers: {
              Authorization: `${token}`,
            },
          
        }
      );
      setProducts(products.filter((product) => product.id !== productId));
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <>
      <Layout role={"staff"}>
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
            <button
              className="bg-blue-500 text-white px-4 rounded shadow-md hover:bg-blue-600 transition duration-300 h-12 flex items-center"
              onClick={() => navigate("/staff/products/add")}
            >
              +
            </button>
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
                      onClick={() => handleDelete(product.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
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
                          onClick={() => handleDelete(product.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
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
      </Layout>
    </>
  );
};

export default ProductDetailsStaff;
