export interface EmailAddress {
  name?: string;
  email: string;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: string;
  url?: string;
}

export type EmailCategory = 'interested' | 'meeting-booked' | 'not-interested' | 'spam' | 'out-of-office' | null;

export interface Email {
  _id: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  body: string;
  snippet: string;
  receivedAt: string;
  read: boolean;
  starred: boolean;
  labels?: string[];
  folder: string;
  account: string;
  hasAttachments: boolean;
  attachments: EmailAttachment[];
  category: EmailCategory;
  threadId: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  name?: string;
  provider: string;
  folders: EmailFolder[];
}

export interface EmailFolder {
  id: string;
  name: string;
  unreadCount: number;
  totalCount: number;
}