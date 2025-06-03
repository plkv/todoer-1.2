// Universal color system for the planner interface

export const lightTheme = {
  // Content colors (text, icons, etc.)
  content: {
    primary: 'rgba(0, 0, 0, 0.9)',     // 000000, 90%
    secondary: 'rgba(0, 0, 0, 0.6)',   // 000000, 60%
    tertiary: 'rgba(0, 0, 0, 0.4)',    // 000000, 40%
  },

  // Border colors
  border: {
    primary: 'rgba(0, 0, 0, 0.08)',    // Light border
    secondary: 'rgba(0, 0, 0, 0.04)',  // Lighter border
  },

  // Fill colors
  fill: {
    primary: 'rgba(0, 0, 0, 0.03)',    // 000000, 3%
    secondary: 'rgba(0, 0, 0, 0.06)',  // 000000, 6%
    tertiary: 'rgba(0, 0, 0, 0.12)',   // 000000, 12%
  },

  // Background colors
  bg: {
    primary: '#FFFFFF',    // Pure white
    secondary: '#F7F7F7',  // Light gray for sections
  },

  // Accent colors
  accent: {
    red: '#EF4444',
    orange: '#F97316',
    yellow: '#EAB308',
    violet: '#8B5CF6',
    blue: '#3B82F6',
    turquoise: '#06B6D4',
    green: '#22C55E',
  },
};

export const darkTheme = {
  // Content colors (text, icons, etc.)
  content: {
    primary: 'rgba(255, 255, 255, 0.9)',     // FFFFFF, 90%
    secondary: 'rgba(255, 255, 255, 0.6)',   // FFFFFF, 60%
    tertiary: 'rgba(255, 255, 255, 0.4)',    // FFFFFF, 40%
  },

  // Border colors
  border: {
    primary: 'rgba(255, 255, 255, 0.08)',    // Light border
    secondary: 'rgba(255, 255, 255, 0.04)',  // Lighter border
  },

  // Fill colors
  fill: {
    primary: 'rgba(255, 255, 255, 0.03)',    // FFFFFF, 3%
    secondary: 'rgba(255, 255, 255, 0.06)',  // FFFFFF, 6%
    tertiary: 'rgba(255, 255, 255, 0.12)',   // FFFFFF, 12%
  },

  // Background colors
  bg: {
    primary: '#1A1A1A',    // Dark background
    secondary: '#2A2A2A',  // Slightly lighter for sections
  },

  // Accent colors (same for both themes)
  accent: {
    red: '#EF4444',
    orange: '#F97316',
    yellow: '#EAB308',
    violet: '#8B5CF6',
    blue: '#3B82F6',
    turquoise: '#06B6D4',
    green: '#22C55E',
  },
};

// Accent colors (same for both themes) - keeping for backward compatibility
export const accentColors = {
  red: '#EF4444',
  orange: '#F97316',
  yellow: '#EAB308',
  violet: '#8B5CF6',
  blue: '#3B82F6',
  turquoise: '#06B6D4',
  green: '#22C55E',
};

// Dynamic colors object that will be updated based on theme
export let colors = lightTheme;

export const updateColors = (isDark: boolean) => {
  colors = isDark ? darkTheme : lightTheme;
};

// Helper function to get task card colors based on the color prop
export const getTaskCardColors = (color?: string, isDark: boolean = false) => {
  switch (color) {
    case 'red':
      return {
        bg: 'rgba(239, 68, 68, 0.08)', // 8% opacity
        border: 'transparent',
      };
    case 'orange':
      return {
        bg: 'rgba(249, 115, 22, 0.08)',
        border: 'transparent',
      };
    case 'yellow':
      return {
        bg: 'rgba(234, 179, 8, 0.08)',
        border: 'transparent',
      };
    case 'violet':
    case 'purple':
      return {
        bg: 'rgba(139, 92, 246, 0.08)',
        border: 'transparent',
      };
    case 'blue':
      return {
        bg: 'rgba(59, 130, 246, 0.08)',
        border: 'transparent',
      };
    case 'turquoise':
    case 'teal':
      return {
        bg: 'rgba(6, 182, 212, 0.08)',
        border: 'transparent',
      };
    case 'green':
      return {
        bg: 'rgba(34, 197, 94, 0.08)',
        border: 'transparent',
      };
    default:
      return {
        bg: isDark ? darkTheme.bg.primary : lightTheme.bg.primary,
        border: 'transparent',
      };
  }
};

// Color mapping for ColorSelector component
export const colorSelectorOptions = [
  { value: '', color: 'rgba(156, 163, 175, 1)' }, // gray-400
  { value: 'green', color: accentColors.green },
  { value: 'teal', color: accentColors.turquoise },
  { value: 'blue', color: accentColors.blue },
  { value: 'purple', color: accentColors.violet },
  { value: 'yellow', color: accentColors.yellow },
  { value: 'orange', color: accentColors.orange },
  { value: 'red', color: accentColors.red },
];
