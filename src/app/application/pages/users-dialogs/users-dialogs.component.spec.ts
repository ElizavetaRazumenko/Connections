import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDialogsComponent } from './users-dialogs.component';

describe('UsersDialogsComponent', () => {
  let component: UsersDialogsComponent;
  let fixture: ComponentFixture<UsersDialogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersDialogsComponent]
    });
    fixture = TestBed.createComponent(UsersDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
