import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/delivery');
      setDeliveries(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching delivery details');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await axios.delete(`http://localhost:5000/api/delivery/${id}`);
        setDeliveries(deliveries.filter(delivery => delivery._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting delivery');
      }
    }
  };

  const handleEdit = (delivery) => {
    setEditingId(delivery._id);
    setEditForm({
      firstName: delivery.firstName,
      lastName: delivery.lastName,
      streetAddress: delivery.streetAddress,
      streetAddress2: delivery.streetAddress2 || '',
      city: delivery.city,
      postalCode: delivery.postalCode,
      contactNumber: delivery.contactNumber,
      email: delivery.email
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/delivery/${id}`, editForm);
      setDeliveries(deliveries.map(delivery => 
        delivery._id === id ? response.data : delivery
      ));
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating delivery');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    `${delivery.firstName} ${delivery.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.contactNumber.includes(searchTerm)
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Delivery Management</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md mx-auto block p-2 border rounded-lg"
        />
      </div>

      {filteredDeliveries.length === 0 ? (
        <p className="text-center text-gray-600">No delivery records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border-b">User ID</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Address</th>
                <th className="py-3 px-4 border-b">City</th>
                <th className="py-3 px-4 border-b">Postal Code</th>
                <th className="py-3 px-4 border-b">Contact</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Created At</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery._id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">{delivery.userId}</td>
                  <td className="py-3 px-4 border-b">
                    {editingId === delivery._id ? (
                      <div className="flex gap-2">
                        <input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="p-1 border rounded"
                          placeholder="First Name"
                        />
                        <input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="p-1 border rounded"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      `${delivery.firstName} ${delivery.lastName}`
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {editingId === delivery._id ? (
                      <>
                        <input
                          value={editForm.streetAddress}
                          onChange={(e) => setEditForm({ ...editForm, streetAddress: e.target.value })}
                          className="p-1 border rounded mb-1 w-full"
                          placeholder="Street Address"
                        />
                        <input
                          value={editForm.streetAddress2}
                          onChange={(e) => setEditForm({ ...editForm, streetAddress2: e.target.value })}
                          className="p-1 border rounded w-full"
                          placeholder="Street Address 2"
                        />
                      </>
                    ) : (
                      `${delivery.streetAddress}${delivery.streetAddress2 ? `, ${delivery.streetAddress2}` : ''}`
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {editingId === delivery._id ? (
                      <input
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="p-1 border rounded w-full"
                        placeholder="City"
                      />
                    ) : (
                      delivery.city
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {editingId === delivery._id ? (
                      <input
                        value={editForm.postalCode}
                        onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                        className="p-1 border rounded w-full"
                        placeholder="Postal Code"
                      />
                    ) : (
                      delivery.postalCode
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {editingId === delivery._id ? (
                      <input
                        value={editForm.contactNumber}
                        onChange={(e) => setEditForm({ ...editForm, contactNumber: e.target.value })}
                        className="p-1 border rounded w-full"
                        placeholder="Contact Number"
                      />
                    ) : (
                      delivery.contactNumber
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {editingId === delivery._id ? (
                      <input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="p-1 border rounded w-full"
                        placeholder="Email"
                      />
                    ) : (
                      delivery.email
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(delivery.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {editingId === delivery._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(delivery._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(delivery)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(delivery._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;