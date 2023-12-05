import { FormControl } from '@angular/forms';

export function loginNotValid(control: FormControl) {
  if (control.value !== null && control.value !== '') {
    if (control.value.match(/[0-9[!@#$&*"'./|/\\+^`~_=:;]/)) {
      return {
        loginNotValid: {
          value: true,
          message: 'Allowed only letters or spaces'
        }
      };
    }
  }
  return null;
}
