import Sidebar from './SideBar';
import Navbar from './Navbar';

const Layout = ({ children, role }) => {
    return (
        <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />
  
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar role={role} />
  
          {/* Main Content */}
          <div className="flex-1 p-6 bg-gray-100">{children}</div>
        </div>
            
        </div>
    );
};

export default Layout;
