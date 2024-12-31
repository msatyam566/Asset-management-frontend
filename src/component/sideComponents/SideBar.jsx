import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {

  const links = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: '📊' },
      { path: '/admin/users', label: 'User Details', icon: '👥' },
      { path: '/admin/products', label: 'Product Details', icon: '📦' },
      { path: '/admin/sales', label: 'Sales Details', icon: '💰' },
      { path: '/admin/invoices', label: 'Invoices', icon: '🧾' },

    ],
    shopOwner: [
      { path: '/shop-owner', label: 'Dashboard', icon: '📊' },
      { path: '/shop-owner/staff', label: 'Staff Details', icon: '👥' },
      { path: '/shop-owner/products', label: 'Product Details', icon: '📦' },
      { path: '/shop-owner/category', label: 'Category Details', icon: '📂' }, 
      { path: '/shop-owner/sales', label: 'Sales Details', icon: '💰' },
      { path: '/shop-owner/invoices', label: 'Invoices', icon: '🧾' },

    ],
    staff: [
      { path: '/staff', label: 'Dashboard', icon: '📊' },
      { path: '/staff/products', label: 'Products', icon: '📦' },
      { path: '/staff/category', label: 'Category Details', icon: '📂' },
      { path: '/checkout', label: 'Checkout', icon: '🛒' }, 
      { path: '/staff/sales', label: 'Sales', icon: '💰' },


    ],
  };


    if (!links[role]) {
    return (
      <div className="bg-gray-800 text-white h-screen p-4">
        <p className="text-center">Invalid Role</p>
      </div>
    );
  }

  return (
<div className="bg-gray-800 text-white min-h-screen p-4 flex flex-col transition-all duration-300 w-16 md:w-64">
      {/* Sidebar Links */}
      <ul className="space-y-5">
        {links[role]?.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="flex items-center text-md text-white py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
            >
              {/* Icon */}
              <span className="text-lg">{link.icon}</span>
              {/* Label hidden on small screens */}
              <span className="ml-4 hidden md:inline">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
