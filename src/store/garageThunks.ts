import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import type { CarInput } from '../types';
import { CARS_PER_PAGE } from '../types';

export const fetchCars = createAsyncThunk(
  'garage/fetchCars',
  async ({ page = 1 }: { page?: number } = {}) => {
    const response = await api.getCars(page, CARS_PER_PAGE);
    return { cars: response.data, totalCount: response.totalCount, page };
  }
);

export const createCarThunk = createAsyncThunk(
  'garage/createCar',
  async (carData: CarInput) => {
    return await api.createCar(carData);
  }
);

export const updateCarThunk = createAsyncThunk(
  'garage/updateCar',
  async ({ id, carData }: { id: number; carData: CarInput }) => {
    return await api.updateCar(id, carData);
  }
);

export const deleteCarThunk = createAsyncThunk(
  'garage/deleteCar',
  async (id: number) => {
    await api.deleteCar(id);
    return id;
  }
);

export const createRandomCarsThunk = createAsyncThunk(
  'garage/createRandomCars',
  async (cars: CarInput[]) => {
    const promises = cars.map((car) => api.createCar(car));
    return await Promise.all(promises);
  }
);

export const startEngineThunk = createAsyncThunk(
  'garage/startEngine',
  async (carId: number) => {
    const response = await api.startEngine(carId);
    return { carId, ...response };
  }
);

export const stopEngineThunk = createAsyncThunk(
  'garage/stopEngine',
  async (carId: number) => {
    await api.stopEngine(carId);
    return carId;
  }
);

export const driveCarThunk = createAsyncThunk(
  'garage/driveCar',
  async (carId: number) => {
    const response = await api.driveEngine(carId);
    return { carId, success: response.success };
  }
);
