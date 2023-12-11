/* eslint-disable @ngrx/no-dispatch-in-effects */
/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import * as GroupChatsActions from '../actions/group-chats.action';
import * as TimerActions from '../actions/timerGroupChats.action';
import * as AlertActions from '../actions/alert.action';
import {
  HttpService,
  ResponseGroupMessagesData
} from 'src/app/core/services/http.service';
import { GroupChat } from '../models/group-chats.model';

@Injectable()
export class GroupChatsEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService
  ) {}

  getGroupChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupChatsActions.chatsSendDataAction),
      switchMap((requestData) =>
        this.httpService
          .getGroupMessages(requestData.id, requestData.since)
          .pipe(
            mergeMap((data) => [
              GroupChatsActions.chatsSaveDataAction({
                chatData: this.convertData(
                  requestData.id,
                  data.body as ResponseGroupMessagesData
                )
              }),
              TimerActions.timerChangeFlagAction({ timerFlag: true }),
              AlertActions.alertAddAlertAction({
                notify: {
                  message: 'Groups chat updated successfully',
                  isSuccess: true,
                  id: window.crypto.randomUUID()
                }
              })
            ]),
            catchError((error) => {
              const message = error.error.message as string;
              return of(GroupChatsActions.chatsErrorAction({ message }));
            })
          )
      )
    );
  });

  private convertData(id: string, data: ResponseGroupMessagesData): GroupChat {
    return {
      id,
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
