import { describe, it, expect } from 'vitest';
import {
  nextGaussian,
  shuffle,
  percentage,
  round2,
  replaceAll,
  getOnlyKey,
  getOnlyVal,
  arrayContains,
  mapCounter
} from '../mathUtils';

describe('mathUtils', () => {
  describe('nextGaussian', () => {
    it('should return a number', () => {
      const result = nextGaussian();
      expect(typeof result).toBe('number');
    });

    it('should return different values on multiple calls', () => {
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        results.add(nextGaussian());
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('shuffle', () => {
    it('should shuffle an array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...arr]);
      expect(shuffled).toHaveLength(5);
      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('percentage', () => {
    it('should calculate percentage correctly', () => {
      expect(percentage(50, 100)).toBe('50%');
      expect(percentage(75, 100)).toBe('75%');
      expect(percentage(1, 3)).toBe('33%');
    });

    it('should handle zero denominator', () => {
      expect(percentage(10, 0)).toBe('0%');
    });
  });

  describe('round2', () => {
    it('should round to 2 decimal places', () => {
      expect(round2(1.234)).toBe(1.23);
      expect(round2(1.235)).toBe(1.24);
      expect(round2(1.999)).toBe(2);
    });
  });

  describe('replaceAll', () => {
    it('should replace all occurrences', () => {
      expect(replaceAll('hello hello', 'hello', 'hi')).toBe('hi hi');
      expect(replaceAll('a-b-c', '-', '_')).toBe('a_b_c');
    });
  });

  describe('getOnlyKey/getOnlyVal', () => {
    it('should get the only key from object', () => {
      expect(getOnlyKey({ foo: 'bar' })).toBe('foo');
    });

    it('should get the only value from object', () => {
      expect(getOnlyVal({ foo: 'bar' })).toBe('bar');
    });
  });

  describe('arrayContains', () => {
    it('should check if array contains element', () => {
      expect(arrayContains('foo', ['foo', 'bar'])).toBe(true);
      expect(arrayContains('baz', ['foo', 'bar'])).toBe(false);
    });
  });

  describe('mapCounter', () => {
    it('should increment counter in map', () => {
      const map = {};
      mapCounter(map, 'foo');
      expect(map.foo).toBe(1);
      mapCounter(map, 'foo');
      expect(map.foo).toBe(2);
    });
  });
});
