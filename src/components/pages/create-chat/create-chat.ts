import { Component } from '@angular/core';
import {FormBuilder, FormControl, type FormGroup, Validators} from '@angular/forms';
import {type CreateMutationResult} from '@tanstack/angular-query-experimental';
import {type Chat} from '@/schemes/chat.schema';
import {type NewChat, NewChatScheme} from '@/schemes/new-chat.scheme';
import {useCreateChat} from '@/hooks/create-chat.hooks';
import {Form} from '@/components/ui/form/form';

@Component({
  selector: 'app-create-chat',
  imports: [
    Form
  ],
  templateUrl: './create-chat.html',
  styleUrl: './create-chat.scss',
})
export class CreateChat {
  protected form: FormGroup;
  protected title: string = "Створення чату";
  protected submitText: string = "Створити";
  private createChat: CreateMutationResult<Chat, Error, NewChat, void> = useCreateChat();

  constructor(formBuilder: FormBuilder) {
    const titleInput: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required],
    });
    //@ts-ignore
    titleInput.meta = {label: "Назва чату"};
    const description: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required],
    });
    //@ts-ignore
    description.meta = {label: "Опис чату"};
    this.form = formBuilder.group({
      title: titleInput,
      description,
    })
  }

  public create(): void {
    const data: unknown = this.form.value;
    const newChatDto: NewChat = NewChatScheme.parse(data);
    this.createChat.mutate(newChatDto);
  }
}
