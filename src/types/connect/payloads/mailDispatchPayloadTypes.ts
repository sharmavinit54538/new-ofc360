export interface MailDispatchRequest {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  triggerEvent: string;
  employeeId?: string;
}

export interface MailDispatchResponse {
  success: boolean;
  messageId: string;
  dispatchedAt: string;
  recipient: string;
}
