import React from 'react';
import { Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <RootLayout />
      </>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'details/:pair', element: <DetailsPage /> },
      { path: 'favorites', element: <HomePage /> },
      { path: '*', element: <Navigate to='/' /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
