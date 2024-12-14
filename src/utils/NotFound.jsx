import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <button
        className="bg-blue-500 text-white px-4 rounded  hover:bg-blue-600 transition duration-300 h-12 flex items-center"
        onClick={()=>navigate("/login")}
      >
        login
      </button>
    </div>
  );
};

export default NotFound;
