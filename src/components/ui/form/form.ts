import {Component, input, type InputSignal, output, type OutputEmitterRef,} from '@angular/core';
import {AbstractControl, FormControl, type FormGroup, ReactiveFormsModule, type ValidationErrors} from '@angular/forms';
import {Heading} from '@/components/ui/heading/heading';
import {InputError} from '@/components/ui/input-error/input-error';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {Button} from '@/components/ui/button/button';

interface ControlMeta {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

interface TypedFormControl<T = any> extends FormControl<T> {
  meta?: ControlMeta;
}

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    Heading,
    InputError,
    MatFormField,
    MatInput,
    MatLabel,
    Button
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  public formGroup: InputSignal<FormGroup> = input.required<FormGroup>();
  public onSubmit: OutputEmitterRef<void> = output<void>();
  public titleText: InputSignal<string> = input.required<string>();
  public submitText: InputSignal<string> = input.required<string>();

  protected get controls(): TypedFormControl[] {
    const formGroup: FormGroup = this.formGroup();
    return Object.keys(formGroup.controls)
      .map((source: string): TypedFormControl | null => formGroup.get(source) as TypedFormControl)
      .filter((control: TypedFormControl | null): control is TypedFormControl => control !== null);
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

  protected getMeta(control: TypedFormControl): ControlMeta | undefined {
    return control.meta;
  }

  protected submitHandler(): void {
    const formGroup: FormGroup = this.formGroup();
    if (formGroup.valid) {
      this.onSubmit.emit();
    } else {
      formGroup.markAllAsTouched();
    }
  }
}
