import Layout from "../sideComponents/Layout";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// Sample data for charts
const barData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales (₹)",
      data: [12000, 15000, 18000, 20000, 22000, 25000],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "User Growth",
      data: [500, 700, 1200, 1500, 2100, 3000],
      fill: false,
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.2,
    },
  ],
};
const StaffDashboard = () => {
    return (
        <Layout role="staff">
<div className="p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-700">Total Sales</h2>
            <p className="text-2xl font-semibold text-blue-500">₹1,20,000</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-700">New Users</h2>
            <p className="text-2xl font-semibold text-green-500">1,200</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-700">Active Users</h2>
            <p className="text-2xl font-semibold text-yellow-500">3,000</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-700">Orders</h2>
            <p className="text-2xl font-semibold text-red-500">2,500</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Monthly Sales</h2>
            <Bar data={barData} />
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">User Growth</h2>
            <Line data={lineData} />
          </div>
        </div>
      </div>          
        </Layout>
    );
};

export default StaffDashboard;
