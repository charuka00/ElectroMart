import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, deliveryDetails } = location.state || { cartItems: [], deliveryDetails: {} };

  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!cartItems.length || !deliveryDetails._id) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-6">Error</h1>
          <p className="text-red-600">
            Invalid cart or delivery details. Please start from the cart page.
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const validateNameOnCard = (value) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!value) return 'Name on card is required';
    if (!nameRegex.test(value)) return 'Name on card can only contain letters and spaces';
    return '';
  };

  const validateCardNumber = (value) => {
    const cleanedValue = value.replace(/\s/g, '');
    const numberRegex = /^\d+$/;
    if (!cleanedValue) return 'Card number is required';
    if (!numberRegex.test(cleanedValue)) return 'Card number can only contain numbers';
    if (cleanedValue.length !== 16) return 'Card number must be exactly 16 digits';
    return '';
  };

  const validateExpiryDate = (value) => {
    if (!value) return 'Expiry date is required';
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(value)) return 'Expiry date must be in MM/YY format';

    const [month, year] = value.split('/').map(Number);
    const fullYear = 2000 + year;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
      return 'Expiry date cannot be in the past';
    }
    return '';
  };

  const validateCvc = (value) => {
    const cvcRegex = /^\d+$/;
    if (!value) return 'CVC is required';
    if (!cvcRegex.test(value)) return 'CVC can only contain numbers';
    if (value.length !== 3) return 'CVC must be exactly 3 digits';
    return '';
  };

  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < cleanedValue.length; i += 4) {
      parts.push(cleanedValue.slice(i, i + 4));
    }
    return parts.join(' ').slice(0, 19);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    }

    setFormData({ ...formData, [name]: formattedValue });

    let error = '';
    switch (name) {
      case 'nameOnCard':
        error = validateNameOnCard(value);
        break;
      case 'cardNumber':
        error = validateCardNumber(formattedValue);
        break;
      case 'expiryDate':
        error = validateExpiryDate(value);
        break;
      case 'cvc':
        error = validateCvc(value);
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {
      nameOnCard: validateNameOnCard(formData.nameOnCard),
      cardNumber: validateCardNumber(formData.cardNumber),
      expiryDate: validateExpiryDate(formData.expiryDate),
      cvc: validateCvc(formData.cvc),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userId = '12345'; // Replace with actual user ID from auth context in a real app
      const paymentData = {
        userId,
        orderId: deliveryDetails._id,
        nameOnCard: formData.nameOnCard,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvc: formData.cvc,
        amount: parseFloat(calculateTotal()),
      };

      console.log('Sending payment data:', paymentData);

      const paymentResponse = await axios.post('http://localhost:5000/api/payment', paymentData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Payment response:', paymentResponse.data);

      // Show popup message
      const confirmNavigation = window.confirm('Payment Successful! Click OK to view your order.');
      if (confirmNavigation) {
        setFormData({ nameOnCard: '', cardNumber: '', expiryDate: '', cvc: '' });
        navigate('/order', {
          state: { cartItems, deliveryDetails, paymentDetails: paymentResponse.data },
        });
      }
    } catch (error) {
      console.error('Full error response:', error.response);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while processing your payment.';
      const errorDetails = error.response?.data?.details || '';
      setErrors({ api: `${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Details</h1>

        {errors.api && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{errors.api}</div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-xl font-bold text-purple-600">${calculateTotal()}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name on Card</label>
            <input
              type="text"
              name="nameOnCard"
              value={formData.nameOnCard}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.nameOnCard ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
              }`}
              disabled={loading}
            />
            {errors.nameOnCard && (
              <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
              }`}
              maxLength="19"
              disabled={loading}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  maxLength="5"
                  disabled={loading}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">CVC</label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  placeholder="123"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.cvc ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  maxLength="3"
                  disabled={loading}
                />
                {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition duration-300 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;