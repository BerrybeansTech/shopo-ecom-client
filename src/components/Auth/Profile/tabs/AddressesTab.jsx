import React, { useState } from "react";
import { Trash2, Plus, MapPin, Mail, Phone, Globe, MapPinned } from "lucide-react";

export default function AddressesTab() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Shuvo Khan",
      email: "rafiqulislamsuvobd@gmail.com",
      phone: "01792166627",
      country: "Bangladesh",
      state: "Barishal",
      city: "Banaripara",
    },
    {
      id: 2,
      name: "Shuvo Khan",
      email: "rafiqulislamsuvobd@gmail.com",
      phone: "01792166627",
      country: "Bangladesh",
      state: "Barishal",
      city: "Banaripara",
    },
  ]);
  const [defaultAddressId, setDefaultAddressId] = useState(1); // Default to first address
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
  });
  const [error, setError] = useState("");

  const openEditPopup = (address) => {
    setEditAddress(address);
    setFormData({ ...address });
    setIsPopupOpen(true);
    setError("");
  };

  const openAddPopup = () => {
    setEditAddress(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
    });
    setIsPopupOpen(true);
    setError("");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditAddress(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.country || !formData.state || !formData.city) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editAddress.id ? { ...formData, id: addr.id } : addr
        )
      );
    } else {
      // Add new address
      const newId = addresses.length + 1;
      setAddresses((prev) => [
        ...prev,
        { ...formData, id: newId },
      ]);
      // Set new address as default if it's the first address
      if (addresses.length === 0) {
        setDefaultAddressId(newId);
      }
    }
    closePopup();
  };

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      // If the deleted address was the default, set the first remaining address as default
      if (defaultAddressId === addressId && addresses.length > 1) {
        setDefaultAddressId(addresses.find((addr) => addr.id !== addressId).id);
      }
    }
  };

  const handleSetDefault = (addressId) => {
    setDefaultAddressId(addressId);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-qblack mb-1">Saved Addresses</h2>
        <p className="text-qgray text-sm">Manage your delivery addresses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {addresses.map((address, index) => (
          <div
            key={address.id}
            className="bg-white rounded-lg border border-qgray-border hover:border-qyellow transition-all duration-300 overflow-hidden group"
          >
            <div className="bg-gradient-to-r from-primarygray to-white p-4 border-b border-qgray-border">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-qyellow/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-qyellow" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-qblack">Address #{index + 1}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="w-8 h-8 rounded-full border border-qgray-border bg-white hover:bg-qred hover:border-qred flex items-center justify-center transition-all duration-300 group/delete"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4 text-qgray group-hover/delete:text-white transition-colors" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-qyellow"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-qgraytwo font-medium mb-0.5">Full Name</p>
                  <p className="text-sm text-qblack font-semibold">{address.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-qgray" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-qgraytwo font-medium mb-0.5">Email Address</p>
                  <p className="text-sm text-qblack font-medium truncate">{address.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-qgray" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-qgraytwo font-medium mb-0.5">Phone Number</p>
                  <p className="text-sm text-qblack font-medium">{address.phone}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-qgray-border">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPinned className="w-4 h-4 text-qgray" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-qgraytwo font-medium mb-0.5">Location</p>
                    <p className="text-sm text-qblack font-medium">
                      {address.city}, {address.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-qgray" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-qgraytwo font-medium mb-0.5">Country</p>
                    <p className="text-sm text-qblack font-medium">{address.country}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditPopup(address)}
                  className="flex-1 py-2 px-3 border border-qgray-border rounded-lg text-sm font-medium text-qblack hover:bg-primarygray transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleSetDefault(address.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold text-qblack transition-all ${
                    address.id === defaultAddressId
                      ? "bg-qgray hover:bg-opacity-90"
                      : "bg-qyellow hover:bg-opacity-90"
                  }`}
                >
                  {address.id === defaultAddressId ? "Default" : "Set Default"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={openAddPopup}
        className="inline-flex items-center gap-2 px-4 py-2 bg-qyellow rounded-lg text-sm font-semibold text-qblack hover:bg-opacity-90 hover:shadow-lg transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
        Add New Address
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-qblack mb-4">
              {editAddress ? "Edit Address" : "Add New Address"}
            </h3>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-qgraytwo mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-qgray-border rounded-lg focus:ring-2 focus:ring-qyellow focus:border-qyellow outline-none text-sm text-qblack"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-qgraytwo mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-qgray-border rounded-lg focus:ring-2 focus:ring-qyellow focus:border-qyellow outline-none text-sm text-qblack"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-qgraytwo mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-qgray-border rounded-lg focus:ring-2 focus:ring-qyellow focus:border-qyellow outline-none text-sm text-qblack"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-qgraytwo mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-qgray-border rounded-lg focus:ring-2 focus:ring-qyellow focus:border-qyellow outline-none text-sm text-qblack"
                  placeholder="Enter country"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-qgraytwo mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-qgray-border rounded-lg focus:ring-2 focus:ring-qyellow focus:border-qyellow outline-none text-sm text-qblack"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-qgraytwo mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-qgray-border rounded-lg focus:ring-2 focus:ring-qyellow focus:border-qyellow outline-none text-sm text-qblack"
                  placeholder="Enter city"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2 px-3 bg-qyellow rounded-lg text-sm font-semibold text-qblack hover:bg-opacity-90 transition-all"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="flex-1 py-2 px-3 border border-qgray-border rounded-lg text-sm font-medium text-qblack hover:bg-primarygray transition-all"
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