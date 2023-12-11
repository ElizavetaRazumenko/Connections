import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

interface NameQueryParams {
  name: string;
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
}
