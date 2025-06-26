import { CAR_BRANDS, CAR_MODELS } from './constants';
import type { CarInput } from '../types';

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomColor = (): string => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, '0')}`;
};

export const generateRandomCarName = (): string => {
  const randomBrand = CAR_BRANDS[getRandomInt(0, CAR_BRANDS.length - 1)];
  const randomModel = CAR_MODELS[getRandomInt(0, CAR_MODELS.length - 1)];
  return `${randomBrand} ${randomModel}`;
};

export const generateRandomCar = (): CarInput => ({
  name: generateRandomCarName(),
  color: generateRandomColor(),
});

export const generateRandomCars = (count: number): CarInput[] => {
  return Array.from({ length: count }, () => generateRandomCar());
};
