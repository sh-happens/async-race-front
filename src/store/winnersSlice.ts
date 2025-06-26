import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  WinnerWithCar,
  LoadingState,
  SortField,
  SortOrder,
} from '../types';

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
    setWinners: (state, action: PayloadAction<WinnerWithCar[]>) => {
      state.winners = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWinners,
  setCurrentPage,
  setTotalCount,
  setSortField,
  setSortOrder,
  setLoading,
  setError,
} = winnersSlice.actions;

export default winnersSlice.reducer;
