/**
 * Formats a raw phone string into Latvian telephone format (+371 XXXXXXXX)
 */
export function formatLatvianPhoneNumber(value: string): string {
  // If user clears the input completely, let it clear
  if (!value) return '';

  // Extract all digits
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 0) {
    return value.startsWith('+') ? '+' : '';
  }

  let localDigits = cleaned;

  // If starts with Latvia country code 371
  if (cleaned.startsWith('371')) {
    localDigits = cleaned.slice(3);
  }

  // Cap at 8 digits (Latvian mobile/landline numbers have 8 digits)
  localDigits = localDigits.slice(0, 8);

  if (localDigits.length === 0) {
    return '+371 ';
  }

  if (localDigits.length <= 4) {
    return `+371 ${localDigits}`;
  }

  return `+371 ${localDigits.slice(0, 4)} ${localDigits.slice(4)}`;
}

/**
 * Validates whether the telephone number contains a valid 8-digit Latvian format
 */
export function isValidLatvianPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('371')) {
    return digits.length === 11; // 371 + 8 digits
  }
  return digits.length === 8;
}
