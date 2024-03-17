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
      const isMatch = await compareStringToHash(string, incorrectHash);

      expect(isMatch).toBe(false);
    });

    it('should handle bcrypt compare directly for controlled testing', async () => {
      // This test bypasses the hashing function and uses bcrypt directly for a known hash
      const string = 'password1234';
      // Known bcrypt hash of the string "TestString" with a salt round of 11 (ensure consistency in salt rounds)
      const knownHash = '$2b$11$PmYCF6Gx6lF1Cpf9FpYGDuwG.qoIjf3XaJ8wxvxZJZ5w9h4slblny'; // Replace with a real hash of "TestString" with salt rounds of 11
      const isMatch = await bcrypt.compare(string, knownHash);

      expect(isMatch).toBe(true);
    });
  });
});
