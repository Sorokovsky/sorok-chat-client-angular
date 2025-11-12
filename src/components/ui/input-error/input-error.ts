import {Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';
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
  @Input() public control: AbstractControl | null = null;

  get processedMessages(): string[] {
    if (!this.control || !this.control.errors) return [];
    return Object.keys(this.control.errors).map((key: string): string => {
      const error: Record<string, string> = this.control?.errors![key];
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
