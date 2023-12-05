import { profileNode } from '../reducers/profile.reducer';
import { ProfileState } from './profile.model';

export interface State {
  [profileNode]: ProfileState;
}
