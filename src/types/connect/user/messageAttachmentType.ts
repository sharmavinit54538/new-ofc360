export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  [key: string]: any;
}
