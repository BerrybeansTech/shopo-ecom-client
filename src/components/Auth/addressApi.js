import { apiService } from '../../services/apiservice';

/**
 * Address API Service
 * Handles all address-related API calls for customer address management
 */
export const addressApi = {
    /**
     * Get all addresses for the logged-in customer
     * @returns {Promise} Response with array of addresses and pagination
     */
    getAllAddresses: async () => {
        try {
            const customerId = apiService.getCurrentUserId();
            if (!customerId) {
                console.warn('No customer ID found in storage');
            }
            const response = await apiService.apiCall(`/customer/get-all-address?customerId=${customerId || ''}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Get all addresses API error:', error);
            throw error;
        }
    },

    /**
     * Get a specific address by ID
     * @param {number} addressId - The ID of the address to fetch
     * @returns {Promise} Response with address details
     */
    getAddressById: async (addressId) => {
        try {
            const response = await apiService.apiCall(`/customer/get-address/${addressId}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Get address by ID API error:', error);
            throw error;
        }
    },

    /**
     * Create a new address
     * @param {Object} addressData - Address data
     * @param {string} addressData.customerId - Customer ID
     * @param {string} addressData.address - Street address
     * @param {string} addressData.city - City
     * @param {string} addressData.state - State
     * @param {string} addressData.country - Country
     * @param {string} addressData.postalCode - Postal code
     * @returns {Promise} Response with created address
     */
    createAddress: async (addressData) => {
        try {
            console.log('Creating address:', addressData);
            const response = await apiService.apiCall('/customer/create-address', {
                method: 'POST',
                body: addressData,
            });
            console.log('Create address response:', response);
            return response;
        } catch (error) {
            console.error('Create address API error:', error);
            throw error;
        }
    },

    /**
     * Update an existing address
     * @param {Object} addressData - Address data with ID
     * @param {number} addressData.id - Address ID
     * @param {string} addressData.address - Street address
     * @param {string} addressData.city - City
     * @param {string} addressData.state - State
     * @param {string} addressData.country - Country
     * @param {string} addressData.postalCode - Postal code
     * @returns {Promise} Response confirming update
     */
    updateAddress: async (addressData) => {
        try {
            console.log('Updating address:', addressData);
            const response = await apiService.apiCall('/customer/update-address', {
                method: 'PUT',
                body: addressData,
            });
            console.log('Update address response:', response);
            return response;
        } catch (error) {
            console.error('Update address API error:', error);
            throw error;
        }
    },

    /**
     * Delete an address
     * @param {number} addressId - The ID of the address to delete
     * @returns {Promise} Response confirming deletion
     */
    deleteAddress: async (addressId) => {
        try {
            console.log('Deleting address:', addressId);
            const response = await apiService.apiCall(`/customer/delete-address/${addressId}`, {
                method: 'DELETE',
            });
            console.log('Delete address response:', response);
            return response;
        } catch (error) {
            console.error('Delete address API error:', error);
            throw error;
        }
    },

    /**
     * Set an address as default
     * @param {number} addressId - The ID of the address to set as default
     * @returns {Promise} Response confirming default address set
     */
    setDefaultAddress: async (addressData) => {
        try {
            console.log('Setting default address:', addressData.id);
            const response = await apiService.apiCall('/customer/update-address', {
                method: 'PUT',
                body: addressData,
            });
            console.log('Set default address response:', response);
            return response;
        } catch (error) {
            console.error('Set default address API error:', error);
            throw error;
        }
    },
};
