import { useEffect } from 'react';
import { driveCarThunk } from '../store/garageThunks';
import {
  removeRacingCar,
  setCarAnimating,
  resetCarRaceState,
  setCarRaceType,
} from '../store/garageSlice';
import { setRaceWinner } from '../store/uiSlice';
import type { Car } from '../types';
import { useAppDispatch, useAppSelector } from './redux';

interface ModalFunctions {
  showSuccess: (title: string, message: string) => void;
}

export const useCarRaceEffects = (
  car: Car,
  startCarAnimation: (
    velocity: number,
    distance: number,
    willBreakDown?: boolean
  ) => void,
  stopAnimation: () => void,
  driveInProgressRef: React.MutableRefObject<boolean>,
  modalFunctions: ModalFunctions
) => {
  const dispatch = useAppDispatch();
  const { racingCars, carRaceStates, firstFinisher } = useAppSelector(
    (state) => state.garage
  );
  const { raceInProgress, raceWinner } = useAppSelector((state) => state.ui);

  const isRacing = racingCars.includes(car.id);
  const carRaceState = carRaceStates[car.id];

  useEffect(() => {
    if (
      firstFinisher === car.id &&
      !raceWinner &&
      raceInProgress &&
      carRaceState?.isFinished
    ) {
      console.log(`Car ${car.id} is the winner!`);
      dispatch(setRaceWinner(car.name));

      setTimeout(() => {
        modalFunctions.showSuccess(
          'Race Winner! 🏆',
          `${car.name} wins with time ${carRaceState.raceTime.toFixed(2)}s!`
        );
      }, 100);
    }
  }, [
    firstFinisher,
    car.id,
    car.name,
    raceWinner,
    raceInProgress,
    carRaceState?.isFinished,
    carRaceState?.raceTime,
    dispatch,
    modalFunctions,
  ]);

  useEffect(() => {
    if (
      !raceInProgress &&
      carRaceState?.position > 0 &&
      !carRaceState.isIndividualRace
    ) {
      console.log(`Resetting car ${car.id} position - general race was reset`);
      dispatch(resetCarRaceState(car.id));
      stopAnimation();
    }
  }, [
    raceInProgress,
    dispatch,
    car.id,
    carRaceState?.position,
    carRaceState?.isIndividualRace,
    stopAnimation,
  ]);

  useEffect(() => {
    if (!isRacing && carRaceState?.isAnimating) {
      console.log(`Car ${car.id} stopped individually - keeping position`);
      dispatch(setCarAnimating({ carId: car.id, isAnimating: false }));
      stopAnimation();
    }
  }, [isRacing, carRaceState?.isAnimating, dispatch, car.id, stopAnimation]);

  useEffect(() => {
    if (
      isRacing &&
      carRaceState &&
      !carRaceState.isAnimating &&
      !carRaceState.isFinished &&
      !driveInProgressRef.current
    ) {
      const isIndividualRace = !raceInProgress;
      dispatch(setCarRaceType({ carId: car.id, isIndividualRace }));

      console.log(
        `Starting drive for car ${car.id} (${raceInProgress ? 'general race' : 'individual race'})`
      );
      driveInProgressRef.current = true;

      const handleDrive = async () => {
        if (!carRaceState) {
          driveInProgressRef.current = false;
          return;
        }

        try {
          console.log(`Sending drive command for car ${car.id}`);
          const driveResult = await dispatch(driveCarThunk(car.id)).unwrap();

          if (driveResult.success) {
            console.log(
              `Drive successful for car ${car.id}, starting animation`
            );
            startCarAnimation(
              carRaceState.velocity,
              carRaceState.distance,
              false
            );
          } else {
            console.log(`Drive failed for car ${car.id}`);
            dispatch(removeRacingCar(car.id));
            driveInProgressRef.current = false;
          }
        } catch (error) {
          console.log(
            `Drive command failed for car ${car.id} - car will break down:`,
            error
          );
          startCarAnimation(carRaceState.velocity, carRaceState.distance, true);
        }
      };

      handleDrive();
    }
  }, [
    isRacing,
    carRaceState,
    dispatch,
    car.id,
    raceInProgress,
    startCarAnimation,
    driveInProgressRef,
  ]);
};
