import React from 'react';
import { AppRouter } from './Routes.jsx';
import { AuthProvider } from './AuthContext.jsx';

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
