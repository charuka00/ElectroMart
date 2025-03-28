import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // Demo products list
  const demoProducts = [
    {
      id: 1,
      name: 'Smartphone X12',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', // Smartphone
    },
    {
      id: 2,
      name: 'UltraBook Pro 15',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', // Laptop
    },
    {
      id: 3,
      name: 'Smartwatch Elite',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', // Smartwatch
    },
    {
      id: 4,
      name: 'Gaming Headset RGB',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', // Headset
    },
  ];

  // Cart items state
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Handle quantity update
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/tech-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay to ensure content readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Shopping Cart
        </h1>

        {/* Demo Products Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Add Demo Items to Cart
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {demoProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Items Section */}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">Your cart is empty</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b py-4 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300 transition duration-200"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 text-center border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300 transition duration-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 mt-2 transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Total and Checkout */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${calculateTotal()}
                  </span>
                </div>
                <Link to="/delivery" state={{ cartItems }}>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;