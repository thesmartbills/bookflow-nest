export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isValidCurrency(value: string): boolean {
  return /^[A-Z]{3}$/.test(value);
}

export function isValidTimezone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', {
      timeZone: value,
    });

    return true;
  } catch {
    return false;
  }
}

export function isValidMinorAmount(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidDateRange(startAt: Date, endAt: Date): boolean {
  return (
    startAt instanceof Date &&
    endAt instanceof Date &&
    !Number.isNaN(startAt.getTime()) &&
    !Number.isNaN(endAt.getTime()) &&
    endAt > startAt
  );
}
