import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car, LoadingState } from '../types';
import {
  fetchCars,
  createCarThunk,
  updateCarThunk,
  deleteCarThunk,
  createRandomCarsThunk,
  generateRandomCarsThunk,
  startEngineThunk,
  stopEngineThunk,
} from './garageThunks';

interface CarRaceState {
  position: number;
  isAnimating: boolean;
  raceTime: number;
  startTime: number | null;
  isFinished: boolean;
  velocity: number;
  distance: number;
  isIndividualRace: boolean;
}

interface FormState {
  carName: string;
  carColor: string;
}

interface GarageState extends LoadingState {
  cars: Car[];
  currentPage: number;
  totalCount: number;
  selectedCar: Car | null;
  racingCars: number[];
  engineData: Record<number, { velocity: number; distance: number }>;
  carRaceStates: Record<number, CarRaceState>;
  formState: FormState;
  firstFinisher: number | null;
}

const initialState: GarageState = {
  cars: [],
  currentPage: 1,
  totalCount: 0,
  selectedCar: null,
  racingCars: [],
  engineData: {},
  carRaceStates: {},
  formState: {
    carName: '',
    carColor: '#ff0000',
  },
  isLoading: false,
  error: null,
  firstFinisher: null,
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
      if (action.payload) {
        state.formState.carName = action.payload.name;
        state.formState.carColor = action.payload.color;
      }
    },
    clearSelectedCar: (state) => {
      state.selectedCar = null;
      state.formState.carName = '';
      state.formState.carColor = '#ff0000';
    },
    clearError: (state) => {
      state.error = null;
    },
    addRacingCar: (state, action: PayloadAction<number>) => {
      if (!state.racingCars.includes(action.payload)) {
        state.racingCars.push(action.payload);
      }
    },
    clearFirstFinisher: (state) => {
      state.firstFinisher = null;
    },
    removeRacingCar: (state, action: PayloadAction<number>) => {
      state.racingCars = state.racingCars.filter((id) => id !== action.payload);
    },
    clearRacingCars: (state) => {
      state.racingCars = [];
    },
    setFormCarName: (state, action: PayloadAction<string>) => {
      state.formState.carName = action.payload;
    },
    setFormCarColor: (state, action: PayloadAction<string>) => {
      state.formState.carColor = action.payload;
    },
    resetForm: (state) => {
      state.formState.carName = '';
      state.formState.carColor = '#ff0000';
    },
    initCarRaceState: (
      state,
      action: PayloadAction<{
        carId: number;
        velocity: number;
        distance: number;
        isIndividualRace: boolean;
      }>
    ) => {
      const { carId, velocity, distance, isIndividualRace } = action.payload;
      state.carRaceStates[carId] = {
        position: 0,
        isAnimating: false,
        raceTime: 0,
        startTime: Date.now(),
        isFinished: false,
        velocity,
        distance,
        isIndividualRace,
      };
    },

    updateCarPosition: (
      state,
      action: PayloadAction<{
        carId: number;
        position: number;
        raceTime: number;
      }>
    ) => {
      const { carId, position, raceTime } = action.payload;
      if (state.carRaceStates[carId]) {
        state.carRaceStates[carId].position = position;
        state.carRaceStates[carId].raceTime = raceTime;
      }
    },

    setCarAnimating: (
      state,
      action: PayloadAction<{ carId: number; isAnimating: boolean }>
    ) => {
      const { carId, isAnimating } = action.payload;
      if (state.carRaceStates[carId]) {
        state.carRaceStates[carId].isAnimating = isAnimating;
      }
    },

    finishCarRace: (
      state,
      action: PayloadAction<{
        carId: number;
        finalTime: number;
        isIndividualRace?: boolean;
      }>
    ) => {
      const { carId, finalTime, isIndividualRace } = action.payload;
      if (state.carRaceStates[carId]) {
        state.carRaceStates[carId].isFinished = true;
        state.carRaceStates[carId].isAnimating = false;
        state.carRaceStates[carId].position = 100;
        state.carRaceStates[carId].raceTime = finalTime;

        if (!isIndividualRace && !state.carRaceStates[carId].isIndividualRace) {
          const finishedGeneralRaceCars = Object.entries(
            state.carRaceStates
          ).filter(
            ([, raceState]) =>
              raceState.isFinished && !raceState.isIndividualRace
          );
          if (finishedGeneralRaceCars.length === 1) {
            state.firstFinisher = carId;
          }
        }
      }
    },

    resetCarRaceState: (state, action: PayloadAction<number>) => {
      const carId = action.payload;
      if (state.carRaceStates[carId]) {
        state.carRaceStates[carId] = {
          ...state.carRaceStates[carId],
          position: 0,
          isAnimating: false,
          raceTime: 0,
          startTime: null,
          isFinished: false,
        };
      }
    },

    clearAllRaceStates: (state) => {
      Object.keys(state.carRaceStates).forEach((carId) => {
        const numericCarId = parseInt(carId);
        if (state.carRaceStates[numericCarId]) {
          state.carRaceStates[numericCarId] = {
            ...state.carRaceStates[numericCarId],
            position: 0,
            isAnimating: false,
            raceTime: 0,
            startTime: null,
            isFinished: false,
          };
        }
      });
      state.firstFinisher = null;
    },

    setCarRaceType: (
      state,
      action: PayloadAction<{ carId: number; isIndividualRace: boolean }>
    ) => {
      const { carId, isIndividualRace } = action.payload;
      if (state.carRaceStates[carId]) {
        state.carRaceStates[carId].isIndividualRace = isIndividualRace;
      }
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
        if (!state.selectedCar) {
          state.formState.carName = '';
          state.formState.carColor = '#ff0000';
        }
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
        state.formState.carName = '';
        state.formState.carColor = '#ff0000';
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
          state.formState.carName = '';
          state.formState.carColor = '#ff0000';
        }

        state.racingCars = state.racingCars.filter(
          (id) => id !== action.payload
        );
        delete state.carRaceStates[action.payload];
        delete state.engineData[action.payload];
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
        if (!state.racingCars.includes(carId)) {
          state.racingCars.push(carId);
        }
        state.carRaceStates[carId] = {
          position: 0,
          isAnimating: false,
          raceTime: 0,
          startTime: Date.now(),
          isFinished: false,
          velocity,
          distance,
          isIndividualRace: false,
        };
      })
      .addCase(stopEngineThunk.fulfilled, (state, action) => {
        const carId = action.payload;
        delete state.engineData[carId];
        state.racingCars = state.racingCars.filter((id) => id !== carId);
        if (state.carRaceStates[carId]) {
          state.carRaceStates[carId] = {
            ...state.carRaceStates[carId],
            position: 0,
            isAnimating: false,
            raceTime: 0,
            startTime: null,
            isFinished: false,
          };
        }
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
  setFormCarName,
  setFormCarColor,
  resetForm,
  initCarRaceState,
  updateCarPosition,
  setCarAnimating,
  finishCarRace,
  resetCarRaceState,
  clearAllRaceStates,
  setCarRaceType,
  clearFirstFinisher,
} = garageSlice.actions;

export default garageSlice.reducer;
