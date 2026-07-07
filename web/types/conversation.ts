export type ConnectorId = "chatgpt";

export type ConversationStatus = "idle" | "generating" | "interrupted" | "waitingUser" | "completed" | "failed";

export type StatusLabel = "Idle" | "Generating" | "Interrupted" | "WaitingUser";

export type EngineStatusResponse = {
  status: ConversationStatus;
  text: string;
  connector: ConnectorId;
  session?: string;
};

export type EngineAskResponse = {
  status: ConversationStatus;
  session?: string;
};

export type EngineStopResponse = {
  status: ConversationStatus;
  partial: string;
  session?: string;
};

export type ConnectorOption = {
  id: ConnectorId;
  label: string;
  disabled?: boolean;
};
