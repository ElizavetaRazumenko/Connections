import { FormControl } from '@angular/forms';

export function nameNotValid(control: FormControl) {
  if (control.value !== null && control.value !== '') {
    if (control.value.match(/[[!@#$&*"'./|/\\+^`~_=:;]/)) {
      return {
        nameNotValid: {
          value: true,
          message: 'Allowed only letters, spaces and digits'
        }
      };
    }
  }
  return null;
}
