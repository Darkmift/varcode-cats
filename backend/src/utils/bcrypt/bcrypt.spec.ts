import * as bcrypt from 'bcrypt';
import { hashString, compareStringToHash } from './index'; // Adjust the import path to match your file structure

describe('Hashing and Comparison', () => {
  describe('hashString', () => {
    it('should hash a string successfully', async () => {
      const string = 'TestString';
      const hash = await hashString(string);

      // Basic validation to ensure it returns a string
      expect(typeof hash).toBe('string');
      // Ensure the hash is not the same as the original string
      expect(hash).not.toEqual(string);
    });
  });

  describe('compareStringToHash', () => {
    it('should return true for a string and its correct hash', async () => {
      const string = 'TestString';
      const hash = await hashString(string);
      const isMatch = await compareStringToHash(string, hash);

      expect(isMatch).toBe(true);
    });

    it('should return false for a string and an incorrect hash', async () => {
      const string = 'TestString';
      const incorrectHash = await hashString('DifferentString');
      console.log('🚀 ~ it ~ incorrectHash:', incorrectHash);
      const isMatch = await compareStringToHash(string, incorrectHash);

      expect(isMatch).toBe(false);
    });
  });
});
