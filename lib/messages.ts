import fs from 'fs';
import path from 'path';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json');

export function getMessages(): ContactMessage[] {
  try {
    if (!fs.existsSync(MESSAGES_FILE)) {
      return [];
    }
    const content = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(content || '[]') as ContactMessage[];
  } catch (error) {
    console.error('Error reading messages.json:', error);
    return [];
  }
}

export function saveMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
  const dir = path.dirname(MESSAGES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const messages = getMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.unshift(newMessage);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  return newMessage;
}

export function deleteMessage(id: string): boolean {
  try {
    const messages = getMessages().filter((m) => m.id !== id);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  } catch (error) {
    return false;
  }
}

export function markMessageRead(id: string): boolean {
  try {
    const messages = getMessages().map((m) => (m.id === id ? { ...m, read: true } : m));
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  } catch (error) {
    return false;
  }
}
