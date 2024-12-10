import { useState } from 'react';
import axios from 'axios';
import ErrorCard from "../cards/ErrorCard"; 
import { useNavigate } from "react-router-dom";


const AddShop = ({userId}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    userId:userId,
    name: '',
    role: 'SHOPOWNER', // Default role
  });

  const navigate = useNavigate();


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
            'http://localhost:5000/api/admin/shop',
            formData, // The formData object is the body
            {
              headers: {
                Authorization: `${token}`, // Pass token in Authorization header
              },
            }
          );

          if(response.data){
            navigate("/admin/users")
            console.log('Shop Added:', response.data);
            alert('Shop added successfully!');
          }


   
      setFormData({
        name: '',
        userId:userId,
        role: 'SHOPOWNER', // Reset to default
      });
    } catch (error) {
      setErrorMessage(error.response.data.message)
    }
  };

  return (
      <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
                <ErrorCard message={errorMessage}onClose={() => setErrorMessage("")} position="top-right" />
        <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">Add shop to user</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Shop name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
    

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SHOPOWNER">Shop Owner</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className=" bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
  );
};

export default AddShop;
