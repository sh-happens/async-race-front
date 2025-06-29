import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCars } from '../../store/garageThunks';
import { setCurrentPage } from '../../store/garageSlice';
import { CARS_PER_PAGE } from '../../types';
import CarCreationPanel from './CarCreationPanel';
import RaceControlPanel from './RaceControlPanel';
import Pagination from '../common/Pagination';
import CarList from './CarList';

const GarageView: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    cars,
    isLoading,
    error,
    totalCount,
    currentPage
  } = useAppSelector((state) => state.garage);

  const totalPages = Math.ceil(totalCount / CARS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchCars({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="garage-view">
      <div className="garage-header">
        <h2 className="view-title">Garage</h2>
        <p className="car-count">Total cars: {totalCount}</p>
      </div>

      <div className="garage-controls">
        <CarCreationPanel />
        <RaceControlPanel />
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading">Loading cars...</div>
      ) : (
        <>
          <CarList cars={cars} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {cars.length === 0 && !isLoading && (
        <div className="empty-state">
          <p>No cars in the garage yet!</p>
          <p>Create your first car using the form above 🚗</p>
        </div>
      )}
    </div>
  );
};

export default GarageView;