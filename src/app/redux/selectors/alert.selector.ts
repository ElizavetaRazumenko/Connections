import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertNotify, AlertState } from '../models/alert.model';
import { alertNode } from '../reducers/alert.reducer';

const selectAlertFeature = createFeatureSelector<AlertState>(alertNode);

export const selectAlertNotifies = createSelector(
  selectAlertFeature,
  (state: AlertState): AlertNotify[] => state.alert
);
