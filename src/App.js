// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Layout from './layout';
import HomePage from './pages/home';
import Simulator from './pages/simulator';

function App() {
  return (
    <Router>
        <Routes>
        {/* <Route path="/" element={<Layout />}> */}
          <Route index element={<HomePage />} />
          <Route exact path="/:person" element={<Simulator/>} />
          {/* <Route path="about" element={} /> */}
          {/* <Route exact path="/:id" component= {DashboardContainer} /> */} 
          {/* </Route> */}
        </Routes>
    </Router>
  );
}


export default App;

