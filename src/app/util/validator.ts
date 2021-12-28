import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

const isbnRegex = new RegExp('^(?=(?:\\D*\\d){10}(?:(?:\\D*\\d){3})?$)[\\d-]+$');

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return testRegex(control.value) ? null : {invalidIsbn: {value: control.value}};
  }
}

function testRegex(input: string): boolean {
  const res = isbnRegex.test(input);
  return res;
}
