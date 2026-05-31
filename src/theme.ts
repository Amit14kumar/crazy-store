import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  palette: {
    primary:   { main: '#0a0a0a', contrastText: '#ffffff' },
    secondary: { main: '#E11D48', contrastText: '#ffffff' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text:       { primary: '#0a0a0a', secondary: '#666666' },
    divider:    '#e8e8e8',
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 700, fontStyle: 'italic' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.688rem' },
    caption: { letterSpacing: '0.05em' },
    overline: { fontWeight: 700, letterSpacing: '0.35em' },
  },
  shape: { borderRadius: 0 }, // square everything
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          borderRadius: 0,
          minHeight: 48,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontSize: '0.688rem',
        },
        sizeLarge:  { minHeight: 56, padding: '0 32px', fontSize: '0.75rem' },
        sizeMedium: { minHeight: 48, padding: '0 24px' },
        sizeSmall:  { minHeight: 40, padding: '0 16px', fontSize: '0.625rem' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 0 },
        sizeMedium: { width: 44, height: 44 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 0, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.625rem' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: 0 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 0, boxShadow: 'none' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 0 } },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 0 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 0, height: 3 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#e8e8e8' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        * { box-sizing: border-box; }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `,
    },
  },
})

export default theme
