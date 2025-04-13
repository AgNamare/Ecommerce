export async function getAccessToken() {
  const consumer_key = process.env.MPESA_CONSUMER_KEY;
  const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
  console.log(btoa(consumer_key + ":" + consumer_secret));
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = "Basic " + btoa(consumer_key + ":" + consumer_secret);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get access token");
    }

    const data = await response.json();
    console.log(data);
    const accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

export const getTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const mockFetch = async (url, options) => {
  // Simulated response data
  const mockResponseData = {
    MerchantRequestID: "12345-67890-12345",
    CheckoutRequestID: "ws_CO_1234567890",
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing",
    CustomerMessage: "Success. Request accepted for processing",
  };

  return {
    ok: true,
    json: async () => mockResponseData,
  };
};

// Function to generate a unique order ID starting with "ord"
export const generateOrderId = () => {
  const timestamp = new Date().toISOString().replace(/\D/g, "").substr(0, 5);
  const random = Math.random().toString(36).substr(2, 5);

  return `ORD${timestamp}${random}`;
};

// Example usage
const orderId = generateOrderId();
console.log(orderId); // Example output: 'ord20240708bhsP5Xz'
