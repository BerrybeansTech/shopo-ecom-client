// components/Profile/AddressesTab.js
import React, { useState, useEffect } from "react";
import { Trash2, Plus, MapPin, Phone, Globe, MapPinned, Check, Edit2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    type: "billing"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, updateProfile, accessToken } = useAuth();

  // Convert customer profile to addresses format (prevent duplicates)
  const customerToAddresses = (customer) => {
    if (!customer) return [];
    
    const addressMap = new Map();

    // Additional addresses stored in remarks
    if (customer.remarks) {
      try {
        const additionalAddresses = JSON.parse(customer.remarks);
        if (Array.isArray(additionalAddresses)) {
          additionalAddresses.forEach((addr) => {
            const addressId = addr.id || `addr_${Date.now()}_${Math.random()}`;
            if (!addressMap.has(addressId) ) {
              addressMap.set(addressId, {
                ...addr,
                id: addressId,
                isDefault: addr.isDefault || false
              });
            }
          });
        }
      } catch (e) {
        console.error('Error parsing remarks:', e);
      }
    }

    return Array.from(addressMap.values());
  };

  // Load addresses from user profile
  useEffect(() => {
    if (user) {
      const userAddresses = customerToAddresses(user);
      setAddresses(userAddresses);
    }
  }, [user]);

  const openEditPopup = (address) => {
    setEditAddress(address);
    setFormData({ 
      name: address.name || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      type: address.type || "billing"
    });
    setIsPopupOpen(true);
    setError("");
  };

  const openAddPopup = () => {
    setEditAddress(null);
    setFormData({
      name: "",
      fullName: user?.name || "",
      phone: user?.phone || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      type: "billing"
    });
    setIsPopupOpen(true);
    setError("");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditAddress(null);
    setFormData({
      name: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      type: "billing"
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      setError("All fields marked with * are required.");
      return false;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }
    return true;
  };

  // Save address with proper duplicate prevention
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const currentAddresses = customerToAddresses(user);
      let updatedAddresses;
      let shouldUpdateProfile = false;

      if (editAddress) {
        // Update existing address
        updatedAddresses = currentAddresses.map(addr =>
          addr.id === editAddress.id 
            ? { ...formData, id: editAddress.id, isDefault: addr.isDefault }
            : addr
        );
        shouldUpdateProfile = true;
      } else {
        // Check for duplicates before adding
        const isDuplicate = currentAddresses.some(addr => 
          addr.address.toLowerCase().trim() === formData.address.toLowerCase().trim() &&
          addr.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
          addr.pincode === formData.pincode
        );

        if (isDuplicate) {
          setError('This address already exists');
          setLoading(false);
          return;
        }

        // Add new address with unique ID
        const newAddress = {
          ...formData,
          id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          isDefault: currentAddresses.length === 0 // First address is default
        };
        updatedAddresses = [...currentAddresses, newAddress];
        shouldUpdateProfile = true;
      }

      if (!shouldUpdateProfile) {
        setLoading(false);
        return;
      }

      // Get default address for main profile fields
      const defaultAddress = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
      
      // Store only non-main addresses in remarks
      const additionalAddresses = updatedAddresses.filter(addr => addr.id );

      const updatedCustomer = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: defaultAddress.address,
        city: defaultAddress.city,
        state: defaultAddress.state,
        country: defaultAddress.country,
        postalCode: defaultAddress.pincode,
        remarks: additionalAddresses.length > 0 ? JSON.stringify(additionalAddresses) : null
      };

      console.log('Saving address - Single API call:', updatedCustomer);
      const result = await updateProfile(updatedCustomer, accessToken);
      
      if (result.success) {
        closePopup();
      } else {
        setError(result.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Save address error:', error);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setLoading(true);
    setError("");

    try {
      const currentAddresses = customerToAddresses(user);
      const addressToDelete = currentAddresses.find(addr => addr.id === addressId);
      const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);
      
      if (updatedAddresses.length === 0) {
        // No addresses left
        const updatedCustomer = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          remarks: null
        };

        await updateProfile(updatedCustomer, accessToken);
      } else {
        // If deleting default address, set first remaining as default
        let newDefaultId = null;
        if (addressToDelete?.isDefault) {
          newDefaultId = updatedAddresses[0].id;
          updatedAddresses[0].isDefault = true;
        }

        const defaultAddress = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
        const additionalAddresses = updatedAddresses.filter(addr => addr.id );

        const updatedCustomer = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          country: defaultAddress.country,
          postalCode: defaultAddress.pincode,
          remarks: additionalAddresses.length > 0 ? JSON.stringify(additionalAddresses) : null
        };

        await updateProfile(updatedCustomer, accessToken);
      }
    } catch (error) {
      console.error('Delete address error:', error);
      setError('Failed to delete address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    setLoading(true);
    setError("");

    try {
      const currentAddresses = customerToAddresses(user);
      const selectedAddress = currentAddresses.find(addr => addr.id === addressId);
      
      if (!selectedAddress) {
        setError('Address not found');
        setLoading(false);
        return;
      }

      // Update isDefault flags - only selected address is default
      const updatedAddresses = currentAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));

      // Update main profile with new default address
      const additionalAddresses = updatedAddresses.filter(addr => addr.id );

      const updatedCustomer = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        postalCode: selectedAddress.pincode,
        remarks: additionalAddresses.length > 0 ? JSON.stringify(additionalAddresses) : null
      };

      console.log('Setting default address - Single API call:', updatedCustomer);
      const result = await updateProfile(updatedCustomer, accessToken);
      
      if (!result.success) {
        setError(result.error || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Set default address error:', error);
      setError('Failed to set default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black-900 mb-1">Saved Addresses</h2>
        <p className="text-black-50 text-sm">Manage your delivery addresses</p>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white-50 p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black-900 mx-auto"></div>
            <p className="text-sm text-black-50 mt-2">Processing...</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white-50 rounded-lg border border-white-700 hover:border-black-100 transition-all duration-300 overflow-hidden group"
          >
            <div className="bg-white-200 p-4 border-b border-white-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white-400 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-black-100" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-black-900">{address.name}</h3>
                    {address.isDefault && (
                      <span className="text-xs px-2 py-0.5 rounded bg-black-900 text-white-50">
                        Default Address
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="w-8 h-8 rounded-full border border-white-700 bg-white-50 hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4 text-black-50 group-hover:text-white-50 transition-colors" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-black-50"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-black-50 font-medium mb-1">Full Name *</p>
                  <p className="text-sm text-black-900 font-semibold">{address.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-black-100" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-black-50 font-medium mb-1">Phone Number *</p>
                  <p className="text-sm text-black-900 font-medium">{address.phone}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white-700">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-white-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPinned className="w-4 h-4 text-black-100" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-black-50 font-medium mb-1">Address *</p>
                    <p className="text-sm text-black-900 font-medium">
                      {address.address}, {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-black-100" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-black-50 font-medium mb-1">Country</p>
                    <p className="text-sm text-black-900 font-medium">{address.country}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditPopup(address)}
                  className="flex-1 py-2 px-3 border border-white-700 rounded-lg text-sm font-medium text-black-100 hover:bg-white-300 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleSetDefault(address.id)}
                  disabled={address.isDefault}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                    address.isDefault
                      ? "bg-white-500 text-black-50 cursor-not-allowed"
                      : "bg-black-900 hover:bg-black-200 text-white-50"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {address.isDefault ? "Default" : "Set Default"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-white-700 rounded-lg mb-6">
          <MapPin className="w-12 h-12 text-black-50 mx-auto mb-3" />
          <p className="text-black-50 mb-4">No addresses saved yet</p>
        </div>
      )}

      <button
        type="button"
        onClick={openAddPopup}
        className="inline-flex items-center gap-2 px-4 py-2 bg-black-900 text-white-50 rounded-lg text-sm font-semibold hover:bg-black-200 transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
        Add New Address
      </button>

      {/* Add/Edit Address Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white-50 rounded-lg p-6 w-full max-w-md mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-black-900 mb-4">
              {editAddress ? "Edit Address" : "Add New Address"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black-100 mb-1">
                  Address Name <span className="text-black-50">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
                  placeholder="e.g., Home, Office"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-100 mb-1">
                  Address Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
                >
                  <option value="billing">Billing</option>
                  <option value="shipping">Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black-100 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-100 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-100 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900 resize-none"
                  placeholder="House No, Building, Street, Area"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-black-100 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black-100 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-black-100 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
                    placeholder="6-digit pincode"
                    maxLength="6"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black-100 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 border border-white-700 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none text-sm text-black-900"
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
                className="flex-1 py-2 px-3 bg-black-900 text-white-50 rounded-lg text-sm font-semibold hover:bg-black-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="flex-1 py-2 px-3 border border-white-700 rounded-lg text-sm font-medium text-black-100 hover:bg-white-300 transition-all"
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