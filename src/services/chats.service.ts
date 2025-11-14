import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {type Chat, ChatSchema} from '@/schemes/chat.schema';
import {CHATS_BY_ME_URL} from '@/constants/backend-api.constants';
import {map, Observable} from 'rxjs';

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

  public sendMessage() {

  }
}
