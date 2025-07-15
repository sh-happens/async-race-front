import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setCurrentView } from '../../store/uiSlice';
import type { View } from '../../types';
import './Header.css';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((state) => state.ui.currentView);
  const raceInProgress = useAppSelector((state) => state.ui.raceInProgress);
  const carRaceStates = useAppSelector((state) => state.garage.carRaceStates);

  const hasIndividualRaces = Object.values(carRaceStates).some(
    (raceState) => raceState.isAnimating
  );

  const isNavigationDisabled = raceInProgress || hasIndividualRaces;

  const handleViewChange = (view: View) => {
    if (isNavigationDisabled) {
      return;
    }
    dispatch(setCurrentView(view));
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">🏎️ Async Race</h1>
        <nav className="header-nav">
          <button
            className={`nav-button ${currentView === 'garage' ? 'active' : ''} ${isNavigationDisabled ? 'disabled' : ''
              }`}
            onClick={() => handleViewChange('garage')}
            disabled={isNavigationDisabled}
            title={
              isNavigationDisabled
                ? 'Navigation disabled during active races'
                : 'Switch to Garage view'
            }
          >
            Garage
          </button>
          <button
            className={`nav-button ${currentView === 'winners' ? 'active' : ''} ${isNavigationDisabled ? 'disabled' : ''
              }`}
            onClick={() => handleViewChange('winners')}
            disabled={isNavigationDisabled}
            title={
              isNavigationDisabled
                ? 'Navigation disabled during active races'
                : 'Switch to Winners view'
            }
          >
            Winners
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;