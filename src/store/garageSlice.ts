// src/store/garageSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car, LoadingState } from '../types';
import {
  fetchCars,
  createCarThunk,
  updateCarThunk,
  deleteCarThunk,
  createRandomCarsThunk,
  generateRandomCarsThunk, // Add this import
  startEngineThunk,
  stopEngineThunk,
} from './garageThunks';

interface GarageState extends LoadingState {
  cars: Car[];
  currentPage: number;
  totalCount: number;
  selectedCar: Car | null;
  racingCars: Set<number>;
  engineData: Record<number, { velocity: number; distance: number }>;
}

const initialState: GarageState = {
  cars: [],
  currentPage: 1,
  totalCount: 0,
  selectedCar: null,
  racingCars: new Set(),
  engineData: {},
  isLoading: false,
  error: null,
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    clearSelectedCar: (state) => {
      state.selectedCar = null;
    },
    clearError: (state) => {
      state.error = null;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload.cars;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cars';
      });

    builder
      .addCase(createCarThunk.fulfilled, (state, action) => {
        state.cars.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createCarThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create car';
      });

    builder
      .addCase(updateCarThunk.fulfilled, (state, action) => {
        const index = state.cars.findIndex(
          (car) => car.id === action.payload.id
        );
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
        state.selectedCar = null;
      })
      .addCase(updateCarThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update car';
      });

    builder
      .addCase(deleteCarThunk.fulfilled, (state, action) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedCar?.id === action.payload) {
          state.selectedCar = null;
        }
      })
      .addCase(deleteCarThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete car';
      });

    builder
      .addCase(createRandomCarsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRandomCarsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalCount += action.payload.length;
      })
      .addCase(createRandomCarsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create random cars';
      });

    // Add handler for generateRandomCarsThunk
    builder
      .addCase(generateRandomCarsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateRandomCarsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalCount += action.payload.length;
      })
      .addCase(generateRandomCarsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to generate random cars';
      });

    builder
      .addCase(startEngineThunk.fulfilled, (state, action) => {
        const { carId, velocity, distance } = action.payload;
        state.engineData[carId] = { velocity, distance };
        state.racingCars.add(carId);
      })
      .addCase(stopEngineThunk.fulfilled, (state, action) => {
        const carId = action.payload;
        delete state.engineData[carId];
        state.racingCars.delete(carId);
      });
  },
});

export const {
  setCurrentPage,
  setSelectedCar,
  clearSelectedCar,
  clearError,
  addRacingCar,
  removeRacingCar,
  clearRacingCars,
} = garageSlice.actions;

export default garageSlice.reducer;
