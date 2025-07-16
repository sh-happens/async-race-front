import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showModal = (options: Omit<ModalState, 'isOpen'>) => {
    setModalState({
      ...options,
      isOpen: true,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const showInfo = (title: string, message: string, confirmText = 'OK') => {
    showModal({ title, message, type: 'info', confirmText });
  };

  const showWarning = (title: string, message: string, confirmText = 'OK') => {
    showModal({ title, message, type: 'warning', confirmText });
  };

  const showError = (title: string, message: string, confirmText = 'OK') => {
    showModal({ title, message, type: 'error', confirmText });
  };

  const showSuccess = (title: string, message: string, confirmText = 'OK') => {
    showModal({ title, message, type: 'success', confirmText });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    showModal({
      title,
      message,
      type: 'confirm',
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  return {
    modalState,
    closeModal,
    showModal,
    showInfo,
    showWarning,
    showError,
    showSuccess,
    showConfirm,
  };
};
