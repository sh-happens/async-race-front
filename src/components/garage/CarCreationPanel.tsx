import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createCarThunk, updateCarThunk } from '../../store/garageThunks';
import { clearSelectedCar } from '../../store/garageSlice';
import { useModal } from '../../hooks/useModal';
import Modal from '../common/Modal';
import type { CarInput } from '../../types';
import './CarCreationPanel.css';

const CarCreationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedCar, isLoading } = useAppSelector((state) => state.garage);
  const { modalState, closeModal, showError, showSuccess } = useModal();

  const [carName, setCarName] = useState('');
  const [carColor, setCarColor] = useState('#ff0000');

  useEffect(() => {
    if (selectedCar) {
      setCarName(selectedCar.name);
      setCarColor(selectedCar.color);
    }
  }, [selectedCar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!carName.trim()) {
      showError('Validation Error', 'Please enter a car name before creating or updating the car.');
      return;
    }

    const carData: CarInput = {
      name: carName.trim(),
      color: carColor,
    };

    try {
      if (selectedCar) {
        await dispatch(updateCarThunk({ id: selectedCar.id, carData })).unwrap();
        showSuccess('Car Updated', `Successfully updated "${carName}"!`);
      } else {
        await dispatch(createCarThunk(carData)).unwrap();
        showSuccess('Car Created', `Successfully created "${carName}"!`);
      }

      setCarName('');
      setCarColor('#ff0000');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const action = selectedCar ? 'update' : 'create';
      showError(
        'Operation Failed',
        `Failed to ${action} the car. Please check your connection and try again.`
      );
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedCar());
    setCarName('');
    setCarColor('#ff0000');
  };

  return (
    <>
      <div className="car-creation-panel">
        <h3 className="panel-title">
          {selectedCar ? 'Update Car' : 'Create New Car'}
        </h3>

        <form onSubmit={handleSubmit} className="car-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="car-name">Car Name:</label>
              <input
                id="car-name"
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="Enter car name (e.g., Tesla Model S)"
                maxLength={50}
                className="car-name-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-color">Color:</label>
              <div className="color-picker-container">
                <input
                  id="car-color"
                  type="color"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  className="color-picker"
                />
                <span className="color-value">{carColor}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button primary"
            >
              {isLoading ? 'Saving...' : (selectedCar ? 'Update' : 'Create')}
            </button>

            {selectedCar && (
              <button
                type="button"
                onClick={handleCancel}
                className="submit-button secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />
    </>
  );
};

export default CarCreationPanel;