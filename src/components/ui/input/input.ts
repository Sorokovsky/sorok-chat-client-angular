import {Component, input, type InputSignal} from '@angular/core';
import {InputError} from "@/components/ui/input-error/input-error";
import {MatFormField} from "@angular/material/form-field";
import {MatInput, MatLabel} from "@angular/material/input";
import {AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {ControlMeta, type TypedFormControl} from '@/schemes/input.schema';

@Component({
  selector: 'app-input',
  imports: [
    InputError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {

  public controller: InputSignal<TypedFormControl> = input.required<TypedFormControl>();
  public formGroup: InputSignal<FormGroup> = input.required<FormGroup>();

  protected getMeta(control: TypedFormControl): ControlMeta | undefined {
    return control.meta;
  }

  protected getNameOfController(control: AbstractControl): string | null {
    const formGroup: FormGroup = this.formGroup();
    if (!formGroup) return null;
    return Object.keys(formGroup.controls).find(name => control === formGroup.get(name)) || null;
  }

  protected getInputType(name: string): string {
    const control: AbstractControl | null = this.formGroup().get(name);
    if (!control) return 'text';

    const validator: ValidationErrors | undefined | null = control.validator?.({} as any);

    if (validator?.['email']) return 'email';
    if (validator?.['required'] && name.toLowerCase().includes('pass')) return 'password';
    if (typeof control.value === 'number') return 'number';
    if (name.toLowerCase().includes('phone')) return 'tel';
    if (name.toLowerCase().includes('url')) return 'url';

    return 'text';
  }
}
