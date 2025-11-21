import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {type Chat, ChatSchema} from '@/schemes/chat.schema';
import {CHATS_BY_ME_URL, CHATS_URL, WRITE_MESSAGE_URL} from '@/constants/backend-api.constants';
import {map, type Observable} from 'rxjs';
import {type NewChat} from '@/schemes/new-chat.scheme';
import {Message} from '@/schemes/message.schema';
import {NewMessage} from '@/schemes/new-message.schema';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getByMe(): Observable<Chat[]> {
    return this.httpClient.get<Chat[]>(CHATS_BY_ME_URL)
      .pipe(map((response: unknown): Chat[] => ChatSchema.array().parse(response)));
  }

  public createChat(chat: NewChat): Observable<Chat> {
    return this.httpClient.post<Chat>(CHATS_URL, chat)
      .pipe(map((response: unknown): Chat => ChatSchema.parse(response)));
  }

  public sendMessage(message: NewMessage, chatId: number): Observable<Chat> {
    return this.httpClient.post<Message>(`${WRITE_MESSAGE_URL}/${chatId}`, message)
      .pipe(map((response: unknown): Chat => ChatSchema.parse(response)));
  }
}
