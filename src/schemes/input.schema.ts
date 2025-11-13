import {type FormControl} from '@angular/forms';

export interface ControlMeta {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

export interface TypedFormControl<T = any> extends FormControl<T> {
  meta?: ControlMeta;
}
