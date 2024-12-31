import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../sideComponents/Layout";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid"; // Heroicons
import ErrorCard from "../../cards/ErrorCard";

const UserDetails = ({ setSelectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [userToDelete, setUserToDelete] = useState(null); // User to delete

  const navigate = useNavigate();

  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    };
    fetchUsers();
  }, []);

  // handle pass a id to add shop component
  const handleAddShop = (userId) => {
    setSelectedUserId(userId); // Store the userId
    navigate("/admin/users/add-shop");
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.role.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  // Handle delete with modal
  const confirmDelete = (userId) => {
    setUserToDelete(userId); // Store the userId to delete
    setShowModal(true); // Show the confirmation modal
  };
  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/${userToDelete}`, {
        headers: {
          Authorization: `${token}`, // Add the token to the headers
        },
      });
      setUsers(users.filter((user) => user.id !== userToDelete));
      setFilteredUsers(
        filteredUsers.filter((user) => user.id !== userToDelete)
      );
      setShowModal(false);
      setUserToDelete(null);
    } catch (error) {
      setErrorMessage(error.response.data.message);
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
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded w-full md:w-1/3"
          />

          <button
            className="bg-blue-500 text-white px-4 rounded shadow-md hover:bg-blue-600 transition duration-300 h-12 flex items-center"
            onClick={() => navigate("/admin/users/add")} // Pass the user.id
          >
            Add user
          </button>
        </div>

        {/* Responsive User Display */}
        <div className="block md:hidden">
          {/* Mobile view: Card-based design */}
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md rounded-md p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-400">Role: {user.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-green-500 hover:text-green-700 transition"
                    onClick={() =>
                      console.log("Edit button clicked for user", user.id)
                    }
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => confirmDelete(user.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  {user.shopId === null && (
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => navigate("/admin/users/add-shop")}
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-4">No users found.</p>
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
                    Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Role
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {user.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center gap-4">
                      <button
                        className="text-green-500 hover:text-green-700 transition"
                        onClick={() =>
                          console.log("Edit button clicked for user", user.id)
                        }
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => confirmDelete(user.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>

                      <button
                        className={`bg-blue-500 text-white px-2 py-1 rounded shadow-md hover:bg-blue-600 transition duration-300 ${
                          user.shopId
                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                            : ""
                        }`}
                        onClick={() => handleAddShop(user.id)}
                      >
                        Add shop
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-4">
                      No users found.
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
              Are you sure you want to delete this user?
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

export default UserDetails;
