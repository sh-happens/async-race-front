import React, { useRef } from 'react';
import { useCarRaceAnimation } from '../../hooks/useCarRaceAnimation';
import { useCarControls } from '../../hooks/useCarControls';
import { useCarRaceEffects } from '../../hooks/useCarRaceEffects';
import { useModal } from '../../hooks/useModal';
import { useAppSelector } from '../../hooks/redux';
import Modal from '../common/Modal';
import type { Car } from '../../types';
import './CarItem.css';

interface CarItemProps {
  car: Car;
}

const CarItem: React.FC<CarItemProps> = ({ car }) => {
  const { carRaceStates } = useAppSelector(state => state.garage);
  const carRef = useRef<HTMLDivElement>(null);

  const { modalState, closeModal, showError, showConfirm, showSuccess } = useModal();

  const { startCarAnimation, stopAnimation, driveInProgressRef } = useCarRaceAnimation(car.id);

  const {
    handleSelect,
    handleDelete,
    handleStartEngine,
    handleStopEngine,
    isRacing,
    isLoading,
    raceInProgress
  } = useCarControls(car, { showError, showConfirm });

  useCarRaceEffects(car, startCarAnimation, stopAnimation, driveInProgressRef, { showSuccess });

  React.useEffect(() => {
    return stopAnimation;
  }, [stopAnimation]);

  const carRaceState = carRaceStates[car.id];

  const getTrackWidth = () => {
    if (!carRef.current?.parentElement) {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 320) return 200;
      if (screenWidth <= 500) return 250;
      if (screenWidth <= 768) return 300;
      return 400;
    }

    const trackContainer = carRef.current.parentElement;
    const containerWidth = trackContainer.offsetWidth;

    const screenWidth = window.innerWidth;
    let padding;

    if (screenWidth <= 320) {
      padding = 80;
    } else if (screenWidth <= 500) {
      padding = 100;
    } else if (screenWidth <= 768) {
      padding = 120;
    } else {
      padding = 140;
    }

    return Math.max(containerWidth - padding, 150);
  };

  return (
    <>
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
    </>
  );
};

export default CarItem