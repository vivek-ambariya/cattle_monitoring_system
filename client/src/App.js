import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MilkYard from './pages/MilkYard';
import CattleList from './pages/CattleList';
import HealthMonitoring from './pages/HealthMonitoring';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/milk-yard" element={<MilkYard />} />
            <Route path="/cattle" element={<CattleList />} />
            <Route path="/health" element={<HealthMonitoring />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

