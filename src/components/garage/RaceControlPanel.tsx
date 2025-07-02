import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { generateRandomCarsThunk, startEngineThunk } from '../../store/garageThunks';
import { setRaceInProgress, setRaceWinner } from '../../store/uiSlice';
import { clearRacingCars, addRacingCar } from '../../store/garageSlice';
import { RANDOM_CARS_COUNT } from '../../types';
import './RaceControlPanel.css';

const RaceControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, cars } = useAppSelector((state) => state.garage);
  const { raceInProgress, raceWinner } = useAppSelector((state) => state.ui);

  const handleRaceStart = async () => {
    if (cars.length === 0) {
      alert('No cars to race!');
      return;
    }

    dispatch(setRaceInProgress(true));
    dispatch(setRaceWinner(null));

    cars.forEach(async (car) => {
      try {
        const engineResult = await dispatch(startEngineThunk(car.id)).unwrap();
        dispatch(addRacingCar(car.id));
        console.log(`Car ${car.id} engine started:`, engineResult);
      } catch (error) {
        console.error(`Failed to start car ${car.id}:`, error);
      }
    });
  };

  const handleRaceReset = async () => {
    dispatch(setRaceInProgress(false));
    dispatch(setRaceWinner(null));
    dispatch(clearRacingCars());
  };

  const handleGenerateRandomCars = () => {
    if (window.confirm(`Generate ${RANDOM_CARS_COUNT} random cars?`)) {
      dispatch(generateRandomCarsThunk(RANDOM_CARS_COUNT));
    }
  };

  return (
    <div className="race-control-panel">
      <h3 className="panel-title">Race Control</h3>

      <div className="control-buttons">
        <div className="race-buttons">
          <button
            onClick={handleRaceStart}
            disabled={raceInProgress || cars.length === 0}
            className="control-button race-start"
            title="Start race for all cars on this page"
          >
            🏁 Race
          </button>
          <button
            onClick={handleRaceReset}
            disabled={!raceInProgress && !raceWinner}
            className="control-button race-reset"
            title="Reset all cars to starting position"
          >
            🔄 Reset
          </button>
        </div>

        <div className="generation-buttons">
          <button
            onClick={handleGenerateRandomCars}
            disabled={isLoading || raceInProgress}
            className="control-button generate-cars"
            title={`Generate ${RANDOM_CARS_COUNT} random cars`}
          >
            {isLoading ? 'Generating...' : `Generate ${RANDOM_CARS_COUNT} Cars`}
          </button>
        </div>
      </div>

      {raceWinner && (
        <div className="winner-banner">
          🏆 Winner: {raceWinner}
        </div>
      )}
    </div>
  );
};

export default RaceControlPanel;