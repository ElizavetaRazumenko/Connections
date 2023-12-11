import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModalState } from '../models/modal.model';
import { modalNode } from '../reducers/modal.reducer';

const selectModalFeature = createFeatureSelector<ModalState>(modalNode);

export const selectModalOpening = createSelector(
  selectModalFeature,
  (state: ModalState): boolean => state.isOpen
);
