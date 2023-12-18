/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import * as UsersActions from '../actions/users.action';
import * as TimerActions from '../actions/timerUsers.action';
import * as AlertActions from '../actions/alert.action';
import {
  HttpService,
  ResponseConversationsData,
  ResponseUsersData
} from 'src/app/core/services/http.service';
import { ConversationsData, UsersData } from '../models/users.model';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService
  ) {}

  getUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.usersGetRequestDataAction),
      switchMap(() =>
        this.httpService.getMembersRequest().pipe(
          mergeMap((data) => [
            TimerActions.timerUsersChangeFlagAction({ timerFlag: true }),
            UsersActions.usersSaveDataAction({
              usersData: this.convertUsersData(data as ResponseUsersData)
            }),
            AlertActions.alertAddAlertAction({
              notify: {
                message: 'Users list updated successfully',
                isSuccess: true,
                id: window.crypto.randomUUID()
              }
            })
          ]),
          catchError((error) => {
            const message = error.error.message as string;
            return of(UsersActions.usersErrorAction({ message }));
          })
        )
      )
    );
  });

  getUsersNoTimer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.usersGetRequestDataNoTimerAction),
      switchMap(() =>
        this.httpService.getMembersRequest().pipe(
          mergeMap((data) => [
            UsersActions.usersSaveDataAction({
              usersData: this.convertUsersData(data as ResponseUsersData)
            })
          ]),
          catchError((error) => {
            const message = error.error.message as string;
            return of(UsersActions.usersErrorAction({ message }));
          })
        )
      )
    );
  });

  getConversations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.usersGetConversationDataAction),
      switchMap(() =>
        this.httpService.getConversationsRequest().pipe(
          mergeMap((data) => [
            UsersActions.usersSaveConversationsAction({
              conversationsData: this.convertConversationsData(
                data as ResponseConversationsData
              )
            })
          ]),
          catchError((error) => {
            const message = error.error.message as string;
            return of(UsersActions.usersErrorAction({ message }));
          })
        )
      )
    );
  });

  private convertUsersData(data: ResponseUsersData): UsersData[] {
    return data.Items.map((item) => ({ name: item.name.S, id: item.uid.S }));
  }

  private convertConversationsData(
    data: ResponseConversationsData
  ): ConversationsData[] {
    return data.Items.map((item) => ({
      id: item.id.S,
      companionID: item.companionID.S
    }));
  }
}
