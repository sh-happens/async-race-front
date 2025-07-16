import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/redux';
import './App.css';
import Header from './components/common/Header';
import GarageView from './components/garage/GarageView';
import WinnersView from './components/winners/WinnersView';

const AppContent: React.FC = () => {
  const currentView = useAppSelector((state) => state.ui.currentView);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {currentView === 'garage' ? <GarageView /> : <WinnersView />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
