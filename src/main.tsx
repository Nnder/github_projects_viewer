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
    // secondary: {
    //   main: "#2196F3",
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
          '& .MuiInputBase-input::placeholder': {
						fontStyle: 'italic',
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
    MuiTableBody: {
      styleOverrides: {
        root: {
          ".MuiTableRow-hover": {
            color: 'green',
          },
        },
      },
    }
    // MuiTableRow:{
    //   styleOverrides: {
    //     root: {
    //       "&:hover": {
    //         backgroundColor: "rgb(33, 150, 243, 0.4)",
    //       },
    //     },
    //     hover: {
    //       backgroundColor: "rgb(33, 150, 243, 0.4)",
    //     }
    //   },
    // }
  },
});



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
