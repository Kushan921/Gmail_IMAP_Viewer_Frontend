import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import InboxPage from './pages/InboxPage';
import EmailDetailPage from './pages/EmailDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/mail" element={<InboxPage />} />
        <Route path="/mail/:id" element={<EmailDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
