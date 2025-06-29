import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { generateRandomCarsThunk } from '../../store/garageThunks';
import { setRaceInProgress } from '../../store/uiSlice';
import { clearRacingCars } from '../../store/garageSlice';
import { RANDOM_CARS_COUNT } from '../../types';

const RaceControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.garage);
  const { raceInProgress } = useAppSelector((state) => state.ui);

  const handleRaceStart = () => {
    dispatch(setRaceInProgress(true));
    console.log('Starting race for all cars');
  };

  const handleRaceReset = () => {
    dispatch(setRaceInProgress(false));
    dispatch(clearRacingCars());
    console.log('Resetting race');
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
            disabled={raceInProgress}
            className="control-button race-start"
            title="Start race for all cars"
          >
            🏁 Race
          </button>
          <button
            onClick={handleRaceReset}
            disabled={!raceInProgress}
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
    </div>
  );
};

export default RaceControlPanel;