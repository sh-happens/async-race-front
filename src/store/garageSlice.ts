import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car, LoadingState } from '../types';

interface GarageState extends LoadingState {
  cars: Car[];
  currentPage: number;
  totalCount: number;
  selectedCar: Car | null;
  racingCars: Set<number>;
}

const initialState: GarageState = {
  cars: [],
  currentPage: 1,
  totalCount: 0,
  selectedCar: null,
  racingCars: new Set(),
  isLoading: false,
  error: null,
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCars: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload;
    },
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload);
      state.totalCount += 1;
    },
    updateCar: (state, action: PayloadAction<Car>) => {
      const index = state.cars.findIndex((car) => car.id === action.payload.id);
      if (index !== -1) {
        state.cars[index] = action.payload;
      }
    },
    removeCar: (state, action: PayloadAction<number>) => {
      state.cars = state.cars.filter((car) => car.id !== action.payload);
      state.totalCount -= 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setSelectedCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addRacingCar: (state, action: PayloadAction<number>) => {
      state.racingCars.add(action.payload);
    },
    removeRacingCar: (state, action: PayloadAction<number>) => {
      state.racingCars.delete(action.payload);
    },
    clearRacingCars: (state) => {
      state.racingCars.clear();
    },
  },
});

export const {
  setCars,
  addCar,
  updateCar,
  removeCar,
  setCurrentPage,
  setTotalCount,
  setSelectedCar,
  setLoading,
  setError,
  addRacingCar,
  removeRacingCar,
  clearRacingCars,
} = garageSlice.actions;

export default garageSlice.reducer;
