import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

export class ProductoUnicoValidator {
  static validarProductosUnicos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) {
        return null; 
      }

      const nombres = control.controls.map(control => control.get('name')?.value);
      const nombresUnicos = new Set(nombres);

      if (nombres.length !== nombresUnicos.size) {
        return { productoDuplicado: true };
      }
      return null;
    };
  }
}
