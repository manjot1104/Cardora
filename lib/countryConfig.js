// Dual Platform Support - India & Canada
// Country-specific configurations

export const countries = {
  india: {
    name: 'India',
    code: 'IN',
    currency: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    phoneCode: '+91',
    dateFormat: 'DD/MM/YYYY',
    paymentMethods: ['upi', 'razorpay', 'stripe', 'bank_transfer'],
    popularEvents: ['Wedding', 'Engagement', 'Anniversary', 'Birthday', 'Festival'],
  },
  canada: {
    name: 'Canada',
    code: 'CA',
    currency: 'CAD',
    symbol: '$',
    flag: '🇨🇦',
    phoneCode: '+1',
    dateFormat: 'MM/DD/YYYY',
    paymentMethods: ['stripe', 'interac', 'paypal', 'bank_transfer'],
    popularEvents: ['Wedding', 'Engagement', 'Anniversary', 'Birthday', 'Corporate'],
  },
};

// Get country by code
export const getCountryByCode = (code) => {
  return Object.values(countries).find((country) => country.code === code) || countries.india;
};

// Detect user country (basic detection)
export const detectUserCountry = () => {
  if (typeof window === 'undefined') return countries.india;
  
  // Try to detect from browser
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language || navigator.userLanguage;
  
  if (timezone.includes('America') || language.includes('en-CA')) {
    return countries.canada;
  }
  
  if (timezone.includes('Asia/Kolkata') || language.includes('hi')) {
    return countries.india;
  }
  
  // Default to India
  return countries.india;
};

// Format currency based on country
export const formatCurrency = (amount, countryCode = 'IN') => {
  const country = getCountryByCode(countryCode);
  return `${country.symbol}${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
};

// Format phone number
export const formatPhoneNumber = (phone, countryCode = 'IN') => {
  const country = getCountryByCode(countryCode);
  if (phone.startsWith(country.phoneCode)) {
    return phone;
  }
  return `${country.phoneCode} ${phone}`;
};




