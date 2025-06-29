import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteCarThunk, startEngineThunk, stopEngineThunk } from '../../store/garageThunks';
import { setSelectedCar } from '../../store/garageSlice';
import type { Car } from '../../types';
import './CarItem.css';

interface CarItemProps {
  car: Car;
}

const CarItem: React.FC<CarItemProps> = ({ car }) => {
  const dispatch = useAppDispatch();
  const { isLoading, racingCars } = useAppSelector((state) => state.garage);
  const { raceInProgress } = useAppSelector((state) => state.ui);

  const isRacing = racingCars.has(car.id);

  const handleSelect = () => {
    if (!raceInProgress) {
      dispatch(setSelectedCar(car));
    }
  };

  const handleDelete = () => {
    if (raceInProgress) {
      alert('Cannot delete car during race');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${car.name}?`)) {
      dispatch(deleteCarThunk(car.id));
    }
  };

  const handleStartEngine = () => {
    if (!isRacing) {
      dispatch(startEngineThunk(car.id));
    }
  };

  const handleStopEngine = () => {
    if (isRacing) {
      dispatch(stopEngineThunk(car.id));
    }
  };

  return (
    <div className="car-item">
      <div className="car-controls">
        <button
          onClick={handleSelect}
          disabled={raceInProgress}
          className="control-button select"
          title="Select for editing"
        >
          Select
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading || raceInProgress}
          className="control-button delete"
          title="Delete car"
        >
          Remove
        </button>
      </div>

      <div className="car-info">
        <div className="car-visual">
          <div
            className="car-icon"
            style={{ backgroundColor: car.color }}
            title={`${car.name} - ${car.color}`}
          />
          <span className="car-name">{car.name}</span>
        </div>
      </div>

      <div className="race-track">
        <div className="track-line">
          <div className="start-line">START</div>
          <div className="finish-line">FINISH</div>
        </div>
      </div>

      <div className="engine-controls">
        <button
          onClick={handleStartEngine}
          disabled={isRacing || raceInProgress}
          className="control-button start"
          title="Start engine"
        >
          Start
        </button>
        <button
          onClick={handleStopEngine}
          disabled={!isRacing}
          className="control-button stop"
          title="Stop engine"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default CarItem;