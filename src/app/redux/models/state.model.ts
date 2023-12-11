import { alertNode } from '../reducers/alert.reducer';
import { groupNode } from '../reducers/group.reducer';
import { modalNode } from '../reducers/modal.reducer';
import { profileNode } from '../reducers/profile.reducer';
import { timerGroupNode } from '../reducers/timerGroup.reducer';
import { AlertState } from './alert.model';
import { ModalState } from './modal.model';
import { GroupState } from './group.model';
import { ProfileState } from './profile.model';
import { TimerState } from './timer.model';
import { timerUsersNode } from '../reducers/timerUsers.reducer';
import { UsersState } from './users.model';
import { usersNode } from '../reducers/users.reducer';
import { groupChatsNode } from '../reducers/group-chats.reducer';
import { GroupChatsState } from './group-chats.model';
import { timerGroupChatsNode } from '../reducers/timerGroupChats.reducer';

export interface State {
  [profileNode]: ProfileState;
  [alertNode]: AlertState;
  [timerGroupNode]: TimerState;
  [timerUsersNode]: TimerState;
  [timerGroupChatsNode]: TimerState;
  [groupNode]: GroupState;
  [usersNode]: UsersState;
  [modalNode]: ModalState;
  [groupChatsNode]: GroupChatsState;
}
