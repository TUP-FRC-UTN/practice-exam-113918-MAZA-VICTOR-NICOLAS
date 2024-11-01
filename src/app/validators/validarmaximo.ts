import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from "@angular/forms";

export class ValidatorMaximo {
  static validarMaximo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null; // Si el control no tiene un grupo padre, no valida

      const formGroup = control.parent as FormGroup;
      const stockMaximo = formGroup.get('stock')?.value;

      if (control.value > stockMaximo) {
        return { superaStock: true };
      }
      return null;
    };
  }
}
