import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateWizard from './pages/Create/CreateWizard';
import Success from './pages/Success';
import Proposal from './pages/Proposal';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateWizard />} />
        <Route path="/created" element={<Success />} />
        <Route path="/p/:id" element={<Proposal />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
