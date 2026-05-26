import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import AddCar from './pages/AddCar';
import Docs from './pages/Docs';
import AIAssistant from './components/AIAssistant/AIAssistant';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddCar />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </Layout>
      <AIAssistant />
    </BrowserRouter>
  );
};

export default App;
