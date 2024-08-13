import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196F3',
        },
        background: {
            default: '#F2F2F2',
        },
        action: {
            hover: 'rgba(33, 150, 243, 0.1)',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: 15,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                    backgroundColor: 'palette.secondary.main',
                    '& .MuiInputBase-input::placeholder': {
                        fontStyle: 'italic',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiTableSortLabel: {
            styleOverrides: {
                root: {
                    flexDirection: 'row-reverse',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    width: '20%',
                    p: 1,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&.MuiTableRow-hover:hover': {
                        backgroundColor: 'palette.action.hover',
                    },
                },
            },
        },
    },
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <div>Ошибка 404</div>,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
);
