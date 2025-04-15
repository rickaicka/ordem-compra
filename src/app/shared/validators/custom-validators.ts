import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static isNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value === null || value === undefined || value === '') {
        return null;
      }

      return isNaN(Number(value)) ? { notANumber: true } : null;
    };
  }
}
