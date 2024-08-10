import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
    },
	background: {
		default: '#F2F2F2',
	},
	action: {
		hover: 'rgba(33, 150, 243, 0.1)'
	},
	// secondary: {
	// 	main: "#F2F2F2",
	// },
    // info: {
    //   main: "#2196F3",
    // },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 15,
        }
      }
    },
    MuiTextField:{
      styleOverrides: {
        root: {
			fontSize: 14,
			backgroundColor: 'palette.secondary.main',
			'& .MuiInputBase-input::placeholder': {
				fontStyle: 'italic',
			},
			"& .MuiOutlinedInput-notchedOutline": {
				border: 'none',
			}
        },
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          flexDirection: "row-reverse",
        },
      },
    },
    MuiTableCell:{
      styleOverrides: {
        root: {
          width: "20%",
          p:1,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
          // Even though there is a hover rule we have to override it here. Don't ask.
          root: {
              '&.MuiTableRow-hover:hover': {
                  backgroundColor: 'palette.action.hover',
              },
          },
      },
  },
  },
});



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
