/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as ProfileActions from '../actions/profile.action';
import {
  HttpService,
  RequestResponseData
} from 'src/app/core/services/http.service';
import { ProfileData } from '../models/profile.model';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService
  ) {}

  getProfileData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProfileActions.profileSendUserDataAction),
      switchMap(() =>
        this.httpService.sendProfileRequest().pipe(
          map((data) =>
            ProfileActions.profileSaveDataAction({
              profileData: this.convertData(data as RequestResponseData)
            })
          ),
          catchError((error) => {
            const message = error.error.message as string;
            return of(ProfileActions.profileErrorAction({ message }));
          })
        )
      )
    );
  });

  private convertData(data: RequestResponseData): ProfileData {
    return {
      email: data.email.S,
      name: data.name.S,
      uid: data.uid.S,
      createdAt: data.createdAt.S,
      isDataBeenReceived: true
    };
  }
}
