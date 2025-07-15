import { useRef, useCallback } from 'react';
import {
  updateCarPosition,
  setCarAnimating,
  finishCarRace,
  removeRacingCar,
} from '../store/garageSlice';
import { saveWinnerThunk } from '../store/winnersThunks';
import { useAppDispatch, useAppSelector } from './redux';

export const useCarRaceAnimation = (carId: number) => {
  const dispatch = useAppDispatch();
  const carRaceStates = useAppSelector((state) => state.garage.carRaceStates);
  const animationRef = useRef<number>(0);
  const driveInProgressRef = useRef<boolean>(false);

  const startCarAnimation = useCallback(
    (velocity: number, distance: number, willBreakDown = false) => {
      const currentCarRaceState = carRaceStates[carId];
      if (!currentCarRaceState) {
        driveInProgressRef.current = false;
        return;
      }

      const actualRaceTime = distance / velocity;
      const animationDuration = Math.min(
        Math.max(actualRaceTime * 100, 3000),
        10000
      );
      const breakDownTime = willBreakDown
        ? Math.random() * animationDuration * 0.8 + animationDuration * 0.2
        : Infinity;

      dispatch(setCarAnimating({ carId, isAnimating: true }));
      const startTime = Date.now();

      const animate = () => {
        const freshCarRaceState = carRaceStates[carId];
        if (!freshCarRaceState) {
          driveInProgressRef.current = false;
          return;
        }

        const elapsed = Date.now() - startTime;

        if (willBreakDown && elapsed >= breakDownTime) {
          console.log(`Car ${carId} broke down at ${elapsed / 1000}s`);
          dispatch(setCarAnimating({ carId, isAnimating: false }));
          dispatch(removeRacingCar(carId));
          driveInProgressRef.current = false;
          return;
        }

        const progress = Math.min(elapsed / animationDuration, 1);
        const currentTime = (elapsed / animationDuration) * actualRaceTime;

        dispatch(
          updateCarPosition({
            carId,
            position: progress * 100,
            raceTime: currentTime,
          })
        );

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          console.log(
            `Car ${carId} finished! Time: ${actualRaceTime.toFixed(2)}s`
          );
          dispatch(finishCarRace({ carId, finalTime: actualRaceTime }));
          dispatch(removeRacingCar(carId));
          dispatch(saveWinnerThunk({ carId, time: actualRaceTime }));
          driveInProgressRef.current = false;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [dispatch, carId, carRaceStates]
  );

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    driveInProgressRef.current = false;
  }, []);

  return {
    startCarAnimation,
    stopAnimation,
    driveInProgressRef,
    animationRef,
  };
};
