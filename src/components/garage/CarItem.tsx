import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteCarThunk, startEngineThunk, stopEngineThunk, driveCarThunk } from '../../store/garageThunks';
import { setSelectedCar, removeRacingCar } from '../../store/garageSlice';
import { setRaceWinner } from '../../store/uiSlice';
import { saveWinnerThunk } from '../../store/winnersThunks';
import type { Car } from '../../types';
import './CarItem.css';

let globalWinnerDeclared = false;
interface CarItemProps {
  car: Car;
}

const CarItem: React.FC<CarItemProps> = ({ car }) => {
  const dispatch = useAppDispatch();
  const { isLoading, racingCars, engineData } = useAppSelector((state) => state.garage);
  const { raceInProgress, raceWinner } = useAppSelector((state) => state.ui);

  const [carPosition, setCarPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [raceTime, setRaceTime] = useState(0);
  const carRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  const isRacing = racingCars.includes(car.id);
  const carEngineData = engineData[car.id];

  useEffect(() => {
    if (!raceInProgress) {
      console.log(`Resetting car ${car.id} position - race was reset`);
      setCarPosition(0);
      setIsAnimating(false);
      setRaceTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    } else if (!isRacing && carPosition > 0) {
      console.log(`Car ${car.id} stopped individually - keeping position`);
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    }
  }, [raceInProgress, isRacing, car.id, carPosition]);

  useEffect(() => {
    if (raceInProgress && !raceWinner) {
      globalWinnerDeclared = false;
    }
  }, [raceInProgress, raceWinner]);

  useEffect(() => {
    if (isRacing && carEngineData && !isAnimating && raceInProgress) {
      console.log(`Starting drive for car ${car.id}`);
      handleDriveStart();
    }
  }, [isRacing, carEngineData, isAnimating, raceInProgress]);

  const handleDriveStart = async () => {
    if (!carEngineData) return;

    try {
      console.log(`Sending drive command for car ${car.id}`);
      const driveResult = await dispatch(driveCarThunk(car.id)).unwrap();

      if (driveResult.success) {
        console.log(`Drive successful for car ${car.id}, starting animation`);
        startCarAnimation(carEngineData.velocity, carEngineData.distance, false);
      } else {
        console.log(`Drive failed for car ${car.id}`);
        dispatch(removeRacingCar(car.id));
      }
    } catch (error) {
      console.log(`Drive command failed for car ${car.id} - car will break down:`, error);
      startCarAnimation(carEngineData.velocity, carEngineData.distance, true);
    }
  };

  const startCarAnimation = useCallback((velocity: number, distance: number, willBreakDown = false) => {
    if (!carRef.current) return;

    const actualRaceTime = distance / velocity;

    const animationDuration = Math.min(Math.max(actualRaceTime * 100, 3000), 10000);

    const breakDownTime = willBreakDown ? Math.random() * animationDuration * 0.8 + animationDuration * 0.2 : Infinity;

    console.log(`Car ${car.id} starting race:`, {
      velocity,
      distance,
      actualRaceTime: actualRaceTime.toFixed(2) + 's',
      animationDuration: (animationDuration / 1000).toFixed(2) + 's',
      willBreakDown,
      breakDownAt: willBreakDown ? (breakDownTime / 1000).toFixed(2) + 's' : 'never'
    });

    setIsAnimating(true);
    const startTime = Date.now();

    const animate = () => {
      if (!raceInProgress) {
        console.log(`Animation stopped for car ${car.id} - race ended manually`);
        setIsAnimating(false);
        dispatch(removeRacingCar(car.id));
        return;
      }

      const elapsed = Date.now() - startTime;

      if (willBreakDown && elapsed >= breakDownTime) {
        console.log(`Car ${car.id} broke down at ${elapsed / 1000}s (${((elapsed / animationDuration) * 100).toFixed(1)}% progress)`);
        setIsAnimating(false);
        dispatch(removeRacingCar(car.id));
        return;
      }

      const progress = Math.min(elapsed / animationDuration, 1);

      setCarPosition(progress * 100);
      setRaceTime((elapsed / animationDuration) * actualRaceTime);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        console.log(`Car ${car.id} finished! Actual race time: ${actualRaceTime.toFixed(2)}s - staying at finish line`);
        setIsAnimating(false);
        setCarPosition(100);
        dispatch(removeRacingCar(car.id));

        if (!globalWinnerDeclared && !raceWinner) {
          globalWinnerDeclared = true;
          console.log(`Car ${car.id} is the first to finish - declaring winner!`);
          dispatch(setRaceWinner(car.name));
          dispatch(saveWinnerThunk({ carId: car.id, time: actualRaceTime }));

          setTimeout(() => {
            alert(`🏆 ${car.name} wins with time ${actualRaceTime.toFixed(2)}s!`);
          }, 100);
        } else {
          console.log(`Car ${car.id} finished, but winner already declared (global: ${globalWinnerDeclared}, redux: ${raceWinner})`);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [raceInProgress, dispatch, car.id, car.name, raceWinner]);

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
    if (!isRacing && !raceInProgress) {
      try {
        console.log(`Starting individual engine for car ${car.id}`);
        const result = await dispatch(startEngineThunk(car.id)).unwrap();
        console.log(`Individual engine start result for car ${car.id}:`, result);

        handleDriveStart();
      } catch (error) {
        console.error('Failed to start engine:', error);
        dispatch(removeRacingCar(car.id));
      }
    }
  };

  const handleStopEngine = () => {
    if (isRacing) {
      console.log(`Stopping engine for car ${car.id} - resetting to start`);
      setIsAnimating(false);
      setCarPosition(0);
      setRaceTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
      dispatch(stopEngineThunk(car.id));
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
        {isRacing && (
          <div className="race-info">
            <div>Time: {raceTime.toFixed(2)}s</div>
            <div>Progress: {carPosition.toFixed(1)}%</div>
            {carEngineData && (
              <div style={{ fontSize: '10px', color: '#666' }}>
                Speed: {carEngineData.velocity} | Distance: {carEngineData.distance}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="race-track">
        <div className="track-line">
          <div className="start-line">START</div>
          <div
            ref={carRef}
            className={`racing-car ${isAnimating ? 'racing' : ''}`}
            style={{
              backgroundColor: car.color,
              transform: `translateX(${(carPosition / 100) * getTrackWidth()}px) translateY(-50%)`
            }}
          />
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