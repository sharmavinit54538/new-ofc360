export interface MailArtifactDraft {
  recipientEmail?: string;
  to?: string;
  recipientName?: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  attachments?: { name: string; url: string; size: number }[];
  [key: string]: any;
}
