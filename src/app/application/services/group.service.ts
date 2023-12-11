import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private deletingGroupId: BehaviorSubject<string> = new BehaviorSubject('');

  public deletingGroupId$: Observable<string> =
    this.deletingGroupId.asObservable();

  private isFormMode: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public isFormMode$: Observable<boolean> = this.isFormMode.asObservable();

  public toTheFormMode() {
    this.isFormMode.next(true);
  }

  public fromTheFormMode() {
    this.isFormMode.next(false);
  }

  private isGroupDeletionMode: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  public isGroupDeletionMode$: Observable<boolean> =
    this.isGroupDeletionMode.asObservable();

  public setDelitionGroupId(id: string) {
    this.deletingGroupId.next(id);
  }

  public toTheGroupDeletionMode() {
    this.isGroupDeletionMode.next(true);
  }

  public fromTheGroupDeletionMode() {
    this.isGroupDeletionMode.next(false);
  }
}
