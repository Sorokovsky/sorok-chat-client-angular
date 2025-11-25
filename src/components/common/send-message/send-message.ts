import {Component, input, type InputSignal, output, OutputEmitterRef} from '@angular/core';
import {Button} from "@/components/ui/button/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Input} from "@/components/ui/input/input";
import {type TypedFormControl} from '@/schemes/input.schema';
import {type User} from '@/schemes/user.schema';
import {CryptoService} from '@/services/crypto.service';
import {type NewMessage} from '@/schemes/new-message.schema';
import {type SentMessage} from "@/schemes/sent-message.scheme";

@Component({
  selector: 'app-send-message',
  imports: [
    Button,
    FormsModule,
    Input,
    ReactiveFormsModule
  ],
  templateUrl: './send-message.html',
  styleUrl: './send-message.scss',
})
export class SendMessage {
  public currentUser: InputSignal<User> = input.required<User>();
  public chatId: InputSignal<number> = input.required<number>();
  public sentMessage: OutputEmitterRef<SentMessage> = output<SentMessage>()
  protected messageForm: FormGroup;
  protected textInput: TypedFormControl;
  private readonly cryptoService: CryptoService;

  constructor(formBuilder: FormBuilder, cryptoService: CryptoService) {
    this.textInput = formBuilder.control('', [Validators.required]) as TypedFormControl;
    this.messageForm = formBuilder.group({
      text: this.textInput,
    })
    this.textInput.meta = {label: "Повідомлення"};
    this.cryptoService = cryptoService;
  }

  public async sendMessage(): Promise<void> {
    const data: unknown = this.messageForm.value;
    if (data && typeof data == "object" && "text" in data && typeof data.text === "string") {
      const macSecret: string = this.currentUser().macSecret!;
      const text: string = this.cryptoService.encrypt(data.text, macSecret)
      const mac: string = this.cryptoService.sign(text, macSecret);
      const newMessage: NewMessage = {text, mac};
      this.messageForm.reset();
      this.sentMessage.emit({chatId: this.chatId(), message: newMessage});
    }
  }
}
