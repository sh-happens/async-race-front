import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { generateRandomCarsThunk, startEngineThunk } from '../../store/garageThunks';
import { setRaceInProgress, setRaceWinner } from '../../store/uiSlice';
import { clearRacingCars, clearAllRaceStates } from '../../store/garageSlice';
import { RANDOM_CARS_COUNT } from '../../types';
import './RaceControlPanel.css';

const RaceControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, cars, carRaceStates } = useAppSelector((state) => state.garage);
  const { raceInProgress, raceWinner } = useAppSelector((state) => state.ui);

  const handleRaceStart = async () => {
    if (cars.length === 0) {
      alert('No cars to race!');
      return;
    }

    console.log('Starting race for all cars on page');
    dispatch(setRaceInProgress(true));
    dispatch(setRaceWinner(null));
    dispatch(clearAllRaceStates());

    const startPromises = cars.map(async (car) => {
      try {
        const engineResult = await dispatch(startEngineThunk(car.id)).unwrap();
        console.log(`Car ${car.id} engine started for race:`, engineResult);
        return { carId: car.id, success: true };
      } catch (error) {
        console.error(`Failed to start car ${car.id} for race:`, error);
        return { carId: car.id, success: false };
      }
    });

    const results = await Promise.all(startPromises);
    const successfulStarts = results.filter(r => r.success);

    console.log(`Race started: ${successfulStarts.length}/${cars.length} cars ready`);

    if (successfulStarts.length === 0) {
      alert('Failed to start any cars for the race!');
      dispatch(setRaceInProgress(false));
    }
  };

  const handleRaceReset = () => {
    console.log('Resetting race - all cars return to start');
    dispatch(setRaceInProgress(false));
    dispatch(setRaceWinner(null));
    dispatch(clearRacingCars());
    dispatch(clearAllRaceStates());
  };

  const handleGenerateRandomCars = () => {
    if (window.confirm(`Generate ${RANDOM_CARS_COUNT} random cars?`)) {
      dispatch(generateRandomCarsThunk(RANDOM_CARS_COUNT));
    }
  };

  const getRaceStats = () => {
    const raceStates = Object.values(carRaceStates);
    const racingCount = raceStates.filter(state => state.isAnimating).length;
    const finishedCount = raceStates.filter(state => state.isFinished).length;
    const totalCars = cars.length;

    return { racingCount, finishedCount, totalCars };
  };

  const { racingCount, finishedCount, totalCars } = getRaceStats();

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
            disabled={!raceInProgress && !raceWinner && finishedCount === 0}
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

      {raceInProgress && (
        <div className="race-status">
          <div className="status-info">
            🏃 Racing: {racingCount}/{totalCars} cars
            {finishedCount > 0 && ` • ✅ Finished: ${finishedCount}`}
          </div>
        </div>
      )}

      {raceWinner && (
        <div className="winner-banner">
          🏆 Winner: {raceWinner}
        </div>
      )}
    </div>
  );
};

export default RaceControlPanel;