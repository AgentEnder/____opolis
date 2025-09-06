/**
 * Utility function to prepend the base URL to relative paths
 * Handles GitHub Pages subdirectory deployment
 */
export function withBaseUrl(path: string): string {
  // Get the base URL from import.meta.env.BASE_URL (set by Vite)
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Handle root path
  if (path === '/') {
    return baseUrl;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash from baseUrl and combine with path
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${normalizedPath}`;
}