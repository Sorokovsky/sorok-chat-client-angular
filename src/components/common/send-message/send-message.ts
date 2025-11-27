import {Component, input, type InputSignal, output, OutputEmitterRef} from '@angular/core';
import {Button} from "@/components/ui/button/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Input} from "@/components/ui/input/input";
import {type TypedFormControl} from '@/schemes/input.schema';
import {type User} from '@/schemes/user.schema';
import {CryptoService} from '@/services/crypto.service';
import {type NewMessage} from '@/schemes/new-message.schema';
import {type SentMessage} from "@/schemes/sent-message.scheme";
import {Chat} from '@/schemes/chat.schema';
import {ChatKeyStorageService} from '@/services/chat-key-storage.service';

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
  public chat: InputSignal<Chat> = input.required<Chat>();
  public sentMessage: OutputEmitterRef<SentMessage> = output<SentMessage>()
  protected messageForm: FormGroup;
  protected textInput: TypedFormControl;
  private readonly cryptoService: CryptoService;
  private readonly chatKeyStorageService: ChatKeyStorageService;

  constructor(
    formBuilder: FormBuilder,
    cryptoService: CryptoService,
    chatKeyStorageService: ChatKeyStorageService,
  ) {
    this.textInput = formBuilder.control('', [Validators.required]) as TypedFormControl;
    this.messageForm = formBuilder.group({
      text: this.textInput,
    })
    this.textInput.meta = {label: "Повідомлення"};
    this.cryptoService = cryptoService;
    this.chatKeyStorageService = chatKeyStorageService;
  }

  public async sendMessage(): Promise<void> {
    const data: unknown = this.messageForm.value;
    if (data && typeof data == "object" && "text" in data && typeof data.text === "string") {
      const macSecret: string = await this.chatKeyStorageService.getChatKey(this.chat().staticPublicKey, this.chat().ephemeralPublicKey, this.chat().id);
      const text: string = this.cryptoService.encrypt(data.text, macSecret)
      const mac: string = this.cryptoService.sign(text, macSecret);
      const newMessage: NewMessage = {text, mac};
      this.messageForm.reset();
      this.sentMessage.emit({chatId: this.chat().id, message: newMessage});
    }
  }
}
