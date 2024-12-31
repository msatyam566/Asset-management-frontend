import { useState } from "react";
import Layout from "../sideComponents/Layout";

const Checkout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 150 },
    { id: 3, name: "Product C", price: 200 },
  ]); // Dummy product data
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  //   const navigate = useNavigate();


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.id.toString().includes(query)
      )
    );
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };



  return (
    <Layout role="staff">

   
    <div className="p-6">
  
    <h1 className="text-2xl font-bold mb-4">Checkout</h1>
  
    <div className="flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-2/3 md:pr-6 mb-6 md:mb-0 h-full">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* Product List */}
        {filteredProducts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Search Results</h2>
            <ul className="border border-gray-300 rounded-lg p-4">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center py-2"
                >
                  <span>
                    {product.name} - ₹{product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
                  >
                    Add to Cart
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Cart Items */}
        <div>
          <h2 className="text-xl font-bold mb-2">Cart</h2>
          {cart.length > 0 ? (
            <ul className="border border-gray-300 rounded-lg p-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <span>{item.name}</span>
                    <span className="ml-4 text-gray-600">
                      ₹{item.price} x {item.quantity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center mr-2"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No products selected</p>
          )}
        </div>
      </div>
  
      {/* Right Section */}
      <div className="w-full md:w-1/3 border border-gray-300 rounded-lg p-4 flex-shrink-0 h-full">
        <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
        <div className="mb-4">
          <p className="text-lg">
            Total Items:{" "}
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </p>
          <p className="text-lg font-bold">Total: ₹{calculateTotal()}</p>
        </div>
        <button
          onClick={() => alert("Checkout completed!")}
          className="bg-blue-500 text-white w-full px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
  </Layout>
  );
};

export default Checkout;
