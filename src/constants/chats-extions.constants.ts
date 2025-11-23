export const ChatsActions = {
  SEND_MESSAGE: "SendMessage",
  RECEIVE_MESSAGE: "ReceiveMessage",
} as const;

export type ChatsActions = typeof ChatsActions[keyof typeof ChatsActions];
