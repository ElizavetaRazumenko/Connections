/* eslint-disable @ngrx/no-dispatch-in-effects */
/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, of, switchMap, take } from 'rxjs';
import * as UserChatsActions from '../actions/user-chats.action';
import * as TimerActions from '../actions/timerUserChats.action';
import * as AlertActions from '../actions/alert.action';
import {
  HttpService,
  ResponseUserMessagesData
} from 'src/app/core/services/http.service';
import { UserChat } from '../models/user-chats.model';

@Injectable()
export class UserChatsEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService
  ) {}

  getUserChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserChatsActions.chatsSendDataAction),
      switchMap((requestData) =>
        this.httpService
          .getUsersMessages(requestData.id, requestData.since)
          .pipe(
            mergeMap((data) => [
              UserChatsActions.chatsSaveDataAction({
                chatData: this.convertData(
                  requestData.id,
                  data.body as ResponseUserMessagesData
                )
              }),
              TimerActions.timerChangeFlagAction({ timerFlag: true }),
              AlertActions.alertAddAlertAction({
                notify: {
                  message: 'Users chat updated successfully',
                  isSuccess: true,
                  id: window.crypto.randomUUID()
                }
              })
            ]),
            catchError((error) => {
              const message = error.error.message as string;
              return of(UserChatsActions.chatsErrorAction({ message }));
            })
          )
      )
    );
  });

  getUserChatsNoTimer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserChatsActions.chatsSendDataNoTimerAction),
      switchMap((requestData) =>
        this.httpService
          .getUsersMessages(requestData.id, requestData.since)
          .pipe(
            take(1),
            mergeMap((data) => [
              UserChatsActions.chatsSaveDataAction({
                chatData: this.convertData(
                  requestData.id,
                  data.body as ResponseUserMessagesData
                )
              })
            ]),
            catchError((error) => {
              const message = error.error.message as string;
              return of(UserChatsActions.chatsErrorAction({ message }));
            })
          )
      )
    );
  });

  private convertData(id: string, data: ResponseUserMessagesData): UserChat {
    return {
      id,
      lastRequestAt: `${new Date().getTime()}`,
      messages: [
        ...data.Items.map((message) => ({
          authorID: message.authorID.S,
          message: message.message.S,
          createdAt: message.createdAt.S,
          isMyMessage: localStorage.getItem('uid') === message.authorID.S
        }))
      ]
    };
  }
}
