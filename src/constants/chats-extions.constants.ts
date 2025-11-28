export const ChatsActions = {
  SEND_MESSAGE: "SendMessageAsync",
  RECEIVE_MESSAGE: "ReceiveMessageAsync",
  JOIN_TO_CHAT: "JoinToChatAsync",
  SEND_EXCHANGE: "SendExchangeAsync",
  RECEIVE_EXCHANGE: "ReceiveExchangeAsync",
  CONNECTED: "ConnectedAsync"
} as const;

export type ChatsActions = typeof ChatsActions[keyof typeof ChatsActions];
