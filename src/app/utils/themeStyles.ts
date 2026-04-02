/**
 * Theme-aware style utilities
 * These functions return CSS properties that automatically adapt to light/dark theme via CSS variables
 */

/**
 * Get background color for the main page background
 */
export const getBackgroundStyle = () => ({
  backgroundColor: 'var(--background)',
});

/**
 * Get foreground (text) color
 */
export const getForegroundStyle = () => ({
  color: 'var(--foreground)',
});

/**
 * Get card background with shadow
 */
export const getCardStyle = () => ({
  backgroundColor: 'var(--card)',
  color: 'var(--card-foreground)',
  boxShadow: 'var(--shadow-sm)',
  borderRadius: '12px',
  border: 'none',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
});

/**
 * Get muted background style
 */
export const getMutedStyle = () => ({
  backgroundColor: 'var(--muted)',
  color: 'var(--muted-foreground)',
});

/**
 * Get muted text color
 */
export const getMutedTextStyle = () => ({
  color: 'var(--muted-foreground)',
});

/**
 * Get secondary text color
 */
export const getSecondaryTextStyle = () => ({
  color: 'var(--secondary-text)',
});

/**
 * Get input background style
 */
export const getInputStyle = () => ({
  backgroundColor: 'var(--input-background)',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
});

/**
 * Get device card style with active/inactive states
 */
export const getDeviceCardStyle = (isActive: boolean) => ({
  backgroundColor: isActive
    ? 'var(--card)'
    : 'var(--card)',
  background: isActive
    ? 'linear-gradient(145deg, rgba(124,92,255,0.12) 0%, rgba(124,92,255,0.04) 100%)'
    : 'var(--card)',
  borderRadius: '12px',
  border: 'none',
  boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
  transition: 'all 0.3s ease',
});

/**
 * Get modal overlay style
 */
export const getModalOverlayStyle = () => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
});

/**
 * Get modal content style
 */
export const getModalContentStyle = () => ({
  backgroundColor: 'var(--card)',
  color: 'var(--card-foreground)',
  borderRadius: '16px',
  boxShadow: 'var(--shadow-lg)',
  border: '1px solid var(--border)',
});

/**
 * Get bottom navigation style
 */
export const getBottomNavStyle = () => ({
  backgroundColor: 'var(--card)',
  borderTop: '1px solid var(--border)',
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
});

/**
 * Get button style
 */
export const getButtonStyle = () => ({
  backgroundColor: 'var(--muted)',
  color: 'var(--foreground)',
  border: 'none',
  borderRadius: '12px',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
});

/**
 * Get primary button style
 */
export const getPrimaryButtonStyle = () => ({
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)',
  border: 'none',
  borderRadius: '12px',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
});
