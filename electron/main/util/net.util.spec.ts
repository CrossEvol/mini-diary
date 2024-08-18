import { describe, expect, it } from 'vitest';
import { findFreePort } from './net.util'; // Replace with actual import path

describe('findFreePort', () => {
    it('should find a free port within the specified range multiple times', async () => {
      const iterations = 10; // Adjust the number of iterations as needed
  
      for (let i = 0; i < iterations; i++) {
        const result = await findFreePort(1024, 65535)
        expect(result).gte(1024)
        expect(result).lte(65535)
      }
    })
  })