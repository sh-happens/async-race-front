import {
  deleteCarThunk,
  startEngineThunk,
  stopEngineThunk,
} from '../store/garageThunks';
import { setSelectedCar, removeRacingCar } from '../store/garageSlice';
import type { Car } from '../types';
import { useAppDispatch, useAppSelector } from './redux';

interface ModalFunctions {
  showError: (title: string, message: string) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

export const useCarControls = (car: Car, modalFunctions: ModalFunctions) => {
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
      modalFunctions.showError(
        'Cannot Delete Car',
        'Cannot delete car during race. Please stop or finish the race first.'
      );
      return;
    }

    modalFunctions.showConfirm(
      'Delete Car',
      `Are you sure you want to delete "${car.name}"? This action cannot be undone.`,
      () => {
        dispatch(deleteCarThunk(car.id));
      },
      'Delete',
      'Cancel'
    );
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
        modalFunctions.showError(
          'Engine Start Failed',
          `Failed to start the engine for "${car.name}". Please check your connection and try again.`
        );
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
