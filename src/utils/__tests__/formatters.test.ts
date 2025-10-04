import { describe, expect, it } from 'vitest';
import {
  capitalizeFirst,
  formatCookingTime,
  formatDate,
  formatDateTime,
  formatDifficulty,
  truncateText,
} from '../formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      const result = formatDate(date);

      expect(result).toBe('December 25, 2023');
    });

    it('should format date string correctly', () => {
      const dateString = '2023-12-25T10:30:00Z';
      const result = formatDate(dateString);

      expect(result).toBe('December 25, 2023');
    });

    it('should handle different date formats', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-06-15');
      const date3 = new Date('2023-12-31');

      expect(formatDate(date1)).toBe('January 1, 2023');
      expect(formatDate(date2)).toBe('June 15, 2023');
      expect(formatDate(date3)).toBe('December 31, 2023');
    });
  });

  describe('formatDateTime', () => {
    it('should format Date object with time correctly', () => {
      const date = new Date('2023-12-25T14:30:00Z');
      const result = formatDateTime(date);

      // Check that it contains the expected parts (timezone may vary)
      expect(result).toContain('Dec 25, 2023');
      expect(result).toMatch(/\d{2}:\d{2}/); // Contains time format
    });

    it('should format date string with time correctly', () => {
      const dateString = '2023-12-25T09:15:00Z';
      const result = formatDateTime(dateString);

      // Check that it contains the expected parts (timezone may vary)
      expect(result).toContain('Dec 25, 2023');
      expect(result).toMatch(/\d{2}:\d{2}/); // Contains time format
    });

    it('should handle different times', () => {
      const morning = new Date('2023-12-25T08:00:00Z');
      const afternoon = new Date('2023-12-25T15:30:00Z');
      const evening = new Date('2023-12-25T22:45:00Z');

      // Check that all contain the expected date and time format
      expect(formatDateTime(morning)).toContain('Dec 25, 2023');
      expect(formatDateTime(morning)).toMatch(/\d{2}:\d{2}/);
      expect(formatDateTime(afternoon)).toContain('Dec 25, 2023');
      expect(formatDateTime(afternoon)).toMatch(/\d{2}:\d{2}/);
      expect(formatDateTime(evening)).toContain('Dec 25, 2023');
      expect(formatDateTime(evening)).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatCookingTime', () => {
    it('should format minutes less than 60', () => {
      expect(formatCookingTime(30)).toBe('30 min');
      expect(formatCookingTime(45)).toBe('45 min');
      expect(formatCookingTime(59)).toBe('59 min');
    });

    it('should format exact hours', () => {
      expect(formatCookingTime(60)).toBe('1h');
      expect(formatCookingTime(120)).toBe('2h');
      expect(formatCookingTime(180)).toBe('3h');
    });

    it('should format hours with remaining minutes', () => {
      expect(formatCookingTime(90)).toBe('1h 30min');
      expect(formatCookingTime(150)).toBe('2h 30min');
      expect(formatCookingTime(135)).toBe('2h 15min');
    });

    it('should handle edge cases', () => {
      expect(formatCookingTime(0)).toBe('0 min');
      expect(formatCookingTime(1)).toBe('1 min');
    });
  });

  describe('formatDifficulty', () => {
    it('should capitalize first letter and lowercase rest', () => {
      expect(formatDifficulty('easy')).toBe('Easy');
      expect(formatDifficulty('medium')).toBe('Medium');
      expect(formatDifficulty('hard')).toBe('Hard');
    });

    it('should handle uppercase input', () => {
      expect(formatDifficulty('EASY')).toBe('Easy');
      expect(formatDifficulty('MEDIUM')).toBe('Medium');
      expect(formatDifficulty('HARD')).toBe('Hard');
    });

    it('should handle mixed case input', () => {
      expect(formatDifficulty('eAsY')).toBe('Easy');
      expect(formatDifficulty('MeDiUm')).toBe('Medium');
      expect(formatDifficulty('hArD')).toBe('Hard');
    });

    it('should handle single character', () => {
      expect(formatDifficulty('a')).toBe('A');
      expect(formatDifficulty('A')).toBe('A');
    });
  });

  describe('truncateText', () => {
    it('should return original text if within limit', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);

      expect(result).toBe('Short text');
    });

    it('should truncate text and add ellipsis', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);

      expect(result).toBe('This is a very long...');
    });

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars';
      const result = truncateText(text, 20);

      expect(result).toBe('Exactly twenty chars');
    });

    it('should handle very short limit', () => {
      const text = 'Hello world';
      const result = truncateText(text, 5);

      expect(result).toBe('Hello...');
    });

    it('should trim whitespace before truncating', () => {
      const text = '  This text has spaces  ';
      const result = truncateText(text, 15);

      expect(result).toBe('This text has...');
    });

    it('should handle empty string', () => {
      const result = truncateText('', 10);

      expect(result).toBe('');
    });

    it('should handle zero limit', () => {
      const text = 'Hello';
      const result = truncateText(text, 0);

      expect(result).toBe('...');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter and lowercase rest', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('world')).toBe('World');
      expect(capitalizeFirst('javascript')).toBe('Javascript');
    });

    it('should handle uppercase input', () => {
      expect(capitalizeFirst('HELLO')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
    });

    it('should handle mixed case input', () => {
      expect(capitalizeFirst('hElLo')).toBe('Hello');
      expect(capitalizeFirst('wOrLd')).toBe('World');
    });

    it('should handle single character', () => {
      expect(capitalizeFirst('a')).toBe('A');
      expect(capitalizeFirst('A')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    it('should handle numbers', () => {
      expect(capitalizeFirst('123')).toBe('123');
    });

    it('should handle special characters', () => {
      expect(capitalizeFirst('!hello')).toBe('!hello');
      expect(capitalizeFirst('@world')).toBe('@world');
    });
  });
});
