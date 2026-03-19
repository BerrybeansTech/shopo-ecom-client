// components/Profile/AddressesTab.js
import React, { useState, useEffect } from "react";
import { Trash2, Plus, User, MapPin, Phone, Globe, MapPinned, Check, Edit2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { addressApi } from "../../addressApi";

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  const { user } = useAuth();

  // Fetch addresses from API on component mount
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setFetchingAddresses(true);
      setError("");
      const response = await addressApi.getAllAddresses();

      if (response.success && response.data) {
        setAddresses(response.data);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses. Please try again.');
      setAddresses([]);
    } finally {
      setFetchingAddresses(false);
    }
  };

  const openEditPopup = (address) => {
    console.log('Editing address:', address);
    setEditAddress(address);
    setFormData({
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      postalCode: address.postalCode || ""
    });
    setIsPopupOpen(true);
    setError("");
  };

  const openAddPopup = () => {
    console.log('Opening add address popup');
    setEditAddress(null);
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: ""
    });
    setIsPopupOpen(true);
    setError("");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditAddress(null);
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: ""
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }
    if (name === 'postalCode') {
      newValue = value.replace(/\D/g, '').slice(0, 6);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setError("");
    
    // Clear field-specific error
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = "Full Name is required (min 3 chars).";
    }
    
    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!formData.address || formData.address.trim().length < 5) {
      errors.address = "Address is required (min 5 chars).";
    }

    if (!formData.city || !formData.city.trim()) {
      errors.city = "City is required.";
    }

    if (!formData.state || !formData.state.trim()) {
      errors.state = "State is required.";
    }

    if (!formData.postalCode) {
      errors.postalCode = "Postal code is required.";
    } else if (!/^\d{6}$/.test(formData.postalCode)) {
      errors.postalCode = "Enter a valid 6-digit postal code.";
    }

    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted errors.");
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      if (editAddress) {
        // Update existing address
        const updateData = {
          id: editAddress.id,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode
        };

        const response = await addressApi.updateAddress(updateData);

        if (response.success) {
          console.log('Address updated successfully');
          await fetchAddresses(); // Refresh the list
          closePopup();
        } else {
          setError(response.message || 'Failed to update address');
        }
      } else {
        // Create new address
        const createData = {
          customerId: user.id,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          isDefault: addresses.length === 0
        };

        const response = await addressApi.createAddress(createData);

        if (response.success) {
          // If it's the first address, set it as default via a separate update call
          if (createData.isDefault && response.data && response.data.id) {
            try {
              await addressApi.setDefaultAddress({
                ...response.data,
                isDefault: true
              });
            } catch (e) {
              console.error('Failed to auto-set as default:', e);
            }
          }

          console.log('Address created successfully');
          await fetchAddresses(); // Refresh the list
          closePopup();
        }
        else {
          setError(response.message || 'Failed to create address');
        }
      }
    } catch (error) {
      console.error('Save address error:', error);
      setError(error.message || 'Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setLoading(true);
    setError("");

    try {
      const response = await addressApi.deleteAddress(addressId);

      if (response.success) {
        console.log('Address deleted successfully');
        await fetchAddresses(); // Refresh the list
      } else {
        setError(response.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Delete address error:', error);
      setError(error.message || 'Failed to delete address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (address) => {
    setLoading(true);
    setError("");

    try {
      // Create update data with isDefault: true
      const updateData = {
        ...address,
        isDefault: true
      };

      const response = await addressApi.setDefaultAddress(updateData);

      if (response.success) {
        console.log('Default address set successfully');
        await fetchAddresses(); // Refresh the list
      } else {
        setError(response.message || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Set default address error:', error);
      setError(error.message || 'Failed to set default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Saved Addresses</h2>
        <p className="text-gray-600 text-sm">Manage your delivery addresses</p>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Processing...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Fetching Addresses State */}
      {fetchingAddresses ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-3"></div>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden"
              >
                {/* Header with badges */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <h3 className="text-base font-semibold text-gray-900">
                        {address.isDefault ? 'Default Address' : 'Additional Address'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(address.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {address.isDefault && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Main
                      </span>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">
                        Full Name *
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {address.name || address.customer?.name || user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Phone Number *</p>
                      <p className="text-sm text-gray-900">{address.phone || user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPinned className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Address *</p>
                      <p className="text-sm text-gray-900">{address.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">City, State - Pincode</p>
                      <p className="text-sm text-gray-900">
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Country</p>
                      <p className="text-sm text-gray-900">{address.country}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditPopup(address)}
                      className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(address)}
                        className="flex-1 py-2 px-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Set Default
                      </button>
                    )}
                    {address.isDefault && (
                      <button
                        type="button"
                        disabled
                        className="flex-1 py-2 px-3 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {addresses.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-6">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No addresses saved yet</p>
              <p className="text-sm text-gray-500">Add your first address to get started</p>
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={openAddPopup}
        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
        Add New Address
      </button>

      {/* Add/Edit Address Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editAddress ? "Edit Address" : "Add New Address"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm text-gray-900 ${formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Full Name"
                  />
                  {formErrors.name && <p className="text-[10px] text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm text-gray-900 ${formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="10-digit phone"
                    maxLength="10"
                  />
                  {formErrors.phone && <p className="text-[10px] text-red-500 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm text-gray-900 resize-none ${formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="House No, Building, Street, Area"
                />
                {formErrors.address && <p className="text-[10px] text-red-500 mt-1">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm text-gray-900 ${formErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="City"
                  />
                  {formErrors.city && <p className="text-[10px] text-red-500 mt-1">{formErrors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm text-gray-900 ${formErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="State"
                  />
                  {formErrors.state && <p className="text-[10px] text-red-500 mt-1">{formErrors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm text-gray-900 ${formErrors.postalCode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="6-digit postal code"
                    maxLength="6"
                  />
                  {formErrors.postalCode && <p className="text-[10px] text-red-500 mt-1">{formErrors.postalCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-sm text-gray-900"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-2 px-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
