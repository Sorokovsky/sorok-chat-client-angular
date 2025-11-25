export const ChatsActions = {
  SEND_MESSAGE: "SendMessageAsync",
  RECEIVE_MESSAGE: "ReceiveMessageAsync",
  JOIN_TO_CHAT: "JoinToChatAsync",
} as const;

export type ChatsActions = typeof ChatsActions[keyof typeof ChatsActions];
