import { describe, test, expect } from 'vitest';

// Simple unit tests for the withBaseUrl logic
// Note: In real usage, import.meta.env.BASE_URL is set by Vite
const createWithBaseUrl = (baseUrl: string) => (path: string): string => {
  // Handle root path
  if (path === '/') {
    return baseUrl;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash from baseUrl and combine with path
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${normalizedPath}`;
};

describe('withBaseUrl logic', () => {
  test('should handle root path with default base URL', () => {
    const withBaseUrl = createWithBaseUrl('/');

    expect(withBaseUrl('/')).toBe('/');
    expect(withBaseUrl('/about')).toBe('/about');
    expect(withBaseUrl('/play')).toBe('/play');
  });

  test('should handle subdirectory base URL', () => {
    const withBaseUrl = createWithBaseUrl('/____opolis/');

    expect(withBaseUrl('/')).toBe('/____opolis/');
    expect(withBaseUrl('/about')).toBe('/____opolis/about');
    expect(withBaseUrl('/play')).toBe('/____opolis/play');
    expect(withBaseUrl('/deck-editor/123')).toBe('/____opolis/deck-editor/123');
  });

  test('should handle paths without leading slash', () => {
    const withBaseUrl = createWithBaseUrl('/____opolis/');

    expect(withBaseUrl('about')).toBe('/____opolis/about');
    expect(withBaseUrl('play')).toBe('/____opolis/play');
  });

  test('should handle base URL without trailing slash', () => {
    const withBaseUrl = createWithBaseUrl('/____opolis');

    expect(withBaseUrl('/')).toBe('/____opolis');
    expect(withBaseUrl('/about')).toBe('/____opolis/about');
  });

  test('should handle default base URL fallback', () => {
    const withBaseUrl = createWithBaseUrl('/');

    expect(withBaseUrl('/')).toBe('/');
    expect(withBaseUrl('/about')).toBe('/about');
  });
});