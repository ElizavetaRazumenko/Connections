import { createAction, props } from '@ngrx/store';
import { AlertNotify } from '../models/alert.model';

export enum AlertType {
  addNotify = '[alert] addNotify',
  deleteNotify = '[alert] deleteNotify'
}

export const alertAddAlertAction = createAction(
  AlertType.addNotify,
  props<{ notify: AlertNotify }>()
);

export const alertDeleteNotifyAction = createAction(
  AlertType.deleteNotify,
  props<{ id: string }>()
);
