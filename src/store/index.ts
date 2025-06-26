import { configureStore } from '@reduxjs/toolkit';
import garageSlice from './garageSlice';
import winnersSlice from './winnersSlice';
import uiSlice from './uiSlice';

export const store = configureStore({
  reducer: {
    garage: garageSlice,
    winners: winnersSlice,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
