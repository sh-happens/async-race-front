import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import type { SortField, SortOrder, WinnerWithCar } from '../types';
import { WINNERS_PER_PAGE } from '../types';

export const fetchWinners = createAsyncThunk(
  'winners/fetchWinners',
  async ({
    page = 1,
    sort,
    order,
  }: {
    page?: number;
    sort?: SortField;
    order?: SortOrder;
  } = {}) => {
    const winnersResponse = await api.getWinners(
      page,
      WINNERS_PER_PAGE,
      sort,
      order
    );

    const winnersWithCars: WinnerWithCar[] = await Promise.all(
      winnersResponse.data.map(async (winner) => {
        const car = await api.getCar(winner.id);
        return { ...winner, car };
      })
    );

    return {
      winners: winnersWithCars,
      totalCount: winnersResponse.totalCount,
      page,
    };
  }
);

export const saveWinnerThunk = createAsyncThunk(
  'winners/saveWinner',
  async ({ carId, time }: { carId: number; time: number }) => {
    try {
      const existingWinner = await api.getWinner(carId);

      const updatedWinner = {
        wins: existingWinner.wins + 1,
        time: time < existingWinner.time ? time : existingWinner.time,
      };

      return await api.updateWinner(carId, updatedWinner);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return await api.createWinner({
        id: carId,
        wins: 1,
        time,
      });
    }
  }
);

export const deleteWinnerThunk = createAsyncThunk(
  'winners/deleteWinner',
  async (carId: number) => {
    try {
      await api.deleteWinner(carId);
      return carId;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return carId;
    }
  }
);
