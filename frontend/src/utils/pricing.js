/**
 * Generates a deterministic "random" price for a service name.
 * @param {string} serviceName 
 * @returns {number} 
 */
export const getServicePrice = (service) => {
  if (!service) return 1000;
  
  // If service is an object with a price, use it
  if (typeof service === 'object' && service.price !== undefined) {
    return service.price;
  }
  
  // Backward compatibility: If service is a string or object without price, use hash
  const serviceName = typeof service === 'object' ? service.name : service;
  if (!serviceName) return 1000;

  let hash = 0;
  for (let i = 0; i < serviceName.length; i++) {
    hash = serviceName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Price between 500 and 10000, in increments of 100
  const minPrice = 500;
  const maxPrice = 10000;
  const range = maxPrice - minPrice;
  const rawPrice = minPrice + (Math.abs(hash) % (range + 1));
  
  return Math.round(rawPrice / 100) * 100;
};

/**
 * Formats a price in INR.
 * @param {number} price 
 * @returns {string} 
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};
