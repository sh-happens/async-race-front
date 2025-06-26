export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface CarInput {
  name: string;
  color: string;
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export interface RaceResult {
  carId: number;
  time: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerWithCar extends Winner {
  car: Car;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export type View = 'garage' | 'winners';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export type SortField = 'wins' | 'time';
export type SortOrder = 'asc' | 'desc';

export const CARS_PER_PAGE = 7;
export const WINNERS_PER_PAGE = 10;
export const RANDOM_CARS_COUNT = 100;
