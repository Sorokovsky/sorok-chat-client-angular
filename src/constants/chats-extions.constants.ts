export const ChatsActions = {
  SEND_MESSAGE: "SendMessageAsync",
  RECEIVE_MESSAGE: "ReceiveMessageAsync",
} as const;

export type ChatsActions = typeof ChatsActions[keyof typeof ChatsActions];
