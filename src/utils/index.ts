// Utility functions for KMRL Knowledge Lens

export function createPageUrl(pageName: string): string {
  // Simple page URL creation - you can customize this based on your routing structure
  const pageRoutes: Record<string, string> = {
    'Dashboard': '/',
    'Documents': '/documents',
    'Search': '/search',
    'Upload': '/upload',
    'Analytics': '/analytics',
    'Settings': '/settings',
    'AccessControl': '/access-control',
    'Alerts': '/alerts',
    'Help': '/help',
    'Wellness': '/wellness'
  };

  return pageRoutes[pageName] || '/';
}
