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
  // FLAGS TO LOAD DATA IN THE FIRST INITIALIZATION

  // FOR GROUPS LIST
  private isGroupListShouldLoadData: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isGroupListShouldLoadData$: Observable<boolean> =
    this.isGroupListShouldLoadData.asObservable();

  public changeIsGroupListShouldLoadData(value: boolean) {
    this.isGroupListShouldLoadData.next(value);
  }

  // FOR GROUP DIALOG
  private isGroupDialogShouldLoadData: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isGroupDialogShouldLoadData$: Observable<boolean> =
    this.isGroupDialogShouldLoadData.asObservable();

  public changeIsGroupDialogShouldLoadData(value: boolean) {
    this.isGroupDialogShouldLoadData.next(value);
  }

  // FOR USERS LIST
  private isUsersListShouldLoadData: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isUsersListShouldLoadData$: Observable<boolean> =
    this.isUsersListShouldLoadData.asObservable();

  public changeIsUsersListShouldLoadData(value: boolean) {
    this.isUsersListShouldLoadData.next(value);
  }

  // FOR USER CHAT
  private isUserChatShouldLoadData: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  public isUserChatShouldLoadData$: Observable<boolean> =
    this.isUserChatShouldLoadData.asObservable();

  public changeIsUserChatShouldLoadData(value: boolean) {
    this.isUserChatShouldLoadData.next(value);
  }
}
