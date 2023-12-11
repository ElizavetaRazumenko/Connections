import { createReducer, on } from '@ngrx/store';

import * as ModalActions from '../actions/modal.action';
import { ModalState } from '../models/modal.model';

export const modalNode = 'modal';
export const initialState: ModalState = {
  isOpen: false
};

export const modalReducer = createReducer(
  initialState,
  on(
    ModalActions.modalOpenAction,
    (state: ModalState): ModalState => ({
      ...state,
      isOpen: true
    })
  ),
  on(
    ModalActions.modalCloseAction,
    (state: ModalState): ModalState => ({
      ...state,
      isOpen: false
    })
  )
);
