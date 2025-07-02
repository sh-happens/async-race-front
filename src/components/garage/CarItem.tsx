import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteCarThunk, startEngineThunk, stopEngineThunk, driveCarThunk } from '../../store/garageThunks';
import { setSelectedCar, removeRacingCar } from '../../store/garageSlice';
import { setRaceWinner } from '../../store/uiSlice';
import { saveWinnerThunk } from '../../store/winnersThunks';
import type { Car } from '../../types';
import './CarItem.css';

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
  const raceStartTime = useRef<number>(0);
  const animationRef = useRef<number>(0);

  const isRacing = racingCars.includes(car.id);
  const carEngineData = engineData[car.id];

  useEffect(() => {
    if (!raceInProgress && !isRacing) {
      setCarPosition(0);
      setIsAnimating(false);
      setRaceTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [raceInProgress, isRacing]);

  const startCarAnimation = useCallback((velocity: number, distance: number) => {
    if (!carRef.current) return;

    setIsAnimating(true);
    raceStartTime.current = Date.now();

    const animationDuration = (distance / velocity) * 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      setCarPosition(progress * 100);
      setRaceTime(elapsed / 1000);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (progress >= 1) {
        setIsAnimating(false);
        dispatch(removeRacingCar(car.id));

        if (!raceWinner) {
          dispatch(setRaceWinner(car.name));
          dispatch(saveWinnerThunk({ carId: car.id, time: elapsed / 1000 }));

          setTimeout(() => {
            alert(`🏆 ${car.name} wins with time ${(elapsed / 1000).toFixed(2)}s!`);
          }, 100);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [dispatch, car.id, car.name, raceWinner]);

  useEffect(() => {
    if (isRacing && carEngineData && !isAnimating) {
      startCarAnimation(carEngineData.velocity, carEngineData.distance);
    }
  }, [isRacing, carEngineData, isAnimating, startCarAnimation]);

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
        const result = await dispatch(startEngineThunk(car.id)).unwrap();

        const driveResult = await dispatch(driveCarThunk(car.id)).unwrap();

        if (driveResult.success) {
          startCarAnimation(result.velocity, result.distance);
        } else {
          setTimeout(() => {
            setIsAnimating(false);
            dispatch(removeRacingCar(car.id));
          }, Math.random() * 2000 + 1000);
        }
      } catch (error) {
        console.error('Failed to start engine:', error);
        dispatch(removeRacingCar(car.id));
      }
    }
  };

  const handleStopEngine = () => {
    if (isRacing) {
      setIsAnimating(false);
      setCarPosition(0);
      setRaceTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
        {isRacing && (
          <div className="race-info">
            <span className="race-time">Time: {raceTime.toFixed(2)}s</span>
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
              transform: `translateX(${carPosition * 3}px)`
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