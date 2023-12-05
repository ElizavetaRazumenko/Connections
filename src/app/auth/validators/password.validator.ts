import { FormControl } from '@angular/forms';
import { MIN_PASS_LENGTH } from 'src/app/constants/constants';

export function passwordNotStrength(control: FormControl) {
  if (control.value !== null && control.value !== '') {
    if (control.value.length < MIN_PASS_LENGTH) {
      return {
        passwordNotStrength: {
          value: true,
          message: 'Password must be at least 8 characters long'
        }
      };
    }
    if (!control.value.match(/[A-Z]/)) {
      return {
        passwordNotStrength: {
          value: true,
          message: 'Password must contain one capital letter'
        }
      };
    }
    if (!control.value.match(/\d/)) {
      return {
        passwordNotStrength: {
          value: true,
          message: 'Password must contain one digit'
        }
      };
    }
    if (!control.value.match(/[[!@#$&*"'./|/\\+^`~_=]/)) {
      return {
        passwordNotStrength: {
          value: true,
          message: 'Password must contain one special character'
        }
      };
    }
  }
  return null;
}
