import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setCurrentView } from '../../store/uiSlice';
import type { View } from '../../types';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((state) => state.ui.currentView);

  const handleViewChange = (view: View) => {
    dispatch(setCurrentView(view));
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">🏎️ Async Race</h1>
        <nav className="header-nav">
          <button
            className={`nav-button ${currentView === 'garage' ? 'active' : ''}`}
            onClick={() => handleViewChange('garage')}
          >
            Garage
          </button>
          <button
            className={`nav-button ${currentView === 'winners' ? 'active' : ''}`}
            onClick={() => handleViewChange('winners')}
          >
            Winners
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;