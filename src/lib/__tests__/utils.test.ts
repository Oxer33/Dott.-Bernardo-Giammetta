// =============================================================================
// UNIT TESTS - UTILITY FUNCTIONS
// Test per le funzioni helper in src/lib/utils.ts
// =============================================================================

import {
  cn,
  highlightKeywords,
  formatDate,
  formatTime,
  calculateReadingTime,
  slugify,
  truncateText,
  getInitials,
  generateTimeSlots,
  isValidEmail,
  isValidPhone,
  absoluteUrl,
} from '../utils';

// =============================================================================
// TEST: cn (class name merger)
// =============================================================================

describe('cn - Class Name Merger', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'active')).toBe('base active');
    expect(cn('base', false && 'inactive')).toBe('base');
  });

  it('should resolve Tailwind conflicts', () => {
    // tailwind-merge dovrebbe risolvere conflitti
    expect(cn('px-4', 'px-6')).toBe('px-6');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });
});

// =============================================================================
// TEST: highlightKeywords
// =============================================================================

describe('highlightKeywords', () => {
  it('should wrap keywords in em tags', () => {
    const result = highlightKeywords('Il metabolismo è importante');
    expect(result).toContain('<em class="keyword">metabolismo</em>');
  });

  it('should preserve original case', () => {
    const result = highlightKeywords('METABOLISMO attivo');
    expect(result).toContain('<em class="keyword">METABOLISMO</em>');
  });

  it('should not modify text without keywords', () => {
    const text = 'Testo senza parole chiave specifiche';
    const result = highlightKeywords(text);
    expect(result).toBe(text);
  });
});

// =============================================================================
// TEST: formatDate
// =============================================================================

describe('formatDate', () => {
  it('should format date in Italian locale', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toContain('15');
    expect(result).toContain('gennaio');
    expect(result).toContain('2024');
  });

  it('should accept string dates', () => {
    const result = formatDate('2024-06-20');
    expect(result).toContain('20');
    expect(result).toContain('giugno');
  });

  it('should accept custom options', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, { month: 'short' });
    expect(result).toContain('gen');
  });
});

// =============================================================================
// TEST: formatTime
// =============================================================================

describe('formatTime', () => {
  it('should format time correctly', () => {
    const date = new Date('2024-01-15T14:30:00');
    const result = formatTime(date);
    expect(result).toBe('14:30');
  });

  it('should handle morning times', () => {
    const date = new Date('2024-01-15T09:05:00');
    const result = formatTime(date);
    expect(result).toBe('09:05');
  });
});

// =============================================================================
// TEST: calculateReadingTime
// =============================================================================

describe('calculateReadingTime', () => {
  it('should calculate reading time for short text', () => {
    const text = 'This is a short text with about ten words in it.';
    expect(calculateReadingTime(text)).toBe(1);
  });

  it('should calculate reading time for longer text', () => {
    // 200 words = 1 minute, 400 words = 2 minutes
    const words = Array(400).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('should handle empty text', () => {
    expect(calculateReadingTime('')).toBe(1);
  });
});

// =============================================================================
// TEST: slugify
// =============================================================================

describe('slugify', () => {
  it('should convert text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove accents', () => {
    expect(slugify('Caffè Espresso')).toBe('caffe-espresso');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('should handle Italian characters', () => {
    expect(slugify('Città d\'arte')).toBe('citta-darte');
  });
});

// =============================================================================
// TEST: truncateText
// =============================================================================

describe('truncateText', () => {
  it('should truncate long text', () => {
    const text = 'This is a very long text that should be truncated';
    const result = truncateText(text, 20);
    expect(result).toBe('This is a very long...');
    expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
  });

  it('should not truncate short text', () => {
    const text = 'Short';
    expect(truncateText(text, 20)).toBe('Short');
  });

  it('should handle exact length', () => {
    const text = 'Exact';
    expect(truncateText(text, 5)).toBe('Exact');
  });
});

// =============================================================================
// TEST: getInitials
// =============================================================================

describe('getInitials', () => {
  it('should get initials from full name', () => {
    expect(getInitials('Mario Rossi')).toBe('MR');
  });

  it('should handle single name', () => {
    expect(getInitials('Mario')).toBe('M');
  });

  it('should limit to 2 characters', () => {
    expect(getInitials('Mario Giuseppe Rossi')).toBe('MG');
  });

  it('should uppercase initials', () => {
    expect(getInitials('mario rossi')).toBe('MR');
  });
});

// =============================================================================
// TEST: generateTimeSlots
// =============================================================================

describe('generateTimeSlots', () => {
  it('should generate default time slots (8-20, 30min)', () => {
    const slots = generateTimeSlots();
    expect(slots[0]).toBe('08:00');
    expect(slots[slots.length - 1]).toBe('19:30');
    expect(slots.length).toBe(24); // (20-8) * 2
  });

  it('should generate custom time slots', () => {
    const slots = generateTimeSlots(9, 12, 60);
    expect(slots).toEqual(['09:00', '10:00', '11:00']);
  });

  it('should handle 15-minute intervals', () => {
    const slots = generateTimeSlots(9, 10, 15);
    expect(slots).toEqual(['09:00', '09:15', '09:30', '09:45']);
  });
});

// =============================================================================
// TEST: isValidEmail
// =============================================================================

describe('isValidEmail', () => {
  it('should validate correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
  });
});

// =============================================================================
// TEST: isValidPhone
// =============================================================================

describe('isValidPhone', () => {
  it('should validate Italian phone numbers', () => {
    expect(isValidPhone('+39 123 4567890')).toBe(true);
    expect(isValidPhone('3331234567')).toBe(true);
    expect(isValidPhone('+393331234567')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('abcdefghij')).toBe(false);
  });
});

// =============================================================================
// TEST: absoluteUrl
// =============================================================================

describe('absoluteUrl', () => {
  it('should create absolute URL from path', () => {
    const result = absoluteUrl('/chi-sono');
    expect(result).toContain('/chi-sono');
    expect(result).toMatch(/^https?:\/\//);
  });

  it('should handle paths without leading slash', () => {
    const result = absoluteUrl('blog');
    expect(result).toContain('/blog');
  });
});
