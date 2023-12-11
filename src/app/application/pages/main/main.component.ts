import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private isFormMode!: boolean;
  private isGroupDeletionMode!: boolean;
  private isFormMode$ = this.GroupServise.isFormMode$;
  private isGroupDeletionMode$ = this.GroupServise.isGroupDeletionMode$;

  private ngSubscribe$ = new Subject<void>();
  constructor(private GroupServise: GroupService) {}

  ngOnInit(): void {
    this.isFormMode$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((value) => (this.isFormMode = value));

    this.isGroupDeletionMode$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((value) => (this.isGroupDeletionMode = value));
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }

  public closeModal(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const closest = target.closest('.form_wrapper');

    if (!closest) {
      if (this.isFormMode) {
        this.GroupServise.fromTheFormMode();
      } /* else if (this.isGroupDeletionMode) { */
      //   this.GroupServise.fromTheGroupDeletionMode();
      // }
    }
  }
}
