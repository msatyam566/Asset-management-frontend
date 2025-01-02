import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../sideComponents/Layout";
import { useNotification } from "../../cards/NotificationProvider";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid"; // Heroicons
import Pagination from "../../../utils/Pagination";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import UpdateModal from "../../../utils/UpdateModal";

const UserDetails = ({ setSelectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [userToDelete, setUserToDelete] = useState(null); // User to delete
  const [userToUpdate, setUserToUpdate] = useState(null); // use for update
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [usersPerPage] = useState(5); // Number of users per page
  const [showupdateModal, setShowupdateModal] = useState(false);

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/", {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
          showNotification(response.data.message || "Users fetched success","success");
        }
      } catch (error) {
        console.log(error);
        console.error(error.response?.data?.data || error.message);
        showNotification(
          error.response?.data?.message ||
            "Failed to fetch users. Please try again.",
          "error"
        );
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
    setCurrentPage(1);
  };
  // Handle delete with modal
  const confirmDelete = (userId) => {
    setUserToDelete(userId); // Store the userId to delete
    setShowModal(true); // Show the confirmation modal
  };
  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/${userToDelete}`,
        {
          headers: {
            Authorization: `${token}`, // Add the token to the headers
          },
        }
      );
      if (response) {
        setUsers(users.filter((user) => user.id !== userToDelete));
        setFilteredUsers(
          filteredUsers.filter((user) => user.id !== userToDelete)
        );
        setShowModal(false);
        setUserToDelete(null);
        showNotification("User deleted successfully", "success");
      }
    } catch (error) {
      showNotification(
        error.response.data.message || "Error in deleting user",
        "error"
      );
    }
  };

  const handleUpdateUser = async (user) => {
    const fieldsToUpdate={
      id:user.id,
      name:user.name,
      email:user.email,
      mobile:user.mobile,
    }
    setUserToUpdate(fieldsToUpdate);
    setShowupdateModal(true);
  };

  // Handle update
  const handleUpdate = async (updatedUser) => {
    try {

      
      const response = await axios.put(
        `http://localhost:5000/api/admin/${updatedUser.id}`, 
        updatedUser, // Send the updated data
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Add the token to the headers
          },
        }
      );
      if (response) {
        // Update users list with updated user data
        setUsers(
          users.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        );
        setFilteredUsers(
          filteredUsers.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        );
        setShowupdateModal(false);
        showNotification("User updated successfully", "success");
      }
    } catch (error) {
      console.log(error);
      showNotification("Failed to update user. Please try again.", "error");
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * usersPerPage;
  const indexOfFirstProduct = indexOfLastProduct - usersPerPage;
  const currentUsers = filteredUsers.length ? filteredUsers.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  ):[];

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout role="admin">
  
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
          {currentUsers.map((user) => (
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
                    onClick={() => handleUpdateUser(user)}
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
          {currentUsers.length === 0 && (
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
                {currentUsers.map((user) => (
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
                        onClick={() => handleUpdateUser(user)}
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
                {currentUsers.length === 0 && (
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

      {/*update modal */}

      <UpdateModal
        showupdateModal={showupdateModal}
        setShowupdateModal={setShowupdateModal}
        onUpdate={handleUpdate}
        data={userToUpdate} // Pass user data to the modal
        title="Update User Information"
      />

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
        message="Are you sure you want to delete this user?"
      />
    </Layout>
  );
};

export default UserDetails;
