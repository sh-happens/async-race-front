import { API_BASE_URL } from '../utils/constants';
import type {
  Car,
  CarInput,
  Winner,
  EngineResponse,
  DriveResponse,
  SortField,
  SortOrder,
} from '../types';

class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP ${response.status}: ${response.statusText}`
    );
  }
  return response.json() as Promise<T>;
};

export const getCars = async (
  page = 1,
  limit = 7
): Promise<{ data: Car[]; totalCount: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/garage?_page=${page}&_limit=${limit}`
  );
  const data = await handleResponse<Car[]>(response);
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
  return { data, totalCount };
};

export const getCar = async (id: number): Promise<Car> => {
  const response = await fetch(`${API_BASE_URL}/garage/${id}`);
  return handleResponse<Car>(response);
};

export const createCar = async (car: CarInput): Promise<Car> => {
  const response = await fetch(`${API_BASE_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return handleResponse<Car>(response);
};

export const updateCar = async (id: number, car: CarInput): Promise<Car> => {
  const response = await fetch(`${API_BASE_URL}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return handleResponse<Car>(response);
};

export const deleteCar = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/garage/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to delete car ${id}`);
  }
};

export const startEngine = async (id: number): Promise<EngineResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/engine?id=${id}&status=started`,
    {
      method: 'PATCH',
    }
  );
  return handleResponse<EngineResponse>(response);
};

export const stopEngine = async (id: number): Promise<EngineResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/engine?id=${id}&status=stopped`,
    {
      method: 'PATCH',
    }
  );
  return handleResponse<EngineResponse>(response);
};

export const driveEngine = async (id: number): Promise<DriveResponse> => {
  const response = await fetch(`${API_BASE_URL}/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  });

  if (response.status === 500) {
    return { success: false };
  }

  return handleResponse<DriveResponse>(response);
};

export const getWinners = async (
  page = 1,
  limit = 10,
  sort?: SortField,
  order?: SortOrder
): Promise<{ data: Winner[]; totalCount: number }> => {
  let url = `${API_BASE_URL}/winners?_page=${page}&_limit=${limit}`;

  if (sort && order) {
    url += `&_sort=${sort}&_order=${order}`;
  }

  const response = await fetch(url);
  const data = await handleResponse<Winner[]>(response);
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
  return { data, totalCount };
};

export const getWinner = async (id: number): Promise<Winner> => {
  const response = await fetch(`${API_BASE_URL}/winners/${id}`);
  return handleResponse<Winner>(response);
};

export const createWinner = async (winner: {
  id: number;
  wins: number;
  time: number;
}): Promise<Winner> => {
  const response = await fetch(`${API_BASE_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return handleResponse<Winner>(response);
};

export const updateWinner = async (
  id: number,
  winner: Omit<Winner, 'id'>
): Promise<Winner> => {
  const response = await fetch(`${API_BASE_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return handleResponse<Winner>(response);
};

export const deleteWinner = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/winners/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to delete winner ${id}`);
  }
};
