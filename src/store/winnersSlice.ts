import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WinnerWithCar,
  LoadingState,
  SortField,
  SortOrder,
} from '../types';
import { fetchWinners, saveWinnerThunk } from './winnersThunks';

interface WinnersState extends LoadingState {
  winners: WinnerWithCar[];
  currentPage: number;
  totalCount: number;
  sortField: SortField;
  sortOrder: SortOrder;
}

const initialState: WinnersState = {
  winners: [],
  currentPage: 1,
  totalCount: 0,
  sortField: 'wins',
  sortOrder: 'desc',
  isLoading: false,
  error: null,
};

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWinners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.winners = action.payload.winners;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchWinners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch winners';
      });

    builder
      .addCase(saveWinnerThunk.fulfilled, () => {})
      .addCase(saveWinnerThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to save winner';
      });
  },
});

export const { setCurrentPage, setSortField, setSortOrder, clearError } =
  winnersSlice.actions;

export default winnersSlice.reducer;
