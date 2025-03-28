import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaSpinner, FaTruck, FaCheckCircle, FaTrash } from 'react-icons/fa'; // Import icons

const PaymentManagement = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate admin check (in a real app, use AuthContext or a token)
  const isAdmin = true; // Hardcoded for demo; replace with actual auth logic

  useEffect(() => {
    if (!isAdmin) {
      navigate('/'); // Redirect non-admins to home
      return;
    }

    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payment');
        // Initialize each payment with an action state
        const paymentsWithAction = response.data.map((payment) => ({
          ...payment,
          actionState: 'Confirm', // Initial state
        }));
        setPayments(paymentsWithAction);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payment records');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPayments();
  }, [navigate, isAdmin]);

  const handleActionClick = (transactionId) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) => {
        if (payment.transactionId === transactionId) {
          if (payment.actionState === 'Confirm') {
            return { ...payment, actionState: 'Processing' };
          } else if (payment.actionState === 'Processing') {
            return { ...payment, actionState: 'Delivery' };
          } else if (payment.actionState === 'Delivery') {
            return { ...payment, actionState: 'Done' };
          }
          // If actionState is 'Done', no further change
          return payment;
        }
        return payment;
      })
    );
  };

  const handleDeletePayment = (transactionId) => {
    // Confirm deletion with user
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.transactionId !== transactionId)
      );
      console.log(`Deleted payment with Transaction ID: ${transactionId}`);
      // In a real app, add an API call here to delete from the backend
    }
  };

  if (!isAdmin) {
    return null; // Redirect already handled in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Payment Management</h1>

        {payments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No payment records found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Action</th> {/* Fixed typo */}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.transactionId} className="border-b last:border-b-0">
                      <td className="p-4">{payment.userId}</td>
                      <td className="p-4">{payment.orderId}</td>
                      <td className="p-4">${payment.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded ${
                            payment.status === 'Completed'
                              ? 'bg-green-200 text-green-800'
                              : payment.status === 'Pending'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-4">{payment.transactionId}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleActionClick(payment.transactionId)}
                            className={`px-3 py-1 rounded text-white flex items-center justify-center space-x-2 ${
                              payment.actionState === 'Confirm'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : payment.actionState === 'Processing'
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : payment.actionState === 'Delivery'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-600 hover:bg-gray-700' // For 'Done'
                            }`}
                            disabled={payment.actionState === 'Done'} // Disable after "Done"
                          >
                            {payment.actionState === 'Confirm' && <FaCheck />}
                            {payment.actionState === 'Processing' && <FaSpinner />}
                            {payment.actionState === 'Delivery' && <FaTruck />}
                            {payment.actionState === 'Done' && <FaCheckCircle />}
                            <span>{payment.actionState}</span>
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.transactionId)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center space-x-2"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;