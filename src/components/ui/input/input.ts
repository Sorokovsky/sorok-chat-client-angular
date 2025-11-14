import {Component, input, InputSignal} from '@angular/core';
import {AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {InputError} from '@/components/ui/input-error/input-error';
import type {ControlMeta, TypedFormControl} from '@/schemes/input.schema';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    InputError,
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
  public controller: InputSignal<TypedFormControl> = input.required<TypedFormControl>();
  public formGroup: InputSignal<FormGroup> = input.required<FormGroup>();

  get name(): string {
    return this.getNameOfController(this.controller())!;
  }

  get type(): string {
    return this.getInputType(this.name);
  }

  get meta(): ControlMeta | undefined {
    return this.getMeta(this.controller());
  }

  get errors(): ValidationErrors | null {
    return this.controller().errors;
  }

  protected getNameOfController(control: TypedFormControl): string | null {
    const formGroup: FormGroup = this.formGroup();
    return Object.keys(formGroup.controls).find(name => control === formGroup.get(name)) || null;
  }

  protected getInputType(name: string): string {
    const control: AbstractControl | null = this.formGroup().get(name);
    if (!control) return 'text';

    const validator: ValidationErrors | null = control.validator?.({} as any) ?? null;

    if (validator?.['email']) return 'email';
    if (name.toLowerCase().includes('pass')) return 'password';
    if (name.toLowerCase().includes('phone')) return 'tel';
    if (typeof control.value === 'number') return 'number';
    if (name.toLowerCase().includes('url')) return 'url';

    return 'text';
  }

  protected getMeta(control: TypedFormControl): ControlMeta | undefined {
    return control.meta;
  }
}
