import {Component} from '@angular/core';
import {FormBuilder, FormControl, type FormGroup, Validators} from '@angular/forms';
import {type CreateMutationResult} from '@tanstack/angular-query-experimental';
import {type Chat} from '@/schemes/chat.schema';
import {useCreateChat} from '@/hooks/create-chat.hooks';
import {Form} from '@/components/ui/form/form';
import {type CreateChat as CreateChatType, CreateChatScheme} from '@/schemes/create-chat.schema';

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
  private createChat: CreateMutationResult<Chat, Error, CreateChatType, void> = useCreateChat();

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
    const opponentEmail: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    });
    //@ts-ignore
    opponentEmail.meta = {label: "Електронна адреса іншого користувача"};
    this.form = formBuilder.group({
      title: titleInput,
      description,
      opponentEmail,
    });
  }

  public create(): void {
    const data: unknown = this.form.value;
    const createdChat: CreateChatType = CreateChatScheme.parse(data);
    this.createChat.mutate(createdChat);
  }
}
