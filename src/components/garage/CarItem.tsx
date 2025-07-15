/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteCarThunk, startEngineThunk, stopEngineThunk, driveCarThunk } from '../../store/garageThunks';
import {
  setSelectedCar,
  removeRacingCar,
  updateCarPosition,
  setCarAnimating,
  finishCarRace,
  resetCarRaceState,
  setCarRaceType,
} from '../../store/garageSlice';
import { setRaceWinner } from '../../store/uiSlice';
import { saveWinnerThunk } from '../../store/winnersThunks';
import type { Car } from '../../types';
import './CarItem.css';

interface CarItemProps {
  car: Car;
}

const CarItem: React.FC<CarItemProps> = ({ car }) => {
  const dispatch = useAppDispatch();
  const { isLoading, racingCars, carRaceStates, firstFinisher } = useAppSelector((state) => state.garage);
  const { raceInProgress, raceWinner } = useAppSelector((state) => state.ui);

  const animationRef = useRef<number>(0);
  const carRef = useRef<HTMLDivElement>(null);
  const driveInProgressRef = useRef<boolean>(false);

  const isRacing = racingCars.includes(car.id);
  const carRaceState = carRaceStates[car.id];

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (firstFinisher === car.id && !raceWinner && raceInProgress && carRaceState?.isFinished) {
      console.log(`Car ${car.id} is the winner!`);
      dispatch(setRaceWinner(car.name));

      setTimeout(() => {
        alert(`🏆 ${car.name} wins with time ${carRaceState.raceTime.toFixed(2)}s!`);
      }, 100);
    }
  }, [firstFinisher, car.id, car.name, raceWinner, raceInProgress, carRaceState?.isFinished, carRaceState?.raceTime, dispatch]);

  useEffect(() => {
    if (!raceInProgress && carRaceState?.position > 0 && !carRaceState.isIndividualRace) {
      console.log(`Resetting car ${car.id} position - general race was reset`);
      dispatch(resetCarRaceState(car.id));
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    }
  }, [raceInProgress, dispatch, car.id, carRaceState?.position, carRaceState?.isIndividualRace]);

  useEffect(() => {
    if (!isRacing && carRaceState?.isAnimating) {
      console.log(`Car ${car.id} stopped individually - keeping position`);
      dispatch(setCarAnimating({ carId: car.id, isAnimating: false }));
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
      driveInProgressRef.current = false;
    }
  }, [isRacing, carRaceState?.isAnimating, dispatch, car.id]);

  useEffect(() => {
    if (isRacing && carRaceState && !carRaceState.isAnimating && !carRaceState.isFinished && !driveInProgressRef.current) {
      const isIndividualRace = !raceInProgress;
      dispatch(setCarRaceType({ carId: car.id, isIndividualRace }));

      console.log(`Starting drive for car ${car.id} (${raceInProgress ? 'general race' : 'individual race'})`);

      driveInProgressRef.current = true;

      if (raceInProgress) {
        handleDriveStart();
      } else {
        handleIndividualDriveStart();
      }
    }
  }, [isRacing, carRaceState, dispatch, car.id, raceInProgress]);

  const handleDriveStart = async () => {
    if (!carRaceState) {
      driveInProgressRef.current = false;
      return;
    }

    try {
      console.log(`Sending drive command for car ${car.id}`);
      const driveResult = await dispatch(driveCarThunk(car.id)).unwrap();

      if (driveResult.success) {
        console.log(`Drive successful for car ${car.id}, starting animation`);
        startCarAnimation(carRaceState.velocity, carRaceState.distance, false);
      } else {
        console.log(`Drive failed for car ${car.id}`);
        dispatch(removeRacingCar(car.id));
        driveInProgressRef.current = false;
      }
    } catch (error) {
      console.log(`Drive command failed for car ${car.id} - car will break down:`, error);
      startCarAnimation(carRaceState.velocity, carRaceState.distance, true);
    }
  };

  const handleIndividualDriveStart = async () => {
    if (!carRaceState) {
      driveInProgressRef.current = false;
      return;
    }

    try {
      console.log(`Sending individual drive command for car ${car.id}`);
      const driveResult = await dispatch(driveCarThunk(car.id)).unwrap();

      if (driveResult.success) {
        console.log(`Individual drive successful for car ${car.id}, starting animation`);
        startCarAnimation(carRaceState.velocity, carRaceState.distance, false);
      } else {
        console.log(`Individual drive failed for car ${car.id}`);
        dispatch(removeRacingCar(car.id));
        driveInProgressRef.current = false;
      }
    } catch (error) {
      console.log(`Individual drive command failed for car ${car.id} - car will break down:`, error);
      startCarAnimation(carRaceState.velocity, carRaceState.distance, true);
    }
  };

  const startCarAnimation = useCallback((velocity: number, distance: number, willBreakDown = false) => {
    if (!carRef.current) {
      driveInProgressRef.current = false;
      return;
    }
    const currentCarRaceState = carRaceStates[car.id];
    if (!currentCarRaceState) {
      driveInProgressRef.current = false;
      return;
    }

    const actualRaceTime = distance / velocity;
    const animationDuration = Math.min(Math.max(actualRaceTime * 100, 3000), 10000);
    const breakDownTime = willBreakDown ? Math.random() * animationDuration * 0.8 + animationDuration * 0.2 : Infinity;

    dispatch(setCarAnimating({ carId: car.id, isAnimating: true }));
    const startTime = Date.now();

    const animate = () => {
      const freshCarRaceState = carRaceStates[car.id];
      if (!freshCarRaceState) {
        driveInProgressRef.current = false;
        return;
      }

      const elapsed = Date.now() - startTime;

      if (willBreakDown && elapsed >= breakDownTime) {
        console.log(`Car ${car.id} broke down at ${elapsed / 1000}s (${((elapsed / animationDuration) * 100).toFixed(1)}% progress)`);
        dispatch(setCarAnimating({ carId: car.id, isAnimating: false }));
        dispatch(removeRacingCar(car.id));
        driveInProgressRef.current = false;
        return;
      }

      const progress = Math.min(elapsed / animationDuration, 1);
      const currentTime = (elapsed / animationDuration) * actualRaceTime;

      dispatch(updateCarPosition({
        carId: car.id,
        position: progress * 100,
        raceTime: currentTime
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        console.log(`Car ${car.id} finished! Actual race time: ${actualRaceTime.toFixed(2)}s`);
        dispatch(finishCarRace({ carId: car.id, finalTime: actualRaceTime }));
        dispatch(removeRacingCar(car.id));
        dispatch(saveWinnerThunk({ carId: car.id, time: actualRaceTime }));
        driveInProgressRef.current = false;

        if (freshCarRaceState.isIndividualRace) {
          console.log(`Car ${car.id} finished individual race in ${actualRaceTime.toFixed(2)}s`);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [raceInProgress, dispatch, car.id, carRaceStates]);

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

  const handleStartEngine = async () => {
    if (!isRacing && !driveInProgressRef.current) {
      try {
        console.log(`Starting individual engine for car ${car.id}`);
        driveInProgressRef.current = false;
        await dispatch(startEngineThunk(car.id)).unwrap();
      } catch (error) {
        console.error('Failed to start engine:', error);
        dispatch(removeRacingCar(car.id));
        driveInProgressRef.current = false;
      }
    }
  };

  const handleStopEngine = () => {
    if (isRacing) {
      console.log(`Stopping engine for car ${car.id} - resetting to start`);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
      dispatch(stopEngineThunk(car.id));
      driveInProgressRef.current = false;
    }
  };

  const getTrackWidth = () => {
    if (!carRef.current?.parentElement) return 300;
    return carRef.current.parentElement.offsetWidth - 120;
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
        {isRacing && carRaceState && (
          <div className="race-info">
            <div>Time: {carRaceState.raceTime.toFixed(2)}s</div>
            <div>Progress: {carRaceState.position.toFixed(1)}%</div>
            <div style={{ fontSize: '10px', color: '#666' }}>
              Speed: {carRaceState.velocity} | Distance: {carRaceState.distance}
            </div>
          </div>
        )}
      </div>

      <div className="race-track">
        <div className="track-line">
          <div className="start-line">START</div>
          <div
            ref={carRef}
            className={`racing-car ${carRaceState?.isAnimating ? 'racing' : ''}`}
            style={{
              backgroundColor: car.color,
              transform: `translateX(${((carRaceState?.position || 0) / 100) * getTrackWidth()}px) translateY(-50%)`
            }}
          />
          <div className="finish-line">FINISH</div>
        </div>
      </div>

      <div className="engine-controls">
        <button
          onClick={handleStartEngine}
          disabled={isRacing || driveInProgressRef.current}
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