/* eslint-disable @ngrx/no-dispatch-in-effects */
/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import * as GroupActions from '../actions/group.action';
import * as TimerActions from '../actions/timerGroup.action';
import * as AlertActions from '../actions/alert.action';
import {
  HttpService,
  ResponseGroupsData
} from 'src/app/core/services/http.service';
import { GroupData } from '../models/group.model';

@Injectable()
export class GroupEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService
  ) {}

  getGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.groupGetRequestDataAction),
      switchMap(() =>
        this.httpService.gesGroupsListRequest().pipe(
          mergeMap((data) => [
            GroupActions.groupSaveDataAction({
              groupsData: this.convertData(data as ResponseGroupsData)
            }),
            TimerActions.timerChangeFlagAction({ timerFlag: true }),
            AlertActions.alertAddAlertAction({
              notify: {
                message: 'Group list updated successfully',
                isSuccess: true,
                id: window.crypto.randomUUID()
              }
            })
          ]),
          catchError((error) => {
            const message = error.error.message as string;
            return of(GroupActions.groupErrorAction({ message }));
          })
        )
      )
    );
  });

  getGroupsNoTimerEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.groupGetRequestDataNoTimerAction),
      switchMap(() =>
        this.httpService.gesGroupsListRequest().pipe(
          mergeMap((data) => [
            GroupActions.groupSaveDataAction({
              groupsData: this.convertData(data as ResponseGroupsData)
            })
          ]),
          catchError((error) => {
            const message = error.error.message as string;
            return of(GroupActions.groupErrorAction({ message }));
          })
        )
      )
    );
  });

  private convertData(data: ResponseGroupsData): GroupData[] {
    return data.Items.map((item) => ({
      id: item.id.S,
      name: item.name.S,
      createdAt: item.createdAt.S,
      createdBy: item.createdBy.S
    }));
  }
}
