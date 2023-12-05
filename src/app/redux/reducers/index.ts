import { ActionReducerMap } from '@ngrx/store';

import { State } from '../models/state.model';
import { profileNode, profileReducer } from './profile.reducer';

export const reducers: ActionReducerMap<State> = {
  [profileNode]: profileReducer
};
