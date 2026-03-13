const appTheme = {
  meta: {
    aesthetic: 'old-money-modern',
    contrast: 'high',
    iconSet: 'Heroicons',
  },
  colors: {
    background: '#130C1F',
    surface: '#221334',
    surfaceElevated: '#2A1840',
    primary: '#8A63D2',
    accent: '#C5A86A',
    textPrimary: '#F3ECFF',
    textSecondary: '#CBBCE6',
    border: '#5E4786',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  typography: {
    title: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: 0.6,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: 0.2,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
  },
  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.35,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
  },
};

export { appTheme };
