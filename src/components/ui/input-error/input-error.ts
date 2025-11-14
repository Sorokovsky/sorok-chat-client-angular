import {Component, input, InputSignal} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {ERROR_MESSAGES} from '@/constants/errors.constants';
import {CommonModule} from '@angular/common';
import {MatError} from '@angular/material/form-field';

@Component({
  selector: 'app-input-error',
  imports: [CommonModule, MatError],
  templateUrl: './input-error.html',
  styleUrl: './input-error.scss',
})
export class InputError {
  public errors: InputSignal<ValidationErrors | null> = input<ValidationErrors | null>(null);

  get processedMessages(): string[] {
    if (!this.errors()) return [];
    return Object.keys(this.errors() as string[]).map((key: string): string => {
      const error: Record<string, string> = this.errors()![key];
      let message: string = ERROR_MESSAGES[key] || key;
      if (error && typeof error === "object") {
        Object.keys(error).forEach((parameter: string): void => {
          const placeholder = `{{${parameter}}}`;
          message = message.replaceAll(new RegExp(placeholder, 'g'), error[parameter]);
        });
      }
      return message;
    });
  }
}
