import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] }; // Fallback to empty array if no state

  // Add status to each item (in a real app, this would come from a backend)
  const [orders, setOrders] = useState(
    cartItems.map((item) => ({
      ...item,
      status: 'Pending', // Default status is "Pending"
    }))
  );

  // Calculate total price
  const calculateTotal = () => {
    return orders.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Handle order cancellation
  const handleCancelOrder = (id) => {
    setOrders(orders.filter((item) => item.id !== id));
    // In a real app, you would send a request to the backend to cancel the order
    console.log(`Order with ID ${id} has been canceled.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Order Confirmation</h1>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No order details found.</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Table for Orders */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-4">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Subtotal</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">${item.price.toFixed(2)}</td>
                      <td className="p-4">{item.quantity}</td>
                      <td className="p-4">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded ${
                            item.status === 'Pending'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-green-200 text-green-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleCancelOrder(item.id)}
                          disabled={item.status === 'Approved'}
                          className={`px-3 py-1 rounded ${
                            item.status === 'Approved'
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Price */}
            <div className="mt-6 flex justify-end">
              <div className="text-right">
                <p className="text-xl font-semibold">Total: ${calculateTotal()}</p>
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;