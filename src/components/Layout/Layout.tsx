import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car, Plus, FileText } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            <Car size={22} />
            <span>AutoMarket</span>
            <span className="logo-tag">AI</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Car size={16} />
              Veículos
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Plus size={16} />
              Cadastrar
            </NavLink>
            <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileText size={16} />
              Docs
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>AutoMarket AI — WSWork Technical Test © 2024</p>
      </footer>
    </div>
  );
};

export default Layout;
