import { createAction } from '@ngrx/store';

export enum ModalType {
  openModal = '[modal] openModal',
  closeModal = '[modal] closeModal'
}

export const modalOpenAction = createAction(ModalType.openModal);

export const modalCloseAction = createAction(ModalType.closeModal);
