import {
  isValidTime,
  isValidCurrency,
  isValidTimezone,
  isValidMinorAmount,
  isValidSlug,
  isValidEmail,
  isValidDateRange,
} from './schema.validators';

describe('Schema validators', () => {
  describe('isValidTime', () => {
    it('accepts valid time', () => {
      expect(isValidTime('09:30')).toBe(true);
    });

    it('rejects invalid time', () => {
      expect(isValidTime('29:90')).toBe(false);
    });
  });

  describe('isValidCurrency', () => {
    it('accepts three-letter currency', () => {
      expect(isValidCurrency('INR')).toBe(true);
    });

    it('rejects invalid currency format', () => {
      expect(isValidCurrency('IN')).toBe(false);
    });
  });

  describe('isValidTimezone', () => {
    it('accepts a valid timezone', () => {
      expect(isValidTimezone('Asia/Kolkata')).toBe(true);
    });

    it('rejects an invalid timezone', () => {
      expect(isValidTimezone('Invalid/Zone')).toBe(false);
    });
  });

  describe('isValidMinorAmount', () => {
    it('accepts a valid integer amount', () => {
      expect(isValidMinorAmount(50000)).toBe(true);
    });

    it('rejects decimal amounts', () => {
      expect(isValidMinorAmount(500.75)).toBe(false);
    });

    it('rejects negative amounts', () => {
      expect(isValidMinorAmount(-500)).toBe(false);
    });
  });

  describe('isValidSlug', () => {
    it('accepts a valid slug', () => {
      expect(isValidSlug('royal-salon')).toBe(true);
    });

    it('rejects spaces', () => {
      expect(isValidSlug('royal salon')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('accepts a valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
    });
  });

  describe('isValidDateRange', () => {
    it('accepts a valid date range', () => {
      expect(
        isValidDateRange(
          new Date('2026-11-24T10:00:00Z'),
          new Date('2026-11-24T10:45:00Z'),
        ),
      ).toBe(true);
    });

    it('rejects an invalid date range', () => {
      expect(
        isValidDateRange(
          new Date('2026-11-24T11:00:00Z'),
          new Date('2026-11-24T10:00:00Z'),
        ),
      ).toBe(false);
    });
  });
});
