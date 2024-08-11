import { describe, expect, it } from 'vitest';
import { extraDateFromPath } from './file.util';

describe('extraDateFromPath', () => {
  it('should extract date from path', () => {
    const pathWithDate = 'D:\\WEB-Code\\my-electron\\mini-diary\\tmp\\diary-string-2024-08-09.json';
    const extractedDate = extraDateFromPath(pathWithDate);
    expect(extractedDate).toBe('2024-08-09');
  });

  it('should return empty string when no date found', () => {
    const pathWithoutDate = 'D:\\WEB-Code\\my-electron\\mini-diary\\tmp\\file.json';
    const extractedDate = extraDateFromPath(pathWithoutDate);
    expect(extractedDate).toBe('');
  });

  it('should handle different file separators', () => {
    const pathWithUnixSeparator = '/path/to/file-2023-12-31.txt';
    const extractedDate = extraDateFromPath(pathWithUnixSeparator);
    expect(extractedDate).toBe('2023-12-31');
  });
});
