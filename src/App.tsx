import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchCars, createCarThunk } from './store/garageThunks';
import { generateRandomCar } from './utils/carGenerator';
import './index.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cars, isLoading, error, totalCount } = useAppSelector(state => state.garage);

  useEffect(() => {
    dispatch(fetchCars({ page: 1 }));
  }, [dispatch]);

  const handleCreateRandomCar = () => {
    const randomCar = generateRandomCar();
    dispatch(createCarThunk(randomCar));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🏎️ Async Race</h1>
        <p>API Integration Test - Phase 2 Complete!</p>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCreateRandomCar}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create Random Car
        </button>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Total cars: {totalCount}
        </p>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ display: 'grid', gap: '12px' }}>
        {cars.map(car => (
          <div
            key={car.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '20px',
                backgroundColor: car.color,
                border: '1px solid #333',
                borderRadius: '2px'
              }}
            />
            <span style={{ fontWeight: '500' }}>{car.name}</span>
            <span style={{ color: '#666' }}>#{car.id}</span>
          </div>
        ))}
      </div>

      {cars.length === 0 && !isLoading && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
          No cars yet. Create your first car! 🚗
        </p>
      )}
    </div>
  );
};

export default App;