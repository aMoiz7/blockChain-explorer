import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TransactionListPage  from './pages/TransactionListPage';
import { DarkModeProvider } from './context/darkMode';
import TransactionDetails from './pages/transactionDetails';

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TransactionListPage />} />
          <Route path="/transaction/:id" element={<TransactionDetails />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
