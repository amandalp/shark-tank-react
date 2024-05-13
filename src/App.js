// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Layout from './layout';
import HomePage from './pages/home';
import Simulator from './pages/simulator';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:personKey" element={<Simulator />} />
        </Routes>
    </Router>
  );
}


export default App;
