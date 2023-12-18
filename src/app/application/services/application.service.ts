import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

interface NameQueryParams {
  name: string;
}

interface ConversationAddQueryParams {
  companion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private nameQueryParams: BehaviorSubject<NameQueryParams> =
    new BehaviorSubject({
      name: ''
    });

  private groupNameQueryParams: BehaviorSubject<NameQueryParams> =
    new BehaviorSubject({
      name: ''
    });

  private conversationAddQueryParams: BehaviorSubject<ConversationAddQueryParams> =
    new BehaviorSubject({
      companion: ''
    });

  constructor(private httpService: HttpService) {}

  public profileResponseData$ = this.nameQueryParams.pipe(
    switchMap((query) => this.httpService.sendChangeNameRequest(query.name))
  );

  public changeNameQueryParams(name: string) {
    this.nameQueryParams.next({ name });
  }

  public groupResponseID$ = this.groupNameQueryParams.pipe(
    switchMap((query) => this.httpService.sendCreateNewGroupRequest(query.name))
  );

  public changeGroupNameQueryParams(name: string) {
    this.groupNameQueryParams.next({ name });
  }

  public conversationAddResponseID$ = this.conversationAddQueryParams.pipe(
    switchMap((query) =>
      this.httpService.createConversationRequest(query.companion)
    )
  );

  public changeConversationAddQueryParams(companion: string) {
    this.conversationAddQueryParams.next({ companion });
  }

  private isGroupsChatFirstInitialization: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isGroupsChatFirstInitialization$: Observable<boolean> =
    this.isGroupsChatFirstInitialization.asObservable();

  public changeIsGroupsChatInitial(value: boolean) {
    this.isGroupsChatFirstInitialization.next(value);
  }

  private isUserChatFirstInitialization: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isUserChatFirstInitialization$: Observable<boolean> =
    this.isUserChatFirstInitialization.asObservable();

  public changeIsUserChatInitial(value: boolean) {
    this.isUserChatFirstInitialization.next(value);
  }

  private isGroupsListCanBeUpdate: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isGroupsListCanBeUpdate$: Observable<boolean> =
    this.isGroupsListCanBeUpdate.asObservable();

  public changeIsGroupsListUpdating(value: boolean) {
    this.isGroupsListCanBeUpdate.next(value);
  }

  private isUsersListCanBeUpdate: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isUsersListCanBeUpdate$: Observable<boolean> =
    this.isUsersListCanBeUpdate.asObservable();

  public changeIsUsersListUpdating(value: boolean) {
    this.isUsersListCanBeUpdate.next(value);
  }
}
