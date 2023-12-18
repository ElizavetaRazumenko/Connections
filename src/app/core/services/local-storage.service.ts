import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public get(key: string) {
    const dataNotParsed = localStorage.getItem(key);

    if (dataNotParsed === null) return 'light';
    return dataNotParsed;
  }
}
