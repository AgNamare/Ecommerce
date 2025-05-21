export const generateUniqueId = () => {
  // Generate a unique ID based on the current timestamp and a random number
  return `LGS_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};