/**
 * Shared Invoice Download Helper
 * Used across OrderDetails, AllOrders, TrackingOrder, ThankYouPopup
 */
import { apiService } from '../services/apiservice';
import { toast } from 'react-toastify';

/**
 * Download a PDF invoice for a given order.
 * Generates the invoice on the server if it doesn't exist yet.
 *
 * @param {Object} order - The order object (must have `id` and optionally `invoiceFile`, `orderId`)
 * @param {Function} [onUpdate] - Optional callback to update local state with new invoiceFile
 * @returns {Promise<boolean>} - true if download succeeded
 */
export const downloadInvoicePDF = async (order, onUpdate) => {
  if (!order?.id) {
    toast.error('Order information is missing.');
    return false;
  }

  try {
    let invoiceFileName = order.invoiceFile;

    // If no invoice exists or it's an old PNG, generate a fresh PDF
    if (!invoiceFileName || invoiceFileName.endsWith('.png')) {
      toast.info('Generating your invoice...');

      const response = await apiService.post('/order/invoices', {
        orderId: order.id
      }, { skipDeduplication: true });

      if (response.success && response.data?.invoiceFile) {
        invoiceFileName = response.data.invoiceFile;
        // Notify parent to update local state
        if (typeof onUpdate === 'function') {
          onUpdate(invoiceFileName);
        }
      } else {
        throw new Error('Failed to generate invoice');
      }
    }

    // Download the invoice PDF
    const downloadPath = `/order/invoices/download/${invoiceFileName}`;
    const extension = invoiceFileName.split('.').pop() || 'pdf';
    const displayId = order.orderId || order.id;
    await apiService.download(downloadPath, `Invoice-${displayId}.${extension}`);
    toast.success('Invoice downloaded successfully!');
    return true;
  } catch (error) {
    console.error('Invoice download error:', error);
    toast.error(error.message || 'Failed to download invoice. Please try again.');
    return false;
  }
};
