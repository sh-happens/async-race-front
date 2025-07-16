import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  generateRandomCarsThunk,
  startEngineThunk,
} from '../../store/garageThunks';
import { setRaceInProgress, setRaceWinner } from '../../store/uiSlice';
import { clearRacingCars, clearAllRaceStates } from '../../store/garageSlice';
import { useModal } from '../../hooks/useModal';
import Modal from '../common/Modal';
import { RANDOM_CARS_COUNT } from '../../types';
import './RaceControlPanel.css';

const RaceControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, cars, carRaceStates } = useAppSelector(
    (state) => state.garage
  );
  const { raceInProgress, raceWinner } = useAppSelector((state) => state.ui);

  const { modalState, closeModal, showError, showConfirm } = useModal();

  const handleRaceStart = async () => {
    if (cars.length === 0) {
      showError(
        'No Cars Available',
        'No cars to race! Please create some cars first.'
      );
      return;
    }

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
    const successfulStarts = results.filter((r) => r.success);

    if (successfulStarts.length === 0) {
      showError(
        'Race Failed',
        'Failed to start any cars for the race! Please check your connection and try again.'
      );
      dispatch(setRaceInProgress(false));
    }
  };

  const handleRaceReset = () => {
    dispatch(setRaceInProgress(false));
    dispatch(setRaceWinner(null));
    dispatch(clearRacingCars());
    dispatch(clearAllRaceStates());
  };

  const handleGenerateRandomCars = () => {
    showConfirm(
      'Generate Random Cars',
      `Are you sure you want to generate ${RANDOM_CARS_COUNT} random cars? This will add them to your garage.`,
      () => {
        dispatch(generateRandomCarsThunk(RANDOM_CARS_COUNT));
      },
      'Generate',
      'Cancel'
    );
  };

  const getRaceStats = () => {
    const raceStates = Object.values(carRaceStates);
    const racingCount = raceStates.filter((state) => state.isAnimating).length;
    const finishedCount = raceStates.filter((state) => state.isFinished).length;
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
        <div className="winner-banner">🏆 Winner: {raceWinner}</div>
      )}

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />
    </div>
  );
};

export default RaceControlPanel;
