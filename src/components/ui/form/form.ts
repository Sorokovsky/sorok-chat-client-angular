import {Component, EventEmitter, Input, Output} from '@angular/core';
import {type FormGroup, type FormSubmittedEvent, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  @Input({required: true}) public formGroup!: FormGroup;
  @Output() public onSubmit: EventEmitter<FormSubmittedEvent> = new EventEmitter<FormSubmittedEvent>();

  protected submitHandler(event: FormSubmittedEvent): void {
    if (this.formGroup.valid) {
      this.onSubmit.emit(event);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
