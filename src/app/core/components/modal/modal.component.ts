import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectModalOpening } from 'src/app/redux/selectors/modal.selector';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  private ngSubscribe$ = new Subject<void>();
  private modalOpening$ = this.store.select(selectModalOpening);
  public isOpen = false;
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.modalOpening$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((isOpen) => (this.isOpen = isOpen));
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }
}
