export interface ConnectSharedFile {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  uploadedBy: string;
  uploaderName: string;
  uploadedAt: string;
  channelId?: string;
  conversationId?: string;
  [key: string]: any;
}
