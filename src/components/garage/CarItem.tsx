import React, { useRef } from 'react';
import { useCarRaceAnimation } from '../../hooks/useCarRaceAnimation';
import { useCarControls } from '../../hooks/useCarControls';
import { useCarRaceEffects } from '../../hooks/useCarRaceEffects';
import { useAppSelector } from '../../hooks/redux';
import type { Car } from '../../types';
import './CarItem.css';

interface CarItemProps {
  car: Car;
}

const CarItem: React.FC<CarItemProps> = ({ car }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { carRaceStates, racingCars } = useAppSelector(state => state.garage);
  const carRef = useRef<HTMLDivElement>(null);

  const { startCarAnimation, stopAnimation, driveInProgressRef } = useCarRaceAnimation(car.id);
  const {
    handleSelect,
    handleDelete,
    handleStartEngine,
    handleStopEngine,
    isRacing,
    isLoading,
    raceInProgress
  } = useCarControls(car);

  useCarRaceEffects(car, startCarAnimation, stopAnimation, driveInProgressRef);

  React.useEffect(() => {
    return stopAnimation;
  }, [stopAnimation]);

  const carRaceState = carRaceStates[car.id];

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
          onClick={() => handleStartEngine(driveInProgressRef)}
          disabled={isRacing || driveInProgressRef.current}
          className="control-button start"
          title="Start engine"
        >
          Start
        </button>
        <button
          onClick={() => handleStopEngine(stopAnimation)}
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

export default CarItem