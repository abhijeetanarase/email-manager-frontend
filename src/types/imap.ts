export interface IMAPCredentials {
  id: string;
  email: string;
  password: string;
  host: string;
  port: number;
  use_ssl: boolean;
  created_at: string;
  updated_at: string;
}

export interface IMAPProvider {
  name: string;
  host: string;
  port: number;
  use_ssl: boolean;
}

export const COMMON_IMAP_PROVIDERS: IMAPProvider[] = [
  {
    name: 'Gmail',
    host: 'imap.gmail.com',
    port: 993,
    use_ssl: true
  },
  {
    name: 'Outlook',
    host: 'outlook.office365.com',
    port: 993,
    use_ssl: true
  },
  {
    name: 'Yahoo',
    host: 'imap.mail.yahoo.com',
    port: 993,
    use_ssl: true
  }
];