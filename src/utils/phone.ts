/**
 * Formats a raw phone string into Latvian telephone format (+371 XXXX XXXX)
 * while allowing seamless backspace deletion on iOS/Android keyboards.
 */
export function formatLatvianPhoneNumber(value: string, prevValue?: string): string {
  if (!value) return '';

  // Allow smooth clearing when backspacing the "+371 " prefix
  if (
    prevValue !== undefined &&
    value.length < prevValue.length &&
    value.replace(/\D/g, '') === '371' &&
    prevValue.replace(/\D/g, '') === '371'
  ) {
    return '';
  }

  // Fallback clearing check even without prevValue when trailing space is backspaced off "+371 "
  if (value === '+371') {
    return '';
  }

  // Allow user to type "+3", "+37" manually without injecting "+371 " mid-prefix
  if (value === '+' || value === '+3' || value === '+37') {
    return value;
  }

  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 0) {
    return value.startsWith('+') ? '+' : '';
  }

  let localDigits = cleaned;
  if (cleaned.startsWith('371')) {
    localDigits = cleaned.slice(3);
  }

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
