import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../sideComponents/Layout";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; // Heroicons
import { useNotification } from "../../cards/NotificationProvider";
import Pagination from "../../../utils/Pagination";

const CategoryDetails = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [productsPerPage] = useState(5); // Number of users per page


  let token = localStorage.getItem("token");
  const { showNotification } = useNotification();

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
        if (response){
          setCategories(response.data.category);
          setFilteredCategories(response.data.category);
          showNotification(response.data.message,"success");

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

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = categories.filter(
      (category) =>
        category.categoryName.toLowerCase().includes(term.toLowerCase()) ||
        category.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/inventory/category/${categoryId}`);
      if(response){
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );
        setFilteredCategories(
          filteredCategories.filter((category) => category.id !== categoryId)
        );
        showNotification(response.data.message,"success");
      }
      
    } catch (error) {
      showNotification( error.response?.data?.message ||
        "Failed to delete the category. Please try again.",
      "error")
    }
  };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentCategories= filteredCategories.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
  
    const totalPages = Math.ceil(filteredCategories.length / productsPerPage);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  

  return (
    <Layout role="shopOwner">
      
      <div className="container mx-auto p-4">
        {/* Search and Add Button */}
        <div className="flex flex-row justify-between items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <button
            className="bg-blue-500 text-white px-4 rounded shadow-md hover:bg-blue-600 transition duration-300 h-12 flex items-center"
            onClick={() => console.log("Add Category button clicked")}
          >
            Add category
          </button>
        </div>

        {/* Responsive Category Display */}
        <div className="block md:hidden">
          {/* Mobile view: Card-based design */}
          {currentCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white shadow-md rounded-md p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    {category.categoryName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {category.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-green-500 hover:text-green-700 transition"
                    onClick={() =>
                      console.log(
                        "Edit button clicked for category",
                        category.id
                      )
                    }
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => handleDelete(category.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {currentCategories.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No categories found.
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
                    Category Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {category.categoryName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {category.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center gap-4">
                      <button
                        className="text-green-500 hover:text-green-700 transition"
                        onClick={() =>
                          console.log(
                            "Edit button clicked for category",
                            category.id
                          )
                        }
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => handleDelete(category.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentCategories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-4">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
    </Layout>
  );
};

export default CategoryDetails;
