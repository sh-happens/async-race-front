import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { View } from '../types';

interface UiState {
  currentView: View;
  raceInProgress: boolean;
  raceWinner: string | null;
}

const initialState: UiState = {
  currentView: 'garage',
  raceInProgress: false,
  raceWinner: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<View>) => {
      state.currentView = action.payload;
    },
    setRaceInProgress: (state, action: PayloadAction<boolean>) => {
      state.raceInProgress = action.payload;
    },
    setRaceWinner: (state, action: PayloadAction<string | null>) => {
      state.raceWinner = action.payload;
    },
  },
});

export const { setCurrentView, setRaceInProgress, setRaceWinner } =
  uiSlice.actions;

export default uiSlice.reducer;
