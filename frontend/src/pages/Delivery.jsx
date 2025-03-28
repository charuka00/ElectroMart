import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Delivery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    postalCode: '',
    contactNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateName = (value, fieldName) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!value) {
      return `${fieldName} is required`;
    }
    if (!nameRegex.test(value)) {
      return `${fieldName} can only contain letters and spaces`;
    }
    return '';
  };

  const validateCity = (value) => {
    const cityRegex = /^[A-Za-z\s]+$/;
    if (!value) {
      return 'City is required';
    }
    if (!cityRegex.test(value)) {
      return 'City can only contain letters and spaces';
    }
    return '';
  };

  const validatePostalCode = (value) => {
    const postalCodeRegex = /^\d+$/;
    if (!value) {
      return 'Postal code is required';
    }
    if (!postalCodeRegex.test(value)) {
      return 'Postal code can only contain numbers';
    }
    if (value.length !== 5) {
      return 'Postal code must be exactly 5 digits';
    }
    return '';
  };

  const validateContactNumber = (value) => {
    const contactNumberRegex = /^\d+$/;
    if (!value) {
      return 'Contact number is required';
    }
    if (!contactNumberRegex.test(value)) {
      return 'Contact number can only contain numbers';
    }
    if (value.length !== 10) {
      return 'Contact number must be exactly 10 digits';
    }
    return '';
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return 'Email is required';
    }
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let error = '';
    switch (name) {
      case 'firstName':
        error = validateName(value, 'First name');
        break;
      case 'lastName':
        error = validateName(value, 'Last name');
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'postalCode':
        error = validatePostalCode(value);
        break;
      case 'contactNumber':
        error = validateContactNumber(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.firstName = validateName(formData.firstName, 'First name');
    newErrors.lastName = validateName(formData.lastName, 'Last name');
    newErrors.streetAddress = formData.streetAddress ? '' : 'Street address is required';
    newErrors.city = validateCity(formData.city);
    newErrors.postalCode = validatePostalCode(formData.postalCode);
    newErrors.contactNumber = validateContactNumber(formData.contactNumber);
    newErrors.email = validateEmail(formData.email);

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
      const userId = '12345'; // This now works since userId is a String in the schema
      const deliveryData = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        streetAddress: formData.streetAddress,
        streetAddress2: formData.streetAddress2,
        city: formData.city,
        postalCode: formData.postalCode,
        contactNumber: formData.contactNumber,
        email: formData.email,
      };

      const response = await axios.post('http://localhost:5000/api/delivery', deliveryData);
      console.log('Delivery details saved:', response.data);

      // Show success message
      alert('Successful!! Your delivery details have been saved.');

      // Navigate to payment page with cartItems and deliveryDetails
      navigate('/payment', {
        state: {
          cartItems,
          deliveryDetails: response.data,
        },
      });
    } catch (error) {
      console.error('Error saving delivery details:', error);
      // Display detailed error message from backend
      const errorMessage = error.response?.data?.message || 'An error occurred';
      const errorDetails = error.response?.data?.details || error.message;
      setErrors({ api: `${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 relative">
      {/* Slideshow Background */}
      <div className="slideshow absolute inset-0 z-0">
        <div className="slideshow-image slide1"></div>
        <div className="slideshow-image slide2"></div>
        <div className="slideshow-image slide3"></div>
        <div className="slideshow-image slide4"></div>
        <div className="slideshow-image slide5"></div>
      </div>
      {/* Overlay to ensure form readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      {/* Form Container */}
      <div className="relative bg-white bg-opacity-90 rounded-lg shadow-2xl p-8 w-full max-w-lg transform transition-all duration-300 hover:shadow-3xl z-20">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Delivery Details</h1>

        {errors.api && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.firstName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  disabled={loading}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.lastName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  disabled={loading}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <div>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Street Address"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 mb-3 ${
                  errors.streetAddress ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                }`}
                disabled={loading}
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
              )}
            </div>
            <input
              type="text"
              name="streetAddress2"
              value={formData.streetAddress2}
              onChange={handleChange}
              placeholder="Street Address Line 2"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
              disabled={loading}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  disabled={loading}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.postalCode ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  maxLength="5"
                  disabled={loading}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Contact Information</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.contactNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  maxLength="10"
                  disabled={loading}
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
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
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>

      {/* Updated CSS for Slideshow */}
      <style>{`
        .slideshow {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
          overflow: hidden;
        }

        .slideshow-image {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          animation: imageFade 25s infinite;
        }

        .slideshow-image.slide1 {
          background-image: url('https://images.unsplash.com/photo-1633185039987-1b7e5f7b7f7f'); /* Circuit board */
          animation-delay: 0s;
        }

        .slideshow-image.slide2 {
          background-image: url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3'); /* Laptop on desk */
          animation-delay: 5s;
        }

        .slideshow-image.slide3 {
          background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c'); /* LED lights */
          animation-delay: 10s;
        }

        .slideshow-image.slide4 {
          background-image: url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'); /* Robotic arm */
          animation-delay: 15s;
        }

        .slideshow-image.slide5 {
          background-image: url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b'); /* Digital screen with code */
          animation-delay: 20s;
        }

        @keyframes imageFade {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          20% {
            opacity: 1;
          }
          30% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Delivery;