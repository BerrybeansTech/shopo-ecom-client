import React, { useState } from "react";
import { Trash2, Plus, MapPin, Mail, Phone, Globe, MapPinned } from "lucide-react";

export default function AddressesTab() {
  const [addresses] = useState([
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

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-qblack mb-2">Saved Addresses</h2>
        <p className="text-qgray text-sm">Manage your delivery addresses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {addresses.map((address, index) => (
          <div
            key={address.id}
            className="bg-white rounded-lg border border-qgray-border hover:border-qyellow transition-all duration-300 overflow-hidden group"
          >
            <div className="bg-gradient-to-r from-primarygray to-white p-6 border-b border-qgray-border">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-qyellow/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-qyellow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-qblack">Address #{index + 1}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border border-qgray-border bg-white hover:bg-qred hover:border-qred flex items-center justify-center transition-all duration-300 group/delete"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4 text-qgray group-hover/delete:text-white transition-colors" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-qyellow"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-qgraytwo font-medium mb-1">Full Name</p>
                  <p className="text-base text-qblack font-semibold">{address.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-qgray" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-qgraytwo font-medium mb-1">Email Address</p>
                  <p className="text-sm text-qblack font-medium truncate">{address.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-qgray" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-qgraytwo font-medium mb-1">Phone Number</p>
                  <p className="text-sm text-qblack font-medium">{address.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-qgray-border">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPinned className="w-4 h-4 text-qgray" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-qgraytwo font-medium mb-1">Location</p>
                    <p className="text-sm text-qblack font-medium">
                      {address.city}, {address.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primarygray flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-qgray" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-qgraytwo font-medium mb-1">Country</p>
                    <p className="text-sm text-qblack font-medium">{address.country}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-4 border border-qgray-border rounded-lg text-sm font-medium text-qblack hover:bg-primarygray transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-qblack transition-all ${
                    index === 1 ? "bg-qyellow hover:bg-opacity-90" : "bg-qgray hover:bg-opacity-90"
                  }`}
                >
                  Set Default
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 px-6 py-3 bg-qyellow rounded-lg text-base font-semibold text-qblack hover:bg-opacity-90 hover:shadow-lg transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
        Add New Address
      </button>
    </div>
  );
}