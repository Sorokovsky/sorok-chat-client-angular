import {Component, input, type InputSignal, output, type OutputEmitterRef,} from '@angular/core';
import {type FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Heading} from '@/components/ui/heading/heading';
import {Button} from '@/components/ui/button/button';
import {Input} from '@/components/ui/input/input';
import {TypedFormControl} from '@/schemes/input.schema';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    Heading,
    Button,
    Input,
    Input
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

  protected submitHandler(): void {
    const formGroup: FormGroup = this.formGroup();
    if (formGroup.valid) {
      this.onSubmit.emit();
    } else {
      formGroup.markAllAsTouched();
    }
  }
}
