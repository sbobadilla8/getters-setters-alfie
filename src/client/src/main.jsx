import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext.jsx';
import AppRouter from './pages/Routes.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ChakraProvider>
    <AuthProvider>
      <RouterProvider router={AppRouter} />
    </AuthProvider>
  </ChakraProvider>,
  // </React.StrictMode>,
);
