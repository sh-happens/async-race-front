import {
  deleteCarThunk,
  startEngineThunk,
  stopEngineThunk,
} from '../store/garageThunks';
import { setSelectedCar, removeRacingCar } from '../store/garageSlice';
import type { Car } from '../types';
import { useAppDispatch, useAppSelector } from './redux';

export const useCarControls = (car: Car) => {
  const dispatch = useAppDispatch();
  const { isLoading, racingCars } = useAppSelector((state) => state.garage);
  const raceInProgress = useAppSelector((state) => state.ui.raceInProgress);

  const isRacing = racingCars.includes(car.id);

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

  const handleStartEngine = async (
    driveInProgressRef: React.MutableRefObject<boolean>
  ) => {
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

  const handleStopEngine = (stopAnimation: () => void) => {
    if (isRacing) {
      console.log(`Stopping engine for car ${car.id} - resetting to start`);
      stopAnimation();
      dispatch(stopEngineThunk(car.id));
    }
  };

  return {
    handleSelect,
    handleDelete,
    handleStartEngine,
    handleStopEngine,
    isRacing,
    isLoading,
    raceInProgress,
  };
};
