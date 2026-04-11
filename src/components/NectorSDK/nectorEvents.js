import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

export const trackNectorEvent = async (customerId, eventName, properties = {}) => {
  // If platform is set, we must prefix the customer_id to match the SDK's identification
  const prefix = NECTOR_PLATFORM ? `${NECTOR_PLATFORM}-` : '';
  const finalCustomerId = (NECTOR_PLATFORM && customerId && !customerId.toString().startsWith(prefix))
    ? `${prefix}${customerId}`
    : customerId;

  console.log(`Nector: Tracking event "${eventName}" for customer "${finalCustomerId}"`, properties);

  try {
    const response = await fetch("https://api.nector.io/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": NECTOR_API_KEY
      },
      body: JSON.stringify({
        customer_id: finalCustomerId,
        event: eventName,
        properties: properties
      })
    });

    const data = await response.json();
    console.log(`Nector: Event tracking response for "${eventName}":`, data);
    return data;
  } catch (error) {
    console.error(`Nector event tracking error [${eventName}]:`, error);
    return null;
  }
};
