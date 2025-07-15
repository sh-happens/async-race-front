import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { View } from '../types';

interface UiState {
  currentView: View;
  raceInProgress: boolean;
  raceWinner: string | null;
  raceStartTime: number | null;
  winnerDeclared: boolean;
}

const initialState: UiState = {
  currentView: 'garage',
  raceInProgress: false,
  raceWinner: null,
  raceStartTime: null,
  winnerDeclared: false,
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
      if (action.payload) {
        state.raceStartTime = Date.now();
        state.raceWinner = null;
        state.winnerDeclared = false;
      } else {
        state.raceStartTime = null;
      }
    },
    setRaceWinner: (state, action: PayloadAction<string | null>) => {
      if (!state.winnerDeclared && action.payload) {
        state.raceWinner = action.payload;
        state.winnerDeclared = true;
      }
    },
    resetRaceState: (state) => {
      state.raceInProgress = false;
      state.raceWinner = null;
      state.raceStartTime = null;
      state.winnerDeclared = false;
    },
  },
});

export const {
  setCurrentView,
  setRaceInProgress,
  setRaceWinner,
  resetRaceState,
} = uiSlice.actions;

export default uiSlice.reducer;
