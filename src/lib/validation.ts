/**
 * Validation utility for checkout form fields.
 * Includes email, phone, credit card (Luhn algorithm), expiry date, and CVV validation.
 */

/**
 * Validates an email address using a standard regex.
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Invalid email format';
};

/**
 * Validates a phone number (basic format).
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  // Matches various formats: +1 (555) 000-0000, 555-000-0000, etc.
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone) ? null : 'Invalid phone number format';
};

/**
 * Validates a credit card number using the Luhn algorithm.
 */
export const validateCreditCard = (cardNumber: string): string | null => {
  if (!cardNumber) return 'Card number is required';
  
  // Remove all non-digit characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return 'Card number must be between 13 and 19 digits';
  }

  // Luhn Algorithm implementation
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (sum % 10 === 0) ? null : 'Invalid credit card number';
};

/**
 * Validates credit card expiry date (MM/YY format).
 */
export const validateExpiryDate = (expiry: string): string | null => {
  if (!expiry) return 'Expiry date is required';
  
  const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  const match = expiry.match(expiryRegex);
  
  if (!match) return 'Use MM/YY format';
  
  const month = parseInt(match[1]);
  const year = parseInt('20' + match[2]);
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return null;
};

/**
 * Validates CVV (3 or 4 digits).
 */
export const validateCVV = (cvv: string): string | null => {
  if (!cvv) return 'CVV is required';
  const cvvRegex = /^[0-9]{3,4}$/;
  return cvvRegex.test(cvv) ? null : 'Invalid CVV (3 or 4 digits)';
};

/**
 * Validates a required string field.
 */
export const validateRequired = (value: string, fieldName: string): string | null => {
  return value.trim() ? null : `${fieldName} is required`;
};

/**
 * Validates ZIP/Postal code (basic check).
 */
export const validateZipCode = (zip: string): string | null => {
  if (!zip) return 'ZIP code is required';
  // Supports US ZIP and basic international formats
  const zipRegex = /^[0-9a-zA-Z\s-]{3,10}$/;
  return zipRegex.test(zip) ? null : 'Invalid ZIP code';
};
